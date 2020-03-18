import { IonPage,IonContent,IonGrid,IonRow,IonCol,IonIcon,IonText } from '@ionic/react';
import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom'

import Title from '../components/Title'
import { authContext } from "../contexts/AuthContext";
import { volunteerPages, fellowPages } from "../utils/Menu"
import './Dashboard.css';
const Alerts = lazy(() => import('../components/Alerts'))

const Dashboard = () => {
    const { isFellow } = React.useContext(authContext);

    return (
        <IonPage>
            <Title name="Dashboard" />

            <IonContent>
                <h3>Volunteer Pages</h3>
                <IonGrid>
                    <IonRow class="ion-justify-content-start">
                        {volunteerPages.map((appPage, index) => {
                            if(appPage.title === "Dashboard") return null
                            return (
                                <IonCol key={index} size-xs="6" size-md="3">
                                    <Link to={appPage.url}>
                                        <div className="box">
                                            <IonIcon slot="start" icon={appPage.iosIcon} size="large" /><br />
                                            <IonText>{appPage.title}</IonText>
                                        </div>
                                    </Link>
                                </IonCol>
                            );
                        })}
                    </IonRow>
                </IonGrid>

                { isFellow() ? (
                    <div>
                        <h3>Fellow Pages</h3>
                        <IonGrid>
                            <IonRow class="ion-justify-content-start">
                                {fellowPages.map((appPage, index) => {
                                    return (
                                        <IonCol key={index} size-xs="6" size-md="3">
                                            <Link to={appPage.url}>
                                                <div className="box">
                                                    <IonIcon slot="start" icon={appPage.iosIcon} size="large" /><br />
                                                    <IonText>{appPage.title}</IonText>
                                                </div>
                                            </Link>
                                        </IonCol>
                                    );
                                })}
                            </IonRow>
                        </IonGrid>
                    </div>
                ) : null }

                <Suspense fallback={<h4>Loading...</h4>}>
                    <Alerts />
                </Suspense>
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;
