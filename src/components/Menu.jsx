import { IonContent,IonIcon,IonItem,IonLabel,IonList,IonListHeader,IonMenu,IonMenuToggle,IonNote } from '@ionic/react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import './Menu.css';
import { authContext } from "../contexts/AuthContext";
import { volunteerPages, fellowPages } from "../utils/Menu"

const Menu = ({ selectedPage }) => {
  const { auth } = React.useContext(authContext);  
  let render;

  if(auth.id) {
    render = (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader>Dashboard</IonListHeader>
            <IonNote>{ auth.name }</IonNote>
            {volunteerPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={selectedPage === appPage.title ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" icon={appPage.iosIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>

          <IonList id="labels-list">
            <IonListHeader>Admin Section</IonListHeader>
            {fellowPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={selectedPage === appPage.title ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" icon={appPage.iosIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>
        </IonContent>
      </IonMenu>
    );

  } else {
    render = (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          <IonList id="inbox-list">
            <IonListHeader>MADNet</IonListHeader>
            <IonNote>Please Login to use this app</IonNote>
          </IonList>
        </IonContent>
      </IonMenu>
    );
  }

  return render
};

export default withRouter(Menu);
