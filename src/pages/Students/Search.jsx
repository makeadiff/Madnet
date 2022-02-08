import {
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react'
import React from 'react'

import { authContext } from '../../contexts/AuthContext'
import { appContext } from '../../contexts/AppContext'
import { dataContext } from '../../contexts/DataContext'
import './Form.css'
import { ListStudents } from './List'

const StudentSearch = ({ segment, shelter_id }) => {
  const { user } = React.useContext(authContext)
  const { setLoading } = React.useContext(appContext)
  const [shelter, setShelter] = React.useState([])
  const [students, setStudents] = React.useState(null)
  const [students_filtered, setStudentsFiltered] = React.useState([])
  const { getUsers, callApi } = React.useContext(dataContext)
  const [search, setSearch] = React.useState({
    city_id: user.city_id,
    id: '',
    name: '',
    shelter_ids: []
  })

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
                        studentSearch(city_id: ${search.city_id}) { id name sex birthday center { id name }}
                        city(id: ${search.city_id}) { name }
                      }`,
          cache_key: `city_${search.city_id}_students`
        })
      }
      setStudents(child_data.studentSearch)
    }
    fetchChildList()
  }, [shelter_id])

  //Fetching all shelters
  React.useEffect(() => {
    const fetchShelters = () => {
      callApi({ url: `/cities/${search.city_id}/centers` }).then((data) => {
        setShelter(data)
      })
    }
    fetchShelters()
  }, [segment])

  const setSearchValue = (key, value) => {
    const new_search = { ...search, [key]: value }
    setSearch(new_search)
  }

  // This converts the selected checkboxes into an array of ids.
  const setShelterSearch = (e) => {
    let shelters = search.shelter_ids
    const value = e.target.value
    if (e.target.checked) {
      shelters.push(value)
    } else {
      shelters = search.shelter_ids.filter((ele) => {
        return ele !== value
      })
    }
    setSearch({ ...search, shelter_ids: shelters })
    console.log(shelters)
  }

  const searchStudents = async (e) => {
    e.preventDefault()
    if (
      search.name === '' &&
      search.id === '' &&
      search.shelter_ids.length === 0
    ) {
      return // skip the search
    }
    setLoading(true)
    let filtered_students = []
    students.forEach((student) => {
      if (
        (search.name == '' ||
          student.name.toLowerCase().includes(search.name.toLowerCase())) &&
        (search.id == '' || student.id === search.id) &&
        (search.shelter_ids.length == 0 ||
          search.shelter_ids.includes(student.center.id))
      ) {
        filtered_students.push(student)
      }
    })
    setStudentsFiltered(filtered_students)
    setLoading(false)
  }

  return (
    <>
      <form onSubmit={(e) => searchStudents(e)}>
        <IonCard className="dark">
          <IonCardHeader>
            <IonCardTitle> Search Student(s)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <InputRow
              label="Student ID"
              id="id"
              type="text"
              value={search.id}
              onIonInput={(e) => setSearchValue('id', e.target.value)}
            />
            <InputRow
              label="Student Name"
              id="name"
              type="text"
              value={search.name}
              onIonInput={(e) => setSearchValue('name', e.target.value)}
            />
            {shelter_id ? null : (
              <div>
                <IonItem>
                  <IonLabel>Shelters</IonLabel>
                </IonItem>
                <div className="groups-area">
                  {shelter.map((sh, index) => {
                    return (
                      <IonItem key={index} lines="none">
                        <IonCheckbox
                          value={sh.id}
                          onIonChange={setShelterSearch}
                        />
                        <IonLabel> &nbsp; {sh.name}</IonLabel>
                      </IonItem>
                    )
                  })}
                </div>
              </div>
            )}

            <IonItem>
              <IonButton id="action" type="submit" size="default">
                Search
              </IonButton>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </form>
      <ListStudents students={students_filtered} sortByDefault="id" />
    </>
  )
}

const InputRow = ({ id, label, type, value, onIonInput }) => {
  return (
    <IonItem>
      <IonLabel position="stacked">{label}</IonLabel>
      <IonInput
        type={type}
        id={id}
        placeholder={label}
        value={value}
        onIonInput={onIonInput}
      />
    </IonItem>
  )
}

export default StudentSearch
