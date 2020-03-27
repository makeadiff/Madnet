import React from 'react'
import { IonRouterOutlet, IonSplitPane, IonPage, IonLoading } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { createBrowserHistory } from "history"
import { authContext } from "./contexts/AuthContext"
import { appContext } from "./contexts/AppContext"

import Menu from './components/Menu'
import Page from './pages/Page'
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import Shelters from './pages/Shelters'
import ManageShelter from './pages/ManageShelter'
import EventIndex from './pages/Events/Index'
import EventRSVP from './pages/Events/RSVP'
import SurveyForm from './pages/Surveys/Form'

const history = createBrowserHistory()

const Root = () => {
    const { loading, setLoading } = React.useContext(appContext)

    return (
        <IonReactRouter history={history}>
            <SetPage />
            <IonSplitPane contentId="main">
                <Menu />
                <IonPage id="main">
                    <IonLoading
                        isOpen={loading}
                        onDidDismiss={() => setLoading(false)}
                        message={'Loading...'}
                        duration={3000}
                    />

                    <IonRouterOutlet id="main">
                        <Route path="/login">
                            <Login />
                        </Route>

                        <PrivateRoute path="/dashboard">
                            <Dashboard />
                        </PrivateRoute>

                        <PrivateRoute path="/shelters/:shelter_id">
                            <ManageShelter />
                        </PrivateRoute>
                        <PrivateRoute path="/shelters">
                            <Shelters />
                        </PrivateRoute>

                        <PrivateRoute path="/surveys/:surveyId">
                            <SurveyForm />
                        </PrivateRoute>

                        <PrivateRoute path="/events/:eventId/rsvp">
                            <EventRSVP />
                        </PrivateRoute>
                        <PrivateRoute path="/events">
                            <EventIndex />
                        </PrivateRoute>

                        <PrivateRoute path="/classes">
                            <Page page={{name: "My Classes"}} />
                        </PrivateRoute>

                        <Route path="/" render={() => <Redirect to="/dashboard" /> } exact={true} />
                    </IonRouterOutlet>
              </IonPage>
            </IonSplitPane>
        </IonReactRouter>
    );
}

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const { auth } = React.useContext(authContext);

    return (
        <Route {...rest}
            render={() =>
                auth.id ? ( children ) : ( <Redirect to={{ pathname: "/login" }} /> )
            } />
    );
}

// The purpose of this function is so that we have globaly accessable path information.
function SetPage() { // Why not put this code in the Root itself? Because this has to be inside the Router componet to work. Otherwise it gives a can't find useContext error.
    const { setData } = React.useContext(appContext);

    let location = useLocation()
    setData("path", location.pathname)

    return null
}

export default Root
