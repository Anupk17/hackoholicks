import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  projectId: "geometry-dash-dc17e",
  appId: "1:637743799176:web:6ee411f78c8a9b08c5f83d",
  storageBucket: "geometry-dash-dc17e.firebasestorage.app",
  apiKey: "AIzaSyBpAaI2el84xWrKytb5qz-IKdz7DQYbaDc",
  authDomain: "geometry-dash-dc17e.firebaseapp.com",
  messagingSenderId: "637743799176",
  measurementId: "G-YGQB29VXRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, getDoc };
