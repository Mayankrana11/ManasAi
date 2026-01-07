import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, Search, Play, Clock, 
  Activity, Heart, Sparkles, ChevronRight 
} from "lucide-react";

/* ---------------- DATA CONFIGURATION ---------------- */
const WORKOUT_DATA = {
  pain: [
    { title: "Neck Pain", desc: "Relief & mobility exercises", id: "PLm_NMESlfZOfFJO01mxjp7Fhkual6TFEC", emoji: "🧠", type: "Therapy" },
    { title: "Shoulder Pain", desc: "Rotator cuff & shoulder relief", id: "PLm_NMESlfZOdcJo4RT2OcXunFCluzv4I_", emoji: "💪", type: "Therapy" },
    { title: "Upper Back Pain", desc: "Posture & thoracic relief", id: "PLm_NMESlfZOfzpCGchrkMF35kFgkPieFG", emoji: "🦴", type: "Therapy" },
    { title: "Lower Back Pain", desc: "Lumbar & spine care", id: "PLm_NMESlfZOdDfr4mZLK4Wv2SzXlVIFpg", emoji: "🧍", type: "Therapy" },
    { title: "Knee Pain", desc: "Joint stability & strength", id: "PLm_NMESlfZOdDdm7ah-4V6bsATHW-ZXMz", emoji: "🦵", type: "Therapy" },
    { title: "Hip Pain", desc: "Hip mobility & strength", id: "PLm_NMESlfZOf1tCX-PBpapsEXn8vhQf-S", emoji: "🦿", type: "Therapy" },
  ],
  cardio: [
    { title: "Low Impact Cardio", desc: "Gentle for beginners", id: "PLm_NMESlfZOfiRaspm8wz44l4vXcQKcIx", emoji: "🫀", type: "Cardio" },
    { title: "Walking Cardio", desc: "Step-focused brisk walking", id: "PLm_NMESlfZOd0bUfPB93k7tZHEnNpEPk0", emoji: "🚶", type: "Cardio" },
    { title: "Fat Burn", desc: "Metabolism boosting routines", id: "PLm_NMESlfZOcRjMfMeLtTv_R8yBkpceG6", emoji: "🔥", type: "Cardio" },
    { title: "Swimming", desc: "Full body low-impact", id: "PLm_NMESlfZOc8vJ2eYTA8hmjvVco5HtRe", emoji: "🏊", type: "Cardio" },
  ],
  yoga: [
    { title: "Surya Namaskar", desc: "Full body energy flow", id: "PLm_NMESlfZOcpo9hQsTdu3ctDOQqcaTmb", emoji: "🌞", type: "Yoga" },
    { title: "Tree Pose", desc: "Balance & focus", id: "A9OzH3kYvyU", emoji: "🌳", type: "Yoga" },
    { title: "Cobra Pose", desc: "Spine & posture", id: "qp1jcVFbXuE", emoji: "🐍", type: "Yoga" },
    { title: "Child’s Pose", desc: "Deep relaxation", id: "kH12QrSGedM", emoji: "🧎", type: "Yoga" },
  ]
};

export default function FitnessPage() {
  const [view, setView] = useState("main"); // main | category | playlist
  const [activeCat, setActiveCat] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search Logic
  const allItems = [...WORKOUT_DATA.pain, ...WORKOUT_DATA.cardio, ...WORKOUT_DATA.yoga];
  const filteredItems = useMemo(() => {
    return allItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleBack = () => {
    if (view === "playlist") setView("category");
    else setView("main");
  };

  /* ---------------- RENDER HELPERS ---------------- */
  
  const Card = ({ item, onClick }) => (
    <button
      onClick={onClick}
      className="group relative bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Activity size={64} />
      </div>
      <div className="text-4xl mb-4 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-green-50 transition-colors">
        {item.emoji}
      </div>
      <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
        {item.type}
      </span>
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        {item.title} <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
    </button>
  );

  /* ---------------- VIEWS ---------------- */

  // 1. MAIN DASHBOARD
  if (view === "main") {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-10 bg-slate-50 min-h-screen">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Wellness Hub <span className="text-green-500">.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Choose a routine that fits your body's needs today. From intense cardio to mindful healing.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search exercises (e.g. 'Back pain', 'Yoga')..."
            className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[24px] shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-green-400 outline-none text-slate-700 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {filteredItems.map((item, idx) => (
              <Card key={idx} item={item} onClick={() => { setActiveItem(item); setView("playlist"); }} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: 'yoga', label: 'Yoga & Flow', icon: <Sparkles className="text-amber-500" />, color: 'bg-amber-50', count: WORKOUT_DATA.yoga.length },
              { id: 'cardio', label: 'Cardio Blast', icon: <Heart className="text-red-500" />, color: 'bg-red-50', count: WORKOUT_DATA.cardio.length },
              { id: 'pain', label: 'Pain Relief', icon: <Activity className="text-blue-500" />, color: 'bg-blue-50', count: WORKOUT_DATA.pain.length },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCat(cat.id); setView("category"); }}
                className={`${cat.color} p-8 rounded-[32px] text-left hover:scale-[1.02] transition-transform shadow-sm group`}
              >
                <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-sm">{cat.icon}</div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">{cat.label}</h2>
                <p className="text-slate-600 font-medium mb-4">{cat.count} curated routines</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  EXPLORE <ArrowLeft className="rotate-180" size={16} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. CATEGORY LIST VIEW
  if (view === "category") {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-10 bg-white min-h-screen">
        <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition mb-10 text-sm uppercase tracking-widest">
          <ArrowLeft size={18} /> Back to Hub
        </button>
        
        <h2 className="text-4xl font-black text-slate-900 mb-10 capitalize">
          {activeCat} <span className="text-green-500">Playlists</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKOUT_DATA[activeCat].map((item, i) => (
            <Card key={i} item={item} onClick={() => { setActiveItem(item); setView("playlist"); }} />
          ))}
        </div>
      </div>
    );
  }

  // 3. VIDEO PLAYER VIEW
  if (view === "playlist" && activeItem) {
    const isSingleVideo = activeItem.id.length === 11;
    const embedUrl = isSingleVideo 
      ? `https://www.youtube.com/embed/${activeItem.id}?autoplay=1`
      : `https://www.youtube.com/embed?listType=playlist&list=${activeItem.id}&autoplay=1`;

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-10 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition mb-4 text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Go Back
            </button>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              {activeItem.emoji} {activeItem.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-slate-100 px-4 py-2 rounded-full flex items-center gap-2 text-slate-600 font-bold text-sm">
                <Clock size={16} /> Auto-play Active
             </div>
          </div>
        </div>

        <div className="aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-900 bg-black">
          <iframe
            src={embedUrl}
            title={activeItem.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-8 p-8 bg-green-50 rounded-[32px] border border-green-100 flex items-start gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm text-green-600">
            <Play fill="currentColor" size={24} />
          </div>
          <div>
            <h4 className="font-black text-green-900 text-lg mb-1">Session Instructions</h4>
            <p className="text-green-700 leading-relaxed">
              Focus on your breathing. Keep your movements fluid and controlled. 
              If you feel any sharp pain, stop immediately and rest in Child's Pose. 
              {activeItem.type === 'Yoga' ? ' Maintain focus on your core alignment.' : ' Keep your heart rate steady.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}