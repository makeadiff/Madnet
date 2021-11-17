import {
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonDatetime
  } from '@ionic/react'
  import React from 'react'
  
  import { dataContext } from '../../contexts/DataContext'
  import { appContext } from '../../contexts/AppContext'
  import { useParams } from 'react-router-dom'
  import Title from '../../components/Title'

  const ShelterForm = () => {
      const {shelter_id} = useParams()
      const [shelter, setShelter] = React.useState([])
      const { callApi, unsetLocalCache } = React.useContext(dataContext)
      const [shelterData, setShelterData] = React.useState({})

      React.useEffect(() => {
        async function fetchData() {
          const data = await callApi({
            graphql: `{
                   center(id:${shelter_id}){
                        name
                    }
                }`
          })
          setShelter(data)
        }
        fetchData()}, [shelter_id])
    
        const updateField = (e) => {
            setShelterData({ ...shelterData, starts_on: e.target.value })
        }
    


    return(
        <IonPage>
            <Title
        name={`Edit ${shelter.name}`}
        back={`/shelters/${shelter_id}`}
      />
      <IonContent className="dark">
        <form /*onSubmit={SaveAssign}*/>
        <IonItem>
                  <IonLabel >Class Started On: </IonLabel>
                  <IonDatetime
                    displayFormat="D MMM YYYY"
                    mode="md"
                    min="2020"
                    value={shelterData.starts_on}
                    name="starts_on"
                    required
                    placeholder="Enter Starting Date"
                    onIonChange={updateField}
                  ></IonDatetime>
                </IonItem>
                <IonItem>
            <IonButton type="submit">Save Shelter Details</IonButton>
          </IonItem>
        </form>
      </IonContent>
        </IonPage>

      )

}

export default ShelterForm