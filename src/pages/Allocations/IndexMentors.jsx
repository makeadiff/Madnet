import {
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonCardContent,
  IonInput,
  IonCard,
  IonButton,
  IonCheckbox
} from '@ionic/react'
import { useHistory } from 'react-router-dom'
import React from 'react'

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import { useParams } from 'react-router-dom'
import Title from '../../components/Title'

const MentorIndex = () => {
  const { user } = React.useContext(authContext)
  const { shelter_id, project_id, level_id, batch_id } = useParams()
  const { showMessage } = React.useContext(appContext)
  const { callApi } = React.useContext(dataContext)

  const [volunteers, setVolunteers] = React.useState([])
  const [city_id] = React.useState(user.city_id)
  const [location, setLocation] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [selected, setSelected] = React.useState([])

  const history = useHistory()

  React.useEffect(() => {
    async function fetchTeacherList() {
      const user_data = await callApi({ url: 'cities/' + city_id + '/users' })
      const city_name = await callApi({ url: 'cities/' + city_id })

      if (user_data) {
        setVolunteers(user_data)
        setLocation(city_name.name)
      } else {
        showMessage('No Volunteers in city')
      }
    }
    fetchTeacherList()
  }, [city_id])

  const addMentors = (e) => {
    e.preventDefault()

    let selected_mentors = Object.keys(selected)
    callApi({
      url: `/batches/${batch_id}/mentors`,
      method: 'post',
      params: { mentor_user_ids: selected_mentors.join(',') }
    }).then((data) => {
      if (data) {
        showMessage(
          `Saved Mentor selections for batch ${data.name} at ${data.center}`,
          'success'
        )
      }
    })

    history.push(
      `/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/${level_id}/view-mentors`
    )
  }

  const selectVolunteer = (e) => {
    const volunteer_id = e.target.value
    const is_selected = e.target.checked

    if (is_selected === undefined) {
      if (selected[volunteer_id]) {
        let sel = { ...selected }
        delete sel[volunteer_id]
        setSelected(sel)
      }
      return
    }

    let sel = { ...selected }
    //True or false if checkbox selected
    if (is_selected === true) {
      sel[volunteer_id] = true
    } else {
      delete sel[volunteer_id]
    }
    setSelected(sel)
  }

  return (
    <IonPage>
      <Title
        name={`Volunteers in ${location}`}
        back={`/shelters/${shelter_id}/projects/${project_id}/batch/${batch_id}/level/${level_id}/view-mentors`}
      />
      <IonContent className="dark">
        <IonCard>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonButton onClick={addMentors}>Assign Mentors</IonButton>
              </IonItem>
              <IonItem>
                <IonInput
                  type="text"
                  id="name"
                  placeholder="Filter by Name"
                  onIonChange={(e) => setQuery(e.target.value)}
                  class="placeholder-text"
                />
              </IonItem>
              <form onSubmit={addMentors}>
                {volunteers
                  .sort((a, b) => {
                    const aSelected = !!selected[a.id]
                    const bSelected = !!selected[b.id]

                    if (aSelected === true && bSelected === false) {
                      return -1
                    } else if (aSelected === false && bSelected === true) {
                      return 1
                    } else {
                      return 0
                    }
                  })
                  .map((volunteer, index) => {
                    if (
                      volunteer.name.toLowerCase().includes(query.toLowerCase())
                    ) {
                      return (
                        <IonItem key={index} className="striped">
                          <IonCheckbox
                            value={volunteer.id}
                            checked={selected[volunteer.id]}
                            onIonChange={selectVolunteer}
                            slot="start"
                          ></IonCheckbox>
                          <IonLabel>{volunteer.name}</IonLabel>
                        </IonItem>
                      )
                    }
                  })}

                <IonItem>
                  <IonButton onClick={addMentors}>Assign Mentors</IonButton>
                </IonItem>
              </form>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default MentorIndex
