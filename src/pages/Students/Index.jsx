import {
  IonPage,
  IonList,
  IonFab,
  IonIcon,
  IonFabButton,
  IonContent
} from '@ionic/react'
import React from 'react'
import { add } from 'ionicons/icons'
import { useParams } from 'react-router-dom'

import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import Title from '../../components/Title'
import ChildDetail from '../../components/Child'

const StudentIndex = () => {
  const { shelter_id } = useParams()
  const { user, hasPermission } = React.useContext(authContext)
  const { callApi } = React.useContext(dataContext)
  const [students, setStudents] = React.useState([])
  const [city_id] = React.useState(user.city_id)
  const [location, setLocation] = React.useState('')

  React.useEffect(() => {
    async function fetchChildList() {
      let child_data = []
      if (shelter_id) {
        child_data = await callApi({
          graphql: `{ 
                    studentSearch(center_id: ${shelter_id}) { id name birthday sex center { name }}
                    center(id: ${shelter_id}) { name }
                  }`,
          cache_key: `center_${shelter_id}_students`
        })
        setLocation(` in ${child_data.center.name}`)
      } else {
        child_data = await callApi({
          graphql: `{ 
                    studentSearch(city_id: ${city_id}) { id name sex birthday center { name }}
                    city(id: ${city_id}) { name }
                  }`,
          cache_key: `city_${city_id}_students`
        })
        setLocation(` in ${child_data.city.name}`)
      }
      setStudents(child_data.studentSearch)
    }
    fetchChildList()
  }, [city_id, shelter_id])

  return (
    <IonPage>
      <Title
        name={`Students ${location}`}
        {...(shelter_id ? { back: `/shelters/${shelter_id}` } : {})}
      />

      <IonContent className="dark">
        <IonList>
          {students.map((child, index) => (
            <ChildDetail key={index} child={child} index={index} />
          ))}
        </IonList>

        { hasPermission('kids_add') ? (
          <IonFab vertical="bottom" horizontal="start" slot="fixed">
            <IonFabButton routerLink={`/students/0`}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        ) : null}
      </IonContent>
    </IonPage>
  )
}

export default StudentIndex
