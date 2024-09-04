// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore}  from  'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmTibRQ-3NdFKsdmtE-X74FAhIsrVf8RE",
  authDomain: "smartbudget-58fca.firebaseapp.com",
  projectId: "smartbudget-58fca",
  storageBucket: "smartbudget-58fca.appspot.com",
  messagingSenderId: "449727751471",
  appId: "1:449727751471:web:e2bbf08559a4f466d52dda",
  measurementId: "G-P6MV7N9RZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
export default db;