import React from "react"

const useGlobalHandler = () => {
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState(["", false])
    const [data] = React.useState([])
    const [notifications, setNotifications] = React.useState([])

    const showMessage = (message, type) => {
        if(type === undefined) type = "info"

        console.log(type + " : " + message)
        setMessage([message, type])
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
        setMessage,
        loading,
        setLoading,
        data,
        setData,
        notifications,
        addNotification
    }
}

export default useGlobalHandler
