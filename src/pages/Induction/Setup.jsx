import React from 'react'
import { IonButton, IonInput, IonPage, IonContent } from '@ionic/react'

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
                <p>Congratulations! Now, you have access to all of MAD Tech. You'll be able to...
                    <ul>
                        <li>See MAD events in your city</li>
                        <li>See your students data</li>
                        <li>Get information about MAD</li>
                        <li>And much more...</li>
                    </ul>
                </p>

                <p>To do all, this we'll need a few App level permissions from your side. </p>

                <p>First, you'll have to add this app to your homepage. </p>

                <p>Once that is done, we'll need permission to send you notification. To let us do that, click on the button below and press Allow.</p>

                <IonButton onClick={notificationPermission}>Set Notification Permission</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default InductionSetup