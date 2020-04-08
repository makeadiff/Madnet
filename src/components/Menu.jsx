import { IonContent,IonIcon,IonItem,IonLabel,IonList,IonListHeader,IonMenu,IonMenuToggle,IonNote } from '@ionic/react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import './Menu.css';
import { authContext } from "../contexts/AuthContext";
import { appContext } from "../contexts/AppContext";
import { volunteerPages, fellowPages } from "../utils/Menu"

const Menu = () => {
    const { auth } = React.useContext(authContext);
    let render;

    if(auth.id) {
        render = (
            <IonMenu menuId="side" contentId="main" type="overlay">
                <IonContent>
                    <IonList id="inbox-list">
                        <IonListHeader>MADNet</IonListHeader>
                        <IonNote>{ auth.name }</IonNote>
                        <MenuSection pages={volunteerPages} />
                    </IonList>

                    <IonList id="labels-list">
                        <IonListHeader>Admin Section</IonListHeader>
                        <MenuSection pages={fellowPages} />
                    </IonList>
                </IonContent>
            </IonMenu>
        );

    } else {
        render = (
            <IonMenu menuId="side" contentId="main" type="overlay">
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

const MenuSection = ({ pages }) => {
    const { data } = React.useContext(appContext);

    return ( pages.map((appPage, index) => {
        let attr = {}
        // External links go out.
        if(appPage.url.includes("http")) attr['href'] = appPage.url
        else attr['routerLink'] = appPage.url

        return (
            <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={data.path.includes(appPage.url) ? 'selected' : ''} { ...attr }>
                    <IonIcon slot="start" icon={appPage.iosIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
            </IonMenuToggle>
        );
    }) )
}

export default withRouter(Menu);
