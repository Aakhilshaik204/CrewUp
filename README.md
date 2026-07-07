<div align="center">
  <img src="./client/public/logo.jpeg" alt="CrewUp Logo" width="180" />
  <h1>🚀 CrewUp</h1>
  <p><strong>The Ultimate SRM AP Sports, Gaming & Equipment Matchmaking Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.x-blue.svg" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-green.svg" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-success.svg" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io-Realtime-black.svg" alt="Socket.io" />
    <img src="https://img.shields.io/badge/License-Proprietary-red.svg" alt="Proprietary License" />
  </p>
</div>

<br/>

## 📖 Table of Contents
- [About CrewUp](#-about-crewup)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Environment Variables](#-environment-variables)
- [API & Socket Overview](#-api--socket-overview)
- [License & Copyright](#-license--copyright)

---

## 🎯 About CrewUp

**CrewUp** is an exclusive, highly-interactive campus platform designed exclusively to connect SRM AP students for sports, gaming, and equipment sharing. It completely eliminates the friction of finding players on campus—no more begging in WhatsApp groups or struggling to find that 11th player for a cricket match or a 4th player for a BGMI squad.

---

## ✨ Key Features

### 🏏 1. Activity Hosting & Matchmaking
- **Create Activities**: Users can host sports matches (Cricket, Football, Basketball, etc.) or gaming lobbies (VALORANT, BGMI, FIFA).
- **Categorization**: Visual tags and emojis make scanning the Feed intuitive.
- **Player Limits**: Activities cap at a set number of players. Once full, the status updates to `Full` automatically.

### 💬 2. Live Squad Chat (Socket.io)
- **Instant Integration**: The moment a user joins an activity, they are granted access to a real-time, isolated chat room for that specific squad.
- **Rich Chat**: Chat UI features automatic scrolling, timestamping, and instant delivery without page reloads.

### 🎒 3. Peer-to-Peer Borrow & Lend (Equipment)
- **Equipment Requests**: Users can broadcast requests to the feed to borrow specific gear (e.g., "Need a Cricket Bat for 2 hours").
- **Acceptance Flow**: Other students can instantly accept the request to lend their item, creating a seamless micro-sharing economy on campus.

### 🎮 4. Gaming Profiles & Stats
- **In-Game Identifiers**: Gamers can attach their in-game IGNs (In-Game Names) and current Ranks to their profile.
- **Squad Clarity**: When joining a gaming lobby, the host can instantly see the rank and IGN of the people joining.

### 🔐 5. Private Crews
- **Secret Invite Codes**: Hosts can mark an activity as `Private`. Private activities do not show up on the public feed.
- **Direct Invites**: Only users with the 6-character unique alphanumeric invite code can join.

### 🔔 6. Real-time Notifications & Toast Alerts
- Live push notifications in the app navigation bar when someone joins your activity, requests your gear, or when an activity is starting soon.

---

## 🛠️ Technology Stack

CrewUp is built using a modern, scalable MERN-stack architecture enhanced with WebSockets:

### Frontend
- **Framework**: React 18 (Bootstrapped with Vite for instant HMR)
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion (page transitions, micro-interactions, layout animations)
- **Icons**: Lucide React
- **Authentication**: Clerk (Google OAuth, Email Magic Links)
- **Routing**: React Router v6

### Backend
- **Server**: Node.js & Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Real-time Engine**: Socket.io
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Cron Jobs**: Node-cron (for automated activity cleanups and status changes)

---

## 📂 Architecture & Folder Structure

```text
CrewUp/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets (3D icons, logo)
│   ├── src/
│   │   ├── api/                # Axios wrappers for modular API calls
│   │   ├── components/         # Reusable UI components
│   │   │   ├── activity/       # Activity cards and detail views
│   │   │   ├── common/         # Spinners, Skeletons, Modals
│   │   │   └── layout/         # Navbar, Footer, Bento Grids
│   │   ├── contexts/           # React Context (Socket.io, Notifications)
│   │   ├── hooks/              # Custom hooks (e.g., useSyncUser)
│   │   ├── pages/              # Primary Route Views
│   │   └── utils/              # Constants, helpers, date formatters
│   ├── index.css               # Tailwind directives
│   └── vite.config.js
│
├── server/                     # Backend API & WebSocket Server
│   ├── config/                 # Database initialization
│   ├── controllers/            # Core business logic for routes
│   ├── middleware/             # Auth guards (Clerk), Error Handlers, Admin checks
│   ├── models/                 # Mongoose Database Schemas
│   ├── routes/                 # Express REST endpoint definitions
│   ├── socket/                 # Socket.io event listeners & emitters
│   ├── utils/                  # Server-side helpers
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
# Navigate to the backend directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server (runs on port 5000)
npm run dev
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the Vite development server (runs on port 5173)
npm run dev
```

---

## 🔑 Environment Variables

To run this project, you will need to configure the following environment variables.

### `server/.env`
| Variable | Description |
|----------|-------------|
| `PORT` | The port the backend runs on (Default: 5000) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `CLERK_SECRET_KEY` | Secret Key from your Clerk Dashboard |
| `CLERK_PUBLISHABLE_KEY`| Publishable Key from your Clerk Dashboard |
| `CLIENT_URL` | URL of your frontend (Default: http://localhost:5173) |
| `NODE_ENV` | Set to `development` or `production` |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |

### `client/.env`
| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable Key from your Clerk Dashboard |
| `VITE_API_URL` | URL of your backend (Default: http://localhost:5000) |

---

## 📡 API & Socket Overview

### Core REST Endpoints
- **`GET /api/activities`**: Fetches paginated, filterable feed of activities.
- **`POST /api/activities`**: Creates a new activity.
- **`POST /api/activities/:id/join`**: Joins an activity and assigns a spot.
- **`GET /api/requests`**: Fetches the borrow/lend request feed.
- **`POST /api/requests`**: Broadcasts a new equipment request.
- **`PUT /api/requests/:id/status`**: Accepts or completes an equipment request.

### WebSocket Events
- **`join_activity`**: Connects a client to a specific activity's chat room.
- **`send_message`**: Emits a chat message to the room.
- **`receive_message`**: Listens for incoming chat messages in real-time.

---

## ⚖️ License & Copyright

**Copyright (c) 2026 Aakhil Shaik. All Rights Reserved.**

This project, including all of its source code, design assets, UI/UX concepts, and documentation, is proprietary and strictly confidential. 

**No license is granted to any person or entity** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software in any capacity. Unauthorized copying, distribution, or modification of this project or its files, via any medium, is strictly prohibited.
