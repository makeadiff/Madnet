import * as React from "react";

/** Utils */
import { DEFAULT_USER_AUTH } from "../Constants";

const useAuthHandler = (initialState) => {
  const [auth, setAuth] = React.useState(initialState);

  const setUser = (user) => {
    window.localStorage.setItem("user", JSON.stringify(user));
    setAuth(user);
  };

  const unsetUser = () => {
    window.localStorage.clear();
    setAuth(DEFAULT_USER_AUTH);
  };

  const isFellow = (or_higher = true) => {
    if(!auth.id) return false;

    for(let i in auth.groups) {
      let grp  = auth.groups[i]
      
      if(grp.type === "fellow") return true
      if(or_higher && (grp.type === "strat" || grp.type === "national" || grp.type === "executive")) return true
    }

    return false
  }

  return {
    auth,
    setUser,
    unsetUser,
    isFellow
  };
};

export default useAuthHandler;
