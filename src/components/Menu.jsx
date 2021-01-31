import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonImg,
  IonAvatar,
  IonAlert
} from '@ionic/react'
import React from 'react'
import { withRouter } from 'react-router-dom'

import './Menu.css'
import { authContext } from '../contexts/AuthContext'
import { appContext } from '../contexts/AppContext'
import { volunteer_pages, fellow_pages } from '../utils/Menu'
import { logOutOutline } from 'ionicons/icons'
import { eraseCookie } from '../utils/Helpers'

const Menu = () => {
  const [confirmLogout, setConfirmLogout] = React.useState(false)
  const { user, unsetCurrentUser, isFellow } = React.useContext(authContext)
  const { data } = React.useContext(appContext)
  let render

  const logout = () => {
    eraseCookie('user_identifier')
    eraseCookie('auth_token')
    unsetCurrentUser()
  }

  if (user.id) {
    render = (
      <>
        <IonList id="volunteer-list" className="sections">
          <IonListHeader>
            <IonImg
              className="logoIcon"
              src={process.env.PUBLIC_URL + '/assets/icon/madnet/madnet-40.png'}
            ></IonImg>{' '}
            MADNet
          </IonListHeader>
        </IonList>

        <IonList id="user-list" className="sections">
          <IonListHeader>User Section</IonListHeader>
          <MenuSection pages={volunteer_pages} />
        </IonList>

        {isFellow() ? (
          <IonList id="admin-list" className="sections">
            <IonListHeader>Admin Section</IonListHeader>
            <MenuSection pages={fellow_pages} />
          </IonList>
        ) : null}

        <IonList className="sections">
          <IonItem
            routerLink="/profile"
            className={
              (data.path.includes('/profile') ? 'selected' : '') + ' noHover'
            }
          >
            <IonAvatar slot="start">
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
            <IonLabel>
              {user.name}
              <br />#{user.id}
            </IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              setConfirmLogout(true)
            }}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonList>

        <IonAlert
          isOpen={confirmLogout}
          onDidDismiss={() => setConfirmLogout(false)}
          header={'Logout!'}
          message={'Are you sure you wish to logout?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            },
            {
              text: 'Logout',
              handler: logout
            }
          ]}
        />
      </>
    )
  } else {
    render = (
      <IonList id="volunteer-list">
        <IonListHeader>
          <IonImg
            className="logoIcon"
            src={process.env.PUBLIC_URL + '/assets/icon/madnet/madnet-40.png'}
          ></IonImg>{' '}
          MADNet
        </IonListHeader>
        {/* <IonNote>Please Login to use this app</IonNote> */}
      </IonList>
    )
  }

  return (
    <IonMenu
      side="start"
      menuId="side"
      contentId="main"
      type="overlay"
      mode="md"
    >
      <IonContent>
        <IonMenuToggle autoHide={false}>{render}</IonMenuToggle>
      </IonContent>
    </IonMenu>
  )
}

const MenuSection = ({ pages }) => {
  const { data } = React.useContext(appContext)

  return pages.map((app, index) => {
    if (app.title === 'Profile') return null

    let attr = {}
    // External links go out.
    if (app.url.includes('http')) attr['href'] = app.url
    else attr['routerLink'] = app.url

    return (
      <IonItem
        key={index}
        className={data.path.includes(app.url) ? 'selected' : ''}
        {...attr}
      >
        <IonIcon slot="start" icon={app.iosIcon} />
        <IonLabel className="uppercase">{app.title}</IonLabel>
      </IonItem>
    )
  })
}

export default withRouter(Menu)
