// ✅ Health Monitor Page (Smartwatch / Fitbit Ready)
function MonitorPage() {
  const metrics = [
    { icon: "❤️", title: "Heart Rate", value: "-- bpm", desc: "Live heart activity" },
    { icon: "🫁", title: "SpO₂", value: "-- %", desc: "Blood oxygen level" },
    { icon: "🩸", title: "Blood Pressure", value: "-- / --", desc: "Systolic / Diastolic" },
    { icon: "👟", title: "Steps", value: "-- steps", desc: "Daily movement count" },
    { icon: "🔥", title: "Calories", value: "-- kcal", desc: "Energy burned today" },
    { icon: "😴", title: "Sleep", value: "-- hrs", desc: "Last sleep duration" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-3 text-center">
        Health Monitor
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Track vital health metrics from smartwatches and fitness bands
      </p>

      {/* Metrics Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{m.icon}</div>
              <span className="text-sm text-gray-400">Preview</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">{m.title}</h2>
            <p className="text-2xl font-bold text-green-600 mt-2">{m.value}</p>
            <p className="text-gray-500 text-sm mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Smartwatch Info */}
      <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-xl flex gap-4 items-start">
        <div className="text-2xl">⌚</div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">
            Smartwatch Integration (Coming Soon)
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            This section will connect to devices like Fitbit, Apple Watch, or
            other fitness trackers to automatically sync health data in real time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MonitorPage;