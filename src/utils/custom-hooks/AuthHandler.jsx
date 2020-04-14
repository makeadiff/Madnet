import * as React from "react";
import { DEFAULT_USER_AUTH } from "../Constants";
import api from "../API";
import { getStoredUser, setStoredUser } from "../Helpers"

const useAuthHandler = (initialState) => {
    const [user, setUser] = React.useState(initialState);

    const setCurrentUser = (user_data) => {
        setStoredUser(user_data)
        setUser(user_data)
    };

    const unsetCurrentUser = () => {
        const user_data = getStoredUser()
        window.localStorage.clear()
        api.rest(`users/${user_data.id}/devices/${user_data.token}`, "delete") // Some wierd issue happening when calling unsetDeviceToken
        
        setUser(DEFAULT_USER_AUTH)
    };

    const isFellow = (or_higher = true) => {
        if (!user.id) return false;

        for (let i in user.groups) {
            let grp = user.groups[i]

            if (grp.type === "fellow") return true
            if (or_higher && (grp.type === "strat" || grp.type === "national" || grp.type === "executive")) return true
        }

        return false
    }

    const hasPermission = (permission) => {
        if (!user.id || user.permissions === undefined) return false;

        return user.permissions.includes(permission)
    }

    return {
        user,
        setCurrentUser,
        unsetCurrentUser,
        isFellow,
        hasPermission
    };
};

export default useAuthHandler;
