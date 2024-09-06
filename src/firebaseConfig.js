import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAi0yK1g3k-aDUe9EU9mwTxkrpae6X9TaA",
  authDomain: "bistromanager-f4361.firebaseapp.com",
  projectId: "bistromanager-f4361",
  storageBucket: "bistromanager-f4361.appspot.com",
  messagingSenderId: "847661301202",
  appId: "1:847661301202:web:895860f8e7c2fede0e1c0b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { createUserWithEmailAndPassword };
