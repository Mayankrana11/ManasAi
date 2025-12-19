// src/AppDesktop.jsx
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
  Activity,
  Pill,
  Dumbbell,
  Stethoscope,
  Users,
  AlertTriangle,
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
            <NavButton label="Monitor" icon={<Activity size={20} />} active={page === "monitor"} onClick={() => setPage("monitor")} />
            <NavButton label="Pill" icon={<Pill size={20} />} active={page === "pill"} onClick={() => setPage("pill")} />
            <NavButton label="Fitness" icon={<Dumbbell size={20} />} active={page === "fitness"} onClick={() => setPage("fitness")} />
            <NavButton label="Doctor" icon={<Stethoscope size={20} />} active={page === "doctor"} onClick={() => setPage("doctor")} />
            <NavButton label="Elder" icon={<Users size={20} />} active={page === "elder"} onClick={() => setPage("elder")} />
            <NavButton label="Emergency" icon={<AlertTriangle size={20} />} active={page === "emergency"} onClick={() => setPage("emergency")} />
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
        {page === "monitor" && <PlaceholderPage title="Monitor" />}
        {page === "pill" && <PlaceholderPage title="Pill" />}
        {page === "fitness" && <FitnessPage />}
        {page === "doctor" && <PlaceholderPage title="Doctor" />}
        {page === "elder" && <PlaceholderPage title="Elder" />}
        {page === "emergency" && <EmergencyPage />}
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

// ✅ Generic placeholder for upcoming pages
function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-md mb-6">
        <Heart size={40} className="text-white" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-3">{title} Page</h1>
      <p className="text-gray-500 text-lg">Coming soon — stay tuned for updates!</p>
    </div>
  );
}

