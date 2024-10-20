importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyAgREgP0o0aZa1VRThhKKqXHgzl6xL8Zog",
  authDomain: "eduzona-ba7dd.firebaseapp.com",
  projectId: "eduzona-ba7dd",
  storageBucket: "eduzona-ba7dd.appspot.com",
  messagingSenderId: "761792972433",
  appId: "1:761792972433:web:5defaa01f3f73bcc916130",
  measurementId: "G-Y7D8QQ9JR0"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Recibido un mensaje en segundo plano: ', payload);
});

messaging.onMessage((payload) => {
  console.log('Mensaje recibido en primer plano: ', payload);
});
