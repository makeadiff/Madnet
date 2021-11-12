import { IonPage, IonList, IonItem, IonLabel, IonContent } from '@ionic/react'
import React from 'react'

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import { useParams } from 'react-router-dom'
import Title from '../../components/Title'

const TeacherIndex = () => {
  const { user } = React.useContext(authContext)
  const { shelter_id, project_id, level_id } = useParams()
  const { showMessage } = React.useContext(appContext)
  const { callApi } = React.useContext(dataContext)
  const [teachers, setTeachers] = React.useState([])
  const [city_id] = React.useState(user.city_id)
  const [location, setLocation] = React.useState('')

  React.useEffect(() => {
    async function fetchTeacherList() {
      const user_data = await callApi({ url: 'cities/' + city_id + '/users' }) // 1
      // const user_data = await callApi({url:"cities/" + city_id + "/teachers"})  // 2 (Diff values. Why?)
      const city_name = await callApi({ url: 'cities/' + city_id })

      if (user_data) {
        setTeachers(user_data)
        setLocation(city_name.name)
      } else {
        showMessage('No teachers in city')
      }
    }
    fetchTeacherList()
  }, [city_id])

  return (
    <IonPage>
      <Title
        name={`Teachers in ${location}`}
        back={`/shelters/${shelter_id}/projects/${project_id}/level/${level_id}/view-teachers`}
      />
      <IonContent className="dark">
        <IonList>
          {teachers.map((teacher, index) => {
            return (
              <IonItem
                key={index}
                routerLink={`/shelters/${shelter_id}/projects/${project_id}/level/${level_id}/assign-teachers/${teacher.id}`}
              >
                <IonLabel>{teacher.name}</IonLabel>
              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default TeacherIndex
