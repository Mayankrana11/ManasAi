# 🩺 Manas+ — Your Personal Health Companion

**Manas+** is an AI-powered health assistant built with **React, Node.js, Firebase**, and **LLaMA 3 (via Ollama)**.  
It provides empathetic, emoji-rich health guidance, maintains chat history, and stores user profiles securely — all while being lightweight and offline-compatible.

---

## 🌸 Features

- 💬 **AI Chat** — Natural conversations with a warm, friendly tone.  
- 🧠 **LLaMA 3 (Ollama)** — Local AI inference, no external API keys needed.  
- 🔊 **Speech Recognition** — Hands-free interaction with auto-send.  
- 🕒 **Chat History** — Stored securely in Firebase Firestore.  
- 👤 **Profile Management** — Persistent user info and health score.  
- 🌐 **Responsive UI** — Built using React + TailwindCSS.  
- 🖥️ **One-Click Startup** — Batch script to launch backend + AI automatically.  

---

## ⚙️ **Setup Instructions**

### 🪄 Step 1: Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|----------|-----------|
| **Node.js** | ≥ 18.x | [https://nodejs.org](https://nodejs.org) |
| **Ollama** | Latest | [https://ollama.com/download](https://ollama.com/download) |
| **Git** | Latest | [https://git-scm.com/downloads](https://git-scm.com/downloads) |
| **Firebase Project** | Any | [https://console.firebase.google.com](https://console.firebase.google.com) |

---

### 🤖 Step 2: Install & Run **LLaMA 3** Model

After installing Ollama, open a terminal and run:

ollama pull llama3


Then to start the Ollama service:

ollama serve


Keep this running — it powers the Manas+ AI backend.

---

### 🔥 Step 3: Firebase Setup

1. Go to your Firebase Console → **Project Settings → Service Accounts → Generate new private key**  
2. Download the JSON file (it will look like `yourproject-firebase-adminsdk.json`)  
3. Place it in your project under:
   ```
   /backend/manas-plus-firebase-adminsdk.json
   ```
4. Make sure your `.gitignore` includes:
   ```
   backend/manas-plus-firebase-adminsdk.json
   .env
   ```

---

### 🧠 Step 4: Backend Setup

In your terminal:
```bash
cd backend
npm install
node server.js
```

If Ollama is running, your backend will start at:
```
http://localhost:5000
```

---

### 💻 Step 5: Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Then open the local web app in your browser:
```
http://localhost:5173
```

---

## 🧩 **Quick Start (Recommended)**

If you don’t want to run commands manually, just double-click the batch file provided in the root directory:

```
start_manas_plus.bat
```

This will:
- ✅ Start Ollama service (if not running)
- ✅ Load the LLaMA 3 model
- ✅ Launch the backend server automatically  

Frontend is already hosted online (see below).

---

## 🌐 **Live Web App**

You can access the deployed frontend here:  
👉 **[ManasAi on Netlify](https://inspiring-melomakarona-ba2e01.netlify.app/)**  

---

## 🧱 **Project Structure**

```
manas-plus-project/
│
├── backend/
│   ├── server.js                # Node.js + Firebase + Ollama API backend
│   ├── manas-plus-firebase-adminsdk.json  # Firebase service key (local only)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── App.jsx              # React frontend (chat, history, profile)
│   ├── package.json
│   └── vite.config.js
│
├── start_manas_plus.bat         # One-click startup script
├── .gitignore                   # Keeps sensitive files private
└── README.md
```

---

## 🔐 **Security Notes**

- ⚠️ Never upload `manas-plus-firebase-adminsdk.json` or `.env` to GitHub.  
- 🔒 Firestore is protected via Firebase rules — only Manas+ can read/write securely.  
- 🧠 Ollama runs entirely offline — no data leaves your device.

---

## ❤️ **Credits**

- 🧠 AI Model — [LLaMA 3](https://ollama.com/library/llama3) via Ollama  
- ☁️ Database — [Firebase Firestore](https://firebase.google.com/)  
- ⚛️ Frontend — [React + TailwindCSS](https://react.dev/)  
- 🧩 Backend — Node.js + Express  

---

✨ *Built with care by Mayank Rana & Mukul*
