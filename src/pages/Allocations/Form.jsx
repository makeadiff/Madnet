import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCardContent,
  IonCard
} from '@ionic/react'
import React from 'react'

import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import { useParams } from 'react-router-dom'
import Title from '../../components/Title'
import { PROJECT_IDS } from '../../utils/Constants'

const TeacherForm = () => {
  const { shelter_id, project_id, user_id, level_id, batch_id } = useParams()
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const [teacher, setTeacher] = React.useState([])
  const [batches, setBatches] = React.useState([])
  const [levels, setLevels] = React.useState([])
  const { showMessage } = React.useContext(appContext)
  const [combo, setCombo] = React.useState({ batch_id: batch_id, level_id: level_id })
  const [sub, setSub] = React.useState([])
  const [subjectField, setSubjectField] = React.useState({ subject_id: '0' })

  React.useEffect(() => {
    async function fetchData() {
      const data = await callApi({
        graphql: `{
                batchSearch(center_id:${shelter_id}, project_id:${project_id}){
                    id batch_name
                }
                levels(center_id:${shelter_id}, project_id:${project_id}){
                    id level_name                               
                }
                user(id: ${user_id}) {
                    name
                }
                subjects {
                  id name
                }
            }`
      })

      setBatches(data.batchSearch)
      setLevels(data.levels)
      setTeacher(data.user)
      setSub(data.subjects)
    }
    if (level_id) {
      setCombo({ ...combo, ['level_id']: level_id })
    }
    fetchData()
  }, [shelter_id, project_id, user_id, batch_id, level_id])

  React.useEffect(() => {
    if (project_id === PROJECT_IDS.AFTERCARE && batches.length) {
      // If aftercare project, just set the first batch as the preselected batch. There should be only one batch in the shelter.
      setCombo({ ...combo, ['batch_id']: batches[0].id }) 
    }
  }, [batches])

  const updateField = (e) => {
    setCombo({ ...combo, [e.target.name]: e.target.value })
  }

  const updateSubField = (e) => {
    setSubjectField({ subject_id: e.target.value })
  }

  const saveAssignment = (e) => {
    e.preventDefault()

    // :TODO: Seperate both out, and open up the relevent selection popup on validation
    if(combo.batch_id === '0' || combo.level_id === '0') {
      showMessage('Please select BOTH Batch and Class Section', 'error')
      return false
    }

    callApi({
      url: `/batches/${combo.batch_id}/levels/${combo.level_id}/teachers/${user_id}`,
      method: 'post',
      params: subjectField
    }).then(() => {
      showMessage('Saved class assignment successfully')
      unsetLocalCache(`teacher_view_${shelter_id}_${project_id}_${combo.batch_id}_${combo.level_id}`)
      unsetLocalCache(`teacher_view_${shelter_id}_${project_id}_0_0`)
      unsetLocalCache(`level_${combo.level_id}`)
      unsetLocalCache(`batch_${combo.batch_id}`)
    })
  }

  return (
    <IonPage>
      <Title
        name={`Assign ${teacher.name} to...`}
        back={`/shelters/${shelter_id}/projects/${project_id}`}
      />
      <IonContent className="dark">
      <IonCard>
      <IonCardContent>
        <form onSubmit={saveAssignment}>
          <IonList>
            {project_id === PROJECT_IDS.AFTERCARE ? null : (
              <IonItem>
                <IonLabel>Batch:</IonLabel>
                <IonSelect
                  slot="end"
                  name="batch_id"
                  value={combo.batch_id}
                  onIonChange={updateField}
                  required="true"
                  color='dark'
                >
                  {batches.map((batch, index) => {
                    return (
                      <IonSelectOption key={index} value={batch.id.toString()}>
                        {batch.batch_name}
                      </IonSelectOption>
                    )
                  })}
                </IonSelect>
              </IonItem>
            )}
            <IonItem>
              <IonLabel>
                {project_id === PROJECT_IDS.AFTERCARE ? 'SSG' : 'Class Section'}:
              </IonLabel>
              <IonSelect
                slot="end"
                name="level_id"
                value={combo.level_id}
                onIonChange={updateField}
                required="true"
              >
                {levels.map((level, index) => {
                  return (
                    <IonSelectOption key={index} value={level.id.toString()}>
                      {level.level_name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
            {project_id === PROJECT_IDS.AFTERCARE ? null : (
              <IonItem>
                <IonLabel>Subject:</IonLabel>
                <IonSelect
                  slot="end"
                  name="subject_id"
                  value={subjectField.subject_id}
                  onIonChange={updateSubField}
                >
                  <IonSelectOption key="0" value="0">
                    None
                  </IonSelectOption>
                  {sub.map((subject, index) => {
                    return (
                      <IonSelectOption
                        key={index}
                        value={subject.id.toString()}
                      >
                        {subject.name}
                      </IonSelectOption>
                    )
                  })}
                </IonSelect>
              </IonItem>
            )}
          </IonList>
          <IonItem>
            <IonButton routerLink={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/${level_id}/view-teachers`}
          routerDirection="none" type="submit">Save Assignment</IonButton>
          </IonItem>
        </form>
        <IonItem
          routerLink={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/${level_id}/view-teachers`}
          routerDirection="none"
        >
          <IonButton color="light">&lt; Back</IonButton>
        </IonItem>        
      </IonCardContent>
      </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default TeacherForm
