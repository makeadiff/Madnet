import { IonPage,IonList,IonItem,IonLabel,IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonText} from '@ionic/react'
import { Link } from 'react-router-dom'
import { business } from 'ionicons/icons';
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
      
            <IonContent className="dark">
                <IonList>
                    <IonCard className="dark">
                        <IonGrid>
                            <IonRow className="ion-justify-content-start">                
                                {shelters.map((shelter, index) => {
                                    return (
                                        <IonCol className="menu-item" key={index} size-xs="6" size-md="3">
                                            <Link to={ "/shelters/" + shelter.id }>
                                                <div className="box">      
                                                    <IonIcon slot="start" icon={business} /><br />                                                                             
                                                    <IonText className="appTitle">{shelter.name}</IonText>
                                                    <IonLabel></IonLabel>
                                                </div>
                                            </Link>
                                        </IonCol>
                                    );
                                })}
                            </IonRow>
                        </IonGrid>
                    </IonCard>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ShelterIndex
