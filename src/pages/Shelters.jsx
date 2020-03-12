import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
        IonList,IonListHeader,IonMenuToggle,IonItem,IonLabel,IonLoading } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { authContext } from "../contexts/AuthContext";
import ManageShelter from "./ManageShelter"

import { apiRequest } from "../utils/Helpers";
import './Page.css';

const Shelters = () => {
  const { auth } = React.useContext(authContext);
  const [shelters, setShelters] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [cityId, setCityId] = useState(auth.city_id); // if we don't do this, infinite loading.

  useEffect(() => {
    async function fetchShelterList() {
      setShowLoading(true)
      const shelters_data = await apiRequest("cities/" + cityId + "/centers", "get");
      if(shelters_data.status === "success") {
        setShelters(shelters_data.data.centers)
      } else {
        console.log("Shelters fetch call failed.")
      }
      setShowLoading(false)
    }
    fetchShelterList();
  }, [cityId])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Shelters</IonTitle>
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
            <IonTitle size="large">Shelters</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="main">
          <IonList>
            {shelters.map((shelter, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem routerLink={ "/page/Shelters/" + shelter.id } routerDirection="none" >
                    <IonLabel>{shelter.name}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Shelters;
