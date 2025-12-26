// ✅ Elder Care Page
function ElderPage() {
  const services = [
    { icon: "👴", title: "Daily Check-ins", desc: "Health monitoring & care" },
    { icon: "🩺", title: "Vital Tracking", desc: "BP, sugar & basic health" },
    { icon: "🚨", title: "Emergency Support", desc: "Instant alerts & help" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Elder Care Support
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-3">{s.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{s.title}</h2>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 mt-10 text-sm">
        Elder care features are currently in preview mode.
      </p>
    </div>
  );
}
export default ElderPage;
