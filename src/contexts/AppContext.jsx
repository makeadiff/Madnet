import * as React from "react";

export const appContext = React.createContext({
    message: ["", false],
    setMessage: () => {},
    showMessage: () => {},
    loading: false,
    setLoading: () => {},
    data: {},
    setData: () => {},
    notifications: [],
    addNotification: () => {}
});

const { Provider } = appContext;

const AppProvider = ({ children }) => {
    const { message,setMessage,showMessage,loading,setLoading,data,setData,notifications,addNotification } = useGlobalHandler()

    return (
        <Provider value={{ message,setMessage,showMessage,loading,setLoading,data,setData,notifications,addNotification }}>
            {children}
        </Provider>
    );
};

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

    const addNotification = (newNotification) => {
        setNotifications([newNotification].concat(notifications))
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


export default AppProvider;
