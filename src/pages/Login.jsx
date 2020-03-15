import { IonButton, IonInput, IonPage, IonList, IonListHeader,IonItem } from '@ionic/react';
import React from 'react';
import * as validator from "validator";
import { createBrowserHistory } from "history"

import useErrorHandler from "../utils/custom-hooks/ErrorHandler";
import ErrorMessage from "../components/ErrorMessage";

import { authContext } from "../contexts/AuthContext";
import api from "../utils/API";

const history = createBrowserHistory()

function Login({ history }) {
    const [userEmail, setUserEmail] = React.useState("");
    const [userPassword, setUserPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const auth = React.useContext(authContext);

    const { error, showError } = useErrorHandler(null);
    const authHandler = async ( history ) => {
        try {
            setLoading(true);
            const user_data = await api.rest(`users/login?email=${userEmail}&password=${userPassword}`, "get"); //, { email: userEmail, password: userPassword });
            if(user_data) {
                let user = user_data.users;
                auth.setUser(user);
                history.push("/page/Dashboard")
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
            <IonList >
                <IonListHeader><strong>Login</strong></IonListHeader>

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        // This to handle browser autofilling data on load.
                        setUserEmail(document.querySelector('#email').value)
                        setUserPassword(document.querySelector('#password').value) // This doesn't work. Looks like a security issue.

                        if (validateLoginForm(userEmail, userPassword, showError)) {
                            authHandler();
                        }
                    }}
                >
                    <IonItem lines="none">
                        <IonInput type="email"
                            name="email"
                            id="email"
                            autofocus="true"
                            required="true"
                            value={userEmail}
                            placeholder="Enter your email..."
                            onIonChange={(e) => setUserEmail(e.target.value) }
                        />
                    </IonItem>
                    <IonItem lines="none">
                        <IonInput
                            type="password"
                            id="password"
                            name="password"
                            requried="true"
                            value={userPassword}
                            placeholder="Password"
                            onIonChange={e => setUserPassword(e.target.value)}
                        />
                    </IonItem>
                    <IonItem lines="none">
                        <IonButton type="submit" disabled={loading} block={true}>
                            {loading ? "Loading..." : "Sign In"}
                        </IonButton>
                    </IonItem>
                    <IonItem lines="none">{error && <ErrorMessage errorMessage={error} />}</IonItem>
                </form>
            </IonList>
        </IonPage>
    );
}

export default Login;
