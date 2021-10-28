import { IonPage, IonList, IonItem, IonLabel, IonContent } from '@ionic/react'
import React from 'react'

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'
import { useParams } from 'react-router-dom'
import Title from '../../components/Title'

const TeacherIndex = () => {
  const { user } = React.useContext(authContext)
  const { shelter_id, project_id, new_level_id } = useParams()
  const [level_id] = React.useState(new_level_id ? new_level_id : 0)
  const { showMessage } = React.useContext(appContext)
  const { callApi } = React.useContext(dataContext)
  const [teachers, setTeachers] = React.useState([])
  const [cityId] = React.useState(user.city_id)
  const [location, setLocation] = React.useState('')

  React.useEffect(() => {
    async function fetchTeacherList() {
      const user_data = await callApi({ url: 'cities/' + cityId + '/users' }) // 1
      // const user_data = await callApi({url:"cities/" + cityId + "/teachers"})  // 2 (Diff values. Why?)
      const city_name = await callApi({ url: 'cities/' + cityId })

      if (user_data) {
        setTeachers(user_data)
        setLocation(city_name.name)
      } else {
        showMessage('No teachers in city')
      }
    }
    fetchTeacherList()
  }, [cityId])

  return (
    <IonPage>
      <Title
        name={`Teachers in ${location}`}
        back={`/shelters/${shelter_id}/projects/${project_id}/view-teachers`}
      />
      <IonContent className="dark">
        <IonList>
          {teachers.map((teacher, index) => {
            return (
              <IonItem
                key={index}
                routerLink={`/shelters/${shelter_id}/projects/${project_id}/assign-teachers/${teacher.id}/level/${level_id}`}
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
