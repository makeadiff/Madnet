import React from "react";

import { requestPermission,onMessage } from "../../init-fcm";

const useGlobalHandler = () => {
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState(["", false]);
    const [data] = React.useState([]);
    const [notifications, setNotifications] = React.useState([]);

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
        notifications,
        addNotification
    };
};

export default useGlobalHandler;
