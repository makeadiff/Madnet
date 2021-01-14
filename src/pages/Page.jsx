import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';

import './Page.css';
import Title from '../components/Title';

const Page = ({ page }) => {
    return (
        <IonPage>
            <Title name={page.name} />

            <IonContent className="dark">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{ page.name }</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ExploreContainer name={page.name} />
            </IonContent>
        </IonPage>
    );
};

export default Page;
