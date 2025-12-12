import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";            // Добавихме това
import { getFirestore } from "firebase/firestore";  // Добавихме това

// Твоята конфигурация (вече е попълнена правилно)
const firebaseConfig = {
  apiKey: "AIzaSyDYWMaEm2otvHfU62twIEiA6y1iAMsZZjQ",
  authDomain: "react-project-2025-59ae4.firebaseapp.com",
  projectId: "react-project-2025-59ae4",
  storageBucket: "react-project-2025-59ae4.firebasestorage.app",
  messagingSenderId: "961048359426",
  appId: "1:961048359426:web:4aa6b5446a65e89005ed1b",
  measurementId: "G-N4GCK2BS6L"
};

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig);

// ВАЖНО: Експортване на услугите, за да ги ползваме в AuthContext
export const auth = getAuth(app);
export const db = getFirestore(app);