import * as React from "react";

import useGlobalHandler from "../utils/custom-hooks/AppHandler";

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
    const { message,setMessage,showMessage,loading,setLoading,data,setData,notifications,addNotification } = useGlobalHandler();

    return (
        <Provider value={{ message,setMessage,showMessage,loading,setLoading,data,setData,notifications,addNotification }}>
            {children}
        </Provider>
    );
};

export default AppProvider;
