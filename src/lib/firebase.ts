import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// User's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCXOFaZxglMlTWN9W2T_EdF27oWmlZNYao",
  authDomain: "tools-app-9b1ef.firebaseapp.com",
  projectId: "tools-app-9b1ef",
  storageBucket: "tools-app-9b1ef.firebasestorage.app",
  messagingSenderId: "776357584654",
  appId: "1:776357584654:web:af805667706fd0caea415f",
  measurementId: "G-2CF1KMNB4M",
};

// Initialize Firebase (SSR safe)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Safe Analytics initialization for Next.js browser execution
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};
