# CrewUp — College Sports & Gaming Matchmaking Platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Clerk account (https://clerk.com)

---

## 📁 Project Structure

```
CrewUp/
├── client/     # React (Vite) + Tailwind CSS frontend
└── server/     # Node.js + Express + Socket.io backend
```

---

## ⚙️ Setup

### 1. Server Setup

```bash
cd server
copy .env.example .env    # Fill in your values
npm install
npm run dev
```

### 2. Client Setup

```bash
cd client
copy .env.example .env    # Fill in your values
npm install
npm run dev
```

---

## 🔑 Environment Variables

### `server/.env`
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLERK_SECRET_KEY` | From Clerk Dashboard → API Keys |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |

### `client/.env`
| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | From Clerk Dashboard → API Keys |
| `VITE_API_URL` | Backend URL (default: http://localhost:5000) |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| Auth | Clerk (Google + Email) |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Realtime | Socket.io |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | react-hot-toast |

---

## 📋 Development Phases

- [x] Phase 1 — Auth, Profile, Backend Setup
- [ ] Phase 2 — Activity System (auto-scaffolded)
- [ ] Phase 3 — Join/Leave, My Activities
- [ ] Phase 4 — Realtime Chat
- [ ] Phase 5 — Notifications & Waitlist
- [ ] Phase 6 — Admin Panel & Reports
- [ ] Phase 7 — Polish & Deployment

---

## 🚢 Deployment

- **Frontend**: Vercel — set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL` in Vercel env
- **Backend**: Render / Railway — set all `server/.env` variables
- **Database**: MongoDB Atlas (shared cluster)
