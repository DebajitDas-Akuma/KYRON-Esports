import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    orderBy,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- ADDED AUTH IMPORTS ---
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjAc7J1jP0WQGdUxBYaEVPiD578QhWOvA",
    authDomain: "kyronesports.firebaseapp.com",
    projectId: "kyronesports",
    storageBucket: "kyronesports.firebasestorage.app",
    messagingSenderId: "548905478063",
    appId: "1:548905478063:web:382cd7412aca9fd532f15a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- AUTH INSTANCE ---
const auth = getAuth(app);

export {
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    query,
    orderBy,
    increment,
    // --- EXPORT AUTH FUNCTIONS ---
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword
};