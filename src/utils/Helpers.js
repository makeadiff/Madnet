import * as validator from "validator";
import { API_AUTH, API_END_POINT } from "./Constants";

/** Handle form validation for the login form
 * @param email - user's auth email
 * @param password - user's auth password
 * @param setError - function that handles updating error state value
 */
export const validateLoginForm = (email, password, setError) => {
  // Check for undefined or empty input fields
  if (!email || !password) {
    setError("Please enter a valid email and password.");
    return false;
  }

  // Validate email
  if (!validator.isEmail(email)) {
    setError("Please enter a valid email address.");
    return false;
  }

  return true;
};

/** Return user auth from local storage value */
export const getStoredUserAuth = () => {
  const auth = window.localStorage.getItem("UserAuth");
  if (auth) {
    return JSON.parse(auth);
  }
  return false;
};

/**
 * API Request handler
 * @param url - api endpoint
 * @param method - http method
 * @param params - body parameters of request
 */
export const apiRequest = async (url, method, params) => {
  const response = await fetch(API_END_POINT + url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Basic ${API_AUTH.base64}`
    },
    body: params ? JSON.stringify(params) : undefined
  });

  return await response.json();
};
