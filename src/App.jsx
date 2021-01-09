import React from 'react'
import { IonApp } from '@ionic/react'
import Root from './Root'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import Feedback from 'feeder-react-feedback'
import 'feeder-react-feedback/dist/feeder-react-feedback.css'

/* Theme variables */
import './theme/variables.css'
import './App.css'

import AuthContextProvider from './contexts/AuthContext'
import AppContextProvider from './contexts/AppContext'
import DataContextProvider from './contexts/DataContext'

const App = () => {
  return (
    <IonApp>
      <AppContextProvider>
        <AuthContextProvider>
          <DataContextProvider>
            <Root />

            <Feedback
              projectId="5fad1e16c018ec00042287b0"
              email={true}
              emailRequired={true}
              primaryColor="#ef233c"
              textColor="#ffffff"
            />
          </DataContextProvider>
        </AuthContextProvider>
      </AppContextProvider>
    </IonApp>
  )
}

export default App
