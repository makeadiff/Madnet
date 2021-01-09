import {
  IonPage,
  IonLabel,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'

import Title from '../../components/Title'
import EventList from './List'
import { authContext } from '../../contexts/AuthContext'

const EventIndex = () => {
  const { user, accessLevel } = React.useContext(authContext)
  const [segment, setSegment] = React.useState('invitations')

  return (
    <IonPage>
      <Title name="Events" />

      <IonContent className="dark">
        {accessLevel() ? (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton routerLink="/events/0">
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        ) : null}

        <IonSegment
          mode="md"
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value)}
        >
          <IonSegmentButton value="invitations">
            <IonLabel>Invitations</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="in-city">
            {user.city_id == '26' ? (
              <IonLabel>All Events</IonLabel>
            ) : (
              <IonLabel>Events in City</IonLabel>
            )}
          </IonSegmentButton>
        </IonSegment>

        <EventList segment={segment} />
      </IonContent>
    </IonPage>
  )
}

export default EventIndex
