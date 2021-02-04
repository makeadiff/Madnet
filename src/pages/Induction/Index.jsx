import React from 'react'
import {
  IonButton,
  IonInput,
  IonPage,
  IonContent,
  IonIcon,
  IonText,
  IonItem,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonLabel
} from '@ionic/react'
import { arrowForwardOutline, logoGoogle } from 'ionicons/icons'
import * as validator from 'validator'
import { useHistory } from 'react-router-dom'

import { firebase } from '../../init-fcm'
import { appContext } from '../../contexts/AppContext'
import api from '../../utils/API'
import { setStoredUser } from '../../utils/Helpers'
import Title from '../../components/Title'

import './Induction.css'

const InductionIndex = () => {
  const [init, setInit] = React.useState(false)
  const [error, setError] = React.useState(null)
  const { setLoading, message, showMessage } = React.useContext(appContext)
  const history = useHistory()
  const no_user_err_message = (
    <>
      Can&apos;t find any user with the given details. This can be because of
      either of these 2 reasons...
      <ul>
        <li>
          You have not given the email you just inputed when registering. Try
          using another email/phone if you have a alternative one.
        </li>
        <li>
          We haven&apos;t updated your profile to mark you as a volunteer yet.
          If you think this is the case, reach out to one of the orginizers of
          the training and get it fixed right now. You&apos;ll need this to be
          done to get to the next stage.
        </li>
      </ul>
    </>
  )

  React.useEffect(() => {
    // Run on load - just once.
    if (init) return

    firebase
      .auth()
      .getRedirectResult()
      .then(function (result) {
        if (!result.user) return false

        let user = result.user // The signed-in user info.
        setLoading(true)
        api.rest(`users?email=${user.email}`, 'get').then((data) => {
          setLoading(false)
          if (data.users.length) {
            setStoredUser(data.users[0])
            history.push('/induction/setup')
          } else {
            showMessage("Can't find any user with given details", 'error')
            setError(no_user_err_message)
          }
        })
      })
      .catch((e) => showMessage(e.message, 'error'))

    setInit(true)
  }, [init])

  const stepOne = function () {
    let identifier = document.getElementById('identifier').value

    if (!identifier) {
      showMessage('Please provide your Email', 'error')
      return false
    }

    let type = false
    if (validator.isEmail(identifier)) type = 'email'
    else if (validator.isMobilePhone(identifier)) type = 'phone'

    if (!type) {
      showMessage(
        'Please make sure that you have provided a valid email',
        'error'
      )
      return false
    }

    setLoading('Sending the OTP to your email address...')
    // :TODO: If phone, sent whatsapp OTP / SMS OTP
    api
      .graphql(`{sendOtp(${type}: "${identifier}") { id name email phone }}`)
      .then((data) => {
        setLoading(false)
        if (data.sendOtp) {
          localStorage.setItem(
            'induction_profile',
            JSON.stringify({
              identifier: identifier,
              type: type,
              user: data.sendOtp
            })
          )
          history.push('/induction/profile')

          // :TODO: Save time to /user/{user_id}/data/induction_started
        } else {
          // Can't find the user.
          showMessage("Can't find any user with given details", 'error')
          setError(no_user_err_message)
        }
      })
  }

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    setLoading(true)
    firebase.auth().signInWithRedirect(provider) // Redirect to Google Login
  }

  return (
    <IonPage>
      <Title name="Welcome to MADNet" />
      <IonContent className="dark">
        <IonCard className="dark loginCard">
          <IonCardHeader>
            <IonCardTitle>Welcome to Make A Difference.</IonCardTitle>
            <IonCardSubtitle>
              We&apos;ll be setting up your profile in our database now. To
              continue, please enter the email you provided when registering for
              MAD
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem className="padded">
              <IonLabel position="stacked">
                Enter your Registered Email
              </IonLabel>
              <IonInput name="identifier" id="identifier" placeholder="Email" />
            </IonItem>
            <IonButton
              name="action"
              expand="full"
              onClick={stepOne}
              size="default"
            >
              Next <IonIcon icon={arrowForwardOutline}></IonIcon>
            </IonButton>
            <IonText className="centerAlign">
              <p>--Or--</p>
            </IonText>
            <IonButton
              type="button"
              expand="full"
              color="tertiary"
              block={true}
              size="default"
              onClick={signInWithGoogle}
            >
              <IonIcon icon={logoGoogle} />
              Login With Google
            </IonButton>
            <div>{error}</div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default InductionIndex
