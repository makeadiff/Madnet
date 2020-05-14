import { IonPage, IonLabel,IonContent, IonInput,IonSegmentButton,IonFab,IonFabButton,IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonTextarea, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonButton} from '@ionic/react';
import { add, calendar } from 'ionicons/icons'
import React from 'react';
import { withRouter } from 'react-router-dom'

import Title from "../../components/Title"
import './Event.css'
import EventList from "./List"
import { authContext } from "../../contexts/AuthContext";
import { dataContext } from "../../contexts/DataContext";

const EventCreate = () => {

    const { hasPermission } = React.useContext(authContext);
    const { user } = React.useContext(authContext);
    const { getEventTypes } = React.useContext(dataContext);    
    const [ eventTypes, setEventTypes ] = React.useState({});
    const [ eventData, setEventData ] = React.useState({
      name: '',
      description: '',
      starts_on: '',
      place: '',
      city_id: user.city_id,
      event_type_id: 0,      
      created_by_user_id: user.id,      
    });

    const updateField = e => {
      setEventData({
        ...eventData,
        [e.target.name]: e.target.value
      })
    }

    let createEvent = async () => {
      console.log(eventData);
    }

    React.useEffect(() => {
      async function fetchEventTypes() {
        let eventTypesData = [];

        eventTypesData = await getEventTypes();
        console.log(eventTypesData);
        if(eventTypesData){
          setEventTypes(eventTypesData);
        }                
      }
      fetchEventTypes();
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
                      <IonInput name="name" type="text" onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Description</IonLabel>
                      <IonTextarea name="description" type="text" onIonChange={updateField} placeholder="What is the event for?"></IonTextarea>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Date</IonLabel>
                      <IonInput name="starts_on" type="date" onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Time</IonLabel>
                      <IonInput name="starts_on" type="time" onIonChange={updateField} placeholder="Enter Event Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Location</IonLabel>
                      <IonInput name="place" type="text" onIonChange={updateField} placeholder="Enter Event Location Name"></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Event Type</IonLabel>
                      { eventTypes.length ? (
                      <IonSelect  placeholder="Select Event Type" interface="alert" name="event_type_id" value={eventData.event_type_id} onIonChange={updateField}>
                        {                                                                                                       
                          eventTypes.map((eventType,index) => {
                            return (
                              <IonSelectOption key={index} value={eventType.id}>{eventType.name}</IonSelectOption>
                            )
                          })
                        }
                      </IonSelect>
                      ): null }
                    </IonItem>
                    <IonItem>
                        <IonButton type="submit" size="default" onClick={createEvent}>Save</IonButton>
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