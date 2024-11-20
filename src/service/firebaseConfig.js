// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2hvOc_MRIgCA48zpOD7iMXOOwY5IkMe4",
  authDomain: "ai-travel-planner-e89e0.firebaseapp.com",
  projectId: "ai-travel-planner-e89e0",
  storageBucket: "ai-travel-planner-e89e0.firebasestorage.app",
  messagingSenderId: "741389131213",
  appId: "1:741389131213:web:23836a4a75b52fa7ddf884",
  measurementId: "G-XBYLCBY7FD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)