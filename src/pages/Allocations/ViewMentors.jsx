import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonButton,
  IonAlert
} from '@ionic/react'
import React from 'react'

import './View.css'
import { dataContext } from '../../contexts/DataContext'
import { useParams } from 'react-router-dom'
import Title from '../../components/Title'
import { appContext } from '../../contexts/AppContext'
import { PROJECT_KEYS } from '../../utils/Constants'

const MentorView = () => {
  const { shelter_id, project_id, level_id, batch_id } = useParams()
  const { callApi, cache, unsetLocalCache } = React.useContext(dataContext)
  const [batches, setBatches] = React.useState([])
  const [shelter, setShelter] = React.useState('')
  const [level, setLevel] = React.useState('')
  const [getConfirmation, setGetConfirmation] = React.useState({
    status: false,
    onConfirm: () => {}
  })
  const { showMessage } = React.useContext(appContext)
  const cache_key = `mentor_view_${shelter_id}_${project_id}_${batch_id}_${level_id}`

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
                    mentors {
                      name id 
                    }
                  }
                }`,
        cache: false,
        cache_key: cache_key
      })

      setShelter(data.center.name)
      setBatches(data.batchSearch)
      if (level_id && data.level) {
        setLevel(data.level.level_name)
      }
    }

    // Nothing in cache, get data from server
    if (cache[cache_key] === undefined || !cache[cache_key]) {
      fetchMapping()
    } else {
      // Use cached data
      const data = cache[cache_key]
      setShelter(data.center.name)
      setBatches(data.batchSearch)
      if (level_id && data.level) {
        setLevel(data.level.level_name)
      }
    }
  }, [shelter_id, project_id, level_id, batch_id, cache[cache_key]])

  const deleteMapping = (batch_id, mentor_id, batch_index, mentor_index) => {
    callApi({
      url: `/batches/${batch_id}/mentors/${mentor_id}`,
      method: 'delete'
    }).then(() => {
      batches[batch_index].mentors.splice(mentor_index, 1)
      unsetLocalCache(cache_key)
      showMessage('Deleted the mentor assignment')
    })
  }

  return (
    <IonPage>
      <Title
        name={`Mentors at ${shelter} ${level} (${PROJECT_KEYS[project_id]})`}
        back={`/shelters/${shelter_id}/projects/${project_id}`}
        refresh={() => {
          unsetLocalCache(cache_key)
          window.location.reload()
        }}
      />
      <IonContent className="dark">
        <IonList>
          {batch_id !== '0' ? (
            <IonItem
              routerLink={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/${level_id}/assign-mentors`}
              routerDirection="none"
            >
              <IonButton> Add New Mentor</IonButton>
            </IonItem>
          ) : (
            <IonItem></IonItem> // Adding empty item for padding
          )}

          {batches.length > 0 ? (
            batches.map((batch, batch_index) => {
              if (batch.mentors.length > 0) {
                return (
                  <IonItem key={batch_index}>
                    <div className="batch-area">
                      <IonLabel>
                        <h2>{batch.batch_name}</h2>
                      </IonLabel>
                      <IonList>
                        {batch.mentors.map((mentor, mentor_index) => {
                          return (
                            <IonItem key={mentor_index} className="striped">
                              <IonLabel className="allocation-info">
                                <p>
                                  Name: {mentor.name ? mentor.name : 'None'}
                                </p>
                              </IonLabel>
                              <IonButton
                                slot="end"
                                onClick={() => {
                                  setGetConfirmation({
                                    status: true,
                                    onConfirm: () => {
                                      deleteMapping(
                                        batch.id,
                                        mentor.id,
                                        batch_index,
                                        mentor_index
                                      )
                                    }
                                  })
                                }}
                              >
                                Delete
                              </IonButton>
                            </IonItem>
                          )
                        })}
                      </IonList>
                    </div>
                  </IonItem>
                )
              } else {
                return (
                  <IonItem key={batch_index}>
                    <div className="batch-area">
                      <IonLabel>
                        <h2>{batch.batch_name}</h2>
                      </IonLabel>
                      <IonList>
                        <IonItem className="striped">
                          <IonLabel className="allocation-info">
                            <p>No Mentors Found</p>
                          </IonLabel>
                        </IonItem>
                      </IonList>
                    </div>
                  </IonItem>
                )
              }
            })
          ) : (
            <IonItem>
              <IonLabel>No Allocations Found</IonLabel>
            </IonItem>
          )}
        </IonList>

        <IonAlert
          isOpen={getConfirmation.status}
          onDidDismiss={() => {
            setGetConfirmation({
              status: false,
              onConfirm: getConfirmation.onConfirm
            })
          }}
          header={'Are you sure?'}
          subHeader={'Confirm that you wish to delete this allocation'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                setGetConfirmation({
                  status: false,
                  onConfirm: getConfirmation.onConfirm
                })
              }
            },
            {
              text: 'Delete',
              handler: getConfirmation.onConfirm
            }
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default MentorView