// ✅ Fitness & Exercise Page
function FitnessPage() {
  const routines = [
    { icon: "🧘", title: "Yoga", desc: "Daily calm routine" },
    { icon: "🏃", title: "Cardio", desc: "Walking & running" },
    { icon: "💪", title: "Strength", desc: "Bodyweight workouts" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Fitness & Exercise
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {routines.map((r, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-3">{r.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{r.title}</h2>
            <p className="text-gray-500 text-sm">{r.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 mt-10 text-sm">
        Note: This preview is mocked — backend not connected.
      </p>
    </div>
  );
}


// ✅MAIN EMERGENCY PAGE✅
// --- imports (place at top of App.jsx if not already there) ---
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Define the hospital icon once
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// ✅ Emergency Page Component
function EmergencyPage() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utility: compute distance between two coordinates (in km)
  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ✅ Fetch location and nearby hospitals
  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported by this browser.");
        await fallbackToIP();
        return;
      }

      const watch = navigator.geolocation.watchPosition(
        async (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          await fetchHospitals(coords);
        },
        async (err) => {
          console.warn("GPS failed:", err.message);
          setError("Using approximate location (IP-based).");
          await fallbackToIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watch);
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const coords = { lat: data.latitude, lng: data.longitude };
        setLocation(coords);
        await fetchHospitals(coords);
      } catch (err) {
        setError("Unable to determine location.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHospitals = async (coords) => {
      try {
        const query = `
          [out:json];
          (
            node["amenity"="hospital"](around:5000,${coords.lat},${coords.lng});
            way["amenity"="hospital"](around:5000,${coords.lat},${coords.lng});
            relation["amenity"="hospital"](around:5000,${coords.lat},${coords.lng});
          );
          out center;
        `;
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });
        const data = await response.json();

        const results = data.elements
          .map((el) => ({
            name: el.tags.name || "Unnamed Hospital",
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon,
          }))
          .filter((h) => h.lat && h.lng)
          .map((h) => ({
            ...h,
            distance: calcDistance(coords.lat, coords.lng, h.lat, h.lng).toFixed(2),
          }));

        setHospitals(results.slice(0, 10));
        setLoading(false);
      } catch (err) {
        console.error("Overpass fetch error:", err);
        setError("Failed to fetch nearby hospitals.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-md relative">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Emergency Assistance
      </h1>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-10 flex-wrap">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition">
          🚑 Call Ambulance
        </button>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-3 rounded-full font-semibold text-lg shadow-md transition">
          🔔 Notify Family
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition">
          🩺 Notify Doctor
        </button>
      </div>

      {/* Status */}
      {loading && (
        <p className="text-center text-gray-500 mb-6">📍 Getting your live location...</p>
      )}
      {error && <p className="text-center text-red-500 mb-6">⚠️ {error}</p>}

      {/* Hospital Data + Map */}
      {location && !loading && (
        <div className="space-y-6">
          {/* Hospital list */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏥 Nearby Hospitals
            </h2>

            {hospitals.length === 0 ? (
              <p className="text-gray-500">No hospitals found nearby.</p>
            ) : (
              <ul className="text-gray-600 space-y-2 text-base">
                {hospitals.map((h, i) => (
                  <li key={i}>
                    {h.name} — <span className="text-gray-400">{h.distance} km away</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Live Map */}
          <div className="h-[350px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location */}
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>

              {/* Hospitals */}
              {hospitals.map((h, i) => (
                <Marker key={i} position={[h.lat, h.lng]} icon={hospitalIcon}>
                  <Popup>
                    {h.name} <br />
                    {h.distance} km away
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Floating SOS button */}
      <button className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-lg transition">
        SOS
      </button>
    </div>
  );
}

// ✅ Chat Page (unchanged)
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

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

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
        if (transcript.trim()) handleVoiceSend(transcript.trim());
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

      if (data.type === "greeting")
        setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      else if (data.type === "medical")
        setMessages((prev) => [...prev, { sender: "bot", text: data.remedies?.[0] || "No response" }]);
      else
        setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Unexpected response from backend." }]);
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
          <p className="text-gray-500">Your compassionate health companion — available 24/7</p>
        </div>
        <button
          className="bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200"
          onClick={() => setMessages([])}
        >
          New Conversation
        </button>
      </div>

      {messages.length === 0 ? (
        <StartingUI />
      ) : (
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
          <p className="text-gray-700 text-sm font-medium mb-2">Listening...</p>
          <p className="text-gray-500 text-xs italic text-center max-w-xs">
            {spokenText || "Speak now..."}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center bg-white border-2 border-green-100 rounded-full shadow-lg px-4 py-2 relative">
        <button
          className={`p-2 transition ${listening ? "text-green-600" : "text-gray-500 hover:text-green-600"}`}
          onClick={toggleListening}
        >
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
    </div>
  );
}

// ✅ Starting UI Section Restored
function StartingUI() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1">
      {/* Center icon */}
      <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-md mb-6">
        <Heart size={40} className="text-white" />
      </div>

      {/* Headline */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Manas+</h2>
      <p className="text-gray-500 max-w-lg mb-10">
        Your trusted health companion. Share your symptoms and I’ll provide
        personalized, compassionate guidance with care and clarity.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 w-full max-w-3xl">
        <FeatureCard
          emoji="😷"
          title="Physical Health"
          desc="Headaches, fever, pain, injuries, and more"
        />
        <FeatureCard
          emoji="🧠"
          title="Mental Wellness"
          desc="Stress, anxiety, sleep issues, and emotional well-being"
        />
        <FeatureCard
          emoji="💊"
          title="Guidance & Care"
          desc="Home remedies, medicine info, and when to see a doctor"
        />
      </div>

      {/* Disclaimer note */}
      <div className="bg-blue-50 border border-blue-100 mt-10 p-5 rounded-xl text-left flex gap-3 items-start text-gray-700 max-w-3xl">
        <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
          i
        </div>
        <p className="text-sm">
          <strong>Important:</strong> Manas+ provides evidence-based health
          guidance, but not a diagnosis. For emergencies or serious symptoms,
          please contact a doctor or healthcare provider immediately.
        </p>
      </div>
    </div>
  );
}

// ✅ Helper for the cards
function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}


// ✅ HistoryPage and ProfilePage remain unchanged from your version
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
