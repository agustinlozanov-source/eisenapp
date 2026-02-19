import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtCbTZEmbN71Ys6-y2D9gMkOUVbWKXP5w",
  authDomain: "eisen-5d82f.firebaseapp.com",
  projectId: "eisen-5d82f",
  storageBucket: "eisen-5d82f.firebasestorage.app",
  messagingSenderId: "1044554126055",
  appId: "1:1044554126055:web:0fafc9ac16b1972a7b0842"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
