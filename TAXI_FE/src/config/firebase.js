 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6vstmtUnLy9okqwh18Lz-g4jCeoA9dFQ",
  authDomain: "taxibooking-64616.firebaseapp.com",
  projectId: "taxibooking-64616",
  storageBucket: "taxibooking-64616.appspot.com",
  messagingSenderId: "928787264501",
  appId: "1:928787264501:web:9fa3264040745405c5e6bc",
  measurementId: "G-ETV9NMFW9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export {storage, googleProvider};