// ============================================================
// auth.js — Authentication helpers
// ============================================================

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Sign in admin
export async function adminLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Sign out
export async function adminLogout() {
  return signOut(auth);
}

// Guard: redirect to login if not authenticated
export function requireAuth(redirectTo = "login.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// Get current user (returns null if not logged in)
export function getCurrentUser() {
  return auth.currentUser;
}

// Listen to auth state changes
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
