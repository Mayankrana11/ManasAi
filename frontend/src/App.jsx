import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  History,
  User,
  UserCircle2,
  Activity,
  Pill,
  Dumbbell,
  Stethoscope,
  Users,
  AlertTriangle,
  Lock,
} from "lucide-react";

import NavButton from "./components/NavButton";

import ChatPage from "./pages/ChatPage";
import MonitorPage from "./pages/MonitorPage";
import PillPage from "./pages/PillPage";
import FitnessPage from "./pages/FitnessPage";
import DoctorPage from "./pages/DoctorPage";
import ElderPage from "./pages/ElderPage";
import EmergencyPage from "./pages/EmergencyPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";

import AuthPage from "./pages/AuthPage";
import PaymentPage from "./pages/PaymentPage";

export default function App() {
  const [page, setPage] = useState("chat");
  const [auth, setAuth] = useState(null); // null | admin | guest

  useEffect(() => {
    const savedAuth = localStorage.getItem("manas_auth");
    if (savedAuth) setAuth(savedAuth);
  }, []);

  /* ---------------- AUTH GATE ---------------- */
  if (!auth) {
    return <AuthPage onAuth={setAuth} />;
  }

  const isGuest = auth === "guest";

  // Only Chat & Profile allowed for guests
  const goOrPay = (target) => {
    if (isGuest && !["chat", "profile"].includes(target)) {
      setPage("payment");
    } else {
      setPage(target);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white to-green-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md flex flex-col justify-between p-6 border-r border-gray-100">
        <div>
          {/* Logo */}
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
            <NavButton
              label="Chat"
              icon={<MessageSquare size={20} />}
              active={page === "chat"}
              onClick={() => setPage("chat")}
            />

            <NavButton
              label="Monitor"
              icon={<Activity size={20} />}
              onClick={() => goOrPay("monitor")}
              locked={isGuest}
            />

            <NavButton
              label="Pill"
              icon={<Pill size={20} />}
              onClick={() => goOrPay("pill")}
              locked={isGuest}
            />

            <NavButton
              label="Fitness"
              icon={<Dumbbell size={20} />}
              onClick={() => goOrPay("fitness")}
              locked={isGuest}
            />

            <NavButton
              label="Doctor"
              icon={<Stethoscope size={20} />}
              onClick={() => goOrPay("doctor")}
              locked={isGuest}
            />

            <NavButton
              label="Elder"
              icon={<Users size={20} />}
              onClick={() => goOrPay("elder")}
              locked={isGuest}
            />

            <NavButton
              label="Emergency"
              icon={<AlertTriangle size={20} />}
              onClick={() => goOrPay("emergency")}
              locked={isGuest}
            />

            <NavButton
              label="History"
              icon={<History size={20} />}
              onClick={() => goOrPay("history")}
              locked={isGuest}
            />

            {/* ✅ Profile ALWAYS unlocked */}
            <NavButton
              label="Profile"
              icon={<User size={20} />}
              onClick={() => setPage("profile")}
              locked={false}
            />
          </nav>

          {/* Guest banner */}
          {isGuest && (
            <div className="mt-6 bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-gray-700 flex gap-2 items-center">
              <Lock size={16} />
              Guest mode — upgrade to unlock all features
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-green-50 rounded-lg text-sm flex items-center gap-2 text-gray-700 border border-green-100">
          <UserCircle2 className="text-green-600" size={18} />
          {isGuest ? "Guest Mode" : "Admin Access"}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-12 overflow-auto">
        {page === "chat" && <ChatPage />}
        {page === "monitor" && <MonitorPage />}
        {page === "pill" && <PillPage />}
        {page === "fitness" && <FitnessPage />}
        {page === "doctor" && <DoctorPage />}
        {page === "elder" && <ElderPage />}
        {page === "emergency" && <EmergencyPage />}
        {page === "history" && <HistoryPage />}
        {page === "profile" && <ProfilePage />}

        {page === "payment" && (
          <PaymentPage
            onBack={() => setPage("chat")}
            onLogin={() => {
              localStorage.removeItem("manas_auth");
              setAuth(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
