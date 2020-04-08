import React from 'react';
import { IonHeader,IonToolbar,IonButtons,IonMenuButton,IonTitle,IonIcon, IonBadge, IonTabButton } from '@ionic/react';
import { home } from 'ionicons/icons';

import './Title.css'

const Title = ({ name }) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton menuId="side" />
                </IonButtons>
                <IonTitle>{ name }</IonTitle>

                <IonButtons slot="end">
                    <IonTabButton href="/dashboard">
                        {/* :TODO: Show badge if there is any new alerts come. */}
                        <IonIcon icon={ home } size="large" />
                        <IonBadge id="notifications-badge" color="danger">5</IonBadge>
                    </IonTabButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default Title;
