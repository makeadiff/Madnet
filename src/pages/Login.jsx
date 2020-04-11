import { IonButton, IonInput, IonPage, IonList, IonItem, IonContent } from '@ionic/react';
import React from 'react';
import * as validator from "validator";
import { useHistory } from 'react-router-dom';

import useErrorHandler from "../utils/custom-hooks/ErrorHandler";
import ErrorMessage from "../components/ErrorMessage";
import { requestPermission } from "../init-fcm";

import { authContext } from "../contexts/AuthContext";
import api from "../utils/API";
import Title from '../components/Title';


/*
:TODO:
- Forget password
- Sign in with Google
- Identifier based login rather than email
- Remember me (?)
- Key Check on return.
*/

function Login() {
    const [userEmail, setUserEmail] = React.useState("");
    const [userPassword, setUserPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const { error, showError } = useErrorHandler(null)
    const { setCurrentUser } = React.useContext(authContext)
    const history = useHistory()

    const authHandler = async () => {
        try {
            setLoading(true);
            const user_data = await api.rest(`users/login?email=${userEmail}&password=${userPassword}`, "get"); //, { email: userEmail, password: userPassword });
            if(user_data) {
                let user = user_data.users;
                setCurrentUser(user);
                requestPermission()
                history.push("/dashboard")
            } else {
                showError("Invalid email/password provided")
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            showError(err.message);
        }
    };

    const validateLoginForm = (email, password, setError) => {
        // Check for undefined or empty input fields
        if (!email || !password) {
            setError("Please enter a valid email and password.");
            return false;
        }

        // Validate email
        if (!validator.isEmail(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    return (
        <IonPage>
            <Title name="Login" />
            <IonContent>
            <IonList>
                <form onSubmit={e => {
                        e.preventDefault();
                        // This to handle browser autofilling data on load.
                        setUserEmail(document.querySelector('#email').value)
                        setUserPassword(document.querySelector('#password').value) // This doesn't work. Looks like a security issue.

                        if (validateLoginForm(userEmail, userPassword, showError)) {
                            authHandler();
                        }
                    }} >
                    <IonItem lines="none">
                        <IonInput type="email" name="email" id="email" autofocus="true" required="true" value={userEmail}
                            placeholder="Email/Phone..." onIonChange={(e) => setUserEmail(e.target.value) } />
                    </IonItem>
                    <IonItem lines="none">
                        <IonInput type="password" id="password" name="password" requried="true" value={userPassword}
                            placeholder="Password..." onIonChange={e => setUserPassword(e.target.value)} />
                    </IonItem>
                    <IonItem lines="none">
                        <IonButton type="submit" disabled={loading} block={true} size="default">
                            {loading ? "Loading..." : "Sign In"}
                        </IonButton>
                    </IonItem>
                    <IonItem lines="none">{error && <ErrorMessage errorMessage={error} />}</IonItem>
                </form>
            </IonList>
            </IonContent>
        </IonPage>
    );
}

export default Login;
