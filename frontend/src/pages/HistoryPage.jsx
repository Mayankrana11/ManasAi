import { useEffect, useState } from "react";

// ✅ HistoryPage and ProfilePage remain unchanged from your version
function HistoryPage() {
  const [history, setHistory] = useState([]);
  const sessionId = localStorage.getItem("manasSession");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(`http://localhost:5000/api/history/${sessionId}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    };
    fetchHistory();
  }, [sessionId]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Chat History</h1>
      {history.length === 0 ? (
        <p className="text-gray-500">No previous conversations yet.</p>
      ) : (
        <div className="space-y-6">
          {history.map((chat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="font-semibold text-gray-800">🧍 {chat.userText}</p>
              <p className="text-gray-600 mt-2 whitespace-pre-line">{chat.botReply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;