<div align="center">
  <img src="./client/public/logo.jpeg" alt="CrewUp Logo" width="150" style="border-radius: 20px; margin-bottom: 20px;" />
  <h1>🚀 CrewUp</h1>
  <p><strong>The Ultimate Campus Matchmaking Platform for Sports, Gaming & Gear</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-PWA-646CFF.svg?logo=vite&logoColor=white" alt="Vite PWA" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933.svg?logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io-Realtime-010101.svg?logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF.svg?logo=clerk&logoColor=white" alt="Clerk" />
  </p>
</div>

<br/>

## 📖 Table of Contents
- [About CrewUp](#-about-crewup)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [📂 Architecture & Folder Structure](#-architecture--folder-structure)
- [🚀 Getting Started](#-getting-started-local-development)
- [🔑 Environment Variables](#-environment-variables)
- [⚖️ License & Copyright](#-license--copyright)

---

## 🎯 About CrewUp

**CrewUp** is an exclusive, highly-interactive platform designed to connect SRM AP students for sports, gaming, and equipment sharing. It eliminates the friction of finding players on campus—no more begging in WhatsApp groups or struggling to find that 11th player for a cricket match or a 4th player for a BGMI squad.

Built as a lightning-fast **Progressive Web App (PWA)**, CrewUp feels like a native mobile application, complete with real-time sockets, rich chat, and push notifications.

---

## ✨ Key Features

### 🏏 1. Activity Hosting & Matchmaking
- **Create Activities**: Host sports matches (Cricket, Football, Basketball, etc.) or gaming lobbies (VALORANT, BGMI, FIFA).
- **Player Limits**: Activities cap at a set number of players. Once full, the status automatically updates to `Full`.
- **Private Crews**: Host secret events using 6-character alphanumeric invite codes.
- **WhatsApp Integration**: Deep-linked native web-sharing formatted perfectly for WhatsApp and Telegram.

### 💬 2. Live Squad Chat (Socket.io)
- **Instant Integration**: The moment a user joins an activity, they are granted access to a real-time, isolated chat room for that specific squad.
- **Rich Chat**: Chat UI features automatic scrolling, timestamping, and instant delivery without page reloads.

### 🎮 3. Gaming Profiles & Stats
- **In-Game Identifiers**: Gamers can attach their in-game IGNs (In-Game Names) and current Ranks to their profile.
- **Squad Clarity**: When joining a gaming lobby, the host can instantly see the rank and IGN of the people joining.

### 👑 4. Advanced Admin Dashboard
- **Total Moderation Control**: Admins can view all users, activities, and platform statistics.
- **Instant Ban Hammer**: Admins can instantly ban users. Banned users are aggressively logged out of their current active sessions globally via Clerk integration and blocked at the API level.

### 📱 5. Progressive Web App (PWA)
- **Installable**: Users can install CrewUp directly to their iOS/Android home screen.
- **Native Feel**: Features a custom branded splash screen, offline caching, and native OS share drawers.

### 🎒 6. Peer-to-Peer Borrow & Lend (Equipment)
- **Micro-Sharing Economy**: Users can broadcast requests to the feed to borrow specific gear (e.g., "Need a Cricket Bat for 2 hours"), which others can instantly accept.

---

## 🛠️ Technology Stack

CrewUp is built using a modern, scalable MERN-stack architecture enhanced with WebSockets:

**Frontend**
- **Framework**: React 18 (Bootstrapped with Vite for instant HMR)
- **PWA**: `vite-plugin-pwa` for manifest generation and service workers
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion (page transitions, micro-interactions)
- **Icons**: Lucide React
- **Authentication**: Clerk (Google OAuth, Email Magic Links)

**Backend**
- **Server**: Node.js & Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Real-time Engine**: Socket.io
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Cron Jobs**: Node-cron (for automated activity cleanups)

---

## 📂 Architecture & Folder Structure

```text
CrewUp/
├── client/                     # Frontend Vite + React + PWA Application
│   ├── public/                 # Static assets and PWA icons
│   ├── src/
│   │   ├── api/                # Axios interceptors (with auto-ban logout logic)
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React Context (Socket.io, Notifications)
│   │   ├── pages/              # Primary Route Views (Auth, Feed, Admin, etc.)
│   │   └── utils/              # Constants, helpers, formatting
│   ├── index.css               # Tailwind directives
│   └── vite.config.js          # Vite & PWA Manifest Configuration
│
├── server/                     # Backend API & WebSocket Server
│   ├── config/                 # Database initialization
│   ├── controllers/            # Core business logic (Admin, Activities, Users)
│   ├── middleware/             # Auth guards (Clerk Auth), Error Handlers
│   ├── models/                 # Mongoose Database Schemas
│   ├── routes/                 # Express REST endpoint definitions
│   ├── socket/                 # Socket.io event listeners & emitters
│   ├── cron.js                 # Scheduled background tasks
│   └── index.js                # Server entry point
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** cluster URI (e.g., MongoDB Atlas)
- **Clerk** account (for Authentication keys)

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Environment Variables

### `server/.env`
| Variable | Description |
|----------|-------------|
| `PORT` | The port the backend runs on (Default: 5000) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `CLERK_SECRET_KEY` | Secret Key from your Clerk Dashboard |
| `CLERK_PUBLISHABLE_KEY`| Publishable Key from your Clerk Dashboard |
| `CLIENT_URL` | URL of your frontend |
| `NODE_ENV` | Set to `development` or `production` |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |

### `client/.env`
| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable Key from your Clerk Dashboard |
| `VITE_API_URL` | URL of your backend |

---

## ⚖️ License & Copyright

**Copyright (c) 2026 Aakhil Shaik. All Rights Reserved.**

This project, including all of its source code, design assets, UI/UX concepts, and documentation, is proprietary and strictly confidential. 

**No license is granted to any person or entity** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software in any capacity. Unauthorized copying, distribution, or modification of this project or its files, via any medium, is strictly prohibited.
