/* eslint-disable no-mixed-spaces-and-tabs */
import {
  IonContent,
  IonPage,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTextarea,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonToggle,
  IonNote
} from '@ionic/react'

import { pencil, close } from 'ionicons/icons'
import React from 'react'
// import ExploreContainer from '../components/ExploreContainer';

import './Profile.css'
import './All.css'

import Title from '../components/Title'
import { authContext } from '../contexts/AuthContext'
import { appContext } from '../contexts/AppContext'
import { dataContext } from '../contexts/DataContext'

const Profile = () => {
  const { user } = React.useContext(authContext)
  const { setLoading, showMessage } = React.useContext(appContext)
  const { updateUser } = React.useContext(dataContext)
  const [error, setError] = React.useState('')
  const [changePassword, setChangePassword] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  let breakcondition = false
  const [disable, setDisable] = React.useState(true)
  const sexArray = {
    m: 'Male',
    f: 'Female',
    o: 'Not Specified'
  }

  const [userData, setUserData] = React.useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    sex: user.sex,
    birthday: user.birthday,
    address: user.address,
    password: password
  })

  const updateField = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const openEdit = () => {
    setDisable(false)
  }

  const closeEdit = () => {
    setDisable(true)
  }

  async function updateUserData() {
    if (changePassword) {
      userData.password = password
    } else {
      delete userData.password
    }
    console.log(userData)
    let update = await updateUser(user.id, userData)
    if (update) {
      setDisable(true)
    }
  }

  return (
    <IonPage>
      <Title />
      <IonContent className="dark">
        <IonGrid>
          <IonRow>
            <IonCol size-md="6" size-xs="12">
              <IonList>
                <IonCard className="dark no-shadow">
                  <IonCardHeader>
                    <IonCardTitle>Personal Details</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem className="noHover profileContainer">
                      <IonAvatar className="profileImage">
                        <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                      </IonAvatar>
                    </IonItem>
                    <IonItem className="centerAlign">
                      <IonLabel>
                        {userData.name}
                        <br />#{user.id}
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Name</IonLabel>
                      <IonInput
                        required
                        type="text"
                        name="name"
                        value={userData.name}
                        onIonChange={updateField}
                        disabled={disable}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Email</IonLabel>
                      <IonInput
                        required
                        type="email"
                        name="email"
                        value={userData.email}
                        disabled={disable}
                        onIonChange={updateField}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Phone</IonLabel>
                      <IonInput
                        required
                        type="text"
                        value={userData.phone}
                        name="phone"
                        disabled={disable}
                        onIonChange={updateField}
                      ></IonInput>
                    </IonItem>
                    <IonItem className={!disable ? 'hidden' : null}>
                      <IonLabel position="stacked">Sex</IonLabel>
                      <IonInput
                        required
                        type="text"
                        value={sexArray[userData.sex]}
                        disabled
                      ></IonInput>
                    </IonItem>
                    <IonRadioGroup
                      name="sex"
                      className={disable ? 'hidden' : null}
                      value={userData.sex}
                      onIonChange={updateField}
                    >
                      <IonListHeader>
                        <IonLabel>Sex</IonLabel>
                      </IonListHeader>

                      <IonItem>
                        <IonLabel>Male</IonLabel>
                        <IonRadio
                          mode="ios"
                          name="sex"
                          slot="start"
                          value="m"
                        />
                      </IonItem>

                      <IonItem>
                        <IonLabel>Female</IonLabel>
                        <IonRadio
                          mode="ios"
                          name="sex"
                          slot="start"
                          value="f"
                        />
                      </IonItem>

                      <IonItem>
                        <IonLabel>Other</IonLabel>
                        <IonRadio
                          mode="ios"
                          name="sex"
                          slot="start"
                          value="o"
                        />
                      </IonItem>
                    </IonRadioGroup>
                    <IonItem>
                      <IonLabel position="stacked">Birthday</IonLabel>
                      <IonInput
                        required
                        type="date"
                        name="birthday"
                        value={userData.birthday}
                        disabled={disable}
                        onIonChange={updateField}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Address</IonLabel>
                      <IonTextarea
                        required
                        value={userData.address}
                        disabled={disable}
                        name="address"
                        onIonChange={updateField}
                      ></IonTextarea>
                    </IonItem>
                    <IonItem className={disable ? 'hidden' : null}>
                      <IonLabel
                        className="trigger"
                        color="primary"
                        onClick={(e) => setChangePassword(true)}
                      >
                        Change Password
                      </IonLabel>
                    </IonItem>
                    {changePassword ? (
                      <>
                        <IonItem>
                          <IonLabel position="stacked">Password</IonLabel>
                          <IonInput
                            required
                            type="password"
                            name="password"
                            placeholder="****"
                            disabled={disable}
                            onIonChange={(e) => setPassword(e.target.value)}
                          ></IonInput>
                        </IonItem>
                        <IonItem>
                          <IonLabel position="stacked">
                            Confirm Password
                          </IonLabel>
                          <IonInput
                            required
                            type="password"
                            name="confirm_password"
                            placeholder="****"
                            disabled={disable}
                            onIonChange={(e) =>
                              setConfirmPassword(e.target.value)
                            }
                          ></IonInput>
                        </IonItem>
                      </>
                    ) : null}
                    {password &&
                    confirmPassword &&
                    password !== confirmPassword ? (
                      <IonItem>
                        <IonNote color="danger">
                          Passwords should match.
                        </IonNote>
                      </IonItem>
                    ) : null}
                    <IonItem
                      className={disable ? 'hidden' : null}
                      disabled={
                        changePassword && password !== confirmPassword
                          ? true
                          : false
                      }
                    >
                      <IonButton
                        expand="full"
                        size="default"
                        color="primary"
                        type="submit"
                        onClick={updateUserData}
                      >
                        Save
                      </IonButton>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              </IonList>
            </IonCol>
            <IonCol size-md="6" size-xs="12">
              <IonList>
                <IonCard className="light no-shadow">
                  <IonCardHeader>
                    <IonCardTitle>MAD Profile Details</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem>
                      <IonLabel position="stacked">Volunteer ID </IonLabel>
                      <IonInput
                        required
                        type="text"
                        value={user.id}
                        disabled
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Roles: </IonLabel>
                      <ul className="roleList">
                        {user.groups
                          ? user.groups.map((roles, index) => {
                              if (!breakcondition) {
                                if (index < 3) {
                                  return (
                                    <li key={index}>
                                      <IonChip className="roles">
                                        {roles.name}
                                      </IonChip>
                                    </li>
                                  )
                                } else {
                                  breakcondition = true
                                  return (
                                    <li key={index}>
                                      <IonChip className="roles">
                                        + {user.groups.length - index} More
                                      </IonChip>
                                    </li>
                                  )
                                }
                              }
                            })
                          : null}
                      </ul>
                    </IonItem>
                    {user.mad_email ? (
                      <IonItem>
                        <IonLabel position="stacked">Official Email: </IonLabel>
                        <IonInput
                          required
                          type="text"
                          value={user.mad_email}
                          disabled
                        ></IonInput>
                      </IonItem>
                    ) : null}
                    <IonItem>
                      <IonLabel position="stacked">MAD City: </IonLabel>
                      <IonInput
                        required
                        type="text"
                        value={user.city}
                        disabled
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Joined On: </IonLabel>
                      <IonInput
                        required
                        type="date"
                        value={new Date(user.joined_on)
                          .toISOString()
                          .slice(0, 10)}
                        disabled
                      ></IonInput>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
                {/* <IonCard className="dark no-shadow">
                                    <IonCardHeader>
                                        <IonCardTitle>Profile Settings</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonItem>
                                            <IonLabel>Notifcation</IonLabel>
                                            <IonToggle color="primary" />
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard> */}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab
          onClick={openEdit}
          vertical="bottom"
          horizontal="start"
          slot="fixed"
          className={!disable ? 'hidden' : null}
        >
          <IonFabButton>
            <IonIcon icon={pencil} />
          </IonFabButton>
        </IonFab>
        <IonFab
          onClick={closeEdit}
          vertical="bottom"
          horizontal="start"
          slot="fixed"
          className={disable ? 'hidden' : null}
        >
          <IonFabButton>
            <IonIcon icon={close} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Profile
