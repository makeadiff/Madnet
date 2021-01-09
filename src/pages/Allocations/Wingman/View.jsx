import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonButton
} from '@ionic/react'
import React from 'react'

import { dataContext } from '../../../contexts/DataContext'
import { useParams } from 'react-router-dom'
import Title from '../../../components/Title'
import { appContext } from '../../../contexts/AppContext'

// :TODO: Have a delete assignment option.

const WingmanView = () => {
  const { shelter_id, project_id } = useParams()
  const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)
  const [batches, setBatches] = React.useState([])
  const [batch_id] = React.useState([])
  const [level_id] = React.useState([])
  const [wingman_id] = React.useState([])

  React.useEffect(() => {
    async function fetchMapping() {
      const data = await callApi({
        graphql: `{
                center(id: ${shelter_id}) { name }
                batchSearch(center_id:${shelter_id}, project_id: ${project_id}) {
                    id batch_name 
                    allocations {
                        role
                        user {
                            id name
                        }
                        level {
                            id level_name 
                            students {
                                id name
                            }
                        }
                        subject {
                            id name
                        }
                    }
                }
              }`,
        cache: true,
        cache_key: `wingman_view_${shelter_id}_${project_id}`
      })

      setBatches(data.batchSearch)
    }

    // If Cache is empty, reload the data.
    if (
      cache[`wingman_view_${shelter_id}_${project_id}`] === undefined ||
      !cache[`wingman_view_${shelter_id}_${project_id}`]
    ) {
      fetchMapping()
    }
  }, [
    shelter_id,
    project_id,
    cache[`wingman_view_${shelter_id}_${project_id}`]
  ])

  const deleteMapping = (x) => {
    callApi({
      url: `/batches/${batch_id[x]}/levels/${level_id[x]}/teachers/${wingman_id[x]}`,
      method: 'delete'
    }).then(() => {
      showMessage('Deleted')
      unsetLocalCache(`wingman_view_${shelter_id}_${project_id}`)
    })
  }

  return (
    <IonPage>
      <Title
        name={`Assigned Wingmen `}
        back={`/shelters/${shelter_id}/projects/${project_id}`}
      />
      <IonContent className="dark">
        <IonList>
          <IonItem
            routerLink={`/shelters/${shelter_id}/projects/${project_id}/assign-wingmen`}
            routerDirection="none"
          >
            <IonButton> Add New Wingman</IonButton>
          </IonItem>

          {batches.map((batch, index) => {
            return (
              <IonItem key={index}>
                <IonLabel>
                  <IonList>
                    {batch.allocations.map((alloc, index_2) => {
                      batch_id[index_2] = batch.id
                      wingman_id[index_2] = alloc.user.id
                      level_id[index_2] = alloc.level.id
                      return (
                        <IonItem key={index_2}>
                          <IonLabel>
                            <p>Wingman: {alloc.user.name}</p>
                            {alloc.level.students.map((student, index_3) => {
                              return (
                                <IonLabel key={index_3}>
                                  <p>Student:{student.name}</p>
                                </IonLabel>
                              )
                            })}
                            {alloc.subject != null ? (
                              <p>Subject: {alloc.subject.name}</p>
                            ) : (
                              <p>Subject: None</p>
                            )}
                          </IonLabel>
                          <IonButton
                            key={index_2}
                            slot="end"
                            onClick={() => deleteMapping(index_2)}
                          >
                            {' '}
                            Delete{' '}
                          </IonButton>
                        </IonItem>
                      )
                    })}
                  </IonList>
                </IonLabel>
              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default WingmanView
