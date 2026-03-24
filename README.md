# 🎮 KYRON Esports Tournament Website

A complete, production-ready esports tournament management platform for **Free Fire** and **BGMI**.

---

## 📁 Project Structure

```
kyron-esports/
├── index.html          — Home page (hero, game selection)
├── game.html           — Game page (lists all seasons for a game)
├── season.html         — Season page (matches + seasonal leaderboard)
├── match.html          — Match page (details + match leaderboard)
├── admin.html          — Admin panel (full management)
├── login.html          — Admin login page
│
├── firebase.js         — Firebase app initialization
├── auth.js             — Authentication helpers
├── main.js             — Public-facing logic
├── admin.js            — Admin panel logic
│
├── firebase.json       — Firebase Hosting config
└── firestore.rules     — Firestore security rules
```

---

## 🔥 Firestore Data Structure

```
/seasons/{seasonId}
  - seasonName (string)
  - game (string: "freefire" | "bgmi")
  - createdAt (timestamp)

/matches/{matchId}
  - matchName (string)
  - matchType (string: "solo" | "duo" | "squad")
  - registrationLink (string, optional)
  - matchDateTime (timestamp)
  - seasonId (string)
  - game (string)

/registrations/{matchId}/entries/{entryId}
  SOLO: { playerName, playerUID }
  TEAM: { teamName, players: [{name, uid, isLeader}] }

/matchLeaderboards/{matchId}/entries/{entryId}
  SOLO: { playerName, playerUID, points }
  TEAM: { teamName, points }

/seasonLeaderboards/{seasonId}/entries/{entryId}
  { playerName, playerUID, totalPoints, matchesPlayed }
```

---

## 🚀 Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **kyronesports**
3. Enable **Email/Password** authentication:
   - Authentication → Sign-in method → Email/Password → Enable

4. Create your admin account:
   - Authentication → Users → Add user
   - Enter your admin email + password

5. Set up Firestore:
   - Firestore Database → Create database → Production mode
   - Deploy security rules (see below)

### 2. Deploy Firestore Rules

```bash
firebase login
firebase deploy --only firestore:rules
```

### 3. Deploy to Firebase Hosting

```bash
firebase login
cd kyron-esports
firebase deploy --only hosting
```

### 4. Deploy to Netlify (Alternative)

- Drag the entire `kyron-esports` folder to [netlify.com/drop](https://app.netlify.com/drop)
- Done! (no server needed — all Firebase)

---

## 🔐 Admin Workflow

1. Go to `yoursite.com/login.html`
2. Log in with your admin email/password
3. You'll be redirected to `admin.html`

### Creating Content:
```
1. Select Game (Free Fire / BGMI)
2. Go to "Seasons" → Create Season
3. Click "Manage" on a season → Go to "Matches"
4. Create a match (with type: solo/duo/squad)
5. Click "Manage" on a match → Go to "Leaderboard"
6. Add registrations + enter match results
```

---

## 🌐 Public URL Structure

| Page | URL |
|------|-----|
| Home | `/index.html` |
| Free Fire | `/game.html?g=freefire` |
| BGMI | `/game.html?g=bgmi` |
| Season | `/season.html?id={seasonId}` |
| Match | `/match.html?id={matchId}` |
| Admin | `/admin.html` |
| Login | `/login.html` |

---

## ⚡ Features

- **Real-time updates** — Firestore `onSnapshot` listeners
- **Seasonal leaderboard** — Auto-aggregated from match results
- **Player search** — Search by name or UID in leaderboards
- **Top 3 highlighting** — 🥇🥈🥉 medals for top players
- **Sorted by points** — Descending order automatically
- **Mobile responsive** — Works on all screen sizes
- **Dark esports theme** — Neon accents, glow effects, grid backgrounds

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Neon | `#00f5ff` (cyan) |
| Secondary | `#7b2fff` (purple) |
| Background | `#050810` |
| Card | `#0d1117` |
| Font (Display) | Orbitron |
| Font (Body) | Rajdhani |
| Font (Code/UID) | JetBrains Mono |

---

## 📝 Notes

- Seasonal leaderboard is auto-updated when solo match results are entered
- For duo/squad matches, the team points are stored but not auto-aggregated to seasonal (admin can manually add)
- Registration link is external (Google Forms, etc.) — opened in new tab
- All public pages are read-only — no user accounts needed

---

*Built with Firebase + Vanilla JS + Tailwind CSS*
