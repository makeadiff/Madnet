import { IonPage, IonLabel,IonContent, IonSegment,IonSegmentButton } from '@ionic/react';
import React from 'react';

import Title from "../../components/Title"
import EventList from "./List"

const EventIndex = () => {
    const [segment, setSegment] = React.useState('invitations')

    return (
        <IonPage>
            <Title name="Events" />

            <IonContent>
                <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value)}>
                    <IonSegmentButton value="invitations">
                        <IonLabel>Invitations</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="in-city">
                        <IonLabel>Events in City</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <EventList segment={segment} />

            </IonContent>
        </IonPage>
    );
};

export default EventIndex;
