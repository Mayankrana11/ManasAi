// ✅ Fitness & Exercise Page
function FitnessPage() {
  const routines = [
    { icon: "🧘", title: "Yoga", desc: "Daily calm routine" },
    { icon: "🏃", title: "Cardio", desc: "Walking & running" },
    { icon: "💪", title: "Strength", desc: "Bodyweight workouts" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-green-50 p-8 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Fitness & Exercise
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {routines.map((r, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-3">{r.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{r.title}</h2>
            <p className="text-gray-500 text-sm">{r.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 mt-10 text-sm">
        Note: This preview is mocked — backend not connected.
      </p>
    </div>
  );
}

export default FitnessPage;