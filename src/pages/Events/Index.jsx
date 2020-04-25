import { IonPage, IonLabel,IonContent, IonSegment,IonSegmentButton,IonFab,IonFabButton,IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons'
import React from 'react';

import Title from "../../components/Title"
import EventList from "./List"
import { authContext } from "../../contexts/AuthContext";

const EventIndex = () => {
    const [segment, setSegment] = React.useState('invitations')
    const { hasPermission } = React.useContext(authContext)

    return (
        <IonPage>
            <Title name="Events" />

            <IonContent>
                {/* This is working code { hasPermission('event_add') ? 
                    (<IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton>
                            <IonIcon icon={add} />
                        </IonFabButton>
                    </IonFab>) : null } */}

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
