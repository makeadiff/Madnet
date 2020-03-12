import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
        IonList,IonMenuToggle,IonItem,IonLabel,IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import { graphql } from "../utils/Helpers"
import './Page.css';

const ManageShelter = () => {
  const { shelter_id } = useParams()

  const [shelter, setShelter] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [shelterId] = useState(shelter_id); // if we don't do this, infinite loading.

  useEffect(() => {
    async function fetchShelter() {
      setShowLoading(true)
      const shelter_data = await graphql(`{ center(id: ${shelterId}) { 
          id name
          batches { id batch_name }
          levels { id level_name }
        }}`);

      if(shelter_data.center) {
        console.log(shelter_data.center)
        setShelter(shelter_data.center)
      } else {
        console.log("Shelter fetch call failed.")
      }
      setShowLoading(false)
    }
    fetchShelter();
  }, [shelterId])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Manage { shelter.name }</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Loading...'}
          duration={5000}
        />
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Manage { shelter.name }</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="main">
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem routerLink={ `/page/Shelters/${shelter.id}/batches` } routerDirection="none" >
                <IonLabel>{ (shelter.batches !== undefined) ? shelter.batches.length : "" } Batche(s)</IonLabel>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ManageShelter;
