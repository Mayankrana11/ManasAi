import { useEffect, useState, useMemo } from "react";
import { 
  MessageSquare, Search, Clock, 
  Copy, Check, Trash2, Loader2, 
  ChevronDown, ChevronUp, Calendar,
  Sparkles
} from "lucide-react";

/**
 * HISTORY PAGE - UPDATED FOR THREADED CONVERSATIONS
 * Groups flat message pairs into a single continuous chat session.
 */
function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDate, setExpandedDate] = useState("Today"); // Keeps the most recent thread open
  const [copiedId, setCopiedId] = useState(null);
  const sessionId = localStorage.getItem("manasSession"); //

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Fetching from your specific endpoint
        const res = await fetch(`http://localhost:5000/api/history/${sessionId}`);
        const data = await res.json();
        
        // We assume the backend returns messages in order; we reverse for "newest first" view
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) fetchHistory();
    else setLoading(false);
  }, [sessionId]);

  /** * LOGIC: Grouping individual comments into "Threads"
   * This takes your list of messages and organizes them by Date.
   */
  const groupedHistory = useMemo(() => {
    const filtered = history.filter(chat => 
      chat.userText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.botReply.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups = {};
    filtered.forEach(chat => {
      // Use timestamp if available, otherwise fallback to now
      const dateObj = new Date(chat.timestamp || Date.now());
      const dateKey = dateObj.toLocaleDateString('en-GB', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      });
      
      // Assign human-friendly labels
      const now = new Date();
      const diffDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
      let label = dateKey;
      if (diffDays === 0) label = "Today";
      else if (diffDays === 1) label = "Yesterday";

      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    });
    return groups;
  }, [history, searchTerm]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen bg-white">
      {/* Header - Indigo/Emerald Accents */}
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <Calendar className="text-emerald-500" /> Health Journey
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Review your clinical conversation history.</p>
      </header>

      {/* Search Input */}
      <div className="relative mb-8 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search through past symptoms or advice..." 
          className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="font-bold text-sm uppercase tracking-widest">Fetching Chat Logs...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold italic">No sessions recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([label, chats]) => (
            <div key={label} className="bg-slate-50/50 rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              
              {/* Session Accordion Trigger */}
              <button 
                onClick={() => setExpandedDate(expandedDate === label ? null : label)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                    <Clock size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-800">{label}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{chats.length} interactions in this chat</p>
                  </div>
                </div>
                {expandedDate === label ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>

              {/* The "Full Chat" Thread View */}
              {expandedDate === label && (
                <div className="px-6 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="border-t border-slate-100 pt-6 space-y-8">
                    {chats.map((chat, idx) => (
                      <div key={idx} className="space-y-3">
                        {/* User Message Bubble - Indigo */}
                        <div className="flex justify-end gap-3">
                          <div className="bg-indigo-600 text-white px-5 py-3 rounded-[24px] rounded-tr-none shadow-md text-sm max-w-[80%]">
                            {chat.userText}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500 shrink-0 uppercase">You</div>
                        </div>

                        {/* Bot Message Bubble - Emerald Accent */}
                        <div className="flex justify-start gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-200">
                            <Sparkles size={14} />
                          </div>
                          <div className="relative max-w-[85%]">
                            <div className="bg-white border border-slate-200 text-slate-700 px-5 py-4 rounded-[24px] rounded-tl-none shadow-sm text-sm leading-relaxed whitespace-pre-line">
                              {chat.botReply}
                            </div>
                            
                            {/* Copy Action */}
                            <button 
                              onClick={() => handleCopy(chat.botReply, `${label}-${idx}`)}
                              className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-emerald-500"
                            >
                              {copiedId === `${label}-${idx}` ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;