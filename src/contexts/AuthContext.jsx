import * as React from "react";

/** Custom Hooks */
import useAuthHandler from "../utils/custom-hooks/AuthHandler";
/** Utils */
import { DEFAULT_USER_AUTH } from "../utils/Constants";
import { getStoredUser } from "../utils/Helpers";

export const authContext = React.createContext({
  auth: DEFAULT_USER_AUTH,
  user: DEFAULT_USER_AUTH,
  setCurrentUser: () => {},
  unsetCurrentUser: () => {},
  isFellow: () => {},
  accessLevel: () => {},
  hasPermission: () => {}
});

const { Provider } = authContext;

const AuthProvider = ({ children }) => {
  const { auth, user, setCurrentUser, unsetCurrentUser, isFellow, hasPermission, accessLevel } = useAuthHandler( getStoredUser() );

  return (
    <Provider value={{ auth, user, setCurrentUser, unsetCurrentUser, isFellow, hasPermission, accessLevel }}>
      {children}
    </Provider>
  );
};

export default AuthProvider;
