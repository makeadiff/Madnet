import React from 'react'
import { IonButton, IonInput, IonPage, IonContent, IonIcon, IonList,IonItem } from '@ionic/react'
import { arrowForwardOutline } from 'ionicons/icons'
import * as validator from "validator"
import { useHistory } from 'react-router-dom'

import { firebase } from "../../init-fcm"
import { appContext } from "../../contexts/AppContext"
import api from "../../utils/API"
import { assets, setStoredUser } from "../../utils/Helpers"
import Title from '../../components/Title'

const InductionIndex = () => {
    const [init, setInit] = React.useState(false)
    // const [identifier, setIdentifier] = React.useState("")
    const { setLoading, message, showMessage } = React.useContext(appContext)
    const history = useHistory()
    const no_user_err_message = (<>
        Can't find any user with the given details. This can be because of either of these 2 reasons...
        <ul>
            <li>You have not given the email or phone number you gave when registering. 
                Try using another email/phone if you have a alternative one.</li>
            <li>We haven't updated your profile to mark you as a volunteer yet. 
                If you think this is the case, reach out to one of the orginizers of the induction and get it fixed right now. 
                You'll need this to be done to get to the next stage.</li>
        </ul></>)


    React.useEffect(() => { // Run on load - just once.
        if(init) return

        firebase.auth().getRedirectResult().then(function(result) {
            if(!result.user) return false

            let user = result.user // The signed-in user info.
            setLoading(true)
            api.rest(`users?email=${user.email}`, "get").then((data) => {
                setLoading(false)
                if(data.users.length) {
                    setStoredUser(data.users[0])
                    history.push('/induction/setup')
                } else {
                    showMessage(no_user_err_message, "error")
                }
            })

        }).catch(e => showMessage(e.message, "error"));

        setInit(true)
    }, [init])

    const stepOne = function() {
        let identifier = document.getElementById("identifier").value

        if(!identifier) {
            showMessage("Please provide your Email or Phone number", "error")
            return false
        }

        let type = false
        if(validator.isEmail(identifier)) type = "email"
        else if(validator.isMobilePhone(identifier)) type = "phone"

        if (!type) {
            showMessage("Please make sure that you have provided a valid email or phone number", "error")
            return false
        }

        setLoading(true)
        // :TODO: We'll need another call for this - check if its their first time, etc. Or its a big security issue. People can just use this page to login to anyone who's email id/phone they know.
        // :TODO: If email, sent OTP
        // :TODO: If phone, sent whatsapp OTP / SMS OTP
        api.rest(`users?identifier=${identifier}`, "get").then((data) => {
            setLoading(false)
            if(data.users.length) {
                localStorage.setItem("induction_profile", JSON.stringify({
                    "identifier": identifier,
                    "type": type,
                    "user": data.users[0]
                }))
                history.push('/induction/profile')

            } else { // Can't find the user.
                showMessage(no_user_err_message, "error")
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
            <IonContent>
                <IonList>
                <IonItem><strong>Welcome to Make A Difference.</strong></IonItem>
                
                <IonItem>We'll be setting up your profile in our database now. 
                    To continue, please <strong>enter the email OR phone number you provided when registering for MAD</strong>.</IonItem>
                
                <IonItem><IonInput name="identifier" id="identifier" placeholder="Email OR Phone Number" /></IonItem>

                <IonItem><IonButton name="action" onClick={ stepOne }>Next <IonIcon icon={arrowForwardOutline}></IonIcon></IonButton></IonItem>

                <IonItem>OR</IonItem>

                <IonItem><img width="200" src={ assets('glogin.png') } alt="Login With Google" onClick={ signInWithGoogle } /></IonItem>

                <IonItem>{message.length && <span className={message[1] + "-message"}>{ message[0] }</span>}</IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default InductionIndex