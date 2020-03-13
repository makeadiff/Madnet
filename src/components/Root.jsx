import React, { useState } from 'react';
import { IonRouterOutlet, IonSplitPane, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
        IonList,IonListHeader,IonMenuToggle,IonItem,IonLabel,IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { createBrowserHistory } from "history"
import { authContext } from "../contexts/AuthContext";
import { appContext } from "../contexts/AppContext";
import { volunteerPages, fellowPages } from "../utils/Menu"

import Menu from './Menu';
import Page from '../pages/Page';
import Login from "../pages/Login";
import Dashboard from '../pages/Dashboard';
import Shelters from '../pages/Shelters';
import ManageShelter from '../pages/ManageShelter';

const history = createBrowserHistory()

const Root = () => {
  const [selectedPage, setSelectedPage] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const { auth } = React.useContext(authContext);
  const { app } = React.useContext(appContext);

  const allPages = volunteerPages.concat(fellowPages);

  return (
	  <IonReactRouter history={history}>
    <SetPage />
	    <IonSplitPane contentId="main">
	      <Menu selectedPage={selectedPage} />
	      <IonPage id="main">
          <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
            duration={5000}
          />

  				<IonRouterOutlet id="main">
  					<Route path="/login">
  						<Login />
  					</Route>

  					<PrivateRoute path="/page/Dashboard">
  						<Dashboard />
  					</PrivateRoute>

  					<PrivateRoute path="/page/Shelters/:shelter_id">
  						<ManageShelter />
  					</PrivateRoute>

  					<PrivateRoute path="/page/Shelters">
  						<Shelters />
  					</PrivateRoute>
  					<PrivateRoute path="/page/MyClasses">
  						<Page page={{name: "My Classes"}} />
  					</PrivateRoute>
  					<Route path="/" render={() => <Redirect to="/page/Dashboard" /> } exact={true} />
  				</IonRouterOutlet>
  		  </IonPage>
	    </IonSplitPane>
	  </IonReactRouter>
	);
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const { auth } = React.useContext(authContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.id ? ( children ) : ( <Redirect to={{ pathname: "/login" }} /> )
      }
    />
  );
}

function SetPage({ children, ...rest }) { // Why not put this code in the Root itself? Because this has to be inside the Router componet to work. Otherwise it gives a can't find useContext error.
  const { custom } = React.useContext(appContext);
  const { auth } = React.useContext(authContext);

  let location = useLocation();
  console.log(location, custom, auth)
  // app.setCustom({"path": location.pathname})

  return null
}


// Global hooks taken from https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8
// function setState(newState) {
//   this.state = { ...this.state, ...newState };
//   this.listeners.forEach((listener) => {
//     listener(this.state);
//   });
// }

// function useCustom(React) {
//   const newListener = React.useState()[1];
//   React.useEffect(() => {
//     // Called just after component mount
//     this.listeners.push(newListener);
//     return () => {
//       // Called just before the component unmount
//       this.listeners = this.listeners.filter(listener => listener !== newListener);
//     };
//   }, []);
//   return [this.state, this.setState];
// }

// const useGlobalHook = (React, initialState) => {
//   const store = { state: initialState, listeners: [] };
//   store.setState = setState.bind(store);
//   return useCustom.bind(store, React);
// };


// const useGlobal = useGlobalHook(React, {page : ""});

export default Root;
