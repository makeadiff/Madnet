import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem
} from '@ionic/react'
import React, { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

import Title from '../components/Title'
import { authContext } from '../contexts/AuthContext'
import { volunteer_pages, fellow_pages } from '../utils/Menu'
import './All.css'
import './Dashboard.css'
const Alerts = lazy(() => import('../components/Alerts'))

const Dashboard = () => {
  const { isFellow } = React.useContext(authContext)
  const { user } = React.useContext(authContext)

  return (
    <IonPage>
      <Title name="Dashboard" />
      <IonContent class="dark">
        <IonGrid>
          <IonRow>
            <IonCol size-md="6" size-xs="12">
              <IonCard className="light">
                <IonCardHeader>
                  <IonCardTitle id="greeting-title">
                    Hello, {user.name}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size-md="3" size-xs="4">
                        <IonText className="centerAlign">
                          <p>Credits</p>
                        </IonText>
                        <div className="infoDisc small">
                          <IonText>{user.credit}</IonText>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
              <Suspense fallback={<h4>Loading...</h4>}>
                <Alerts />
              </Suspense>
            </IonCol>
            <IonCol size-md="6" size-xs="12">
              <IonCard className="dark no-shadow">
                <IonCardHeader>
                  <IonCardTitle>Your Section</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <AppGrid apps={volunteer_pages} />
                </IonCardContent>
              </IonCard>
              {isFellow() ? (
                <IonCard className="dark no-shadow">
                  <IonCardHeader>
                    <IonCardTitle>Admin</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <AppGrid apps={fellow_pages} />
                  </IonCardContent>
                </IonCard>
              ) : null}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

const AppGrid = ({ apps }) => {
  return (
    <IonGrid>
      <IonRow className="ion-justify-content-start">
        {apps.map((app, index) => {
          if (app.title === 'Dashboard') return null

          return (
            <IonCol className="menu-item" key={index} size-xs="6" size-md="4">
              <Link to={app.url}>
                <div className="box">
                  <IonIcon slot="start" icon={app.iosIcon} />
                  <br />
                  <IonText className="appTitle">{app.title}</IonText>
                </div>
              </Link>
            </IonCol>
          )
        })}
      </IonRow>
    </IonGrid>
  )
}

export default Dashboard
