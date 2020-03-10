import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

import { authContext } from "../contexts/AuthContext";
import Login from "./Login";

const Page: React.FC<RouteComponentProps<{ name: string; }>> = ({ match }) => {

  const { auth } = React.useContext(authContext);
  let page_name = "Login"
  let show_component = <Login />;
  if(auth.id !== 0) {
    show_component = <ExploreContainer name={match.params.name} />
    page_name = match.params.name
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{page_name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{ page_name }</IonTitle>
          </IonToolbar>
        </IonHeader>
        { show_component }
      </IonContent>
    </IonPage>
  );
};

export default Page;
