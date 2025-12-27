function NavButton({ label, icon, active, onClick, locked }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active
          ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-800 font-semibold"
          : "hover:bg-gray-50 text-gray-700"
      } ${locked ? "opacity-60" : ""}`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {locked && <span className="text-xs">🔒</span>}
    </button>
  );
}

export default NavButton;
