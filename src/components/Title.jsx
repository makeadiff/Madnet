import React from 'react';
import { IonHeader,IonToolbar,IonButtons,IonMenuButton,IonTitle,IonIcon, IonBadge, IonButton } from '@ionic/react';
import { home } from 'ionicons/icons';

import { appContext } from "../contexts/AppContext"
import './Title.css'

const Title = ({ name }) => {
    const { notifications } = React.useContext(appContext)
    
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton menuId="side" />
                </IonButtons>

                <IonButtons slot="start">
                    <IonButton routerLink="/dashboard">
                        <IonIcon icon={ home } size="large" />
                        { notifications.length ? 
                            <IonBadge id="notifications-badge" color="danger">{ notifications.length }</IonBadge> 
                            : null }
                    </IonButton>
                </IonButtons>

                <IonTitle>{ name }</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

export default Title;
