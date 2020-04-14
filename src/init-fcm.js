import * as firebase from "firebase/app"
import "firebase/messaging"
import 'firebase/auth'
import api from "./utils/API"
import { getStoredUser,setStoredUser } from "./utils/Helpers";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBMADdvkn0Avmq2_loScmoXdTf7m7LgNXk",
    authDomain: "madnet-28ca4.firebaseapp.com",
    databaseURL: "https://madnet-28ca4.firebaseio.com",
    projectId: "madnet-28ca4",
    storageBucket: "madnet-28ca4.appspot.com",
    messagingSenderId: "552143822852",
    appId: "1:552143822852:web:b4878a4f6cf344350b5551",
    measurementId: "G-1Q23XLELJ9"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
let messaging = false
try {
    messaging = firebase.messaging()
    messaging.usePublicVapidKey('BA9qJfeWPrqYdKAoQNsFaEGsyStR5YfPp99wWa-py6nmKKnU-6A0oGjHC4LDzwoAiAyps_LzkYnIyWXY8Hzm04k')
} catch (error) {
    console.error("Can't use Firebase SDK: " + error)
}

const requestPermission = async () => {
    if(!messaging) return

    messaging.requestPermission()
        .then(async () => {
            const token = await messaging.getToken()
            // Save token to Server against curret user. 
            // Using this raw format(rather than using DataContext or Auth context) because this file is not a React component - hence will not let us use contexts within in.
            const user = getStoredUser()
            console.log(user, token)
            if(user && user.id && user.token !== token) {
                api.rest(`users/${user.id}/devices/${token}`, "post")
                user['token'] = token
                setStoredUser(user)
            }
        })
        .catch(function(err) {
            console.log("Unable to get permission to notify.", err)
        });
}

const onMessage = (callback) => {
    if(!messaging) return
    navigator.serviceWorker.addEventListener("message", callback)
}

// // Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(() => {
//     messaging.getToken().then((refreshedToken) => {
//       console.log('Token refreshed.');

//       // Send Instance ID token to app server.
//       // sendTokenToServer(refreshedToken);
//     }).catch((err) => {
//       console.log('Unable to retrieve refreshed token ', err);
//     });
//   });

export { firebase, messaging, requestPermission, onMessage };
