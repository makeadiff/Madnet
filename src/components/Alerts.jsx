import React from 'react'

import { authContext } from '../contexts/AuthContext'
import { appContext } from '../contexts/AppContext'
import { dataContext } from '../contexts/DataContext'
import './Alerts.css'
import {
  IonCardContent,
  IonCardHeader,
  IonCard,
  IonCardTitle
} from '@ionic/react'

// Send test Push Notification using https://console.firebase.google.com/u/1/project/madnet-28ca4/notification/compose

const Alerts = () => {
  const { user } = React.useContext(authContext)
  const { getAlerts } = React.useContext(dataContext)
  const { notifications } = React.useContext(appContext)
  const [alerts, setAlerts] = React.useState([])
  const [user_id] = React.useState(user.id) // if we don't do this, infinite loading.

  React.useEffect(() => {
    setAlerts(notifications.concat(alerts))
  }, [notifications])

  React.useEffect(() => {
    async function fetchAlerts() {
      const alerts_data = await getAlerts()
      if (alerts_data) {
        setAlerts(notifications.concat(alerts_data))
      } else {
        console.log(' No Alert Data')
      }
    }
    fetchAlerts()
  }, [user_id])

  if (alerts.length) {
    return (
      <IonCard className="light">
        <IonCardHeader>
          <IonCardTitle>Alerts</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {alerts.map((alert, index) => {
            // :TODO: Some highlight based on read or not - you can get it from appContext.notifications
            // :TODO: Once read, delete that alert from appContext.notifications
            return (
              <div className="alert-card danger" key={index}>
                <div className="alert-card-content">
                  <h4>
                    <URL alert={alert} />
                  </h4>
                  <p>{alert.description}</p>
                </div>
              </div>
            )
          })}
        </IonCardContent>
      </IonCard>
    )
  } else {
    return null
  }
}

const URL = ({ alert }) => {
  let render = alert.name
  if (alert.url !== undefined && alert.url.includes('http')) {
    render = <a href={alert.url}>{alert.name}</a>
  }
  // :TODO: Handle In App links - using Router's <Link>

  return render
}

export default Alerts
