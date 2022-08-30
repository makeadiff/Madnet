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
import React from 'react'
import { add } from 'ionicons/icons'

import Title from '../../components/Title'
import UserList from './List'

const UserIndex = () => {
  const [segment, setSegment] = React.useState('all')

  return (
    <IonPage>
      <Title name="Volunteers" />

      <IonContent className="dark">
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value)}
        >
          <IonSegmentButton value="all">
            <IonLabel>All Volunteers</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="search">
            <IonLabel>Search</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="needs-attention">
            <IonLabel>Needs Attention</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <UserList segment={segment} />
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton
            routerLink={`/newuser`}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default UserIndex
