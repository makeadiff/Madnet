import { IonList,IonItem,IonLabel } from '@ionic/react';
import React, { useState, useEffect } from 'react';

import * as moment from 'moment';

import { authContext } from "../../contexts/AuthContext";
import { appContext } from "../../contexts/AppContext";
import api from "../../utils/API";

const EventList = ({ segment }) => {
    const { user } = React.useContext(authContext);
    const { setLoading } = React.useContext(appContext);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEventList() {
            setLoading(true)
            let events_data = []

            if(segment === "invitations") {
                events_data = await api.rest(`events?invited_user_id=${user.id}&from_date=today`, "get");
            } else if(segment === "in-city") {
                 events_data = await api.rest(`events?city_id=${user.city_id}&from_date=today`, "get");
            }
            if(events_data) {
                setEvents(events_data.events)
            } else {
                console.log("EventList fetch call failed.")
            }
            setLoading(false)
        }
        fetchEventList();
    }, [segment])

    return (
        <IonList>
            {events.map((event, index) => {
                return (
                    <IonItem key={index} routerLink={ `/events/${event.id}/rsvp` } routerDirection="none" >
                        <IonLabel>
                            <h4>{event.name}</h4>
                            <p>{ moment(event.starts_on).format("MMM Do") } </p>
                        </IonLabel>
                    </IonItem>
                );
            })}
            { (events.length === 0) ? (<IonItem><IonLabel>No Events found.</IonLabel></IonItem>) : null }
        </IonList>
    );
};

export default EventList;
