import {
  IonLabel,
  IonList,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonItem
} from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'

// import ChildSearch from './Search'
import ChildDetail from '../../components/Child'
import { authContext } from '../../contexts/AuthContext'
import { dataContext } from '../../contexts/DataContext'
import { appContext } from '../../contexts/AppContext'

import './Form.css'
import StudentSearch from './Search'

const StudentList = ({ segment, shelter_id }) => {
  const { user, hasPermission } = React.useContext(authContext)
  const { callApi } = React.useContext(dataContext)
  const [students, setStudents] = React.useState([])
  const [city_id] = React.useState(user.city_id)
  const { showMessage } = React.useContext(appContext)

  React.useEffect(() => {
    async function fetchChildList() {
      let child_data = []
      if (shelter_id) {
        child_data = await callApi({
          graphql: `{
                    studentSearch(center_id: ${shelter_id}) { id name birthday sex center { id name }}
                    center(id: ${shelter_id}) { name }
                  }`,
          cache_key: `center_${shelter_id}_students`
        })
      } else {
        child_data = await callApi({
          graphql: `{
                    studentSearch(city_id: ${city_id}) { id name sex birthday center { id name }}
                    city(id: ${city_id}) { name }
                  }`,
          cache_key: `city_${city_id}_students`
        })
      }
      setStudents(child_data.studentSearch)
    }
    fetchChildList()
  }, [city_id, shelter_id])

  if (segment == 'all') {
    return (
      <IonContent className="dark">
        <ListStudents students={students} sortByDefault="id" />
        {hasPermission('kids_add') ? (
          <IonFab vertical="bottom" horizontal="start" slot="fixed">
            <IonFabButton routerLink={`/students/0`}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        ) : null}
      </IonContent>
    )
  } else if (segment == 'search') {
    return <StudentSearch segment={segment} shelter_id={shelter_id} />
  } else {
    showMessage('Something went wrong while fetching student data', 'error')
  }
}

const ListStudents = ({ students, sortByDefault }) => {
  const [sortBy, setSortBy] = React.useState(sortByDefault)
  if (students.length > 0) {
    return (
      <IonList>
        <IonItem>
          <IonLabel class="ion-text-right">Sort By</IonLabel>
          <IonSelect
            interface="popover"
            value={sortBy}
            placeholder="Choose"
            onIonChange={(e) => setSortBy(e.target.value)}
          >
            <IonSelectOption value="id">ID</IonSelectOption>
            <IonSelectOption value="name">Name</IonSelectOption>
          </IonSelect>
        </IonItem>
        {students
          .sort((item1, item2) => (item1[sortBy] > item2[sortBy] ? 1 : -1))
          .map((child, index) => (
            <ChildDetail key={index} child={child} index={index} />
          ))}
      </IonList>
    )
  } else {
    return (
      <IonList>
        <IonItem>
          <IonLabel>No Students found.</IonLabel>
        </IonItem>
      </IonList>
    )
  }
}

export default StudentList
export { ListStudents }
