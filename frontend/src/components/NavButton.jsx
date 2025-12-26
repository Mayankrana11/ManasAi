export default function NavButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active
          ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800 font-semibold shadow-sm"
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      {icon} {label}
    </button>
  );
}
