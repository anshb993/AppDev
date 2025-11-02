// src/firebaseConfig.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnen2b3bN4oYJloz-nhufISznYInc8HNY",
  authDomain: "auth-e0e5a.firebaseapp.com",
  projectId: "auth-e0e5a",
  storageBucket: "auth-e0e5a.firebasestorage.app",
  messagingSenderId: "515009385847",
  appId: "1:515009385847:web:034e1c730334199a18bd72"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);