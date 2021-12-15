import * as React from 'react'
import { appContext } from './AppContext'
import { authContext } from './AuthContext'
import api from '../utils/API'

// This is the global store. Just didn't want to call it a store because I'm not sure if this is how to implement it.

export const dataContext = React.createContext({
  unsetLocalCache: () => {},
  getCacheByKey: () => {},
  callApi: () => {},
  getSurveyForm: () => {},
  setSurveyResponses: () => {},
  getUsers: () => {},
  updateUser: () => {},
  getAlerts: () => {},
  setDeviceToken: () => {},
  unsetDeviceToken: () => {},
  getEventTypes: () => {},
  deleteUser: () => {},
  getVerticals: () => {},
  getGroupTypes: () => {},
  setCache: () => {},
  clearLocalCache: () => {},
  cache: {}
})

const { Provider } = dataContext

const DataProvider = ({ children }) => {
  const {
    cache,
    setCache,
    unsetLocalCache,
    getCacheByKey,
    callApi,
    getSurveyForm,
    setSurveyResponses,
    getUsers,
    getAlerts,
    setDeviceToken,
    unsetDeviceToken,
    getEventTypes,
    updateUser,
    deleteUser,
    getVerticals,
    getGroupTypes,
    clearLocalCache
  } = useHandler()

  return (
    <Provider
      value={{
        cache,
        setCache,
        unsetLocalCache,
        getCacheByKey,
        callApi,
        getSurveyForm,
        setSurveyResponses,
        getUsers,
        getAlerts,
        setDeviceToken,
        unsetDeviceToken,
        getEventTypes,
        updateUser,
        deleteUser,
        getVerticals,
        getGroupTypes,
        clearLocalCache
      }}
    >
      {children}
    </Provider>
  )
}

