import React from 'react'
import {
  IonRouterOutlet,
  IonSplitPane,
  IonPage,
  IonLoading,
  IonToast
} from '@ionic/react'
import { IonReactHashRouter } from '@ionic/react-router'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { authContext } from './contexts/AuthContext'
import { appContext } from './contexts/AppContext'

import { SITE_URL } from './utils/Constants'

import Menu from './components/Menu'
import Page from './pages/Page'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Links from './pages/Links'
import ShelterView from './pages/Shelters/View'
import ShelterIndex from './pages/Shelters/Index'
import BatchForm from './pages/Batches/Form'
import BatchIndex from './pages/Batches/Index'
import LevelForm from './pages/Levels/Form'
import LevelIndex from './pages/Levels/Index'
import LevelAddStudent from './pages/Levels/AddStudent'
import EventIndex from './pages/Events/Index'
import EventCreate from './pages/Events/Create'
import EventRSVP from './pages/Events/RSVP'
// import EventView from './pages/Events/View'

import SurveyForm from './pages/Surveys/Form'
import InductionIndex from './pages/Induction/Index'
import InductionProfile from './pages/Induction/Profile'
import InductionSetup from './pages/Induction/Setup'
import Profile from './pages/Profile'
import Notes from './pages/Notes'
import UserIndex from './pages/Users/Index'
import UserView from './pages/Users/View'
import UserForm from './pages/Users/Form'
import StudentIndex from './pages/Students/Index'
import StudentForm from './pages/Students/Form'
import TeacherIndex from './pages/Allocations/Index'
import TeacherForm from './pages/Allocations/Form'
import TeacherView from './pages/Allocations/View'
import WingmanForm from './pages/Allocations/Wingman/Form'
import WingmanView from './pages/Allocations/Wingman/View'

const Root = () => {
  const { loading, setLoading, message, setMessage } = React.useContext(
    appContext
  )

  return (
    <IonReactHashRouter>
      <SetPage />
      <IonSplitPane contentId="main">
        <Menu />

        <IonPage id="main">
          <IonLoading
            isOpen={typeof loading === 'string' ? true : loading}
            onDidDismiss={() => setLoading(false)}
            message={typeof loading === 'string' ? loading : 'Loading...'}
            duration={10000}
          />
          <IonToast
            isOpen={message[0] ? true : false}
            onDidDismiss={() => setMessage(['', false])}
            message={message[0]}
            className={message[1] ? message[1] + '-toast' : ''}
            duration={3000}
          />

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

            <PrivateRoute path="/shelters/:shelter_id/projects/:project_id/batches/:batch_id">
              <BatchForm />
            </PrivateRoute>
            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/batches"
              exact={true}
            >
              <BatchIndex />
            </PrivateRoute>
            <PrivateRoute path="/shelters/:shelter_id/projects/:project_id/levels/:level_id/add-student">
              <LevelAddStudent />
            </PrivateRoute>
            <PrivateRoute path="/shelters/:shelter_id/projects/:project_id/levels/:param_level_id">
              <LevelForm />
            </PrivateRoute>
            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/levels"
              exact={true}
            >
              <LevelIndex />
            </PrivateRoute>
            <PrivateRoute path="/shelters/:shelter_id/students" exact={true}>
              <StudentIndex />
            </PrivateRoute>
            <PrivateRoute path="/shelters/:item_id/notes" exact={true}>
              <Notes item_type="center" />
            </PrivateRoute>
            <PrivateRoute
              path="/shelters/:shelter_id/projects/:param_project_id"
              exact={true}
            >
              <ShelterView />
            </PrivateRoute>
            <PrivateRoute path="/shelters/:shelter_id" exact={true}>
              <ShelterView />
            </PrivateRoute>
            <PrivateRoute path="/shelters" exact={true}>
              <ShelterIndex />
            </PrivateRoute>

            {/* <PrivateRoute path="/users/:user_id/view">
                            <UserView />
                        </PrivateRoute> */}
            <PrivateRoute path="/users/:user_id/" exact={true}>
              <UserForm />
            </PrivateRoute>
            <PrivateRoute path="/users/:user_id/:action" exact={true}>
              <UserForm />
            </PrivateRoute>
            <PrivateRoute path="/users" exact={true}>
              <UserIndex />
            </PrivateRoute>

            <PrivateRoute path="/surveys/:surveyId">
              <SurveyForm />
            </PrivateRoute>

            <PrivateRoute path="/events/:eventId/rsvp" exact={true}>
              <EventRSVP />
            </PrivateRoute>
            <PrivateRoute path="/events" exact={true}>
              <EventIndex />
            </PrivateRoute>
            <PrivateRoute path="/events/0" exact={true}>
              <EventCreate />
            </PrivateRoute>
            <PrivateRoute path="/events/:eventId" exact={true}>
              <EventCreate />
            </PrivateRoute>

            <PrivateRoute path="/classes">
              <Page page={{ name: 'My Classes' }} />
            </PrivateRoute>

            <PrivateRoute path="/links">
              <Links />
            </PrivateRoute>

            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>

            <PrivateRoute path="/students" exact={true}>
              <StudentIndex />
            </PrivateRoute>
            <PrivateRoute path="/students/:student_id" exact={true}>
              <StudentForm />
            </PrivateRoute>
            <PrivateRoute path="/students/:item_id/notes" exact={true}>
              <Notes item_type="student" />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/view-teachers"
              exact={true}
            >
              <TeacherView />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/assign-teachers"
              exact={true}
            >
              <TeacherIndex />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/assign-teachers/level/:new_level_id"
              exact={true}
            >
              <TeacherIndex />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/assign-teachers/:user_id/level/:new_level_id"
              exact={true}
            >
              <TeacherForm />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/assign-teachers/:user_id"
              exact={true}
            >
              <TeacherForm />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/view-wingmen"
              exact={true}
            >
              <WingmanView />
            </PrivateRoute>

            <PrivateRoute
              path="/shelters/:shelter_id/projects/:project_id/assign-wingmen"
              exact={true}
            >
              <WingmanForm />
            </PrivateRoute>

            {/* Redirect to external paths... */}
            <Route
              path="/donut"
              exact={true}
              render={() => {
                window.location.href = SITE_URL + 'donut'
              }}
            />

            <Route
              path="/"
              render={() => <Redirect to="/dashboard" />}
              exact={true}
            />
          </IonRouterOutlet>
        </IonPage>
      </IonSplitPane>
    </IonReactHashRouter>
  )
}

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const { user } = React.useContext(authContext)

  return (
    <Route
      {...rest}
      render={() =>
        user.id ? children : <Redirect to={{ pathname: '/login' }} />
      }
    />
  )
}

// The purpose of this function is so that we have globaly accessable path information.
function SetPage() {
  // Why not put this code in the Root itself? Because this has to be inside the Router componet to work. Otherwise it gives a can't find useContext error.
  const { setData } = React.useContext(appContext)

  let location = useLocation()
  setData('path', location.pathname)

  return null
}

export default Root
