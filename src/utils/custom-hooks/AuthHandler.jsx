import * as React from "react";

/** Utils */
import { DEFAULT_USER_AUTH } from "../Constants";

const useAuthHandler = (initialState) => {
  const [auth, setAuth] = React.useState(initialState);
  const [user, setUser] = React.useState(initialState);

  const setCurrentUser = (user_data) => {
    window.localStorage.setItem("user", JSON.stringify(user_data));
    setAuth(user_data);
    setUser(user_data);
  };

  const unsetCurrentUser = () => {
    window.localStorage.clear();
    setAuth(DEFAULT_USER_AUTH);
    setUser(DEFAULT_USER_AUTH);
  };

  const isFellow = (or_higher = true) => {
    if(!user.id) return false;

    for(let i in user.groups) {
      let grp  = user.groups[i]
      
      if(grp.type === "fellow") return true
      if(or_higher && (grp.type === "strat" || grp.type === "national" || grp.type === "executive")) return true
    }

    return false
  }

  const hasPermission = (permission) => {
    if(!user.id || user.permissions === undefined) return false;

    return user.permissions.includes(permission)
  }

  return {
    auth,
    user,
    setCurrentUser,
    unsetCurrentUser,
    isFellow,
    hasPermission
  };
};

export default useAuthHandler;
