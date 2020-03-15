import { IonPage,IonContent,IonGrid,IonRow,IonCol,IonItem,IonIcon,IonText,
            IonCard,IonCardHeader, IonCardTitle,IonCardContent } from '@ionic/react';
import React from 'react';
import { Link } from 'react-router-dom'

import Title from '../components/Title'
import { authContext } from "../contexts/AuthContext";
import { volunteerPages, fellowPages } from "../utils/Menu"

import './Dashboard.css';

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

                <div className="card-area">
                    <div className="alert-card danger">
                        <div className="alert-card-content">
                            <h4>Child Protection Policy</h4>
                            <p>You haven't signed the CPP yet. Please do.</p>
                        </div>
                    </div>

                    <div className="alert-card warning">
                        <div className="alert-card-content">
                            <h4>Volunteer Leadership Circle</h4>
                            <p>You have been invited for an event on 2nd Feb.</p>
                        </div>
                    </div>

                    <div className="alert-card primary">
                        <div className="alert-card-content">
                            <h4>Launch: Fellowship</h4>
                            <p>Fellowship Profiles are now open for application.</p>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;
