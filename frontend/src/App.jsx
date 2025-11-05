// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  History,
  User,
  UserCircle2,
  Send,
  Mic,
  Save,
} from "lucide-react";

export default function App() {
  const [page, setPage] = useState("chat");

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white to-green-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md flex flex-col justify-between p-6 border-r border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-green-400 to-blue-400 p-3 rounded-2xl shadow-md">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Manas+</h1>
              <p className="text-xs text-gray-500">Your Health Companion</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 text-lg">
            <NavButton label="Chat" icon={<MessageSquare size={20} />} active={page === "chat"} onClick={() => setPage("chat")} />
            <NavButton label="History" icon={<History size={20} />} active={page === "history"} onClick={() => setPage("history")} />
            <NavButton label="Profile" icon={<User size={20} />} active={page === "profile"} onClick={() => setPage("profile")} />
          </nav>

          <div className="mt-8 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-gray-600 leading-relaxed">
            <strong>Remember:</strong> Manas+ provides guidance, not diagnosis.
            Always consult a professional for serious concerns.
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg text-sm flex items-center gap-2 text-gray-700 border border-green-100">
          <UserCircle2 className="text-green-600" size={18} /> Your Health Journey
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-auto">
        {page === "chat" && <ChatPage />}
        {page === "history" && <HistoryPage />}
        {page === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}

function NavButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active
          ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800 font-semibold shadow-sm"
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      {icon} {label}
    </button>
  );
}

// ✅ Chat Page with Speech Recognition + Restored Starting UI
function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  const [sessionId] = useState(() => {
    let id = localStorage.getItem("manasSession");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("manasSession", id);
    }
    return id;
  });

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setSpokenText(transcript);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
        setListening(false);
        if (transcript.trim()) {
          handleVoiceSend(transcript.trim());
        }
      }, 1500);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleVoiceSend = (text) => {
    setInput(text);
    sendMessage(text);
    setSpokenText("");
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return alert("Speech recognition not supported.");
    if (!listening) {
      setSpokenText("");
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  const sendMessage = async (customText = null) => {
    const text = customText || input;
    if (!text.trim()) return;
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setMessages((prev) => [...prev, { sender: "bot", text: "Thinking..." }]);

    try {
      const res = await fetch("http://localhost:5000/api/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: text, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => prev.slice(0, -1));

      if (data.type === "greeting") {
        setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      } else if (data.type === "medical") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.remedies?.[0] || "No response" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Unexpected response from backend." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "⚠️ Backend not responding. Try again." },
      ]);
    }
  };

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[85vh] relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Chat with Manas+</h1>
          <p className="text-gray-500">
            Your compassionate health companion — available 24/7
          </p>
        </div>
        <button
          className="bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200"
          onClick={() => setMessages([])}
        >
          New Conversation
        </button>
      </div>

      {messages.length === 0 ? <StartingUI /> : (
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`my-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-lg text-lg shadow-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-green-400 to-blue-400 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {listening && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-green-200 rounded-xl p-5 w-[350px] flex flex-col items-center z-20">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-green-400 rounded-full animate-bounce"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
          <p className="text-gray-700 text-sm font-medium mb-2">Listening...</p>
          <p className="text-gray-500 text-xs italic text-center max-w-xs">
            {spokenText || "Speak now..."}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center bg-white border-2 border-green-100 rounded-full shadow-lg px-4 py-2 relative">
        <button className={`p-2 transition ${listening ? "text-green-600" : "text-gray-500 hover:text-green-600"}`} onClick={toggleListening}>
          <Mic size={20} />
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Describe your symptoms or health concern..."
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-gray-700 px-3 py-2 overflow-y-auto"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 flex items-center gap-2"
        >
          <Send size={18} />
        </button>
      </div>

      <p className="text-center text-gray-400 mt-2 text-sm">
        Press Enter to send • Shift+Enter for new line
      </p>
    </div>
  );
}

// ✅ Starting UI Section Restored
function StartingUI() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1">
      <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-md mb-6">
        <Heart size={40} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Manas+</h2>
      <p className="text-gray-500 max-w-lg mb-10">
        Your trusted health companion. Share your symptoms and I’ll provide
        personalized, compassionate guidance with care and clarity.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-4 w-full max-w-3xl">
        <FeatureCard emoji="😷" title="Physical Health" desc="Headaches, fever, pain, injuries, and more" />
        <FeatureCard emoji="🧠" title="Mental Wellness" desc="Stress, anxiety, sleep issues, and emotional well-being" />
        <FeatureCard emoji="💊" title="Guidance & Care" desc="Home remedies, medicine info, and when to see a doctor" />
      </div>

      <div className="bg-blue-50 border border-blue-100 mt-10 p-5 rounded-xl text-left flex gap-3 items-start text-gray-700 max-w-3xl">
        <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
          i
        </div>
        <p className="text-sm">
          <strong>Important:</strong> Manas+ provides evidence-based health guidance,
          but not a diagnosis. For emergencies or serious symptoms, please contact a
          doctor or healthcare provider immediately.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ✅ History Page & Profile Page remain unchanged
function HistoryPage() {
  const [history, setHistory] = useState([]);
  const sessionId = localStorage.getItem("manasSession");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(`http://localhost:5000/api/history/${sessionId}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    };
    fetchHistory();
  }, [sessionId]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Chat History</h1>
      {history.length === 0 ? (
        <p className="text-gray-500">No previous conversations yet.</p>
      ) : (
        <div className="space-y-6">
          {history.map((chat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="font-semibold text-gray-800">🧍 {chat.userText}</p>
              <p className="text-gray-600 mt-2 whitespace-pre-line">{chat.botReply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", age: "", healthScore: "" });
  const sessionId = localStorage.getItem("manasSession");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/profile/${sessionId}`);
      const data = await res.json();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [sessionId]);

  const saveProfile = async () => {
    await fetch(`http://localhost:5000/api/profile/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    alert("Profile saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Your Profile</h1>
      <div className="grid grid-cols-2 gap-6">
        {["name", "email", "age", "healthScore"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
              {field === "healthScore" ? "Health Score (%)" : field}
            </label>
            <input
              type={field === "age" || field === "healthScore" ? "number" : "text"}
              value={profile[field] || ""}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>
        ))}
      </div>
      <button
        onClick={saveProfile}
        className="mt-6 bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:opacity-90"
      >
        <Save size={18} /> Save Changes
      </button>
    </div>
  );
}
