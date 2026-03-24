// ============================================================
// firebase.js — Firebase initialization and shared config
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjAc7J1jP0WQGdUxBYaEVPiD578QhWOvA",
  authDomain: "kyronesports.firebaseapp.com",
  projectId: "kyronesports",
  storageBucket: "kyronesports.firebasestorage.app",
  messagingSenderId: "548905478063",
  appId: "1:548905478063:web:382cd7412aca9fd532f15a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ============================================================
// FIRESTORE DATA STRUCTURE (for reference):
//
// /seasons/{seasonId}
//   - seasonName, game, createdAt
//
// /matches/{matchId}
//   - matchName, matchType, registrationLink,
//     matchDateTime, seasonId, game
//
// /registrations/{matchId}/entries/{entryId}
//   - SOLO: { playerName, playerUID }
//   - DUO/SQUAD: { teamName, players:[{name,uid,isLeader}] }
//
// /matchLeaderboards/{matchId}/entries/{entryId}
//   - SOLO: { playerName, playerUID, points }
//   - TEAM: { teamName, points }
//
// /seasonLeaderboards/{seasonId}/entries/{entryId}
//   - { playerName, playerUID, totalPoints, matchesPlayed }
//
// ============================================================
