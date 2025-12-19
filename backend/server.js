// backend/server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import admin from "firebase-admin";
import fetch from "node-fetch";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Initialize Firebase using .env for safety
try {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./manas-plus-firebase-adminsdk.json";

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Firebase service account file not found at ${serviceAccountPath}`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  console.log("🔥 Connected to Firebase Firestore");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
}

const db = admin.firestore();
const chatsRef = db.collection("chats");
const profilesRef = db.collection("profiles");

const MODEL = "llama3:latest";
const OLLAMA_API = "http://localhost:11434/api/generate";
console.log("🤖 Connected model:", MODEL);

// ✅ Emoji-based text enhancer
function enhanceWithEmojis(text) {
  let t = text;

  t = t.replace(/\*\*(.*?)\*\*/g, "$1");
  t = t.replace(/\*(.*?)\*/g, "$1");

  t = t.replace(/\b(headache|pain|migraine)\b/gi, "😣 $1");
  t = t.replace(/\b(fever|temperature|flu)\b/gi, "🤒 $1");
  t = t.replace(/\b(stress|anxiety|tension)\b/gi, "😟 $1");
  t = t.replace(/\b(cough|cold)\b/gi, "🤧 $1");
  t = t.replace(/\b(water|hydrate|hydration)\b/gi, "💧 $1");
  t = t.replace(/\b(rest|sleep|relax)\b/gi, "😴 $1");
  t = t.replace(/\b(doctor|physician|medical help)\b/gi, "👩‍⚕️ $1");
  t = t.replace(/\b(medicine|medication|remedy|treatment)\b/gi, "💊 $1");
  t = t.replace(/\b(see a doctor|consult a doctor|seek medical)\b/gi, "⚕️ $1");
  t = t.replace(/\b(diet|food|nutrition)\b/gi, "🥗 $1");
  t = t.replace(/\b(exercise|walk|yoga)\b/gi, "🏃 $1");

  if (!t.trim().endsWith("❤️")) {
    t += "\n\n💚 Take care! I'm here if you want to discuss this further.";
  }

  return t;
}

// ✅ Main processing route
app.post("/api/process-text", async (req, res) => {
  const { userText, sessionId } = req.body;

  if (!userText || !sessionId) {
    return res.status(400).json({ error: "Missing userText or sessionId" });
  }

  // Quick greeting
  if (/^(hi|hello|hey|yo|good\s(morning|evening|afternoon))$/i.test(userText.trim())) {
    const greeting = "👋 Hello! I'm Manas+, your friendly health companion. How are you feeling today?";
    await chatsRef.add({ sessionId, userText, botReply: greeting, timestamp: Date.now() });
    return res.json({ type: "greeting", message: greeting });
  }

  try {
    console.log("🧠 Sending request to Ollama...");

    const response = await fetch(OLLAMA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: `You are Manas+, a caring healthcare assistant.
Write naturally (no markdown, no asterisks).
Be warm and friendly. Use short sentences. Add gentle reassurance.
Organize the response into:
1. Short intro sentence of empathy.
2. Probable causes (with simple bullet points).
3. Helpful remedies or lifestyle suggestions.
4. A clear note about when to see a doctor.

User: ${userText}
Response:`,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Invalid Ollama response or empty body.");
    }

    const rl = readline.createInterface({ input: response.body, crlfDelay: Infinity });
    let botReply = "";

    for await (const line of rl) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.response) botReply += json.response;
      } catch {
        // Ignore broken JSON chunks
      }
    }

    botReply = botReply.trim() || "I'm sorry, I couldn’t process that right now. Please try again.";
    const enhancedReply = enhanceWithEmojis(botReply);

    await chatsRef.add({
      sessionId,
      userText,
      botReply: enhancedReply,
      timestamp: Date.now(),
    });

    console.log("✅ Enhanced Reply:", enhancedReply.slice(0, 100) + "...");
    res.json({
      type: "medical",
      classification: "Health Guidance",
      remedies: [enhancedReply],
    });
  } catch (error) {
    console.error("❌ Ollama Error:", error);
    res.status(500).json({
      type: "error",
      classification: "Error",
      remedies: ["AI model not responding. Please ensure Ollama is running."],
    });
  }
});

// ✅ Fetch history
app.get("/api/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const snapshot = await chatsRef.where("sessionId", "==", sessionId).get();
    if (snapshot.empty) return res.json([]);
    const history = snapshot.docs.map((doc) => doc.data());
    res.json(history);
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json([]);
  }
});

// ✅ Profile routes
app.get("/api/profile/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const doc = await profilesRef.doc(sessionId).get();
    if (!doc.exists) return res.json(null);
    res.json(doc.data());
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

app.post("/api/profile/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const data = req.body;
  try {
    await profilesRef.doc(sessionId).set(data, { merge: true });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Profile save error:", err);
    res.status(500).json({ error: "Failed to save profile." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Manas+ backend running at http://localhost:${PORT}`));
