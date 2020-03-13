import { IonPage, IonList,IonMenuToggle,IonItem,IonLabel,IonContent } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { authContext } from "../contexts/AuthContext";
import Title from "../components/Title"
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
      <Title name="Shelters" />
      
      <IonContent>
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
      </IonContent>
    </IonPage>
  );
};

export default Shelters;
