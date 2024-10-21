importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyAgREgP0o0aZa1VRThhKKqXHgzl6xL8Zog",
    authDomain: "eduzona-ba7dd.firebaseapp.com",
    projectId: "eduzona-ba7dd",
    storageBucket: "eduzona-ba7dd.appspot.com",
    messagingSenderId: "761792972433",
    appId: "1:761792972433:web:5defaa01f3f73bcc916130",
    measurementId: "G-Y7D8QQ9JR0"
  };
  
const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app)

messaging.onBackgroundMessage((payload) => {
  console.log('Mensaje recibido en segundo plano: ', payload)
  console.log(payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://labarbada.store/img/logo.png"
  }
  
  return self.registration.showNotification(notificationTitle, notificationOptions)
})