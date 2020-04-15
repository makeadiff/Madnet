import React from 'react'
import { IonRouterOutlet, IonSplitPane, IonPage, IonLoading } from '@ionic/react'
import { IonReactHashRouter } from '@ionic/react-router'
import { Redirect, Route, useLocation } from 'react-router-dom'
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
import InductionIndex from './pages/Induction/Index'
import InductionProfile from './pages/Induction/Profile'
import InductionSetup from './pages/Induction/Setup'

const Root = () => {
    const { loading, setLoading } = React.useContext(appContext)

    return (
        <IonReactHashRouter>
            <SetPage />
            <IonSplitPane contentId="main">
                <Menu />
                
                <IonPage id="main">
                    <IonLoading isOpen={loading} onDidDismiss={() => setLoading(false)} message={'Loading...'} duration={3000} />

                    <IonRouterOutlet id="main">
                        <Route path="/login">
                            <Login />
                        </Route>

                        <Route path="/induction/profile">
                            <InductionProfile />
                        </Route>
                        <Route path="/induction/setup">
                            <InductionSetup />
                        </Route>
                        <Route path="/induction/join">
                            <InductionIndex />
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

                        <PrivateRoute path="/profile">
                            <Page page={{name: "Profile"}} />
                        </PrivateRoute>

                        <Route path="/" render={() => <Redirect to="/dashboard" /> } exact={true} />
                    </IonRouterOutlet>
                </IonPage>

            </IonSplitPane>
        </IonReactHashRouter>
    );
}

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    const { user } = React.useContext(authContext);

    return (
        <Route {...rest}
            render={() =>
                user.id ? ( children ) : ( <Redirect to={{ pathname: "/login" }} /> )
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
