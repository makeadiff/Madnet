import { IonButton, IonInput } from '@ionic/react';
import React from 'react';
import { Redirect } from 'react-router-dom'
import * as validator from "validator";
import { createBrowserHistory } from "history"

import useErrorHandler from "../utils/custom-hooks/ErrorHandler";
import ErrorMessage from "../components/ErrorMessage";

import { authContext } from "../contexts/AuthContext";

// import { getUser, setUser } from '../contexts/Session'
// import useSession, { UseSessionProvider } from 'react-session-hook';

/** Utils */
import { apiRequest } from "../utils/Helpers";

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
      const user_data = await apiRequest("users/login", "post", { email: userEmail, password: userPassword });
      if(user_data.status === "success") {
        let user = user_data.data.users;
        // console.log(user)
        auth.setAuthStatus(user);
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


  /** Handle form validation for the login form
   * @param email - user's auth email
   * @param password - user's auth password
   * @param setError - function that handles updating error state value
   */
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
     <div className="container">
      <strong>Login</strong>
        <div className="login-area">
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
          <IonInput type="email"
            name="email"
            id="email"
            autofocus="true"
            required="true"
            value={userEmail}
            placeholder="john@mail.com"
            onIonChange={(e) => setUserEmail(e.target.value) }
          />
          <IonInput
            type="password"
            id="password"
            name="password"
            requried="true"
            value={userPassword}
            placeholder="Password"
            onIonChange={e => setUserPassword(e.target.value)}
          />
          <IonButton type="submit" disabled={loading} block={true}>
            {loading ? "Loading..." : "Sign In"}
          </IonButton>
          <br />
          {error && <ErrorMessage errorMessage={error} />}
          </form>
        </div>
      </div>
  );
}

export default Login;

/*

    <Form
      onSubmit={e => {
        e.preventDefault();
        if (validateLoginForm(userEmail, userPassword, showError)) {
          authHandler();
        }
      }}
    >
      <Header>Sign in</Header>
      <br />
      <FormGroup>
        <Input
          type="email"
          name="email"
          value={userEmail}
          placeholder="john@mail.com"
          onChange={e => setUserEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          name="password"
          value={userPassword}
          placeholder="Password"
          onChange={e => setUserPassword(e.target.value)}
        />
      </FormGroup>
      <Button type="submit" disabled={loading} block={true}>
        {loading ? "Loading..." : "Sign In"}
      </Button>
      <br />
      {error && <ErrorMessage errorMessage={error} />}
    </Form>
    */