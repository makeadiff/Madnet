import { IonPage, IonLabel,IonContent, IonSegment,IonSegmentButton,IonFab,IonFabButton,IonIcon } from '@ionic/react';
import React from 'react';
import { useParams } from "react-router-dom"

import * as moment from 'moment';

import Title from "../../components/Title"
import { authContext } from "../../contexts/AuthContext";
import { appContext } from "../../contexts/AppContext";
import api from "../../utils/API";

const EventRSVP = () => {
    const { eventId } = useParams()
    const [event, setEvent] = React.useState({})
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

    return (
        <IonPage>
            <Title name="Event RSVP" />

            <IonContent>
                <h3>{ event.name }</h3>
                <h4>{ event.event_type }</h4>
                <h6>{ event.place ? "At " + event.place : null }
                    { event.starts_on ? " On " + moment(event.starts_on).format("MMM Do") : null }</h6>

                <p>{ event.description }</p>

            </IonContent>
        </IonPage>
    );
};

export default EventRSVP;
