import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Search, Calendar, Clock, CheckCircle, MapPin, 
  Star, ChevronRight, Bell, Video, ClipboardList, User, AlertCircle, 
  Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Send, X, Trash2, ExternalLink
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------- Leaflet Marker Icon Fix ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------- Helper Functions ---------- */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(2);
};

const generateNextMonthDates = () => {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export default function DoctorConnect() {
  const [page, setPage] = useState("home"); 
  const [doctorType, setDoctorType] = useState(null);
  const [userLocation] = useState([28.6139, 77.209]); // Delhi Center
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // --- Global State for Manage Appointments ---
  const [myAppointments, setMyAppointments] = useState([
    { id: 'ap1', doctor: 'Dr. Aman Bansal', date: '2025-12-28', slot: '10:50', type: 'Video' },
    { id: 'ap2', doctor: 'Dr. Ankit Sharma', date: '2025-12-29', slot: '14:10', type: 'Clinic' }
  ]);

  // --- Booking States ---
  const [availableDates] = useState(generateNextMonthDates());
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [pendingSlot, setPendingSlot] = useState(null); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Consultation UI States ---
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'Doctor', text: 'Hello Mukul, ready for our session?' }]);

  const ALL_SLOTS = Array.from({ length: 36 }, (_, i) => {
    const hour = Math.floor(i / 6) + 10;
    const min = (i % 6) * 10;
    return `${hour}:${min === 0 ? '00' : min}`;
  });

  const SPECIALTIES = [
    { name: "General Physician", emoji: "🧑‍⚕️" }, { name: "Dermatologist", emoji: "🧴" },
    { name: "Neurologist", emoji: "🧠" }, { name: "Cardiologist", emoji: "❤️" },
    { name: "Pediatrician", emoji: "👶" }, { name: "Dentist", emoji: "🦷" }
  ];

  /* ---------- Expanded Database to Distinguish Doctors ---------- */
  const DOCTOR_DB = [
    { id: 1, name: "Dr. Aman Bansal", spec: "Neurologist", exp: "12 yrs", rating: 5.0, lat: 28.615, lng: 77.210 },
    { id: 2, name: "Dr. Kavita Reddy", spec: "Neurologist", exp: "15 yrs", rating: 4.9, lat: 28.650, lng: 77.180 },
    { id: 3, name: "Dr. Ankit Sharma", spec: "General Physician", exp: "8 yrs", rating: 4.8, lat: 28.630, lng: 77.220 },
    { id: 4, name: "Dr. Sunita Rao", spec: "General Physician", exp: "10 yrs", rating: 4.7, lat: 28.580, lng: 77.250 },
    { id: 5, name: "Dr. Neha Verma", spec: "Dermatologist", exp: "5 yrs", rating: 4.5, lat: 28.610, lng: 77.200 },
    { id: 6, name: "Dr. Rahul Sethi", spec: "Dermatologist", exp: "9 yrs", rating: 4.6, lat: 28.690, lng: 77.120 },
    { id: 7, name: "Dr. Rohit Gupta", spec: "Cardiologist", exp: "10 yrs", rating: 4.9, lat: 28.710, lng: 77.150 },
    { id: 8, name: "Dr. Meenakshi Iyer", spec: "Cardiologist", exp: "18 yrs", rating: 5.0, lat: 28.605, lng: 77.215 },
    { id: 9, name: "Dr. Sameer Khan", spec: "Pediatrician", exp: "15 yrs", rating: 4.7, lat: 28.650, lng: 77.240 },
    { id: 10, name: "Dr. Anjali Deshmukh", spec: "Pediatrician", exp: "11 yrs", rating: 4.8, lat: 28.618, lng: 77.205 },
    { id: 11, name: "Dr. Ishani Roy", spec: "Dentist", exp: "7 yrs", rating: 4.6, lat: 28.600, lng: 77.180 },
    { id: 12, name: "Dr. Vikas Oberoi", spec: "Dentist", exp: "14 yrs", rating: 4.9, lat: 28.640, lng: 77.210 }
  ];

  const handleCategorySelect = (type) => {
    setDoctorType(type);
    const filtered = DOCTOR_DB.filter(d => d.spec === type).map(doc => {
      const dist = calculateDistance(userLocation[0], userLocation[1], doc.lat, doc.lng);
      return { ...doc, distance: dist, isNearby: dist <= 5.0 };
    });
    setDoctors(filtered);
    setPage("doctors");
  };

  const handleConfirmBooking = () => {
    const newAppointment = { id: Date.now().toString(), doctor: selectedDoctor.name, date: selectedDate, slot: pendingSlot, type: 'Clinic' };
    setMyAppointments([...myAppointments, newAppointment]);
    setShowConfirmModal(false);
    setPage("manage");
  };

  /* ================= VIEW: MANAGE APPOINTMENTS ================= */
  if (page === "manage") {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-[#F8FAFC] min-h-screen">
        <header className="flex items-center gap-6 mb-10">
           <button onClick={() => setPage("home")} className="p-4 bg-white rounded-2xl shadow-sm hover:scale-110 transition"><ArrowLeft /></button>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Visits</h1>
        </header>
        <div className="space-y-6">
          {myAppointments.map(ap => (
            <div key={ap.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-3xl shadow-inner ${ap.type === 'Video' ? 'bg-purple-50' : 'bg-blue-50'}`}>{ap.type === 'Video' ? '🎥' : '🏥'}</div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{ap.doctor}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-slate-500 text-sm font-bold flex items-center gap-1"><Calendar size={14}/> {ap.date}</p>
                    <p className="text-blue-600 text-sm font-black flex items-center gap-1"><Clock size={14}/> {ap.slot}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {ap.type === 'Video' && <button onClick={() => setPage("consultation")} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-200">Join Call <ExternalLink size={16}/></button>}
                <button onClick={() => setMyAppointments(myAppointments.filter(item => item.id !== ap.id))} className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition shadow-sm"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= VIEW: VIDEO CONSULTATION ================= */
  if (page === "consultation") {
    return (
      <div className="fixed inset-0 bg-[#0F172A] z-[4000] flex flex-col font-sans">
        <div className="p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">AB</div>
             <div><h2 className="text-white font-black">Dr. Aman Bansal</h2><p className="text-green-400 text-xs font-bold animate-pulse">Live Session Ongoing</p></div>
           </div>
           <button onClick={() => setShowChat(!showChat)} className={`p-4 rounded-2xl transition ${showChat ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}><MessageSquare size={20}/></button>
        </div>
        <div className="flex-1 relative flex items-center justify-center p-6">
          <div className="w-full h-full max-w-5xl bg-slate-800 rounded-[40px] border border-white/5 flex items-center justify-center">
             {!isCamOn && <User size={100} className="text-slate-600" />}
             <div className="absolute top-8 right-8 w-48 h-64 bg-slate-900 rounded-3xl border-2 border-white/20 shadow-2xl flex items-center justify-center">
                <User size={32} className="text-slate-700" /><p className="absolute bottom-4 text-[10px] font-black text-white/50 tracking-widest">Mukul</p>
             </div>
          </div>
          {showChat && (
            <div className="absolute right-10 top-10 bottom-10 w-80 bg-white rounded-[40px] shadow-2xl flex flex-col animate-in slide-in-from-right">
               <div className="p-6 border-b flex justify-between items-center"><h3 className="font-black text-slate-800">Chat</h3><button onClick={() => setShowChat(false)} className="text-slate-400"><X size={20}/></button></div>
               <div className="flex-1 p-6 space-y-4 overflow-y-auto">{messages.map((m, i) => <div key={i} className={`p-4 rounded-2xl text-sm font-medium ${m.sender === 'Doctor' ? 'bg-slate-100 text-slate-700' : 'bg-blue-600 text-white self-end'}`}>{m.text}</div>)}</div>
            </div>
          )}
        </div>
        <div className="p-10 flex justify-center gap-6 bg-gradient-to-t from-black/50 to-transparent">
           <button onClick={() => setIsMicOn(!isMicOn)} className={`w-16 h-16 rounded-full flex items-center justify-center transition ${isMicOn ? 'bg-white/10 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/40'}`}>{isMicOn ? <Mic size={24}/> : <MicOff size={24}/>}</button>
           <button onClick={() => setIsCamOn(!isCamOn)} className={`w-16 h-16 rounded-full flex items-center justify-center transition ${isCamOn ? 'bg-white/10 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/40'}`}>{isCamOn ? <Video size={24}/> : <VideoOff size={24}/>}</button>
           <button onClick={() => setPage("manage")} className="w-20 h-16 bg-red-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-red-600/40 hover:bg-red-700 transition hover:w-24 font-bold tracking-tighter uppercase">Leave</button>
        </div>
      </div>
    );
  }

  /* ================= VIEW: BOOKING PAGE ================= */
  if (page === "booking") {
    const dailyBooked = myAppointments.filter(ap => ap.date === selectedDate).map(ap => ap.slot);
    return (
      <div className="max-w-5xl mx-auto p-6 bg-[#F9FAFB] min-h-screen">
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600"><AlertCircle size={40} /></div>
              <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Confirm Slot?</h2>
              <p className="text-center text-slate-500 mb-8 leading-relaxed italic text-sm">Book <span className="font-bold text-blue-600">{pendingSlot}</span> on <span className="font-bold text-slate-800">{selectedDate}</span>?</p>
              <div className="flex gap-4"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-500">Cancel</button><button onClick={handleConfirmBooking} className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200">Confirm</button></div>
            </div>
          </div>
        )}
        <button onClick={() => setPage("doctors")} className="flex items-center gap-2 text-slate-500 mb-6 font-bold hover:text-blue-600 transition"><ArrowLeft size={20} /> Back</button>
        <h1 className="text-3xl font-black text-slate-900 mb-8">🗓️ Appointment – {selectedDoctor?.name}</h1>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 mb-8">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Switch Appointment Date</label>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {availableDates.map(date => (
              <button key={date} onClick={() => setSelectedDate(date)} className={`px-8 py-4 rounded-2xl font-bold border transition-all ${selectedDate === date ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200'}`}>{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ALL_SLOTS.map((slot) => {
            const isBooked = dailyBooked.includes(slot) || (selectedDate === '2025-12-19' && ['10:50', '11:20', '14:10', '15:00'].includes(slot));
            return (<button key={slot} disabled={isBooked} onClick={() => { setPendingSlot(slot); setShowConfirmModal(true); }} className={`py-4 rounded-2xl font-black text-sm border transition-all ${isBooked ? 'bg-[#FEE2E2] text-[#EF4444] border-[#FECACA] cursor-not-allowed line-through' : 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] hover:scale-105 hover:shadow-md'}`}>{slot}</button>);
          })}
        </div>
      </div>
    );
  }

  /* ================= VIEW: DOCTORS LIST ================= */
  if (page === "doctors") {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-[#F9FAFB]">
        <button onClick={() => setPage("home")} className="p-3 bg-white rounded-full shadow-sm mb-6 hover:scale-110 transition"><ArrowLeft /></button>
        <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">📍 Available {doctorType}s</h1>
        <div className="rounded-[40px] overflow-hidden border-4 border-white shadow-2xl mb-12 h-[350px]">
          <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle center={userLocation} radius={5000} pathOptions={{ color: '#3b82f6', fillOpacity: 0.1 }} />
            {doctors.map(d => <Marker key={d.id} position={[d.lat, d.lng]}><Popup>{d.name}</Popup></Marker>)}
          </MapContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map(d => (
            <div key={d.id} className="bg-white p-6 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:bg-blue-50 transition">👨‍⚕️</div>
                  <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1"><Star size={14} fill="currentColor"/> {d.rating}</div>
                </div>
                <h2 className="font-black text-slate-900 text-lg mb-1">{d.name}</h2>
                <p className="text-slate-400 text-xs font-bold mb-4">🛡️ {d.exp} Experience</p>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${d.isNearby ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>{d.isNearby ? 'Nearby' : 'Out of Range'}</span>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-5">
                <div className="text-blue-600 font-black text-sm flex items-center gap-1"><MapPin size={16}/> {d.distance} km</div>
                <button onClick={() => { setSelectedDoctor(d); setPage("booking"); }} className="bg-[#FDE047] hover:bg-[#FACC15] px-6 py-3 rounded-2xl font-black text-sm transition flex items-center gap-1">Book <ChevronRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= VIEW: HOME DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
           <div><p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">HEALTH CONNECT</p><h1 className="text-5xl font-black text-slate-900 tracking-tight">Doctor Connect</h1></div>
           <button className="p-4 bg-white rounded-2xl shadow-sm text-slate-400"><Bell /></button>
        </header>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <button onClick={() => setPage("home")} className="bg-blue-600 p-12 rounded-[45px] shadow-2xl text-left text-white relative overflow-hidden group col-span-2">
            <div className="relative z-10"><div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-6 backdrop-blur-md">📅</div><h2 className="text-3xl font-black mb-3">Instant Booking</h2><p className="text-blue-100 opacity-90 text-lg">Book specialized doctors within a 5km radius.</p></div>
          </button>
          <div className="bg-white p-10 rounded-[45px] shadow-sm flex flex-col justify-center items-center text-center border">
             <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-4xl mb-6 text-yellow-500 animate-pulse"><Star fill="currentColor" size={40}/></div>
             <h3 className="font-black text-slate-800 text-xl tracking-tighter uppercase">Top Rated</h3>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <button onClick={() => setPage("manage")} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition group">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition shadow-inner"><ClipboardList /></div>
            <div className="text-left font-black text-slate-800 text-xl tracking-tight">Manage Appointments</div>
          </button>
          <button onClick={() => setPage("consultation")} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50 flex items-center gap-6 hover:shadow-xl transition group">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition shadow-inner"><Video /></div>
            <div className="text-left font-black text-slate-800 text-xl tracking-tight">Video / Chat Consult</div>
          </button>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-10 pl-6 border-l-8 border-blue-600 uppercase tracking-tighter underline decoration-blue-500 decoration-4 underline-offset-8">Quick Specialities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SPECIALTIES.map(cat => (
            <button key={cat.name} onClick={() => handleCategorySelect(cat.name)} className="bg-white p-8 rounded-[35px] border border-slate-50 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">{cat.emoji}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}