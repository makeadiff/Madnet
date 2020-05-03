import { IonList,IonItem,IonLabel } from '@ionic/react';
import React, { useState, useEffect } from 'react';

import * as moment from 'moment';

import { authContext } from "../../contexts/AuthContext";
import { appContext } from "../../contexts/AppContext";
import api from "../../utils/API";
import EventDetail from "../../components/Event";

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
                if(user.city_id!=26){                
                    events_data = await api.rest(`events?city_id=${user.city_id}&from_date=today`, "get");
                }
                else{
                    events_data = await api.rest(`events?from_date=today`,"get");
                }
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
                    <EventDetail event={event} index={index} key={index}/>                    
                );
            })}
            { (events.length === 0) ? (<IonItem><IonLabel>No Events found.</IonLabel></IonItem>) : null }
        </IonList>
    );
};

export default EventList;
