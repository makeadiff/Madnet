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

import { authContext } from '../../../contexts/AuthContext'
import { dataContext } from '../../../contexts/DataContext'
import { appContext } from '../../../contexts/AppContext'
import { useParams } from 'react-router-dom'
import Title from '../../../components/Title'

const WingmanForm = () => {
  const { user } = React.useContext(authContext)
  const { callApi, unsetLocalCache } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)

  const { shelter_id, project_id } = useParams()
  const [batch_id, setBatchId] = React.useState('')
  const [subjects, setSubjects] = React.useState([])
  const [wingmen, setWingmen] = React.useState([])
  const [students, setStudents] = React.useState([])
  const [levelData] = React.useState({
    grade: 7,
    name: 'D',
    center_id: shelter_id,
    project_id: project_id
  })
  const [level_id, setLevelId] = React.useState('')
  const [student_id, setStudentId] = React.useState({ student_ids: '0' })
  const [wingman_id, setWingmanId] = React.useState({ id: '0' })
  const [subjectField, setSubjectField] = React.useState({ subject_id: '0' })

  React.useEffect(() => {
    async function fetchData() {
      const wingman_group_id = 348
      const data = await callApi({
        graphql: `{
                batchSearch(center_id:${shelter_id}, project_id:${project_id}){
                    id batch_name
                }
                userSearch(city_id:${user.city_id}, group_id: ${wingman_group_id}) {
                    id name
                }
                subjects {
                    id name
                }
                studentSearch(center_id:${shelter_id}) {
                    id name
                }
            }`,
        cache: false
      })

      let batch_id = null

      if(!data.batchSearch.length) { // No batches found
        const newBatch = await callApi({ // Create a Default batch - this is how wingman assignments work.
          method: 'post',
          url: '/batches',
          params: {
            day: 0,
            class_time: '00:00:00',
            center_id: shelter_id,
            project_id: project_id
          }
        })
        
        if(newBatch.id) {
          batch_id = newBatch.id
        }
      } else {
        batch_id = data.batchSearch[0].id
      }

      setBatchId(batch_id.toString())
      setSubjects(data.subjects)
      setWingmen(data.userSearch)
      setStudents(data.studentSearch)
    }
    fetchData()
  }, [shelter_id, project_id, user.city_id])

  const updateStudent = (e) => {
    setStudentId({ student_ids: e.target.value })
    callApi({ url: `/levels`, method: 'post', params: levelData }).then(
      (data) => {
        setLevelId(data.id)
      }
    )
  }

  const updateWingman = (e) => {
    setWingmanId({ id: e.target.value })
  }

  const updateSubField = (e) => {
    setSubjectField({ subject_id: e.target.value })
  }

  const saveAssign = (e) => {
    e.preventDefault()
    callApi({
      url: `/levels/${level_id}/students`,
      method: 'post',
      params: student_id
    }).then(() => {})
    callApi({
      url: `/batches/${batch_id}/levels/${level_id}/teachers/${wingman_id.id}`,
      method: 'post',
      params: subjectField
    }).then(() => {
      showMessage('Saved Wingman Assignment Successfully')
      unsetLocalCache(`wingman_view_${shelter_id}_${project_id}`)
    })
  }

  return (
    <IonPage>
      <Title name="Assign Wingman" />
      <IonContent className="dark">
      <IonCard>
        <IonCardContent>
        <form onSubmit={saveAssign}>
          <IonList>
            <IonItem>
              <IonLabel>Wingman:</IonLabel>
              <IonSelect
                slot="end"
                name="wingman_id"
                value={wingman_id.id}
                onIonChange={updateWingman}
                required="true"
              >
                {wingmen.map((wingman, index) => {
                  return (
                    <IonSelectOption key={index} value={wingman.id.toString()}>
                      {wingman.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
            { !wingmen.length ? <IonItem className="text-danger">No Wingmen Found. Please mark volunteers as TR Wingman before using this.</IonItem> : null }

            <IonItem>
              <IonLabel>Student:</IonLabel>
              <IonSelect
                slot="end"
                name="student_id"
                value={student_id.student_ids}
                onIonChange={updateStudent}
                required="true"
              >
                {students
                  .sort((a,b) => { 
                    if(a.name.toUpperCase() < b.name.toUpperCase()) {
                      return -1
                    } else if(a.name.toUpperCase() > b.name.toUpperCase()) {
                      return 1
                    } else {
                      return 0
                    }
                  }).map((student, index) => {
                  return (
                    <IonSelectOption key={index} value={student.id.toString()}>
                      {student.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>

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
                {subjects.map((subject, index) => {
                  return (
                    <IonSelectOption key={index} value={subject.id.toString()}>
                      {subject.name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
          </IonList>
          <IonItem>
            <IonButton type="submit">Save Assignment</IonButton>
          </IonItem>
        </form>
        <IonItem
          routerLink={`/shelters/${shelter_id}/projects/${project_id}/view-wingmen`}
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

export default WingmanForm
