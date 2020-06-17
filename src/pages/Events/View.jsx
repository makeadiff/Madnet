import { IonPage,IonContent,IonGrid,IonRow,IonCol,IonIcon,IonLabel, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react'
import React from 'react'
import { useParams } from "react-router-dom"
import { checkmarkOutline,helpOutline,closeOutline,locationOutline,timeOutline } from 'ionicons/icons'

import * as moment from 'moment'
import { GOOGLE_MAPS_API_TOKEN, CITY_COORDINATES } from '../../utils/Constants'
import MapContainer from '../../components/Map'

import Title from "../../components/Title"
import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import api from "../../utils/API"
import './Event.css'
import { dataContext } from '../../contexts/DataContext'

// :TODO: Show reason input text area when selecting 'Can't Go'

const EventRSVP = () => {
    const { eventId } = useParams()    
    const [ event, setEvent ] = React.useState({})
    const [ rsvp, setRsvp ] = React.useState('no_data')
    const { setLoading } = React.useContext(appContext);
    const { user } = React.useContext(authContext)
    const { callApi } = React.useContext(dataContext);
    const [ location, setLocation ] = React.useState({})


    React.useEffect(() => {
        // console.log(eventId);        
        async function fetchEvent() {            
            const event_data = await callApi({url: `events/${eventId}`});
            console.log(event_data);
            if(event_data !== undefined) {
              setEvent(event_data);
              setLocation({lat: event_data.latitude, lng: event_data.longitude});              
            } else {
                // console.error("Event fetch call failed.")
            }            
        }
        fetchEvent();
    }, [eventId])

    // const saveRsvp = async function(rsvp) {
    //     setLoading(true)
    //     setRsvp(rsvp)
    //     const response = await api.rest(`events/${eventId}/users/${user.id}`, "post", {'rsvp': rsvp})
    //     if(response.user === undefined) {
    //         console.error("Error saving RSVP")
    //     }
    //     setLoading(false)
    // }
    const getUpdatedLocation = (location, address) => {
      let locationData = {
        lat: location.lat(),
        lng: location.lng()
      }
            
      setLocation(locationData);
      // setEventData({...eventData, latitude: locationData.lat, longitude: locationData.lng})
    }


    return (
        <IonPage>
            <Title name="Event RSVP" />

            <IonContent className="dark">
              <IonCard className="dark">
                <IonCardHeader>
                  <IonCardTitle>
                    {event.event_type}
                  </IonCardTitle>
                </IonCardHeader>
                <IonGrid>
                    <IonRow>
                    { event.starts_on ? (
                      <IonCol size-xs="3" size-md="1">
                          <div className="date-number">{ moment(event.starts_on).format("D") }</div>
                          <div className="month-name">{ moment(event.starts_on).format("MMM") }</div>
                      </IonCol>
                    ) : null }
                      <IonCol size-xs="9" size-md="11">                            
                          <div className="event-name">{event.name}</div>
                          <div className="event-description">{event.description}</div>
                      </IonCol>
                    </IonRow>
                        <IonCol size-md="6">
                            <IonCard className="light">
                                <IonCardHeader>                                    
                                </IonCardHeader>
                                <IonCardContent>
                                    {/* <IonRow className="actions">
                                        <IonCol className={`ion-text-center going ${rsvp === 'going' ? 'selected' : null }`}
                                            onClick={e => saveRsvp('going')} size-xs="4" size-md="2" size-lg="1">
                                            <IonIcon icon={ checkmarkOutline } /><br />
                                            <IonLabel>I'm Going</IonLabel>
                                        </IonCol>
                                        <IonCol className={`ion-text-center cant_go ${rsvp === 'cant_go' ? 'selected' : null }`}
                                            onClick={e => { saveRsvp('cant_go') }} size-xs="4" size-md="2" size-lg="1">
                                            <IonIcon icon={ closeOutline } /><br />
                                            <IonLabel>I can't go</IonLabel>
                                        </IonCol>
                                        <IonCol className={`ion-text-center maybe ${rsvp === 'maybe' ? 'selected' : null }`}
                                            onClick={e => saveRsvp('maybe')} size-xs="4" size-md="2" size-lg="1">
                                            <IonIcon icon={ helpOutline } /><br />
                                            <IonLabel>Not Sure</IonLabel>
                                        </IonCol>
                                    </IonRow> */}
                                    <IonRow>
                                        <IonCol offset-xs="1" offset-md="0">
                                            <IonIcon icon={ timeOutline } className="icon-medium" />
                                            <IonLabel> { moment(event.starts_on).format("MMM Do, hh:mm A") }</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                    { event.place? (
                                        <IonRow>
                                            <IonCol offset-xs="1" offset-md="0" className="ion-align-self-center">
                                                <IonIcon icon={ locationOutline } className="icon-medium" />
                                                <IonLabel> { event.place }</IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    ): null }
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size-md="6">
                          <MapContainer
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_TOKEN}&v=3.exp&libraries=geometry,drawing,places`}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ paddingTop: `40px`, height: `400px` }} />}
                            mapElement={<div style={{height: `100%` }} />}
                            coordinates={location}
                            locationUpdate={getUpdatedLocation}
                            isMarkerShown
                          />
                        </IonCol>                                    
                    <IonRow>
                        <IonCol offset-xs="1" offset-md="0">
                            <p>{ event.description }</p>
                        </IonCol>
                    </IonRow>
                </IonGrid>
              </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default EventRSVP;
