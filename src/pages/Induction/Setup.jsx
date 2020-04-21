import React from 'react'
import { IonButton, IonPage, IonContent, IonItem, IonIcon, IonInput } from '@ionic/react'
import { useHistory } from 'react-router-dom'

import { authContext } from '../../contexts/AuthContext'
import { appContext } from '../../contexts/AppContext'
import { requestPermission } from "../../init-fcm"
import Title from '../../components/Title'
import { homeOutline } from 'ionicons/icons'
import api from '../../utils/API'

const InductionSetup = () => {
    const [ step, setStep ] = React.useState("set-password")
    const history = useHistory()
    const { user } = React.useContext(authContext)
    const { setLoading, showMessage } = React.useContext(appContext)
    const all_steps = ["init", "set-password", "home-page", "notification-permission"]

    // Browser Detection
    let browser = "other"
    if(typeof InstallTrigger !== 'undefined') browser = "firefox"
    else if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) browser = "chrome"

    const setPassword = () => {
        const password = document.getElementById("new-password").value
        const confirmation = document.getElementById("confirm-password").value

        if(password !== confirmation) {
            showMessage("Password does not match the confirmation", "error")
        } else {
            setLoading(true)
            api.rest(`users/${user.id}`, "post", {"password": password}).then(() => {
                setLoading(false)
                setStep("home-page")
            }).catch(e => showMessage(e.message, "error"))
        }
    }

    const notificationPermission = () => {
        requestPermission()
        setStep('done')
    }

    return (
        <IonPage>
            <Title name='MADNet Setup' />
            <IonContent>
                <IonItem lines="none"><p>Congratulations! Now, you have access to all of MAD Tech. You'll be able to...</p></IonItem>

                <IonItem lines="none"><ul>
                    <li>See MAD events in your city</li>
                    <li>See your student's data</li>
                    <li>Get information about MAD</li>
                    <li>And much, much more...</li>
                </ul></IonItem>
            
                <IonItem>
                    <p>To do all, this we'll need to setup a few things...</p>
                </IonItem>

                <IonItem>
                    <h3>Step { all_steps.indexOf(step) } / 3</h3>
                </IonItem>

                { (step === "set-password") ? 
                    (<>
                        <IonItem lines="none">First, setup a password for your account. You can login using your email and this password. Alternatively, you can use Google login to login as well.</IonItem>

                        <IonItem lines="none"><IonInput id="new-password" type="password" placeholder="Password" /></IonItem>

                        <IonItem lines="none"><IonInput id="confirm-password" type="password" placeholder="Confirm Password" /></IonItem>

                        <IonItem lines="none"><IonButton onClick={ setPassword }>Next Step 1/3</IonButton></IonItem>
                    </>)
                    : null }

                { (step === "home-page") ? 
                    (<>
                        <IonItem lines="none">First, you'll have to add this app to your phone...</IonItem>

                        <IonItem lines="none">{
                            browser === "firefox" 
                                ? (<span>Click on the <IonIcon icon={homeOutline}></IonIcon> 
                                    at the top-right corner of the browser in firefox and then click on '+ Add to Home Screen'</span>)
                                : "Click on the 'Add MADNet to Home Screen' at the bottom of the browser in Chrome"
                        }</IonItem>

                        <IonItem lines="none"><IonButton onClick={e => setStep("notification-permission") }>Next Step</IonButton></IonItem>
                    </>)
                    : null }

                { (step === "notification-permission") ? 
                    (<>
                        <IonItem lines="none">
                            Next, we'll need permission to send you notifications. 
                            To let us do that, click on the button below and then press Allow.
                        </IonItem>

                        <IonItem lines="none">
                            <IonButton onClick={notificationPermission}>Set Notification Permission</IonButton>
                        </IonItem>
                    </>)
                    : null }

                { (step === "done") ? 
                    (<>
                        <IonItem lines="none">
                            You are done! Now, you can go to your dashboard...
                        </IonItem>

                        <IonItem lines="none">
                            <IonButton onClick={e => { history.push('/dashboard') }}>Dashboard</IonButton>
                        </IonItem>
                    </>)
                    : null }
            </IonContent>
        </IonPage>
    )
}

export default InductionSetup