#  Manas+ — AI Health Companion

**Manas+** is a full-stack AI-powered health companion built with **React, Node.js, Firebase**, and **LLaMA 3 (via Ollama)**.  
It combines empathetic AI chat, health monitoring features, user profiles, and a clean modern UI — designed for extensibility with authentication, subscriptions, and real-world deployment in mind.

---

##  Features

-  **AI Chat Assistant** — Friendly, empathetic health conversations  
-  **LLaMA 3 (Ollama)** — Local AI inference (no external API keys required)  
-  **Authentication System (Temporary)**  
  - Admin login (full access)  
  - Guest mode (limited access)  
-  **Feature Locking for Guests** — Only Chat & Profile accessible  
-  **Professional Profile Page** — Account type, plan, billing placeholders  
-  **Subscription Flow (UI Ready)** — Payment page placeholder  
-  **Chat History & Profiles** — Firebase-ready backend structure  
-  **Modern UI** — React + TailwindCSS + Lucide icons  

---

##  Authentication (Testing Only)

>  **Temporary hard-coded auth for development & UI testing**

### Admin Login
```
Username: admin
Password: admin123
```

### Guest Mode
- Click **“Continue without account”**
- Access limited to:
  -  Chat
  -  Profile
- Other features redirect to **Subscription Required** page

>  This will later be replaced with Firebase Auth / Clerk.

---

##  Setup Instructions

###  Step 1: Prerequisites

| Tool | Version |
|-----|--------|
| Node.js | ≥ 18.x |
| Ollama | Latest |
| Git | Latest |
| Firebase Project | Any |

---

###  Step 2: Install & Run LLaMA 3

```bash
ollama pull llama3
ollama serve
```

Keep Ollama running — it powers the Manas+ AI backend.

---

###  Step 3: Firebase Setup (Backend Ready)

1. Firebase Console → Project Settings → Service Accounts  
2. Generate **Admin SDK private key**
3. Place the file at:
   ```
   backend/manas-plus-firebase-adminsdk.json
   ```
4. Add to `.gitignore`:
   ```
   backend/manas-plus-firebase-adminsdk.json
   .env
   ```

---

###  Step 4: Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs at:
```
http://localhost:5000
```

---

###  Step 5: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:
```
http://localhost:5173
```

---

##  Project Structure (Simplified)

```
manas-plus-project/
│
├── backend/
│   ├── server.js                       # Node.js + Firebase + Ollama backend
│   ├── package.json
│   └── manas-plus-firebase-adminsdk.json (local only) 
│
├── frontend/
│   ├── src/
│   │   ├── components/                 # Sidebar, Nav buttons, UI components
│   │   ├── pages/                      # Chat, Profile, Auth, Payment, etc.
│   │   └── App.jsx                     # App shell + auth + routing logic
│   ├── package.json
│   └── vite.config.js
│
├── run_server.bat                      # One-click backend + Ollama startup
├── .gitignore
└── README.md
```

---

##  Current Limitations

- Temporary hard-coded authentication
- Payment flow is UI-only
- Profile data is mock/local
- Firebase Auth integration planned

---

##  Live Frontend

 https://manas-plus.netlify.app/

---

##  Security Notes

- Never commit Firebase Admin SDK keys
- Ollama runs fully offline
- Development build of React is used

---

## ❤️ Credits

- AI Model — LLaMA 3 via Ollama  
- Frontend — React + TailwindCSS  
- Backend — Node.js + Express  
- Database — Firebase Firestore  

---

Built by Mayank Rana & Mukul
