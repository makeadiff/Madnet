import { API_AUTH, API_REST_URL, API_BASE_URL, DEFAULT_USER_AUTH } from "./Constants";


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
  const response = await fetch(API_REST_URL + url, {
    method,
    headers: {
      "Authorization": `Basic ${API_AUTH.base64}`
    },
    body: params ? JSON.stringify(params) : undefined
  });

  return await response.json();
};

export const graphql = async (query, type) => {
  if(type === undefined) type = 'query'

  const response = await fetch("http://localhost/MAD/api/index.php/graphql", { // :TODO: Url should be API_BASE_URL + "graphql"
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"query": query})
  });

  let data = await response.json();

  if(data && data.data !== undefined) return data.data
  return false
};
