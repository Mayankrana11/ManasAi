import { useState } from "react";
import { Heart } from "lucide-react";

function AuthPage({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "admin" && password === "admin123") {
      const user = {
        role: "admin",
        name: "Admin User",
        email: "admin@manas.ai",
        plan: "Admin (Full Access)",
        nextBilling: "N/A",
      };

      localStorage.setItem("manas_auth", "admin");
      localStorage.setItem("manas_user", JSON.stringify(user));

      onAuth("admin");
    } else {
      setError("Invalid Username or Password!");
    }
  };

  const handleGuest = () => {
    const user = {
      role: "guest",
      name: "Guest User",
      email: "Not linked",
      plan: "Guest (Limited Access)",
      nextBilling: "Upgrade required",
    };

    localStorage.setItem("manas_auth", "guest");
    localStorage.setItem("manas_user", JSON.stringify(user));

    onAuth("guest");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[420px] border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-400 to-blue-400 p-3 rounded-xl">
            <Heart className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Manas+</h1>
            <p className="text-sm text-gray-500">AI Health Companion</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white py-2 rounded-lg font-semibold mb-4"
        >
          Login
        </button>

        <div className="text-center text-sm text-gray-500 mb-3">or</div>

        <button
          onClick={handleGuest}
          className="w-full border border-gray-200 py-2 rounded-lg hover:bg-gray-50"
        >
          Continue without account
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
