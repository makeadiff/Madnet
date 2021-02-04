import { DEFAULT_USER_AUTH } from './Constants'

export const assets = (file) => {
  return `${process.env.PUBLIC_URL}/assets/${file}`
}

/** Return user auth from local storage value */
export const getStoredUser = () => {
  const user = window.localStorage.getItem('user')
  if (user) {
    return JSON.parse(user)
  }
  return DEFAULT_USER_AUTH
}
export const setStoredUser = (user_data) => {
  window.localStorage.setItem('user', JSON.stringify(user_data))
}

export const setCookie = (name, value, days) => {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
export const getCookie = (name) => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
export const eraseCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
