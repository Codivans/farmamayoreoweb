// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4jTmlggSK7sAd0y57qNxypWGZXr-PDF4",
  authDomain: "farmamayoreoapp.firebaseapp.com",
  projectId: "farmamayoreoapp",
  storageBucket: "farmamayoreoapp.appspot.com",
  messagingSenderId: "475117055697",
  appId: "1:475117055697:web:80a7a0bbbff5b6597cdff0"
};

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app)

export {auth, db, storage};