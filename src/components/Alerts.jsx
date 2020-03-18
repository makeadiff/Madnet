import React, { useState, useEffect } from 'react';
import { authContext } from "../contexts/AuthContext";
import { appContext } from "../contexts/AppContext";
import api from "../utils/API";
import './Alerts.css';
import { alert } from 'ionicons/icons';

const Alerts = () => {
    const { auth } = React.useContext(authContext);
    const { setLoading } = React.useContext(appContext);
    const [alerts, setAlerts] = useState([]);
    const [ userId ] = useState(auth.id); // if we don't do this, infinite loading.

    useEffect(() => {
        async function fetchAlerts() {
            setLoading(true)
            const alerts_data = await api.rest("users/" + userId + "/alerts", "get");
            if(alerts_data) {
                setAlerts(alerts_data.alerts)
            } else {
                console.log("Shelters fetch call failed.")
            }
            setLoading(false)
        }
        fetchAlerts();
    }, [userId])

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