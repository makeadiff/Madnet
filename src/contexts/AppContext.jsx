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
    addNotification: () => {},
    cache: {},
    setCache: () => {}
});

const { Provider } = appContext;

const AppProvider = ({ children }) => {
    const { message,setMessage,showMessage,loading,setLoading,data,setData,notifications,addNotification,cache,setCache } = useGlobalHandler();

    return (
        <Provider value={{ message,setMessage,showMessage,loading,setLoading,data,setData,notifications,addNotification,cache,setCache }}>
            {children}
        </Provider>
    );
};

const useGlobalHandler = () => {
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState(["", false])
    const [data] = React.useState([])
    const [notifications, setNotifications] = React.useState([])
    const [cache, setCacheAll] = React.useState({})

    React.useEffect(() => {
        console.log(cache)
    }, [cache])

    const showMessage = (message, type) => {
        if(type === undefined) type = "info"

        console.log(type + " : " + message)
        setMessage([message, type])
    }

    const setData = (key, value) => {
        data[key] = value
    }

    const setCache = (key, value) => {
        let new_cache = cache
        new_cache[key] = value
        setCacheAll(new_cache)
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
        addNotification,
        cache,
        setCache
    }
}


export default AppProvider;
