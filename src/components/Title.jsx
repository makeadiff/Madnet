import React from 'react'
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonIcon,
  IonBadge,
  IonButton
} from '@ionic/react'
import { home, chevronBack, refreshCircle } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'

import { appContext } from '../contexts/AppContext'
import './Title.css'

const Title = ({ name, back, refresh }) => {
  const { notifications } = React.useContext(appContext)
  const history = useHistory()

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton menuId="side" />
        </IonButtons>

        <IonButtons slot="start">
          {back ? (
            back === 'history' ? (
              <IonButton onClick={() => history.goBack()}>
                <IonIcon icon={chevronBack} size="large" />
              </IonButton>
            ) : (
              <IonButton routerLink={back}>
                <IonIcon icon={chevronBack} size="large" />
              </IonButton>
            )
          ) : null}

          <IonButton routerLink="/dashboard">
            <IonIcon icon={home} size="large" />
            {notifications.length ? (
              <IonBadge id="notifications-badge" color="danger">
                {notifications.length}
              </IonBadge>
            ) : null}
          </IonButton>

          { refresh ? 
            <IonButton onClick={refresh}>
              <IonIcon icon={refreshCircle} size="large" />
            </IonButton>
          : null}
        </IonButtons>

        <IonTitle>{name}</IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export default Title
