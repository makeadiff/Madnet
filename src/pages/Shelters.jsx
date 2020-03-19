import { IonPage, IonList,IonMenuToggle,IonItem,IonLabel,IonContent } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { authContext } from "../contexts/AuthContext";
import { appContext } from "../contexts/AppContext";
import Title from "../components/Title"
import api from "../utils/API";
import './Page.css';

const Shelters = () => {
    const { auth } = React.useContext(authContext);
    const { setLoading } = React.useContext(appContext);
    const [shelters, setShelters] = useState([]);
    const [ cityId ] = useState(auth.city_id); // if we don't do this, infinite loading.

    useEffect(() => {
        async function fetchShelterList() {
            setLoading(true)
            const shelters_data = await api.rest("cities/" + cityId + "/centers", "get");
            if(shelters_data) {
                setShelters(shelters_data.centers)
            } else {
                console.log("Shelters fetch call failed.")
            }
            setLoading(false)
        }
        fetchShelterList();
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

export default Shelters;
