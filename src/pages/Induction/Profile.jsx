import React from 'react'
import { IonButton, IonInput, IonPage, IonContent } from '@ionic/react'
import { useHistory } from 'react-router-dom'

import { appContext } from "../../contexts/AppContext"
import Title from '../../components/Title'
import { arrowForwardOutline } from 'ionicons/icons'

const InductionProfile = () => {
    const [init, setInit] = React.useState(false)
    const [ profile, setProfile ] = React.useState({})
    const { setLoading, showMessage } = React.useContext(appContext)
    const history = useHistory()

    React.useEffect(() => {
        const profile_str = localStorage.getItem("induction_profile")
        if(profile_str) {
            setProfile(JSON.parse(profile_str))

        } else { // Can't find any induction information.
            history.push('/induction')
        }
        setInit(true)
    }, [init])

    const checkOtp = () => {
        let otp = document.getElementById("otp").value
        console.log(otp)
        // :TODO: API call to check OTP.

        if(otp === "1234") {
            history.push('/induction/setup')
        }
    }

    return (
        <IonPage>
            <Title name={"Hello, " + profile.user.name} />
            <IonContent>
                <p>We have sent an OTP to your { profile.type === "email" ? "email address" : "phone number" }. Please enter the OTP to continue...</p>

                <IonInput name="otp" id="otp" placeholder="OTP" />
                <IonButton name="action" type="submit" onClick={checkOtp}>Next Step 
                    <IonIcon icon={ arrowForwardOutline }></IonIcon></IonButton>
            </IonContent>
        </IonPage>
    )
}

export default InductionProfile
