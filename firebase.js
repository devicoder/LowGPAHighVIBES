// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore}from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxh-6lUsBnleQQwjirmLdx7Vouqsfiel0",
  authDomain: "hackathon2025-55f41.firebaseapp.com",
  projectId: "hackathon2025-55f41",
  storageBucket: "hackathon2025-55f41.firebasestorage.app",
  messagingSenderId: "376132306989",
  appId: "1:376132306989:web:1eeecb841bd44ac1ec10a4",
  measurementId: "G-XRC2GTJCJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);


export const storage = getStorage(app);
export { db, app };
