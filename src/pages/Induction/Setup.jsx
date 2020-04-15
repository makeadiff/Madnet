import React from 'react'
import { IonButton, IonInput, IonPage, IonContent, IonItem } from '@ionic/react'

import { requestPermission } from "../../init-fcm"
import { appContext } from '../../contexts/AppContext'
import Title from '../../components/Title'

const InductionSetup = () => {
    const { setLoading, showMessage } = React.useContext(appContext)

    const notificationPermission = () => {
        requestPermission()
    }

    return (
        <IonPage>
            <Title name='MADNet Setup' />
            <IonContent>
                <IonItem lines="none"><p>Congratulations! Now, you have access to all of MAD Tech. You'll be able to...</p></IonItem>

                <IonItem lines="none"><ul>
                    <li>See MAD events in your city</li>
                    <li>See your students data</li>
                    <li>Get information about MAD</li>
                    <li>And much more...</li>
                </ul></IonItem>
            
                <IonItem lines="none">
                    <p>To do all, this we'll need a few App level permissions from your side. </p>
                </IonItem>

                <IonItem lines="none">
                    <p>First, you'll have to add this app to your homepage. </p>
                </IonItem>

                <IonItem lines="none">
                    <p>Once that is done, we'll need permission to send you notification. To let us do that, click on the button below and press Allow.</p>
                </IonItem>

                <IonItem lines="none">
                    <IonButton onClick={notificationPermission}>Set Notification Permission</IonButton>
                </IonItem>
            </IonContent>
        </IonPage>
    )
}

export default InductionSetup