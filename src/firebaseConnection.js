import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPK77n2T6_SBMqMUnyZJMCpTlOjPkIZ2w",
  authDomain: "curso-reactjs-b24f2.firebaseapp.com",
  projectId: "curso-reactjs-b24f2",
  storageBucket: "curso-reactjs-b24f2.appspot.com",
  messagingSenderId: "508759279719",
  appId: "1:508759279719:web:862a403506ace3b6deecc2",
  measurementId: "G-YE1FBF92EZ",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
export default firebase;
