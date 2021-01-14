importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js')

// NOTE: This is called from the root of the domain (makeadiff.in/firebase-messaing-sw.js) and redirected to this file using htaccess rewrite.

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyBMADdvkn0Avmq2_loScmoXdTf7m7LgNXk',
  authDomain: 'madnet-28ca4.firebaseapp.com',
  databaseURL: 'https://madnet-28ca4.firebaseio.com',
  projectId: 'madnet-28ca4',
  storageBucket: 'madnet-28ca4.appspot.com',
  messagingSenderId: '552143822852',
  appId: '1:552143822852:web:b4878a4f6cf344350b5551',
  measurementId: 'G-1Q23XLELJ9'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  // Customize notification here
  const notification_title = 'Background Message Title'
  const notification_options = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  }

  return self.registration.showNotification(
    notification_title,
    notification_options
  )
})
