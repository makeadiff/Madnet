import React from 'react'

import { requestPermission,onMessage } from "../init-fcm";
import { authContext } from "../contexts/AuthContext"
import { dataContext } from "../contexts/DataContext"
import './Alerts.css'

const Alerts = () => {
    const { auth } = React.useContext(authContext)
    const { getAlerts } = React.useContext(dataContext)
    const [alerts, setAlerts] = React.useState([])
    const [ user_id ] = React.useState(auth.id); // if we don't do this, infinite loading.
    const [initilized, setInitilized] = React.useState(false)
    const alertsRef = React.useRef()

    React.useEffect(() => {
        if(initilized === false) {
            requestPermission()
            onMessage((payload) => {
                const notification = payload.data.firebaseMessaging.payload.notification
                const title = notification.title
                const body = notification.body
                const icon = notification.icon
                // const link = fcmOptions.link

                // Put the new alert the top.
                setAlerts([{
                    name: title,
                    description: body,
                    url: "", // link,
                    image: icon
                }].concat(alertsRef.current))

            })
            setInitilized(true)
        }
    }, [initilized])

    React.useEffect(() => {
        async function fetchAlerts() {
            const alerts_data = await getAlerts()
            if(alerts_data) {
                alertsRef.current = alerts_data.alerts
                setAlerts(alerts_data.alerts)
            }
        }
        fetchAlerts();
    }, [user_id])

    return (
        <div className="card-area">
            { alerts.map((alert, index) => {
                return (
                    <div className="alert-card danger" key={index}>
                        <div className="alert-card-content">
                            <h4><URL alert={alert} /></h4>
                            <p>{ alert.description }</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const URL = ({ alert }) => {
    let render = alert.name
    if(alert.url.includes("http")) {
        render = (<a href={alert.url}>{ alert.name }</a>)
    }
    // :TODO: Handle In App links - using Router's <Link>

    return render
}

export default Alerts
