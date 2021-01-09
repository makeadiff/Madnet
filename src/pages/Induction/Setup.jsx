import React from 'react'
import {
  IonButton,
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonLabel,
  IonChip
} from '@ionic/react'
import { useHistory } from 'react-router-dom'

import { authContext } from '../../contexts/AuthContext'
import { appContext } from '../../contexts/AppContext'
import { requestPermission } from '../../init-fcm'
import Title from '../../components/Title'
import { homeOutline, arrowForwardOutline } from 'ionicons/icons'
import api from '../../utils/API'

import './Induction.css'

const InductionSetup = () => {
  const [step, setStep] = React.useState('set-password')
  const history = useHistory()
  const { user } = React.useContext(authContext)
  const { setLoading, showMessage } = React.useContext(appContext)
  const all_steps = [
    'init',
    'set-password',
    'home-page',
    'notification-permission',
    'done'
  ]

  React.useEffect(() => {
    if (step === 'set-password') {
      if (!user.id) {
        // User didn't come thru the normal route.
        history.push('/induction/join')
      }
    }
  }, [step])

  // Browser Detection - needed to tell the user how to add the app to phone.
  let browser = 'other'
  if (typeof InstallTrigger !== 'undefined') browser = 'firefox'
  else if (
    !!window.chrome &&
    (!!window.chrome.webstore || !!window.chrome.runtime)
  )
    browser = 'chrome'

  const setPassword = () => {
    const password = document.getElementById('new-password').value
    const confirmation = document.getElementById('confirm-password').value

    if (password !== confirmation) {
      showMessage('Password does not match the confirmation', 'error')
    } else {
      setLoading('Setting your password...')
      api
        .rest(`users/${user.id}`, 'post', { password: password })
        .then(() => {
          setLoading(false)
          setStep('home-page')
        })
        .catch((e) => {
          setLoading(false)
          showMessage(
            'There was an error changing your password. Try again after some time.',
            'error'
          )
        })
    }
  }

  const notificationPermission = () => {
    requestPermission()
    setStep('done')
  }

  const allDone = () => {
    // :TODO: Save time to /user/{user_id}/data/induction_done
    history.push('/dashboard')
  }

  return (
    <IonPage>
      <Title name="MADNet Setup" />
      <IonContent className="dark">
        <IonCard className="dark">
          <IonCardHeader>
            <IonCardTitle>Let's Set Up your account.</IonCardTitle>
            <IonCardSubtitle>
              <p>
                Congratulations! Now, you have access to all of MAD Tech. You'll
                be able to
              </p>
              <ul>
                <li>See MAD events in your city</li>
                <li>See your student's data</li>
                <li>Get information about MAD</li>
                <li>And much, much more...</li>
              </ul>
              <p>To do all, this we'll need to setup a few things</p>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonChip>Step {all_steps.indexOf(step)} / 4</IonChip>
            </IonItem>

            {step === 'set-password' ? (
              <>
                <IonItem>
                  First, setup a password for your account. You can login using
                  your email and this password. Alternatively, you can use
                  Google login to login as well.
                </IonItem>

                <IonItem className="padded">
                  <IonLabel position="stacked">Enter Password.</IonLabel>
                  <IonInput
                    id="new-password"
                    type="password"
                    placeholder="Password"
                  />
                </IonItem>

                <IonItem className="padded">
                  <IonLabel position="stacked">Re-Enter Password.</IonLabel>
                  <IonInput
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                  />
                </IonItem>

                <IonItem className="padded">
                  <IonButton onClick={setPassword} size="default">
                    Next Step <IonIcon icon={arrowForwardOutline}></IonIcon>
                  </IonButton>
                </IonItem>
              </>
            ) : null}

            {step === 'home-page' ? (
              <>
                <IonItem>
                  First, you'll have to add this app to your phone. Hopefully
                  you'll be using this from your phone - if you are NOT using
                  this on your phone, skip to the next step.
                </IonItem>

                <IonItem>
                  {browser === 'firefox' ? (
                    <span>
                      Click on the <IonIcon icon={homeOutline}></IonIcon> at the
                      top-right corner of the browser in firefox and then click
                      on '+ Add to Home Screen'
                    </span>
                  ) : (
                    "Click on the 'Add MADNet to Home Screen' at the bottom of the browser in Chrome"
                  )}
                </IonItem>

                <IonItem className="padded">
                  <IonButton
                    size="default"
                    onClick={(e) => setStep('notification-permission')}
                  >
                    Next Step
                  </IonButton>
                </IonItem>
              </>
            ) : null}

            {step === 'notification-permission' ? (
              <>
                <IonItem>
                  Next, we'll need permission to send you notifications. To let
                  us do that, click on the button below and then press Allow.
                </IonItem>

                <IonItem className="padded">
                  <IonButton size="default" onClick={notificationPermission}>
                    Set Notification Permission
                  </IonButton>
                </IonItem>
              </>
            ) : null}

            {step === 'done' ? (
              <>
                <IonItem>
                  There is no step 4! Setup is done! Now, you can go to your
                  dashboard...
                </IonItem>

                <IonItem className="padded">
                  <IonButton
                    size="default"
                    onClick={(e) => {
                      history.push('/dashboard')
                    }}
                  >
                    Dashboard
                  </IonButton>
                </IonItem>
              </>
            ) : null}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default InductionSetup
