import * as React from "react";

import useGlobalHandler from "../utils/custom-hooks/AppHandler";

export const appContext = React.createContext({
    message: ["", false],
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
    const { message,showMessage,loading,setLoading,data,setData,notifications,addNotification } = useGlobalHandler();

    return (
        <Provider value={{ message,showMessage,loading,setLoading,data,setData,notifications,addNotification }}>
            {children}
        </Provider>
    );
};

export default AppProvider;
