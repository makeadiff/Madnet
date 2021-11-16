import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonButton
} from '@ionic/react'
import React from 'react'

import './View.css'
import { dataContext } from '../../contexts/DataContext'
import { useParams } from 'react-router-dom'
import Title from '../../components/Title'
import { appContext } from '../../contexts/AppContext'
import { PROJECT_KEYS } from '../../utils/Constants'

const TeacherView = () => {
  const { shelter_id, project_id, level_id, batch_id } = useParams()
  const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
  const [batches, setBatches] = React.useState([])
  const [shelter, setShelter] = React.useState('')
  const [level, setLevel] = React.useState('')
  const { showMessage } = React.useContext(appContext)
  const cache_key  = `teacher_view_${shelter_id}_${project_id}_${batch_id}_${level_id}`

  React.useEffect(() => {
    async function fetchMapping() {
      let level_check = ''
      let level_name_fetch = ''
      if (level_id && level_id !== '0') {
        level_check = `, level_id: ${level_id}`
        level_name_fetch = `level(id: ${level_id}) { level_name }`
      }
      let batch_check = ''
      if (batch_id && batch_id !== '0') {
        batch_check = `, batch_id: ${batch_id}`
      }

      const data = await callApi({
        graphql: `{
                center(id: ${shelter_id}) { name }
                ${level_name_fetch}
                batchSearch(center_id:${shelter_id}, project_id: ${project_id} ${level_check} ${batch_check}) {
                    id batch_name 
                    allocations {
                      role
                      users {
                        id name
                      }
                      level {
                        id level_name
                      }
                      subject {
                        id name
                      }
                    }
                }
              }`,
        cache: true,
        cache_key: cache_key
      })

      setShelter(data.center.name)
      setBatches(data.batchSearch)
      if(level_id && data.level) {
        setLevel(data.level.level_name)
      }
    }
    if (
      cache[cache_key] === undefined ||
      !cache[cache_key]
    ) {
      fetchMapping()
    }
  }, [
    shelter_id,
    project_id,
    level_id,
    batch_id,
    cache[cache_key]
  ])

  const deleteMapping = (batch_id, level_id, teacher_id, batch_index, allocation_index) => {
    callApi({
      url: `/batches/${batch_id}/levels/${level_id}/teachers/${teacher_id}`,
      method: 'delete'
    }).then(() => {
      batches[batch_index].allocations.splice(allocation_index, 1)
      unsetLocalCache(cache_key)
      showMessage('Deleted the teacher assignment')
    })
  }

  return (
    <IonPage>
      <Title
        name={`Teachers at ${shelter} ${level} (${PROJECT_KEYS[project_id]})`}
        back={`/shelters/${shelter_id}/projects/${project_id}`}
      />
      <IonContent className="dark">
        <IonItem
          routerLink={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/${level_id}/assign-teachers`}
          routerDirection="none"
        >
          <IonButton> Add New Teacher</IonButton>
        </IonItem>

        <IonList>
          {batches.map((batch, batch_index) => {
            if (batch.allocations.length > 0) {
              return (
                <IonItem key={batch_index}>
                  <div className="batch-area">
                    <IonLabel>
                      <h1>{batch.batch_name}</h1>
                    </IonLabel>
                    <IonList>
                      {batch.allocations.map((alloc, allocation_index) => {
                        if(!alloc.level) return null; // Mentor Allocation (?)
                        if(level_id && alloc.level.id !== level_id) return null;
                        return (
                          <IonItem key={allocation_index} className="striped">
                            <IonLabel className="allocation-info">
                              <p>Teacher: {alloc.users ? alloc.users[0].name : 'None'}</p>
                              <p>Class Section: {alloc.level.level_name}</p>
                              {alloc.subject != null ? (
                                <p>Subject: {alloc.subject.name}</p>
                              ) : (
                                <p>Subject: None </p>
                              )}
                            </IonLabel>
                            <IonButton slot="end" onClick={() => deleteMapping(batch.id, alloc.level.id, alloc.user.id, batch_index, allocation_index)}>
                              Delete
                            </IonButton>
                          </IonItem>
                        )
                      })}
                    </IonList>
                  </div>
                </IonItem>
              )
            }
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default TeacherView
