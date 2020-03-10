import { IonButton, IonInput } from '@ionic/react';
import React from 'react';
import { Redirect } from 'react-router-dom'

import useErrorHandler from "../utils/custom-hooks/ErrorHandler";
import { authContext } from "../contexts/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

/** Utils */
import { apiRequest, validateLoginForm } from "../utils/Helpers";

function Login() {
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const auth = React.useContext(authContext);

  const { error, showError } = useErrorHandler(null);
  const authHandler = async () => {
    try {
      setLoading(true);
      const user_data = await apiRequest("users/login", "post",
        { email: userEmail, password: userPassword }
      );
      if(user_data.status === "success") {
        console.log(user_data.data.users)
        auth.setUser(user_data.data.users);
        // return (<Redirect to="/page/Dashboard" />)
      } else {
        showError("Invalid email/password provided")
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showError(err.message);
    }
  };

  return (
     <div className="container">
      <strong>Login</strong>
        <div className="login-area">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (validateLoginForm(userEmail, userPassword, showError)) {
                authHandler();
              }
            }}
          >
          <IonInput type="email"
            name="email"
            autofocus="true"
            required="true"
            value={userEmail}
            placeholder="john@mail.com"
            onIonChange={(e) => setUserEmail(e.target.value) }
          />
          <IonInput
            type="password"
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