import Menu from './components/Menu';
import Page from './pages/Page';
import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from "history"

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import './App.css';
import { SessionContext, getUser, setUser } from './contexts/Session'

import Login from "./pages/Login";

const history = createBrowserHistory()
const App = () => {
  const [selectedPage, setSelectedPage] = useState('');
  const [session, setSession] = useState( getUser('1') );
  useEffect(
    () => { 
      console.log("useEffect()", session)
      //setSession( getUser('3') ); 
    },
    [session]
  );

  let show_component = <Login />;

  if(session !== null && session.id !== 0) {
    show_component = (
      <IonSplitPane contentId="main">
        <Menu selectedPage={selectedPage} />
        <IonRouterOutlet id="main" history={history}>
          <Route path="/page/:name" render={(props) => {
            setSelectedPage(props.match.params.name);
            return <Page {...props} />;
          }} exact={true} />
          <Route path="/" render={() => <Redirect to="/page/Inbox" />} exact={true} />
        </IonRouterOutlet>
      </IonSplitPane>
    )
  }

  return (
    <IonApp>
      <SessionContext.Provider value={ session }>
        <IonReactRouter>
          { show_component }
          <span>ID : { session.id }</span>
        </IonReactRouter>
      </SessionContext.Provider>
    </IonApp>
  );
};

export default App;
