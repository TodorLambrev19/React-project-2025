import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";            
import { getFirestore } from "firebase/firestore";  

const firebaseConfig = {
  apiKey: "AIzaSyDYWMaEm2otvHfU62twIEiA6y1iAMsZZjQ",
  authDomain: "react-project-2025-59ae4.firebaseapp.com",
  projectId: "react-project-2025-59ae4",
  storageBucket: "react-project-2025-59ae4.firebasestorage.app",
  messagingSenderId: "961048359426",
  appId: "1:961048359426:web:4aa6b5446a65e89005ed1b",
  measurementId: "G-N4GCK2BS6L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);