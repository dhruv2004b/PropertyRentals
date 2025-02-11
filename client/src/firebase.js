// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "proplet-2025.firebaseapp.com",
  projectId: "proplet-2025",
  storageBucket: "proplet-2025.firebasestorage.app",
  messagingSenderId: "1035332038027",
  appId: "1:1035332038027:web:2918aa20496432a3f4d38e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);