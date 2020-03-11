import * as React from "react";
import { DEFAULT_USER_AUTH } from "../Constants";

const useAuthHandler = (initialState) => {
  const [auth, setAuth] = React.useState(initialState);

  const setUser = (user) => {
    console.log(JSON.stringify(user))
    window.localStorage.setItem("user", JSON.stringify(user));
    setAuth(user);
  };

  const unsetUser = () => {
    window.localStorage.setItem("user", JSON.stringify(DEFAULT_USER_AUTH));
    setAuth(DEFAULT_USER_AUTH);
  };

  return {
    auth,
    setUser,
    unsetUser
  };
};

export default useAuthHandler;
