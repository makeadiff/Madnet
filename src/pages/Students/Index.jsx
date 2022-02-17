import {
  IonPage,
  IonLabel,
  IonContent,
  IonSegment,
  IonSegmentButton
} from '@ionic/react'
import React from 'react'
import { useParams } from 'react-router-dom'

import { dataContext } from '../../contexts/DataContext'

import Title from '../../components/Title'
import ChildList from './List'

const StudentIndex = () => {
  const [segment, setSegment] = React.useState('all')
  const { shelter_id } = useParams()
  const { callApi } = React.useContext(dataContext)
  const [location, setLocation] = React.useState('')

  React.useEffect(() => {
    async function fetchShelterName() {
      let center_data = {}
      if (shelter_id) {
        center_data = await callApi({
          graphql: `{ center(id: ${shelter_id}) { name } }`,
          cache_key: `center_${shelter_id}_name`
        })
        if (center_data.name) {
          setLocation(` in ${center_data.name} Shelter`)
        }
      }
    }
    fetchShelterName()
  }, [shelter_id])

  return (
    <IonPage>
      <Title name={`Students ${location}`} />

      <IonContent className="dark">
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value)}
        >
          <IonSegmentButton value="all">
            <IonLabel>All Students</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="search">
            <IonLabel>Search</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <ChildList segment={segment} shelter_id={shelter_id} />
      </IonContent>
    </IonPage>
  )
}

export default StudentIndex
