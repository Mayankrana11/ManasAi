import { useState } from "react";
import { ArrowLeft } from "lucide-react";

function FitnessPage() {
  const [view, setView] = useState("main");
  // main | pain | cardio | yoga | playlist
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [backTarget, setBackTarget] = useState("main");

  /* ---------------- PAIN RELIEF PLAYLISTS---------------- */
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

  /* ---------------- CARDIO---------------- */
  const cardioPlaylists = [
    {
      title: "Low Impact Cardio",
      desc: "Gentle cardio suitable for beginners & recovery",
      playlistId: "PLm_NMESlfZOfiRaspm8wz44l4vXcQKcIx", 
      emoji: "🫀",
    },
    {
      title: "Walking-Based Cardio",
      desc: "Step-focused workouts & brisk walking",
      playlistId: "PLm_NMESlfZOd0bUfPB93k7tZHEnNpEPk0",
      emoji: "🚶",
    },
    {
      title: "Joint-Friendly Cardio",
      desc: "Moderate intensity, easy on knees & back",
      playlistId: "PLm_NMESlfZOevUFANgCGEzvfE2K8I8PwB",
      emoji: "🦵",
    },
    {
      title: "Fat Burn Cardio",
      desc: "Calorie burning & metabolism boost",
      playlistId: "PLm_NMESlfZOcRjMfMeLtTv_R8yBkpceG6",
      emoji: "🔥",
    },
    {
      title: "Heart Health Cardio",
      desc: "Safe routines for cardiovascular strength",
      playlistId: "PLm_NMESlfZOfL27I4WTfexMiILrRSeZ4q",
      emoji: "❤️",
    },
    {
      title: "Swimming",
      desc: "Low-impact full body cardio in water",
      playlistId: "PLm_NMESlfZOc8vJ2eYTA8hmjvVco5HtRe",
      emoji: "🏊",
    },
  ];

  /* ---------------- YOGA ASANAS---------------- */
  const yogaAsanas = [
    {
      title: "Surya Namaskar",
      desc: "Full body flow & energy",
      playlistId: "PLm_NMESlfZOcpo9hQsTdu3ctDOQqcaTmb",
      emoji: "🌞",
    },
    {
      title: "Vrikshasana (Tree Pose)",
      desc: "Balance & focus",
      playlistId: "A9OzH3kYvyU",
      emoji: "🌳",
    },
    {
      title: "Bhujangasana (Cobra)",
      desc: "Spine & posture",
      playlistId: "qp1jcVFbXuE",
      emoji: "🐍",
    },
    {
      title: "Adho Mukha Svanasana",
      desc: "Flexibility & stretch",
      playlistId: "zK1cLctwBsk",
      emoji: "🐕",
    },
    {
      title: "Tadasana (Mountain)",
      desc: "Posture & alignment",
      playlistId: "TmnVRKygyk0",
      emoji: "🧍‍♂️",
    },
    {
      title: "Balasana (Child’s Pose)",
      desc: "Relaxation & recovery",
      playlistId: "kH12QrSGedM",
      emoji: "🧎",
    },
    {
      title: "Setu Bandhasana (Bridge)",
      desc: "Back & hip strength",
      playlistId: "cNvVl-Q3GD4",
      emoji: "🌉",
    },
    {
      title: "Shavasana",
      desc: "Deep relaxation & calm",
      playlistId: "dXYtWuYxWmQ",
      emoji: "😌",
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
                ? activePlaylist.playlistId.length === 11
                  ? `https://www.youtube.com/embed/${activePlaylist.playlistId}`
                  : `https://www.youtube.com/embed?listType=playlist&list=${activePlaylist.playlistId}`
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
          ▶ Follow exercises at a comfortable pace. Stop if discomfort occurs.
        </p>
      </div>
    );
  }

  /* ---------------- PAIN VIEW ---------------- */
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

        <h1 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
          Pain Relief Exercises
        </h1>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {painPlaylists.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setActivePlaylist(p);
                setBackTarget("pain");
                setView("playlist");
              }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-left"
            >
              <div className="text-4xl mb-3">{p.emoji}</div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- CARDIO VIEW ---------------- */
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

        <div className="grid md:grid-cols-2 gap-6">
          {cardioPlaylists.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                setActivePlaylist(c);
                setBackTarget("cardio");
                setView("playlist");
              }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-left"
            >
              <div className="text-4xl mb-3">{c.emoji}</div>
              <h2 className="font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-500">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- YOGA VIEW ---------------- */
  if (view === "yoga") {
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
          Yoga & Asanas
        </h1>

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {yogaAsanas.map((y, i) => (
            <button
              key={i}
              onClick={() => {
                setActivePlaylist(y);
                setBackTarget("yoga");
                setView("playlist");
              }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-left"
            >
              <div className="text-4xl mb-3">{y.emoji}</div>
              <h3 className="font-semibold">{y.title}</h3>
              <p className="text-sm text-gray-500">{y.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- MAIN LANDING ---------------- */
  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
        Fitness & Exercise
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setView("yoga")}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-left"
        >
          <div className="text-4xl mb-3">🧘</div>
          <h2 className="font-semibold">Yoga</h2>
          <p className="text-sm text-gray-500">
            Flexibility, balance & calm routines
          </p>
        </button>

        <button
          onClick={() => setView("cardio")}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-left"
        >
          <div className="text-4xl mb-3">🏃</div>
          <h2 className="font-semibold">Cardio</h2>
          <p className="text-sm text-gray-500">
            Walking, endurance & heart health
          </p>
        </button>

        <button
          onClick={() => setView("pain")}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md text-left"
        >
          <div className="text-4xl mb-3">🩺</div>
          <h2 className="font-semibold">Pain Relief</h2>
          <p className="text-sm text-gray-500">
            Targeted exercises for body pain
          </p>
        </button>
      </div>
    </div>
  );
}

export default FitnessPage;
