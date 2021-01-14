import { IonButton, IonInput, IonPage, IonList, IonItem, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonIcon, IonText, IonImg} from '@ionic/react'
import React from 'react'
import * as validator from "validator"
import { useHistory } from 'react-router-dom'
import { logoGoogle, arrowForward } from 'ionicons/icons';

import { requestPermission, firebase, onMessage,convertNotificationPayload } from "../init-fcm"
import { authContext } from "../contexts/AuthContext"
import { appContext } from "../contexts/AppContext"
import api from "../utils/API"

import './Login.css'

/*
:TODO:
- Forget password
- Identifier based login rather than email
- Remember me (?)
- Key Check on return.
*/

function Login() {
    const [userEmail, setUserEmail] = React.useState("")
    const [userPassword, setUserPassword] = React.useState("")
    const { loading, setLoading, message, showMessage, addNotification } = React.useContext(appContext)
    const { setCurrentUser } = React.useContext(authContext)
    const history = useHistory()
    
    React.useEffect(() => { // Run on load - just once.
        firebase.auth().getRedirectResult().then(function(result) {
            if(!result.user) return false

            let user = result.user // The signed-in user info.
            setLoading(true)
            api.rest(`users?identifier=${user.email}`, "get").then(loginUser)

        }).catch(e => showMessage(e.message, "error"))
    }, [])

    const loginUser = (user_data, method) => {
        if(method === undefined) method = "google"

        let user = false
        if(user_data) {
            user = user_data.users;
            if(method === "google") user = user_data.users[0]
        }

        if(user) {
            setCurrentUser(user)
            requestPermission()
            onMessage((payload) => {
                addNotification(convertNotificationPayload(payload))
            })
            history.push("/dashboard")
        } else {
            if(method === "google") {
                showMessage("Can't find any registered user associated with the given email", "error")
            } else {
                showMessage("Invalid email/password provided", "error")
            }
        }
        setLoading(false);
    }

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        setLoading(true)
        firebase.auth().signInWithRedirect(provider) // Redirect to Google Login

        // OR - Open popup of google login. 
        // firebase.auth().signInWithPopup(provider).then((result) => {
        //     api.rest(`users?email=${result.user.email}`, "get").then(loginUser)
        // }).catch(e => showMessage(e.message, "error"))
    }

    const authHandler = () => {
        setLoading(true);
        api.rest(`users/login?identifier=${userEmail}&password=${userPassword}`, "get")
            .then(user_data => loginUser(user_data, "api"))
            .catch(err => {
                setLoading(false);
                showMessage(err.message, "error");
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // This to handle browser autofilling data on load.
        setUserEmail(document.querySelector('#email').value)
        setUserPassword(document.querySelector('#password').value) // This doesn't work. Looks like a security issue.        
        if (validateLoginForm(userEmail, userPassword)) {
            authHandler();
        }
    }

    const validateLoginForm = (email, password) => {
        // Check for undefined or empty input fields
        if (!email || !password) {
            showMessage("Please enter a valid email and password.", "error");
            return false;
        }

        // Validate that the field is either a email OR a phone number
        if (!validator.isEmail(email) && !validator.isMobilePhone(email)) {
            showMessage("Please enter a valid email address.", "error");
            return false;
        }

        return true;
    };

    return (
        <IonPage>
            {/* <Title name="Login" /> */}
            <IonContent className="ion-justify-content-center dark">
                <IonCard className="dark loginCard">
                    <IonItem className="logoHolder">
                        <IonImg src={process.env.PUBLIC_URL+'/assets/icon/madnet/madnet-100.png'}></IonImg>
                    </IonItem>                    
                    <IonCardHeader>                                                                 
                        <IonCardTitle>Login to MADNet</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <form onSubmit={ handleSubmit } >
                                <IonItem>
                                    <IonLabel position="stacked">Email/Phone</IonLabel>
                                    <IonInput name="email" id="email" required="true" value={userEmail} 
                                        placeholder="Enter your registered email or phone" onIonChange={e => setUserEmail(e.target.value) } />
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Password</IonLabel>
                                    <IonInput type="password" id="password" name="password" requried="true" value={userPassword} 
                                        onIonChange={e => setUserPassword(e.target.value)} />
                                </IonItem>                                
                                <IonButton type="submit" id="login" expand="full" disabled={loading} block={true} size="default">
                                    {loading ? "Loading..." : "Sign In"}
                                </IonButton>
                                <IonText className="centerAlign">
                                    <p>--Or--</p>
                                </IonText>                                                      
                                <IonButton type="button" color="tertiary" expand="full" disabled={loading} block={true} size="default" onClick={signInWithGoogle}>
                                    <IonIcon icon={logoGoogle}/>{loading ? "Loading..." : "Login With Google"}
                                </IonButton>
                                { message.length && message[0] ? (                                                              
                                    <IonItem lines="none">
                                        {message.length && <div className={message[1] + "-message"}>{ message[0] }</div>}
                                    </IonItem>
                                ): null }                                
                                <div className="cardCaption">
                                    <IonLabel position="stacked">Coming here for the first time?</IonLabel>
                                    <IonButton routerLink="induction/join" type="button" color="tertiary" expand="full" disabled={loading} block={true} size="default">
                                        Register<IonIcon icon={arrowForward}/>
                                    </IonButton>
                                </div>
                            </form>
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default Login;
