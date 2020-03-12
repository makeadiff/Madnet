import * as React from "react";

/** Custom Hooks */
import useAuthHandler from "../utils/custom-hooks/AuthHandler";
/** Utils */
import { DEFAULT_USER_AUTH } from "../utils/Constants";
import { getStoredUserAuth } from "../utils/Helpers";

export const authContext = React.createContext({
  auth: DEFAULT_USER_AUTH,
  setAuthStatus: () => {},
  setUnauthStatus: () => {}
});

const { Provider } = authContext;

const AuthProvider = ({ children }) => {
  const { auth, setAuthStatus, setUnauthStatus } = useAuthHandler( getStoredUserAuth() );

  return (
    <Provider value={{ auth, setAuthStatus, setUnauthStatus }}>
      {children}
    </Provider>
  );
};

export default AuthProvider;
