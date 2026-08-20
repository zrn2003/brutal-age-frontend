import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDe1ty1bfTJ2D0p__df2X2s_CzBluuDXrY",
  authDomain: "ab-s-marketplace.firebaseapp.com",
  projectId: "ab-s-marketplace",
  storageBucket: "ab-s-marketplace.firebasestorage.app",
  messagingSenderId: "911532067133",
  appId: "1:911532067133:web:16ceb2ccd48f82464d9d54",
  measurementId: "G-19JRHCP4KY"
};

// Initialize Firebase Web Client SDK
export const app = initializeApp(firebaseConfig);

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
