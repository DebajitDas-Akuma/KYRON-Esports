// ============================================================
// main.js — Public-facing logic for all user pages
// ============================================================

import { db } from "./firebase.js";
import {
  collection, query, where, orderBy, onSnapshot,
  doc, getDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Utility ──────────────────────────────────────────────────

export function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

export function formatDate(ts) {
  if (!ts) return "TBD";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function gameName(g) {
  return g === "freefire" ? "Free Fire" : "BGMI";
}

// ── Game Page ─────────────────────────────────────────────────

export function loadSeasons(game, container, emptyMsg) {
  const q = query(
    collection(db, "seasons"),
    where("game", "==", game),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, (snap) => {
    if (snap.empty) {
      container.innerHTML = emptyMsg || "<p class='text-gray-400'>No seasons yet.</p>";
      return;
    }
    container.innerHTML = snap.docs.map(d => seasonCard(d.id, d.data())).join("");
  });
}

function seasonCard(id, data) {
  return `
    <a href="season.html?id=${id}" class="season-card group block">
      <div class="card p-6 rounded-xl border border-neon/20 hover:border-neon/60 transition-all duration-300 hover:shadow-neon">
        <div class="flex items-center justify-between mb-3">
          <span class="badge">${gameName(data.game)}</span>
          <span class="text-xs text-gray-500">${formatDate(data.createdAt)}</span>
        </div>
        <h3 class="text-xl font-bold text-white group-hover:text-neon transition-colors">${data.seasonName}</h3>
        <p class="text-sm text-gray-400 mt-2">Click to view matches & leaderboard →</p>
      </div>
    </a>
  `;
}

// ── Season Page ───────────────────────────────────────────────

export function loadSeasonDetails(seasonId, nameEl, subtitleEl) {
  onSnapshot(doc(db, "seasons", seasonId), (snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    if (nameEl) nameEl.textContent = d.seasonName;
    if (subtitleEl) subtitleEl.textContent = gameName(d.game);
  });
}

export function loadMatches(seasonId, container) {
  const q = query(
    collection(db, "matches"),
    where("seasonId", "==", seasonId),
    orderBy("matchDateTime", "asc")
  );
  onSnapshot(q, (snap) => {
    if (snap.empty) {
      container.innerHTML = "<p class='text-gray-400'>No matches scheduled yet.</p>";
      return;
    }
    container.innerHTML = snap.docs.map(d => matchCard(d.id, d.data())).join("");
  });
}

function matchCard(id, data) {
  const typeColor = { solo: "text-cyan-400", duo: "text-purple-400", squad: "text-pink-400" };
  return `
    <a href="match.html?id=${id}" class="group block">
      <div class="card p-5 rounded-xl border border-white/10 hover:border-neon/50 transition-all duration-300 hover:shadow-neon">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-widest ${typeColor[data.matchType] || 'text-gray-400'}">${data.matchType}</span>
          <span class="text-xs text-gray-500">${formatDate(data.matchDateTime)}</span>
        </div>
        <h4 class="text-lg font-bold text-white group-hover:text-neon transition-colors">${data.matchName}</h4>
      </div>
    </a>
  `;
}

export function loadSeasonLeaderboard(seasonId, container, searchInput) {
  const q = query(
    collection(db, "seasonLeaderboards", seasonId, "entries"),
    orderBy("totalPoints", "desc")
  );
  let allEntries = [];

  onSnapshot(q, (snap) => {
    allEntries = snap.docs.map((d, i) => ({ ...d.data(), rank: i + 1 }));
    renderLeaderboard(allEntries, container);
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const val = searchInput.value.toLowerCase();
      const filtered = allEntries.filter(e =>
        e.playerName?.toLowerCase().includes(val) ||
        e.playerUID?.toLowerCase().includes(val)
      );
      renderLeaderboard(filtered, container, true);
    });
  }
}

function renderLeaderboard(entries, container, isFiltered = false) {
  if (!entries.length) {
    container.innerHTML = "<p class='text-gray-400'>No leaderboard data yet.</p>";
    return;
  }
  container.innerHTML = `
    <table class="w-full text-sm">
      <thead>
        <tr class="text-gray-400 border-b border-white/10">
          <th class="text-left py-2 px-3">#</th>
          <th class="text-left py-2 px-3">Player</th>
          <th class="text-left py-2 px-3">UID</th>
          <th class="text-right py-2 px-3">Points</th>
          <th class="text-right py-2 px-3">Matches</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map((e, i) => leaderRow(e, isFiltered ? i + 1 : e.rank)).join("")}
      </tbody>
    </table>
  `;
}

function leaderRow(e, rank) {
  const medals = ["🥇", "🥈", "🥉"];
  const highlight = rank <= 3 ? "top3" : "";
  return `
    <tr class="border-b border-white/5 ${highlight} hover:bg-white/5 transition-colors">
      <td class="py-3 px-3 font-bold ${rank <= 3 ? 'text-neon' : 'text-gray-400'}">
        ${rank <= 3 ? medals[rank - 1] : rank}
      </td>
      <td class="py-3 px-3 text-white font-medium">${e.playerName}</td>
      <td class="py-3 px-3 text-gray-400 font-mono text-xs">${e.playerUID}</td>
      <td class="py-3 px-3 text-right font-bold text-neon">${e.totalPoints}</td>
      <td class="py-3 px-3 text-right text-gray-400">${e.matchesPlayed}</td>
    </tr>
  `;
}

// ── Match Page ────────────────────────────────────────────────

export function loadMatchDetails(matchId, container) {
  onSnapshot(doc(db, "matches", matchId), (snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    const typeColor = { solo: "#22d3ee", duo: "#a78bfa", squad: "#f472b6" };
    container.innerHTML = `
      <div class="mb-6">
        <span class="badge mb-3 inline-block" style="color:${typeColor[d.matchType]};border-color:${typeColor[d.matchType]}40">
          ${d.matchType?.toUpperCase()}
        </span>
        <h1 class="text-3xl md:text-4xl font-black text-white mb-2">${d.matchName}</h1>
        <p class="text-gray-400">📅 ${formatDate(d.matchDateTime)}</p>
      </div>
      ${d.registrationLink ? `
        <a href="${d.registrationLink}" target="_blank"
          class="inline-block px-8 py-3 rounded-full font-bold text-black bg-neon hover:bg-neon/80 transition-all shadow-neon mb-8">
          Register Now ↗
        </a>` : ""}
    `;
    // Store match type for leaderboard rendering
    container.dataset.matchType = d.matchType;
  });
}

export function loadMatchLeaderboard(matchId, container, matchType) {
  const q = query(
    collection(db, "matchLeaderboards", matchId, "entries"),
    orderBy("points", "desc")
  );
  onSnapshot(q, (snap) => {
    if (snap.empty) {
      container.innerHTML = "<p class='text-gray-400'>Leaderboard not published yet.</p>";
      return;
    }
    const entries = snap.docs.map(d => d.data());
    if (matchType === "solo") {
      container.innerHTML = `
        <table class="w-full text-sm">
          <thead><tr class="text-gray-400 border-b border-white/10">
            <th class="text-left py-2 px-3">#</th>
            <th class="text-left py-2 px-3">Player</th>
            <th class="text-left py-2 px-3">UID</th>
            <th class="text-right py-2 px-3">Points</th>
          </tr></thead>
          <tbody>${entries.map((e, i) => `
            <tr class="border-b border-white/5 hover:bg-white/5 ${i < 3 ? 'top3' : ''}">
              <td class="py-3 px-3 font-bold ${i < 3 ? 'text-neon' : 'text-gray-400'}">${["🥇","🥈","🥉"][i] || i+1}</td>
              <td class="py-3 px-3 text-white">${e.playerName}</td>
              <td class="py-3 px-3 text-gray-400 font-mono text-xs">${e.playerUID}</td>
              <td class="py-3 px-3 text-right font-bold text-neon">${e.points}</td>
            </tr>`).join("")}
          </tbody>
        </table>`;
    } else {
      container.innerHTML = `
        <table class="w-full text-sm">
          <thead><tr class="text-gray-400 border-b border-white/10">
            <th class="text-left py-2 px-3">#</th>
            <th class="text-left py-2 px-3">Team</th>
            <th class="text-right py-2 px-3">Points</th>
          </tr></thead>
          <tbody>${entries.map((e, i) => `
            <tr class="border-b border-white/5 hover:bg-white/5 ${i < 3 ? 'top3' : ''}">
              <td class="py-3 px-3 font-bold ${i < 3 ? 'text-neon' : 'text-gray-400'}">${["🥇","🥈","🥉"][i] || i+1}</td>
              <td class="py-3 px-3 text-white">${e.teamName}</td>
              <td class="py-3 px-3 text-right font-bold text-neon">${e.points}</td>
            </tr>`).join("")}
          </tbody>
        </table>`;
    }
  });
}
