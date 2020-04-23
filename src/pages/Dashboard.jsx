import { IonPage,IonContent,IonGrid,IonRow,IonCol,IonIcon,IonText } from '@ionic/react';
import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom'

import Title from '../components/Title'
import { authContext } from "../contexts/AuthContext";
import { volunteer_pages, fellow_pages } from "../utils/Menu"
import './All.css';
import './Dashboard.css';
const Alerts = lazy(() => import('../components/Alerts'))

const Dashboard = () => {
    const { isFellow } = React.useContext(authContext);

    return (
        <IonPage>
            <Title name="Dashboard" />

            <IonContent>
                <h3>Volunteer Pages</h3>
                <AppGrid apps={volunteer_pages} />

                { isFellow() ? (
                    <div>
                        <h3>Fellow Pages</h3>
                        <AppGrid apps={fellow_pages} />
                    </div>
                ) : null }

                <Suspense fallback={<h4>Loading...</h4>}>
                    <Alerts />
                </Suspense>
            </IonContent>
        </IonPage>
    );
};

const AppGrid = ({ apps }) => {
    return (
        <IonGrid>
            <IonRow class="ion-justify-content-start">
                {apps.map((app, index) => {
                    if(app.title === "Dashboard") return null
                    return (
                        <IonCol key={index} size-xs="6" size-md="3">
                            <Link to={app.url}>
                                <div className="box">
                                    <IonIcon slot="start" icon={app.iosIcon} size="large" /><br />
                                    <IonText>{app.title}</IonText>
                                </div>
                            </Link>
                        </IonCol>
                    );
                })}
            </IonRow>
        </IonGrid>
    )
}

export default Dashboard;
