<div align="center">
  <img src="./client/public/logo.jpeg" alt="CrewUp Logo" width="150" />
  <h1>🚀 CrewUp</h1>
  <p><strong>The Ultimate College Sports & Gaming Matchmaking Platform</strong></p>
</div>

<br/>

## 🎯 What is CrewUp?

CrewUp is an exclusive campus platform designed to connect college students for sports, gaming, and equipment sharing. No more begging in WhatsApp groups or struggling to find that 11th player for your cricket match or a 4th player for your BGMI squad.

With CrewUp, you can instantly:
- 🏏 **Create & Join Matches**: Host football matches, cricket nets, or VALORANT lobbies.
- 💬 **Live Squad Chat**: Automatically get placed into a real-time chat room with your teammates as soon as you join an activity.
- 🎮 **Gaming Profiles**: Show off your in-game IGNs and ranks.
- 🎒 **Borrow & Lend**: Request sports equipment (like a basketball or cricket bat) from peers on campus.
- 🔐 **Private Crews**: Host private lobbies with secret invite codes.
- 🔔 **Instant Notifications**: Get alerted when players join your match or request your equipment.

---

## 🛠️ Technology Stack

CrewUp is built using a modern, scalable, and fully responsive tech stack to deliver a premium user experience:

- **Frontend**: React 18, Vite, Tailwind CSS v3, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Real-time Engine**: Socket.io (for live chat and instant feed updates)
- **Authentication**: Clerk (Google OAuth & Email login)
- **UI & UX**: Lucide React Icons, React Hot Toast

---

## 📁 Project Structure

```text
CrewUp/
├── client/     # React frontend
│   ├── src/
│   │   ├── api/          # Axios API wrappers
│   │   ├── components/   # Reusable UI elements (Navbar, Cards, Chat)
│   │   ├── pages/        # Main route views (Feed, Dashboard, Landing)
│   │   └── contexts/     # Socket and Notification context providers
├── server/     # Node.js backend
│   ├── models/       # Mongoose schemas (User, Activity, Message, etc.)
│   ├── controllers/  # API route logic
│   ├── routes/       # Express route definitions
│   └── socket/       # Socket.io event handlers
└── README.md
```

---

## ⚖️ License & Copyright

**Copyright (c) 2026 Aakhil Shaik. All Rights Reserved.**

This project, including all of its source code, design assets, and documentation, is proprietary and strictly confidential. 

**No license is granted to any person or entity** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software in any capacity. Unauthorized copying, distribution, or modification of this project via any medium is strictly prohibited.
