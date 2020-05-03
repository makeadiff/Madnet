import { IonPage,IonList,IonItem,IonLabel,IonContent } from '@ionic/react'
import React from 'react'

import { authContext } from "../../contexts/AuthContext"
import { dataContext } from "../../contexts/DataContext"
import Title from "../../components/Title"

const ShelterIndex = () => {
    const { user } = React.useContext(authContext)
    const { callApi } = React.useContext(dataContext)
    const [shelters, setShelters] = React.useState([])
    const [ cityId ] = React.useState(user.city_id)

    React.useEffect(() => {
        async function fetchShelterList() {
            const shelters_data = await callApi({url: "cities/" + cityId + "/centers" })
            setShelters(shelters_data)
        }
        fetchShelterList()
    }, [cityId])

    return (
        <IonPage>
            <Title name="Shelters" />
      
            <IonContent>
                <IonList>
                    {shelters.map((shelter, index) => {
                        return (
                            <IonItem key={index} routerLink={ "/shelters/" + shelter.id } routerDirection="none" >
                                <IonLabel>{shelter.name}</IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ShelterIndex
