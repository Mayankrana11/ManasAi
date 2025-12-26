import { useState } from "react";
import { ArrowLeft } from "lucide-react";

function FitnessPage() {
  const [view, setView] = useState("main"); 
  // main | pain | cardio | playlist
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [backTarget, setBackTarget] = useState("main");

  // 🔹 Pain relief playlists (UNCHANGED)
  const painPlaylists = [
    {
      title: "Neck Pain",
      desc: "Relief & mobility exercises",
      playlistId: "PLm_NMESlfZOfFJO01mxjp7Fhkual6TFEC",
      emoji: "🧠",
    },
    {
      title: "Shoulder Pain",
      desc: "Rotator cuff & shoulder relief",
      playlistId: "PLm_NMESlfZOdcJo4RT2OcXunFCluzv4I_",
      emoji: "💪",
    },
    {
      title: "Upper Back Pain",
      desc: "Posture & thoracic relief",
      playlistId: "PLm_NMESlfZOfzpCGchrkMF35kFgkPieFG",
      emoji: "🦴",
    },
    {
      title: "Lower Back Pain",
      desc: "Lumbar & spine care",
      playlistId: "PLm_NMESlfZOdDfr4mZLK4Wv2SzXlVIFpg",
      emoji: "🧍",
    },
    {
      title: "Knee Pain",
      desc: "Joint stability & strength",
      playlistId: "PLm_NMESlfZOdDdm7ah-4V6bsATHW-ZXMz",
      emoji: "🦵",
    },
    {
      title: "Ankle & Foot Pain",
      desc: "Balance & mobility exercises",
      playlistId: "PLm_NMESlfZOdYnQTvZUZjCSDorUqr8xxZ",
      emoji: "👣",
    },
    {
      title: "Wrist & Hand Pain",
      desc: "Grip & flexibility care",
      playlistId: "PLm_NMESlfZOfjxe3lsEf41oZ5IlZHynEc",
      emoji: "✋",
    },
    {
      title: "Hip Pain",
      desc: "Hip mobility & strength",
      playlistId: "PLm_NMESlfZOf1tCX-PBpapsEXn8vhQf-S",
      emoji: "🦿",
    },
  ];

  // 🔹 Cardio categories (NEW)
  const cardioPlaylists = [
    {
      title: "Running / Walking",
      desc: "Outdoor & treadmill workouts",
      playlistId: "", // placeholder
      emoji: "🏃",
    },
    {
      title: "Endurance",
      desc: "Stamina & long-duration training",
      playlistId: "",
      emoji: "🔥",
    },
    {
      title: "Heart Health",
      desc: "Cardiac-safe exercise routines",
      playlistId: "",
      emoji: "❤️",
    },
    {
      title: "Swimming",
      desc: "Low-impact full body cardio",
      playlistId: "",
      emoji: "🏊",
    },
  ];

  /* ---------------- PLAYLIST VIEW ---------------- */
  if (view === "playlist" && activePlaylist) {
    return (
      <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
        <button
          onClick={() => setView(backTarget)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          {activePlaylist.title}
        </h1>

        <div className="w-full h-[480px] rounded-xl overflow-hidden shadow-md bg-black">
          <iframe
            src={
              activePlaylist.playlistId
                ? `https://www.youtube.com/embed?listType=playlist&list=${activePlaylist.playlistId}`
                : "https://www.youtube.com/embed"
            }
            title={activePlaylist.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="text-gray-500 text-sm mt-4">
          ▶ Playlist content will be finalized soon.
        </p>
      </div>
    );
  }

  /* ---------------- PAIN RELIEF VIEW (UNCHANGED) ---------------- */
  if (view === "pain") {
    return (
      <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
        <button
          onClick={() => setView("main")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Fitness
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
          Pain Relief Exercises
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Select the area where you’re experiencing discomfort
        </p>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {painPlaylists.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setActivePlaylist(p);
                setBackTarget("pain");
                setView("playlist");
              }}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="text-4xl mb-3">{p.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm">{p.desc}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-400 mt-10 text-sm">
          These exercises are for general guidance only. Consult a professional for persistent pain.
        </p>
      </div>
    );
  }

  /* ---------------- CARDIO VIEW (NEW) ---------------- */
  if (view === "cardio") {
    return (
      <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
        <button
          onClick={() => setView("main")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Fitness
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
          Cardio Workouts
        </h1>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {cardioPlaylists.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                setActivePlaylist(c);
                setBackTarget("cardio");
                setView("playlist");
              }}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="text-4xl mb-3">{c.emoji}</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {c.title}
              </h2>
              <p className="text-gray-500 text-sm">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- MAIN FITNESS LANDING ---------------- */
  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
        Fitness & Exercise
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-4xl mb-3">🧘</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Yoga</h2>
          <p className="text-gray-500 text-sm">
            Flexibility, balance, breathing & calm routines
          </p>
        </div>

        <button
          onClick={() => setView("cardio")}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="text-4xl mb-3">🏃</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Cardio</h2>
          <p className="text-gray-500 text-sm">
            Walking, endurance & heart health exercises
          </p>
        </button>

        <button
          onClick={() => setView("pain")}
          className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="text-4xl mb-3">🩺</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Pain Relief Exercises
          </h2>
          <p className="text-gray-500 text-sm">
            Targeted exercises for common body pains
          </p>
        </button>
      </div>
    </div>
  );
}

export default FitnessPage;
