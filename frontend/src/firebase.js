// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: 'skillhub-7a72d.firebaseapp.com',
    projectId: 'skillhub-7a72d',
    storageBucket: 'skillhub-7a72d.appspot.com',
    messagingSenderId: '759124096182',
    appId: '1:759124096182:web:d00c34c7eb761bcbe06217',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);