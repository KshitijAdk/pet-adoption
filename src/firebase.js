// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "nayasathi-11075.firebaseapp.com",
    projectId: "nayasathi-11075",
    storageBucket: "nayasathi-11075.firebasestorage.app",
    messagingSenderId: "727794644219",
    appId: "1:727794644219:web:845edd63b16e4b8490ec5e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);