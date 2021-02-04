import React from 'react'
import {
  IonItem,
  IonInput,
  IonPage,
  IonContent,
  IonIcon,
  IonList,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader
} from '@ionic/react'
import { arrowForwardOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'

import Title from '../../components/Title'
import { appContext } from '../../contexts/AppContext'
import { authContext } from '../../contexts/AuthContext'
import api from '../../utils/API'

// :TODO: Add a check to make sure their name, email, phone and city are correct here.
// :TODO: Send OTP Again button.

const InductionProfile = () => {
  const [init, setInit] = React.useState(false)
  const [profile, setProfile] = React.useState({ user: { name: '' } })
  const history = useHistory()
  const { setLoading, showMessage } = React.useContext(appContext)
  const { setCurrentUser } = React.useContext(authContext)

  React.useEffect(() => {
    const profile_str = localStorage.getItem('induction_profile')
    if (profile_str) {
      setProfile(JSON.parse(profile_str))
    } else {
      // Can't find any induction information.
      history.push('/induction/join')
    }
    setInit(true)
  }, [init])

  const checkOtp = () => {
    let otp = document.getElementById('otp').value

    // API call to check OTP.
    setLoading(true)
    api
      .graphql(
        `{verifyOtp(${profile.type}: "${profile.identifier}", otp: "${otp}")}`
      )
      .then((data) => {
        setLoading(false)
        if (data.verifyOtp) {
          // Email confirmed - so we can set that person as the current user...
          // :TODO: Update User.verification_status - maybe in verifyOtp call itself.
          setCurrentUser(profile.user)
          history.push('/induction/setup')
        } else {
          // Can't find the user.
          showMessage('Incorrect OTP provided.', 'error')
        }
      })
      .catch((e) => showMessage(e.message, 'error'))
  }

  return (
    <IonPage>
      <Title name={profile ? 'Hello, ' + profile.user.name : ''} />
      <IonContent className="dark">
        <IonCard className="dark">
          <IonCardHeader>
            <IonCardTitle>Verify your Email</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem lines="none">
                <p>
                  We have sent an OTP to your{' '}
                  {profile.type === 'email' ? 'email address' : 'phone number'}.
                  Please enter the OTP to continue...
                </p>
              </IonItem>

              <IonItem lines="none">
                <IonInput name="otp" id="otp" placeholder="OTP" />
              </IonItem>
              <IonItem lines="none">
                <IonButton type="submit" name="action" onClick={checkOtp}>
                  Next Step
                  <IonIcon icon={arrowForwardOutline}></IonIcon>
                </IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default InductionProfile
