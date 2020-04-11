import { DEFAULT_USER_AUTH } from "./Constants"


/** Return user auth from local storage value */
export const getStoredUser = () => {
    const user = window.localStorage.getItem("user")
    if (user) {
        return JSON.parse(user);
    }
    return DEFAULT_USER_AUTH;
}
export const setStoredUser = (user_data) => {
    window.localStorage.setItem("user", JSON.stringify(user_data))
}
