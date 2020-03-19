import { IonPage, IonList,IonMenuToggle,IonItem,IonLabel,IonContent } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import Title from "../components/Title"
import { useParams } from "react-router-dom"
import api from "../utils/API"
import { appContext } from "../contexts/AppContext";
import './Page.css';

const ManageShelter = () => {
    const { shelter_id } = useParams()
    const [shelter, setShelter] = useState([]);
    const [shelterId] = useState(shelter_id); // if we don't do this, infinite loading.
    const { setLoading } = React.useContext(appContext);

    useEffect(() => {
        async function fetchShelter() {
            setLoading(true)
            const shelter_data = await api.graphql(`{ center(id: ${shelterId}) { 
                id name
                batches { id batch_name }
                levels { id level_name }
            }}`);

            if(shelter_data.center) {
                setShelter(shelter_data.center)
            } else {
                console.log("Shelter fetch call failed.")
            }
            setLoading(false)
        }
        fetchShelter();
    }, [shelterId])

    return (
        <IonPage>
            <Title name={ `Manage ${shelter.name} Shelter` } />

            <IonContent>
                <IonList>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/page/Shelters/${shelter.id}/batches` } routerDirection="none" >
                            <IonLabel>{ (shelter.batches !== undefined) ? shelter.batches.length : "" } Batch(es)</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/page/Shelters/${shelter.id}/levels` } routerDirection="none" >
                            <IonLabel>{ (shelter.levels !== undefined) ? shelter.levels.length : "" } Level(s)</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/page/Shelters/${shelter.id}/assign-teachers` } routerDirection="none" >
                            <IonLabel>Assign Teachers</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                        <IonItem routerLink={ `/page/Shelters/${shelter.id}/edit` } routerDirection="none" >
                            <IonLabel>Edit { shelter.name } Details</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ManageShelter;
