import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE,
  authDomain: "mooc-blockchain-cab9c.firebaseapp.com",
  projectId: "mooc-blockchain-cab9c",
  storageBucket: "mooc-blockchain-cab9c.firebasestorage.app",
  messagingSenderId: "897577086041",
  appId: "1:897577086041:web:a8780c5424c5184269d548",
  measurementId: "G-E8G97NE5K2",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
