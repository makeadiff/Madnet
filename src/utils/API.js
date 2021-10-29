import {
  API_AUTH,
  API_REST_URL,
  API_BASE_URL,
  DEFAULT_USER_AUTH
} from './Constants'
import { getStoredUser, setStoredUser } from './Helpers'

const api = {
  rest: async (url, method, params, options) => {
    const default_options = {
      auth: 'basic', // or 'jwt' - but jwt is giving me issues on the server.
      type: 'default'
    }
    options = { ...default_options, ...options }

    if (url[0] === '/') url = url.substring(1) // Sometimes the argument url might have a '/' at the start. Causes an error.
    let response = {}

    let call_headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${API_AUTH.base64}`
    }

    const user = getStoredUser()
    if (user.jwt_token && options.auth !== 'basic') {
      call_headers.Authorization = `Bearer ${user.jwt_token}`
    }

    response = await fetch(API_REST_URL + url, {
      method: method,
      headers: call_headers,
      body: params ? JSON.stringify(params) : undefined
    })
    if (response.ok) {
      // If its a delete call, it might have no return.
      let response_text = await response.text()
      if (response_text) {
        let data = JSON.parse(response_text)
        if (data && data.status === 'success') return data.data
      } else {
        if (method === 'delete') return true
      }
    } else {
      let response_text = await response.text()
      let data = {}
      if (response_text) data = JSON.parse(response_text)

      if (data.status === 'fail') {
        if (data.data[0] === 'Token is Expired') {
          if (options.type === 'token-refresh-attempt') {
            // To make sure we don't go into a recursive loop
            console.error(
              'Token has expried and refresh attempt failed. Please logout and log back in'
            )
            throw 'Token has expried and refresh attempt failed'
          }
          let user = await api.refreshJwtToken()
          if (user) {
            return await api.rest(url, method, params, {
              type: 'token-refresh-attempt'
            })
          }
        }
        throw data.data
      } else if (data) throw data
      else throw response
    }

    return false
  },

  graphql: async (query, type, options) => {
    const default_options = {
      auth: 'basic', // or 'jwt' - but jwt is giving me issues on the server.
      type: 'default'
    }
    options = { ...default_options, ...options }

    if (type === undefined) type = 'query' // WHY IS THERE THE type HERE?! query vs mutation ? :TODO:

    let call_headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${API_AUTH.base64}`
    }

    const user = getStoredUser()
    if (user.jwt_token && options.auth !== 'basic') {
      call_headers.Authorization = `Bearer ${user.jwt_token}`
    }

    const response = await fetch(API_BASE_URL + 'graphql', {
      method: 'POST',
      headers: call_headers,
      body: JSON.stringify({ query: query })
    })
    let data = await response.json()

    if (response.ok) {
      if (data && data.data !== undefined) return data.data
    } else {
      if (data.status === 'fail') {
        if (data.data[0] === 'Token is Expired') {
          if (options.type === 'token-refresh-attempt') {
            // To make sure we don't go into a recursive loop
            console.error(
              'Token has expried and refresh attempt failed. Please logout and log back in'
            )
            throw 'Token has expried and refresh attempt failed'
          }
          let user = await api.refreshJwtToken()
          if (user) {
            return await api.graphql(query, 'query', {
              type: 'token-refresh-attempt'
            }) // Dangerous. Could lead to loop.
          }
        } else {
          throw data.data
        }
      }
    }

    return false
  },

  refreshJwtToken: async () => {
    const user = getStoredUser()
    let data = DEFAULT_USER_AUTH
    try {
      data = await api.rest(
        `users/login?identifier=${user.email}&auth_token=${user.auth_token}`,
        'post',
        null,
        { auth: 'basic' }
      )
      if (data) setStoredUser(data)
    } catch (e) {
      console.log(e)
    }

    return data
  }
}

export default api
