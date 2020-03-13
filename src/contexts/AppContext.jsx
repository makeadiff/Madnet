import * as React from "react";

/** Custom Hooks */
import useGlobalHandler from "../utils/custom-hooks/AppHandler";

export const appContext = React.createContext({
  	message: ["", false],
	showMessage: () => {},
	loading: false,
	setLoading: () => {},
	custom: {},
	setCustom: () => {}
});

const { Provider } = appContext;

const AppProvider = ({ children }) => {
  const { message,showMessage,loading,setLoading,custom,setCustom } = useGlobalHandler();

  return (
    <Provider value={{ message,showMessage,loading,setLoading,custom,setCustom }}>
      {children}
    </Provider>
  );
};

export default AppProvider;
