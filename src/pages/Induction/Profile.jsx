import React from 'react'
import { IonItem, IonInput, IonPage, IonContent,IonIcon, IonList, IonButton } from '@ionic/react'
import { arrowForwardOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'

import { appContext } from "../../contexts/AppContext"
import Title from '../../components/Title'
import { setStoredUser } from '../../utils/Helpers'

const InductionProfile = () => {
    const [init, setInit] = React.useState(false)
    const [ profile, setProfile ] = React.useState({})
    // const { setLoading, showMessage } = React.useContext(appContext)
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
            setStoredUser(profile.user)
            history.push('/induction/setup')
        }
    }

    return (
        <IonPage>
            <Title name={profile ? "Hello, " + profile.user.name : ""} />
            <IonContent>
                <IonList>
                <IonItem lines="none"><p>We have sent an OTP to your { profile.type === "email" ? "email address" : "phone number" }. Please enter the OTP to continue...</p></IonItem>

                <IonItem lines="none"><IonInput name="otp" id="otp" placeholder="OTP" /></IonItem>
                <IonItem lines="none"><IonButton type="submit" name="action" onClick={checkOtp}>Next Step 
                    <IonIcon icon={ arrowForwardOutline }></IonIcon></IonButton></IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default InductionProfile
