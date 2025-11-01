// src/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-5M1uAmHg1Mtys7X6kOcRLn6gy6lzuVc",
  authDomain: "fire-d9411.firebaseapp.com",
  projectId: "fire-d9411",
  storageBucket: "fire-d9411.firebasestorage.app",
  messagingSenderId: "649995942443",
  appId: "1:649995942443:web:2fc094a476b19524c5c86e",
  measurementId: "G-H7BK817MF6"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use new persistence API (non-deprecated)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
