import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBp7xVzUatjF5LGyRz-mp7a-iAuahqzXwU",
  authDomain: "spotify-3a93d.firebaseapp.com",
  databaseURL: "https://spotify-3a93d-default-rtdb.firebaseio.com",
  projectId: "spotify-3a93d",
  storageBucket: "spotify-3a93d.appspot.com",
  messagingSenderId: "525955868882",
  appId: "1:525955868882:web:26d3c8ce978f5d0761250b",
  measurementId: "G-S1JW7CN8D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const firebaseRealtimeDatabase = getDatabase(app)
const firebaseStorage = getStorage(app);

export {app, auth, firebaseRealtimeDatabase, firebaseStorage}