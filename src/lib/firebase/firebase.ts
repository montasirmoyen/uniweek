// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "schedule-cb507.firebaseapp.com",
  projectId: "schedule-cb507",
  storageBucket: "schedule-cb507.firebasestorage.app",
  messagingSenderId: "926560276926",
  appId: "1:926560276926:web:06912c7ec42e5578bd69ef",
  measurementId: "G-4VZTB3XMTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);