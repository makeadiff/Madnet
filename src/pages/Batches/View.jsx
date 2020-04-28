import { IonPage, IonList,IonMenuToggle,IonItem,IonLabel,IonContent } from '@ionic/react';
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"

import Title from "../../components/Title"
import { dataContext } from "../../contexts/DataContext"

const BatchView = () => {
    const { shelter_id } = useParams()
    const [shelter, setShelter] = useState({name: ""})
    const [shelterId] = useState(shelter_id)
    const { callApi } = React.useContext(dataContext);

    useEffect(() => {
        async function fetchShelter() {
            const shelter_data = await callApi({graphql: `{ center(id: ${shelterId}) { 
                id name
                batches { id batch_name }
                levels { id level_name }
            }}`});

            setShelter(shelter_data)
        }
        fetchShelter();
    }, [shelterId])

    return (
        <IonPage>
            <Title name={ `Manage ${shelter.name} Shelter` } />

            <IonContent>
                <IonList>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/shelters/${shelter.id}/batches` } routerDirection="none" >
                            <IonLabel>{ (shelter.batches !== undefined) ? shelter.batches.length : "" } Batch(es)</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/shelters/${shelter.id}/levels` } routerDirection="none" >
                            <IonLabel>{ (shelter.levels !== undefined) ? shelter.levels.length : "" } Level(s)</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/shelters/${shelter.id}/assign-teachers` } routerDirection="none" >
                            <IonLabel>Assign Teachers</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/shelters/${shelter.id}/edit` } routerDirection="none" >
                            <IonLabel>Edit { shelter.name } Details</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default BatchView;
