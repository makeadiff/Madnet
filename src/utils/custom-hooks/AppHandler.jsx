import React from "react";

import { requestPermission,onMessage } from "../../init-fcm";

const useGlobalHandler = () => {
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState(["", false]);
    const [data] = React.useState([]);
    const [notifications, setNotifications] = React.useState([]);
    const [initilized, setInitilized] = React.useState(false)

    React.useEffect(() => {
        if(initilized === false) {
            requestPermission()
            onMessage((payload) => {
                const notification = payload.data.firebaseMessaging.payload.notification
                const new_notification = {
                    name : notification.title,
                    description : notification.body,
                    image : notification.icon,
                //  url : fcmOptions.link
                }

                // Put the new alert the top.
                addNotification(new_notification)
            })
            setInitilized(true)
        }
    }, [initilized])


    const showMessage = (message, type) => {
        setMessage([message, type]);
    }

    const setData = (key, value) => {
        data[key] = value
    }

    const addNotification = (new_notification) => {
        setNotifications([new_notification].concat(notifications))
    }

    return {
        message,
        showMessage,
        loading,
        setLoading,
        data,
        setData,
        notifications
    };
};

export default useGlobalHandler;
