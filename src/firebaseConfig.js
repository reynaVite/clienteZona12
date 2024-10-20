// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

 
const firebaseConfig = {
  apiKey: "AIzaSyAgREgP0o0aZa1VRThhKKqXHgzl6xL8Zog",
  authDomain: "eduzona-ba7dd.firebaseapp.com",
  projectId: "eduzona-ba7dd",
  storageBucket: "eduzona-ba7dd.appspot.com",
  messagingSenderId: "761792972433",
  appId: "1:761792972433:web:5defaa01f3f73bcc916130",
  measurementId: "G-Y7D8QQ9JR0"
};

 
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app; 