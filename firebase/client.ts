// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXaxi3blkKJa_G2sDrT85F6pu7TuoJQrs",
  authDomain: "prepwise-2a8a6.firebaseapp.com",
  projectId: "prepwise-2a8a6",
  storageBucket: "prepwise-2a8a6.firebasestorage.app",
  messagingSenderId: "570427541238",
  appId: "1:570427541238:web:aa7e542d4809b7c59f0ed7",
  measurementId: "G-JR9SFPZR33"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);