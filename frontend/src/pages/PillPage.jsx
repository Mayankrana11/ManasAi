// ✅ Pill & Medication Page
function PillPage() {
  const items = [
    { icon: "💊", title: "Medicine Info", desc: "Usage, dosage & precautions" },
    { icon: "⏰", title: "Reminders", desc: "Never miss your medication" },
    { icon: "⚠️", title: "Side Effects", desc: "Know what to watch for" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Medicines & Care
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {items.map((i, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-3">{i.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{i.title}</h2>
            <p className="text-gray-500 text-sm">{i.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 mt-10 text-sm">
        Medication features will be connected soon.
      </p>
    </div>
  );
}

export default PillPage;