import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "madamesoul-926f6",
  appId: "1:829664664972:web:053b4c40375cd27b26caa9",
  apiKey: "AIzaSyCUVqxJDiJlWpQIJeIscXz7sGFCQOsZn84",
  authDomain: "madamesoul-926f6.firebaseapp.com",
  messagingSenderId: "829664664972",
  measurementId: "G-FR79LF6KS6",
  storageBucket: "madamesoul-926f6.firebasestorage.app"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
