import React, { useState } from 'react';
import { IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from "history"
import { authContext } from "../contexts/AuthContext";

import Menu from './Menu';
import Page from '../pages/Page';
import Login from "../pages/Login";
import Dashboard from '../pages/Dashboard';
import Shelters from '../pages/Shelters';
import ManageShelter from '../pages/ManageShelter';

const history = createBrowserHistory()

const Root = () => {
	const [selectedPage, setSelectedPage] = useState('');
	const { auth } = React.useContext(authContext);	

	return (
	  <IonReactRouter history={history}>
	    <IonSplitPane contentId="main">
	      <Menu selectedPage={selectedPage} />
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

export default Root;
