import { IonPage, IonLabel,IonContent, IonSegment,IonSegmentButton } from '@ionic/react'
import React from 'react'

import Title from "../../components/Title"
import VolunteerList from "./List"


const UserIndex = () => {
    const [segment, setSegment] = React.useState('all')

    return (
        <IonPage>
            <Title name="Volunteers" />

            <IonContent className="dark">
                <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value)}>
                    <IonSegmentButton value="all">
                        <IonLabel>All Volunteers</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="needs-attention">
                        <IonLabel>Needs Attention</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <VolunteerList segment={segment} />

            </IonContent>
        </IonPage>
    );
};

export default UserIndex;
