import { useState } from "react";
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

          <div className="mt-8 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-gray-600">
            <strong>Remember:</strong> Manas+ provides guidance, not diagnosis.
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg text-sm flex items-center gap-2 text-gray-700 border border-green-100">
          <UserCircle2 className="text-green-600" size={18} /> Your Health Journey
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
      </main>
    </div>
  );
}
