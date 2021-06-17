let current_url = window.location.href

// Production Server.
let current_site_url = "https://makeadiff.in/"
let current_api_base_url = current_site_url + "api/"

if(current_url.includes("localhost")) {
    current_site_url = "http://localhost/MAD/"
    // current_site_url = "http://testing.makeadiff.in/"
    current_api_base_url = current_site_url + "api/"

} else if(current_url.includes("testing.makeadiff.in")) {
    current_site_url = "http://testing.makeadiff.in/"
    current_api_base_url = current_site_url + "api/"
}
// :TODO: Handle 192.168.* 

export const GOOGLE_MAPS_API_TOKEN = 'AIzaSyCZls3ImNSUOUG6qqN7ANLHpAj3mzNXZy4'
export const SITE_URL =  current_site_url
export const API_BASE_URL = current_api_base_url
export const API_REST_URL = API_BASE_URL + "v1/"
export const API_AUTH = {"username" : "data.simulation@makeadiff.in", "password" : "pass", "base64": "ZGF0YS5zaW11bGF0aW9uQG1ha2VhZGlmZi5pbjpwYXNz" }
export const DEFAULT_USER_AUTH = { "id" : 0, "email": "", "name": "", "phone": "" }
export const PROJECT_IDS = { "ED": "1", "FP": "2", "TR_ASV": "4", "TR_WINGMAN": "5", "AFTERCARE": "6" }
export const PROJECT_KEYS = {1: "Ed", 2: "FP", 4: "TR ASV", 5: "TR Wingman", 6: "Aftercare" }

export const CITY_COORDINATES = {
    1: {
        name: 'Bangalore',
        lat: 12.9716,
        lng: 77.5946
    },
    26: { //Leadership is same as Bangalore.
        name: 'Bangalore',
        lat: 12.9716,
        lng: 77.5946
    },
    2: {
        name: 'Mangalore',
        lat: 12.9141,
        lng: 74.8560
    },
    3: {
        name: 'Trivandrum',
        lat: 8.5241,
        lng: 76.9366
    },
    4: {
        name: 'Mumbai',
        lat: 19.0760,
        lng: 72.8777
    },
    5: {
        name: 'Pune',
        lat: 18.5204,
        lng: 73.8567
    },
    6: {
        name: 'Chennai',
        lat: 13.0827,
        lng: 80.2707
    },
    8: {
        name: 'Vellore',
        lat: 12.9165,
        lng: 79.1325
    },
    10: {
        name: 'Cochin',
        lat: 9.9312,
        lng: 76.2673
    },
    11: {
        name: 'Hyderabad',
        lat: 17.3850,
        lng: 78.4867
    },
    12: {
        name: 'Delhi',
        lat: 28.7041,
        lng: 77.1025
    },
    13: {
        name: 'Chandigarh',
        lat: 30.7333,
        lng: 76.7794
    },
    14: {
        name: 'Kolkata',
        lat: 22.5726,
        lng: 88.3639
    },
    15: {
        name: 'Nagpur',
        lat: 21.1458,
        lng: 79.0882
    },
    16: {
        name: 'Coimbatore',
        lat: 11.0168,
        lng: 76.9558
    },
    17: {
        name: 'Vizag',
        lat: 17.6868,
        lng: 82.2185
    },
    18: {
        name: 'Vijayawada',
        lat: 16.5062,
        lng: 80.6480
    },
    19: {
        name: 'Gwalior',
        lat: 26.2183,
        lng: 78.1828
    },
    20: {
        name: 'Lucknow',
        lat: 26.8467,
        lng: 80.9462
    },
    21: {
        name: 'Bhopal',
        lat: 23.2599,
        lng: 77.4126
    },
    22: {
        name: 'Mysore',
        lat: 12.2958, 
        lng: 76.6394
    },
    23: {
        name: 'Guntur',
        lat: 16.3076,
        lng: 80.4365
    },
    24: {
        name: 'Ahmedabad',
        lat: 23.0225,
        lng: 72.5714
    },
    25: {
        name: 'Dehradun',
        lat: 30.3165,
        lng: 78.0322
    },
    0: {
        name: 'National',
        lat: 20.5937,
        lng: 78.9629
    }
}