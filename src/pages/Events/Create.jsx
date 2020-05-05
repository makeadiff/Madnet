import { IonPage, IonLabel,IonContent, IonInput,IonSegmentButton,IonFab,IonFabButton,IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonTextarea, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption} from '@ionic/react';
import { add, calendar } from 'ionicons/icons'
import React from 'react';
import { withRouter } from 'react-router-dom'

import Title from "../../components/Title"
import EventList from "./List"
import { authContext } from "../../contexts/AuthContext";
import { dataContext } from "../../contexts/DataContext";

const EventCreate = () => {

    const { hasPermission } = React.useContext(authContext);
    const { user } = React.useContext(authContext);
    const { getVerticals } = React.useContext(dataContext);    
    const [ verticals, setVerticals ] = React.useState({});
    const [ eventData, setEventData ] = React.useState({
      name: '',
      description: '',
      starts_on: '',
      place: '',
      city_id: user.city_id,
      event_type_id: 0,
      vertical_id: 0,
      created_by_user_id: user.id,      
    });

    const updateField = e => {
      setEventData({
        ...eventData,
        [e.target.name]: e.target.value
      })
    }

    React.useEffect(() => {
      async function fetchVerticals() {
        let verticals_data = [];

        verticals_data = await getVerticals();
        if(verticals_data){
          setVerticals(verticals_data);
        }                
      }
      fetchVerticals();
    }, [user])

    return (      
      <IonPage>
        <Title name="Create Event"/>

        <IonContent className="dark">
          <IonGrid>
            <IonRow>
              <IonCol size-md="6" size-xs="12">
                <IonCard className="light eventForm">
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={calendar}></IonIcon>Create Event
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem>
                      <IonLabel position="stacked">Event Name</IonLabel>
                      <IonInput name="name" type="text" onChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Description</IonLabel>
                      <IonTextarea name="description" type="text" onChange={updateField} placeholder="What is the event for?"></IonTextarea>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Date</IonLabel>
                      <IonInput name="starts_on" type="date" onChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Time</IonLabel>
                      <IonInput name="starts_on" type="time" onChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Vertical</IonLabel>
                      { verticals.length ? (
                      <IonSelect  placeholder="Select Vertical" interface="popover" name="vertical_id" value={eventData.vertical_id} onIonChange={updateField}>
                        {                                                                                                       
                          verticals.map((vertical,index) => {
                            return (
                              <IonSelectOption key={index} value={vertical.id}>{vertical.name}</IonSelectOption>
                            )
                          })
                        }
                      </IonSelect>
                      ): null }
                    </IonItem>            
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>      
    );
};

export default EventCreate;