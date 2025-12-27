import { useEffect, useState } from "react";
import { LogOut, Shield, User } from "lucide-react";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("manas_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading profile…
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("manas_auth");
    localStorage.removeItem("manas_user");
    window.location.reload(); // clean reset
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white text-3xl font-bold">
          {user.name?.charAt(0)}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            {user.name}
          </h1>
          <p className="text-gray-500">{user.email}</p>

          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            <Shield size={14} />
            {user.plan}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 p-5 rounded-xl border">
          <p className="text-sm text-gray-500 mb-1">Account Type</p>
          <p className="font-semibold text-gray-800 capitalize">
            {user.role}
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border">
          <p className="text-sm text-gray-500 mb-1">Next Billing Date</p>
          <p className="font-semibold text-gray-800">
            {user.nextBilling}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Profile management will be synced with secure authentication later.
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
