import { DEFAULT_USER_AUTH } from "./Constants";


/** Return user auth from local storage value */
export const getStoredUserAuth = () => {
    const auth = window.localStorage.getItem("user");
    if (auth) {
        return JSON.parse(auth);
    }
    return DEFAULT_USER_AUTH;
};
