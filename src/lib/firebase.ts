// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxNZLUHzU090XHEcPGxo6CmZvQz2nF_UY",
  authDomain: "smarted-ff5e5.firebaseapp.com",
  projectId: "smarted-ff5e5",
  storageBucket: "smarted-ff5e5.firebasestorage.app",
  messagingSenderId: "14690948559",
  appId: "1:14690948559:web:3a9ad1497ef8814745aeba",
  measurementId: "G-3S93CN94JW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Connect to emulators in development (optional)
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

export { analytics };
export default app;