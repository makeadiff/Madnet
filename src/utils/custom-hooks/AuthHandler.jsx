import * as React from "react";

/** Utils */
import { DEFAULT_USER_AUTH } from "../Constants";

const useAuthHandler = (initialState) => {
  const [auth, setAuth] = React.useState(initialState);

  const setAuthStatus = (userAuth) => {
    window.localStorage.setItem("UserAuth", JSON.stringify(userAuth));
    setAuth(userAuth);
  };

  const setUnauthStatus = () => {
    window.localStorage.clear();
    setAuth(DEFAULT_USER_AUTH);
  };

  return {
    auth,
    setAuthStatus,
    setUnauthStatus
  };
};

export default useAuthHandler;
