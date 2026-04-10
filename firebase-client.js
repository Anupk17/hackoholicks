import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ── Correct project: obsidian-coach-002 ──────────────────────────────────────
const firebaseConfig = {
  projectId:         "obsidian-coach-002",
  appId:             "1:987172310335:web:049d1831bd65a4b666d78a",
  storageBucket:     "obsidian-coach-002.firebasestorage.app",
  apiKey:            "AIzaSyCnjVObw7aw56PYDT_mMZ1AXIdghH3R2GA",
  authDomain:        "obsidian-coach-002.firebaseapp.com",
  messagingSenderId: "987172310335"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth, db, googleProvider,
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut,
  doc, setDoc, getDoc
};
