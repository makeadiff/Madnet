let current_url = window.location.href

// Production Server.
let current_site_url = "https://makeadiff.in/"
let current_api_base_url = current_site_url + "api/"

if(current_url.includes("localhost")) {
    current_site_url = "https://makeadiff.in/"
    current_api_base_url = current_site_url + "api/"

} else if(current_url.includes("testing.makeadiff.in")) {
    current_site_url = "http://testing.makeadiff.in/"
    current_api_base_url = current_site_url + "api/"
}
// :TODO: Handle 192.168.* 

export const SITE_URL =  current_site_url
export const API_BASE_URL = current_api_base_url
export const API_REST_URL = API_BASE_URL + "v1/"
export const API_AUTH = {"username" : "data.simulation@makeadiff.in", "password" : "pass", "base64": "ZGF0YS5zaW11bGF0aW9uQG1ha2VhZGlmZi5pbjpwYXNz" }
export const DEFAULT_USER_AUTH = { "id" : 0, "email": "", "name": "", "phone": "" }