const useHandler = () => {
  const { setLoading, showMessage } = React.useContext(appContext)
  const [error, setError] = React.useState([]) // eslint-disable-line
  const { user } = React.useContext(authContext)

  // Right now, this is used only to see if the data should be refreshed. There is a duplication here 
  // - the data is stored in this variable and in localstorage. For now, this can continue. If memory 
  // issues come, rather than storing the entire data, just store a flag. 1/0.
  const [cache, setCacheAll] = React.useState({}) 
  
  const setCache = (key, value) => {
    let new_cache = cache
    new_cache[key] = value
    setCacheAll(new_cache)
  }

  const getCacheKey = (type, key_seed, cache_key) => {
    if (cache_key) return cache_key

    let key = 'API:' + type + ':'
    if (type === 'rest') key += key_seed
    // URL is the final part of the key
    else if (type === 'graphql') {
      key += key_seed.replace(/\s+/g, ' ') // Compress the graphql string - and change all whitespace to ' '(space)
    }
    return key
  }

  const getLocalCache = (type, key_seed, cache_key) => {
    if (!cache_key) cache_key = getCacheKey(type, key_seed)
    const item_json = localStorage.getItem(cache_key)

    if (!item_json) {
      return null
    }

    const item = JSON.parse(item_json)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage and return null
      localStorage.removeItem(cache_key)
      setCache(cache_key, null)
      return null
    }

    setCache(cache_key, item.data)
    return item.data
  }

  const getCacheByKey = (cache_key) => {
    const item_json = localStorage.getItem(cache_key)
    if (!item_json) {
      return null
    }

    const item = JSON.parse(item_json)
    setCache(cache_key, item.data)
    return item.data
  }

  const setLocalCache = (type, key_seed, data, cache_key) => {
    const now = new Date()
    const item = {
      data: data,
      expiry: now.getTime() + 1000 * 60 * 60 * 24 // Expires in a day
    }
    const key = getCacheKey(type, key_seed, cache_key)
    setCache(key, data)
    window.localStorage.setItem(key, JSON.stringify(item))
  }

  const unsetLocalCache = (cache_key) => {
    setCache(cache_key, null)
    localStorage.removeItem(cache_key)
  }

  /*
   * Wrapper to make the API calls.
   * This function has a very aggressive cacching strategy that has and will create issues in the future - so documenting it in more detail.
   * Results of all API calls will be cached in localStorage unless explicitly told not to(using {cache: false} option.). 
   * The API call will be made ONLY if the data does not exist in the cache.
   * Examples
   * const data = await callApi({ url: '/users/1' })
   * const data = await callApi({ graphql: '{ user(ID: 1) { id name email } }' })
   */
  const callApi = async (user_args) => {
    const default_args = {
      url: '',
      type: 'rest',
      method: 'get',

      // POST parameters that should be passed to the API
      params: false,

      // GraphQL query string
      graphql: '', 

      // query or mutation. I don't think its used yet.
      graphql_type: 'query', 
      
      // If false, will not cache the results.
      cache: true, 

      // Human friendly name for the API call. Used in error messages.
      name: '', 

      // We'll use this to extract the correct info when api returns data. Eg. API will return 
      //  `{status:"success", data:{users: [ ... ]}}}` and the key is 'users', function will return just the 
      //  users: [ ... ] part of the data instead of the entire result.
      key: '', 
      
      // Name of the key used for caching in localStorage.
      cache_key: '', 
      
      // Setter function. If this is given, the function will automatically call the setter function with the 
      //  valid data. Eg: `callApi({url: '/users/1', setter: setUser})`
      setter: false
    }

    if (user_args.url !== undefined) {
      default_args['name'] = user_args.url.split(/[\/\?\(]/)[0] // eslint-disable-line
      default_args['key'] = default_args['name']
    } else if (user_args.graphql !== undefined) {
      default_args['type'] = 'graphql'
      default_args['name'] = user_args.graphql
        .split(/\s*\{\s*([^(]+)/)[0]
        .trim()
      default_args['key'] = default_args['name']
    } else {
      console.log('Dev Error: Unsupported call in callApi() - url or graphql must be given.')
    }

    let call_response
    const args = { ...default_args, ...user_args } // Merge both array - so that we have default values

    // See if it exists in Cache first.
    if (args.type === 'rest' && args.method === 'get' && args.cache === true) {
      let data = getLocalCache(args.type, args.url, args.cache_key)
      if (data) {
        if (typeof args.setter === 'function') args.setter.call({}, data)
        return data
      }
    } else if (
      args.type === 'graphql' &&
      args.graphql_type === 'query' &&
      args.cache === true
    ) {
      let data = getLocalCache(args.type, args.graphql, args.cache_key)
      if (data) {
        if (typeof args.setter === 'function') args.setter.call({}, data)
        return data
      }
    }

    setLoading(true)
    try {
      if (args.type === 'rest') {
        call_response = await api.rest(args.url, args.method, args.params)
      } else if (args.type === 'graphql') {
        call_response = await api.graphql(args.graphql, args.graphql_type)
      } else
        console.log('Dev Error: Unsupported type given in callApi({args.type})')
    } catch (e) {
      showMessage(
        `${args.name} ${args.method} call failed: ${e.message}`,
        'error'
      )
    }
    setLoading(false)

    let data = false
    if (call_response !== undefined && call_response[args.key] !== undefined) {
      data = call_response[args.key]
    } else if (
      call_response !== undefined &&
      Object.keys(call_response).length === 1
    ) {
      data = call_response[Object.keys(call_response)[0]]
    } else if (call_response !== undefined) {
      data = call_response
    } else {
      setError({
        status: 'warning',
        message: args.name + ' call failed',
        endpoint: args.url
      })
      showMessage(args.name + ' call failed', 'error')
      return false
    }

    // Save fetched data to cache.
    if (args.type === 'rest' && args.method === 'get' && args.cache === true) {
      setLocalCache(args.type, args.url, data, args.cache_key)
    } else if (
      args.type === 'graphql' &&
      args.graphql_type === 'query' &&
      args.cache === true
    ) {
      setLocalCache(args.type, args.graphql, data, args.cache_key)
    }

    if (typeof args.setter === 'function') args.setter.call({}, data)
    return data
  }

  const getSurveyForm = async (survey_id) => {
    const survey_response = await callApi({ url: `surveys/${survey_id}` })

    if (survey_response !== undefined) {
      let survey = survey_response
      const questions_response = await callApi({
        url: `survey_templates/${survey.survey_template_id}/categorized_questions`
      })

      if (questions_response !== undefined) {
        survey['questions'] = questions_response
        return survey
      } else {
        setError({
          status: 'warning',
          message: 'Survey Questions fetch call failed',
          endpoint: `survey_templates/${survey.survey_template_id}/categorized_questions`
        })
        return survey
      }
    } else {
      setError({
        status: 'error',
        message: 'Survey fetch call failed',
        endpoint: `surveys/${survey_id}`
      })
    }
    return false
  }

  const setSurveyResponses = async (survey_id, survey_responses) => {
    setLoading(true)
    const call_response = await api.rest(
      `surveys/${survey_id}/responses`,
      'post',
      survey_responses,
      user.jwt_token
    )
    setLoading(false)

    if (call_response) return true
    return false
  }

  const getUsers = async (params) => {
    let query_parts = []

    if (!params) {
      return await callApi({ url: '/users_paginated' })
    } else {
      for (let key in params) {
        let val = params[key]
        if (
          val.toString() === '0' &&
          key !== 'credit_lesser_than' &&
          key !== 'credit_greater_than'
        )
          continue

        if (Array.isArray(val)) val = val.join(',')
        query_parts.push(`${key}=${val}`)
      }

      return await callApi({
        url: `/users_paginated?${query_parts.join('&')}`,
        cache: true
      })
    }
  }

  const updateUser = async (user_id, params) => {
    return await callApi({
      url: `users/${user_id}`,
      method: 'post',
      params: params
    })
  }

  const deleteUser = async (user_id) => {
    return await callApi({
      url: `users/${user_id}`,
      method: 'delete'
    })
  }

  const getAlerts = async (user_id) => {
    if (user_id === undefined) user_id = user.id
    return await callApi({ url: `users/${user_id}/alerts` })
  }

  const getEventTypes = async () => {
    return await callApi({ url: `event_types` })
  }

  const setDeviceToken = async (token, user_id) => {
    if (user_id === undefined) user_id = user.id
    return await callApi({
      url: `users/${user_id}/devices/${token}`,
      method: 'post'
    })
  }

  const unsetDeviceToken = async (token, user_id) => {
    if (user_id === undefined) user_id = user.id
    const device_response = await api.rest(
      `users/${user_id}/devices/${token}`,
      'delete',
      {},
      user.jwt_token
    )

    if (device_response) return device_response
    return false
  }

  const getVerticals = async () => {
    return await callApi({ url: `verticals` })
  }

  const getGroupTypes = async () => {
    return await callApi({ url: `group_types` })
  }

  /// Clears all localStorage Cache except for the login/current user key
  const clearLocalCache = () => {
    console.log("Clearing local cache")
    const userData = window.localStorage.getItem('user')
    window.localStorage.clear()
    window.localStorage.setItem('user', userData)
  }

  return {
    callApi,
    getCacheByKey,
    unsetLocalCache,
    cache,
    setCache,
    getSurveyForm,
    setSurveyResponses,
    getUsers,
    updateUser,
    getAlerts,
    setDeviceToken,
    unsetDeviceToken,
    getEventTypes,
    deleteUser,
    getVerticals,
    getGroupTypes,
    clearLocalCache
  }
}

export default DataProvider
