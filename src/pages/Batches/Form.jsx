import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonAlert
} from '@ionic/react'
import { pencil, close, trash } from 'ionicons/icons'
import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import * as moment from 'moment'

import Title from '../../components/Title'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'

const BatchForm = () => {
  const { shelter_id, project_id, batch_id } = useParams()
  const [batch, setBatch] = React.useState({
    batch_name: '',
    class_time: '16:00:00',
    day: 0,
    project_id: project_id,
    center_id: shelter_id
  })
  const [disable, setDisable] = React.useState(true)
  const { callApi, unsetLocalCache, cache } = React.useContext(dataContext)
  const { showMessage } = React.useContext(appContext)
  const [getConfirmation, setGetConfirmation] = React.useState({status: false, onConfirm: () => {}})
  const history = useHistory()

  React.useEffect(() => {
    async function fetchBatch() {
      const batch_data = await callApi({
        graphql: `{ batch(id: ${batch_id}) { 
                id batch_name day class_time project_id
                mentors { id }
                teachers { id }
            }}`,
        cache: true,
        cache_key: `batch_${batch_id}`
      })

      setBatch(batch_data)
    }

    if (batch_id !== '0') {
      if (cache[`batch_${batch_id}`] === undefined || !cache[`batch_${batch_id}`]) {
        fetchBatch()
      } else {
        setBatch(cache[`batch_${batch_id}`])
      }
    } else {
      setDisable(false)
      setBatch({ ...batch, batch_name: 'New Batch' })
    }
  }, [batch_id, cache[`batch_${batch_id}`]])

  const updateField = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value })
  }
  const updateTimeField = (e) => {
    let time_parts = batch.class_time.split(':')
    if (e.target.name === 'class_time_hour') time_parts[0] = e.target.value
    else if (e.target.name === 'class_time_min') time_parts[1] = e.target.value

    setBatch({ ...batch, class_time: time_parts.join(':') })
  }

  const saveBatch = (e) => {
    e.preventDefault()

    if (batch_id !== '0') {
      // Edit
      callApi({
        url: `/batches/${batch_id}`,
        method: 'post',
        params: batch
      }).then((data) => {
        if (data) {
          setDisable(true)
          showMessage('Batch Updated Successfully', 'success')
          unsetLocalCache(`shelter_${shelter_id}_project_${project_id}_batch_index`)
          unsetLocalCache(`shelter_view_${shelter_id}`)
          unsetLocalCache(`batch_${batch_id}`)
        }
      })
    } else {
      // Create new batch
      callApi({ url: `/batches`, method: 'post', params: batch }).then(
        (data) => {
          if (data) {
            setDisable(true)
            showMessage('Batch Created Successfully', 'success')
            unsetLocalCache(`shelter_${shelter_id}_project_${project_id}_batch_index`)
            unsetLocalCache(`shelter_view_${shelter_id}`)
            unsetLocalCache(`batch_${batch_id}`)
          }
        }
      )
    }
  }

  const deleteBatch = () => {
    if(batch.teachers.length > 0 || batch.mentors.length > 0) {
      showMessage(`Please delete all teacher assignments from the batch before deleting.`, 'error')
      return false;
    }
    callApi({
      url: `/batches/${batch_id}`,
      method: 'delete'
    }).then(() => {
      unsetLocalCache(`shelter_${shelter_id}_project_${project_id}_batch_index`)
      unsetLocalCache(`shelter_view_${shelter_id}`)
      unsetLocalCache(`batch_${batch_id}`)
      history.push(`/shelters/${shelter_id}/projects/${project_id}/batches`)
      showMessage('Deleted the batch')
    })
  }

  const class_time_options = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] // 7 AM to 11 PM
  const day_options = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  return (
    <IonPage>
      <Title
        name={`Batch: ${day_options[batch.day]} ${moment(
          '2020-04-29 ' + batch.class_time
        ).format('hh:mm A')}`} // This should have been just batch.batch_name - but some bug caches previous view ka data in that variable.
        back={`/shelters/${shelter_id}/projects/${project_id}/batches`}
      />

      <IonContent class="dark">
        <IonList>
          <form onSubmit={saveBatch}>
            <IonItem>
              <IonLabel>Class Time</IonLabel>
              <IonSelect
                slot="end"
                name="class_time_hour"
                value={batch.class_time.split(':')[0]}
                onIonChange={updateTimeField}
                disabled={disable}
              >
                {class_time_options.map((hour, index) => {
                  return (
                    <IonSelectOption
                      key={index}
                      value={
                        hour < 10 ? '0' + hour.toString() : hour.toString()
                      }
                    >
                      {
                        moment(
                          '2020-04-29 ' +
                            (hour < 10
                              ? '0' + hour.toString()
                              : hour.toString()) +
                            ':00:00'
                        ).format('hh A') // Date can be anything.
                      }
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
              <IonSelect
                slot="end"
                name="class_time_min"
                value={batch.class_time.split(':')[1]}
                onIonChange={updateTimeField}
                disabled={disable}
              >
                {['00', '15', '30', '45'].map((min, index) => {
                  return (
                    <IonSelectOption key={index} value={min}>
                      : {min}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel>Day</IonLabel>
              <IonSelect
                name="day"
                value={batch.day.toString()}
                onIonChange={updateField}
                disabled={disable}
              >
                {day_options.map((name, day) => {
                  return (
                    <IonSelectOption key={day} value={day.toString()}>
                      {name}
                    </IonSelectOption>
                  )
                })}
              </IonSelect>
            </IonItem>
            {disable ? null : (
              <IonItem>
                <IonButton type="submit">Save</IonButton>
              </IonItem>
            )}
          </form>
          { batch_id == "0" ? null :
            <>
            <IonItem>
              <IonButton slot="end" 
                          onClick={() => { 
                            setGetConfirmation({
                              status:true,
                              onConfirm: () => { deleteBatch() } 
                            })
                          }}>
                <IonIcon icon={trash} /> Delete this Batch
              </IonButton>
            </IonItem>
            <IonItem>
              <IonButton routerLink={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/0/view-teachers`}>
                Add/Remove Teachers to this Batch
              </IonButton>
              <IonButton routerLink={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/0/view-mentors`}>
                Add/Remove Mentors to this Batch
              </IonButton>
            </IonItem>
            </>
          }
        </IonList>

        <IonAlert
          isOpen={getConfirmation.status}
          onDidDismiss={() => { setGetConfirmation({ status: false, onConfirm: getConfirmation.onConfirm }) }}
          header={'Are you sure?'}
          subHeader={'Confirm that you wish to delete this allocation'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => { setGetConfirmation({ status: false, onConfirm: getConfirmation.onConfirm }) }
            },
            {
              text: 'Delete',
              handler: getConfirmation.onConfirm
            }
          ]}
        />

        {disable ? (
          <IonFab
            onClick={() => {
              setDisable(false)
            }}
            vertical="bottom"
            horizontal="start"
            slot="fixed"
          >
            <IonFabButton>
              <IonIcon icon={pencil} />
            </IonFabButton>
          </IonFab>
        ) : (
          <IonFab
            onClick={() => {
              setDisable(true)
            }}
            vertical="bottom"
            horizontal="start"
            slot="fixed"
          >
            <IonFabButton>
              <IonIcon icon={close} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  )
}

export default BatchForm
