import { IonList,IonItem,IonLabel } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import * as moment from 'moment'

import { authContext } from "../../contexts/AuthContext";
import { appContext } from "../../contexts/AppContext";
import { dataContext } from "../../contexts/DataContext";
import EventDetail from "../../components/Event";
import './Event.css'

const EventList = ({ segment }) => {
    const { callApi , cache } = React.useContext(dataContext)
    const { user } = React.useContext(authContext);
    const { setLoading } = React.useContext(appContext);
    const [ events, setEvents ] = useState([]);    

    useEffect(() => {
        async function fetchEventList() {
            setLoading(true)
            let events_data = []

            if(segment === "invitations") {
                events_data = await callApi({
                    url: `events?invited_user_id=${user.id}&from_date=today&to_date=` + moment().add(7, 'd').format('YYYY-MM-DD'),
                    method: "get",
                    cache: true,
                    cache_key: `user_${user.id}_events`
                });
            } else if(segment === "in-city") {
                events_data = await callApi({
                    url: `events?city_id=${user.city_id}&from_date=today&to_date=` + moment().add(7, 'd').format('YYYY-MM-DD'),
                    method: "get",
                    cache: true,
                    cache_key: `city_${user.city_id}_events`
                });
            }
            
            if(events_data) {
                setEvents(events_data)
            } else {
                console.log("EventList fetch call failed.")
            }
            setLoading(false)
        }

        if(segment === "invitations") {
            if(cache[`user_${user.id}_events`] === undefined || !cache[`user_${user.id}_events`]) {
                fetchEventList()
            } else {
                setEvents(cache[`user_${user.id}_events`])
            }
        } else if(segment === "in-city") {
            if(cache[`city_${user.city_id}_events`] === undefined || !cache[`city_${user.city_id}_events`]) {
                fetchEventList()
            } else {
                setEvents(cache[`city_${user.city_id}_events`])
            }
        }
    }, [segment, user, cache[`user_${user.id}_events`], cache[`city_${user.city_id}_events`]])

    return (
        <IonList>
            {events.map((event, index) => {
                return (
                    <EventDetail event={event} segment={segment} index={index} key={index}/>                
                );
            })}
            { (events.length === 0) ? (
                <IonItem><IonLabel className="error">No Events found.</IonLabel></IonItem>
            ) : null }
        </IonList>
    );
};

export default EventList;
