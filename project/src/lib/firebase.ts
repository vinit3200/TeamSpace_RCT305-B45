import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-4UnA6C-oYUQqP1GzEP9mag_3K7a-kbY",
  authDomain: "teamspace-2e971.firebaseapp.com",
  databaseURL: "https://teamspace-2e971-default-rtdb.firebaseio.com",
  projectId: "teamspace-2e971",
  storageBucket: "teamspace-2e971.firebasestorage.app",
  messagingSenderId: "1064551046748",
  appId: "1:1064551046748:web:a97c78c4bb59d8facdd099"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;