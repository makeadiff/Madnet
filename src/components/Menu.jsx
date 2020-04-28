import { IonContent,IonIcon,IonItem,IonLabel,IonList,IonListHeader,IonMenu,IonMenuToggle,IonNote,IonAlert } from '@ionic/react'
import React from 'react'
import { withRouter } from 'react-router-dom'

import './Menu.css';
import { authContext } from "../contexts/AuthContext"
import { appContext } from "../contexts/AppContext"
import { volunteer_pages, fellow_pages } from "../utils/Menu"
import { personOutline, logOutOutline } from 'ionicons/icons'

const Menu = () => {
    const [ confirmLogout, setConfirmLogout ] = React.useState(false)
    const { user, unsetCurrentUser, isFellow } = React.useContext(authContext)
    const { data } = React.useContext(appContext)
    let render

    if(user.id) {
        render = (
            <>
            <IonList id="volunteer-list" className="sections">
                <IonListHeader>MADNet</IonListHeader>
                <IonNote>{ user.name }</IonNote>
                <MenuSection pages={volunteer_pages} />
            </IonList>

            { isFellow() ? (
                <IonList id="admin-list" className="sections">
                    <IonListHeader>Admin Section</IonListHeader>
                    <MenuSection pages={fellow_pages} />
                </IonList>
            ) : null }

            <IonList id="user-list" className="sections">
                <IonListHeader>User Section</IonListHeader>
                <IonItem routerLink="/profile" className={data.path.includes("/profile") ? 'selected' : ''}>
                    <IonIcon slot="start" icon={ personOutline } />
                    <IonLabel>Profile</IonLabel>
                </IonItem>

                <IonItem onClick={ () => { setConfirmLogout(true) }}>
                    <IonIcon slot="start" icon={ logOutOutline } />
                    <IonLabel>Logout</IonLabel>
                </IonItem>
            </IonList>

            <IonAlert
                isOpen={ confirmLogout }
                onDidDismiss={ () => setConfirmLogout(false) }
                header={'Logout!'}
                message={'Are you sure you wish to logout?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: e => { }
                    },
                    {
                        text: 'Logout',
                        handler: unsetCurrentUser
                    }
                ]} />
            </>
        );

    } else {
        render = (
            <IonList id="volunteer-list">
                <IonListHeader>MADNet</IonListHeader>
                <IonNote>Please Login to use this app</IonNote>
            </IonList>
        )
    }

    return (
        <IonMenu side="start" menuId="side" contentId="main" type="overlay">
            <IonContent>
                <IonMenuToggle autoHide={false}>
                    {render}
                </IonMenuToggle>
           </IonContent>
        </IonMenu>
    )

};

const MenuSection = ({ pages }) => {
    const { data } = React.useContext(appContext);

    return ( 
        pages.map((app, index) => {
            if(app.title === "Profile") return null

            let attr = {}
            // External links go out.
            if(app.url.includes("http")) attr['href'] = app.url
            else attr['routerLink'] = app.url

            return (
                <IonItem key={index} className={data.path.includes(app.url) ? 'selected' : ''} { ...attr }>
                    <IonIcon slot="start" icon={app.iosIcon} />
                    <IonLabel>{app.title}</IonLabel>
                </IonItem>
            );
        }) 
    )
}

export default withRouter(Menu);
