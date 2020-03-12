import { API_AUTH, API_END_POINT, DEFAULT_USER_AUTH } from "./Constants";


/** Return user auth from local storage value */
export const getStoredUserAuth = () => {
  const auth = window.localStorage.getItem("UserAuth");
  if (auth) {
    return JSON.parse(auth);
  }
  return DEFAULT_USER_AUTH;
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
