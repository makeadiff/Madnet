import React from 'react';
import { IonHeader,IonToolbar,IonButtons,IonMenuButton,IonTitle } from '@ionic/react';

const Title = ({ name }) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton />
                </IonButtons>
                <IonTitle>{ name }</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default Title;
