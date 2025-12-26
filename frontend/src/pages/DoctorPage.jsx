// ✅ Doctor Consultation Page
function DoctorPage() {
  const options = [
    { icon: "🧑‍⚕️", title: "Find Doctors", desc: "Specialists near you" },
    { icon: "📞", title: "Teleconsult", desc: "Talk to doctors online" },
    { icon: "📋", title: "Reports", desc: "Share medical records securely" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Doctor Consultation
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {options.map((o, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-3">{o.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{o.title}</h2>
            <p className="text-gray-500 text-sm">{o.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 mt-10 text-sm">
        Doctor services will be enabled in future updates.
      </p>
    </div>
  );
}

export default DoctorPage;