import { IonPage,IonContent,IonGrid,IonRow,IonCol,IonIcon,IonLabel, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react'
import React from 'react'
import { useParams } from "react-router-dom"
import { checkmarkOutline,helpOutline,closeOutline,locationOutline,timeOutline } from 'ionicons/icons'

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
                id name description place starts_on event_type
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
                    <IonRow>
                    { event.starts_on ? 
                        (<IonCol size-xs="3" size-md="1">
                            <div className="date-number">{ moment(event.starts_on).format("D") }</div>
                            <div className="month-name">{ moment(event.starts_on).format("MMM") }</div>
                        </IonCol>) : null }
                        <IonCol size-xs="9" size-md="11">
                            <div className="event-name">{ event.name }</div>
                            <div className="event-type">{ event.event_type }</div>
                        </IonCol>
                    </IonRow>
                        <IonCol size-md="6">
                            <IonCard className="light">
                                <IonCardHeader>
                                    <IonCardTitle>
                                        RSVP for {event.name}
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonRow className="actions">
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
                                    </IonRow>
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
                    <IonRow>
                        <IonCol offset-xs="1" offset-md="0">
                            <p>{ event.description }</p>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default EventRSVP;
