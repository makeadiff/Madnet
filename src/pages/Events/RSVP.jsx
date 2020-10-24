import { IonPage,IonContent,IonGrid,IonRow,IonCol,IonIcon,IonLabel, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react'
import React from 'react'
import { useParams } from "react-router-dom"
import { checkmark, help, close, location, time, information } from 'ionicons/icons'

import * as moment from 'moment'

import Title from "../../components/Title"
import { authContext } from "../../contexts/AuthContext"
import { appContext } from "../../contexts/AppContext"
import api from "../../utils/API"
import './Event.css'

// :TODO: Show reason input text area when selecting 'Can't Go'

const EventRSVP = () => {
    const { eventId } = useParams()
    const [ event, setEvent ] = React.useState({})
    const [rsvp, setRsvp] = React.useState('no_data')
    const { setLoading } = React.useContext(appContext);
    const { user } = React.useContext(authContext)

    React.useEffect(() => {
        async function fetchEvent() {
            setLoading(true)
            const event_data = await api.graphql(`{ event(id: ${eventId}) { 
                id name description place starts_on event_type {
                    id name
                }
            }}`);

            if(event_data.event !== undefined) {
                let event_info = event_data.event         
                const rsvp = await api.rest(`events/${eventId}/users/${user.id}`)
                if(rsvp !== undefined && rsvp.user !== undefined) {                    
                    event_info['rsvp'] = rsvp.user;                                        
                    setEvent(event_info)
                    setRsvp(rsvp.user.rsvp)
                } else {
                    setEvent(event_info)
                    console.error("Current user not invited to event?")
                }                
            } else {
                console.error("Event fetch call failed.")
            }
            setLoading(false)
        }
        fetchEvent();
    }, [eventId])

    const saveRsvp = async function(rsvp) {
        setLoading(true)
        setRsvp(rsvp)
        const response = await api.rest(`events/${eventId}/users/${user.id}`, "post", {'rsvp': rsvp})
        if(response.user === undefined) {
            console.error("Error saving RSVP")
        }
        setLoading(false)
    }


    return (
        <IonPage>
            <Title name="Event RSVP" />
            <IonContent className="dark">
                <IonGrid>                    
                    <IonCol size-md="6">
                        <IonCard className="light">
                            <IonCardHeader>
                                <IonCardTitle>
                                        RSVP for {event.name}
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonRow>
                                    { event.starts_on ? 
                                        (<IonCol size-xs="3" size-md="1">
                                            <div className="date-number">{ moment(event.starts_on).format("D") }</div>
                                            <div className="month-name">{ moment(event.starts_on).format("MMM") }</div>
                                        </IonCol>
                                        ) : null }
                                    <IonCol size-xs="9" size-md="11">
                                        <IonRow className="actions">
                                            <IonCol className={`ion-text-center going ${rsvp === 'going' ? 'selected' : null }`}
                                                onClick={() => saveRsvp('going')}>
                                                <IonIcon icon={ checkmark } /><br />
                                                <IonLabel>I'm Going</IonLabel>
                                            </IonCol>
                                            <IonCol className={`ion-text-center cant_go ${rsvp === 'cant_go' ? 'selected' : null }`}
                                                onClick={() => { saveRsvp('cant_go') }}>
                                                <IonIcon icon={ close } /><br />
                                                <IonLabel>I can&apos;t go</IonLabel>
                                            </IonCol>
                                            <IonCol className={`ion-text-center maybe ${rsvp === 'maybe' ? 'selected' : null }`}
                                                onClick={() => saveRsvp('maybe')}>
                                                <IonIcon icon={ help } /><br />
                                                <IonLabel>Not Sure</IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonCol>
                                </IonRow>                                
                                <IonRow>
                                    <IonCol>
                                        <IonIcon icon={ time } className="icon-medium" />
                                        <IonLabel>Event Data-Time: { moment(event.starts_on).format("MMM Do, hh:mm A") }</IonLabel>
                                    </IonCol>
                                </IonRow>
                                { event.place? (
                                    <IonRow>
                                        <IonCol className="ion-align-self-center">
                                            <IonIcon icon={ location } className="icon-medium" />
                                            <IonLabel>Event Location/Zoom ID: { event.place }</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                ): null }
                                <IonRow>
                                    <IonCol className="ion-align-self-center">
                                        <IonIcon icon={ information } className="icon-medium" />
                                        <IonLabel>Event Description: { event.description }</IonLabel>
                                    </IonCol>
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>                    
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default EventRSVP;
