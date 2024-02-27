// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAitNyVWEcaAur59qekoUl9JWev7wRqzvk",
  authDomain: "talk-mixer.firebaseapp.com",
  projectId: "talk-mixer",
  storageBucket: "talk-mixer.appspot.com",
  messagingSenderId: "585473538686",
  appId: "1:585473538686:web:2f9af40acf1cf85704b62f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig