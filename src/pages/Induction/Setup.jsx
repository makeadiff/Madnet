import React from 'react'
import { IonButton, IonPage, IonContent, IonItem, IonIcon } from '@ionic/react'
import { useHistory } from 'react-router-dom'

import { requestPermission } from "../../init-fcm"
import Title from '../../components/Title'
import { homeOutline } from 'ionicons/icons'

const InductionSetup = () => {
    const [ step, setStep ] = React.useState("home-page")
    const history = useHistory()

    // Browser Detection
    let browser = "other"
    if(typeof InstallTrigger !== 'undefined') browser = "firefox"
    else if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) browser = "chrome"

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
                    <p>To do all, this we'll need a few App level permissions from your side. </p>
                </IonItem>

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