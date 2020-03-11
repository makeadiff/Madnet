import React from "react"
import { DEFAULT_USER_AUTH } from "../utils/Constants"

export const setUser = (user) => {
	console.log("Saving to local : ", JSON.stringify(user))
	window.localStorage.setItem("user", JSON.stringify(user));
}

export const getUser = (from_x) => {
	let user = window.localStorage.getItem("user");
	if(user === null) user = DEFAULT_USER_AUTH;
	else user = JSON.parse(user);

	console.log("Getting Session: " + from_x, user)

	return user
}

export const SessionContext = React.createContext( getUser('2') );
