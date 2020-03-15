import * as React from "react";

/** Custom Hooks */
import useAuthHandler from "../utils/custom-hooks/AuthHandler";
/** Utils */
import { DEFAULT_USER_AUTH } from "../utils/Constants";
import { getStoredUserAuth } from "../utils/Helpers";

export const authContext = React.createContext({
  auth: DEFAULT_USER_AUTH,
  setUser: () => {},
  unsetUser: () => {},
  isFellow: () => {}
});

const { Provider } = authContext;

const AuthProvider = ({ children }) => {
  const { auth, setUser, unsetUser, isFellow } = useAuthHandler( getStoredUserAuth() );

  return (
    <Provider value={{ auth, setUser, unsetUser, isFellow }}>
      {children}
    </Provider>
  );
};

export default AuthProvider;
