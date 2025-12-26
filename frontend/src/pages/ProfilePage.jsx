import { useEffect, useState } from "react";
import { Save } from "lucide-react";

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", age: "", healthScore: "" });
  const sessionId = localStorage.getItem("manasSession");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/profile/${sessionId}`);
      const data = await res.json();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [sessionId]);

  const saveProfile = async () => {
    await fetch(`http://localhost:5000/api/profile/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    alert("Profile saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Your Profile</h1>
      <div className="grid grid-cols-2 gap-6">
        {["name", "email", "age", "healthScore"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
              {field === "healthScore" ? "Health Score (%)" : field}
            </label>
            <input
              type={field === "age" || field === "healthScore" ? "number" : "text"}
              value={profile[field] || ""}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
            />
          </div>
        ))}
      </div>
      <button
        onClick={saveProfile}
        className="mt-6 bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:opacity-90"
      >
        <Save size={18} /> Save Changes
      </button>
    </div>
  );
}

export default ProfilePage;