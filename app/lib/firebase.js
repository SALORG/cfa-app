import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDoO88HqET0VDE0iEod6qUuxy74ZYPkAWo",
  authDomain: "cfa-loginflow.firebaseapp.com",
  databaseURL: "https://cfa-loginflow-default-rtdb.firebaseio.com",
  projectId: "cfa-loginflow",
  storageBucket: "cfa-loginflow.firebasestorage.app",
  messagingSenderId: "1091159042087",
  appId: "1:1091159042087:web:0832d19285ef79d7518602",
  measurementId: "G-VR7Z1VFH3K",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
