import { useEffect, useRef, useState } from "react";
import { Mic, Send, Camera, RotateCcw, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import StartingUI from "../components/StartingUI";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [sessionId] = useState(() => {
    let id = localStorage.getItem("manasSession");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("manasSession", id);
    }
    return id;
  });

  /* ---------------- SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setSpokenText(transcript);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
        setListening(false);
        if (transcript.trim()) sendMessage(transcript.trim());
      }, 1500);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (!listening) {
      setSpokenText("");
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  /* ---------------- SEND MESSAGE (WITH CONTEXT) ---------------- */
  const sendMessage = async (customText = null) => {
    const text = customText || input;
    if (!text.trim()) return;

    const userMessage = { sender: "user", text, role: "user" };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const chatHistory = [
        { 
          role: "system", 
          content: "You are Manas+, a precise medical AI assistant. Use bullet points for advice. Be structured and professional." 
        },
        ...newMessages.map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        }))
      ];

      const res = await fetch("http://localhost:5000/api/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: text, sessionId, history: chatHistory }),
      });
      
      const data = await res.json();
      setIsTyping(false);

      const botResponse = data.remedies?.[0] || data.message || "I'm analyzing your concern. Please provide more details.";
      setMessages(prev => [...prev, { sender: "bot", text: botResponse, role: "assistant" }]);
      
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Connection error. Please try again.", isError: true }]);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[88vh] bg-white rounded-[32px] shadow-xl border border-slate-100 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-5 flex justify-between items-center border-b border-slate-50 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">Manas<span className="text-emerald-500">+</span></h1>
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Always Active
            </p>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
        {messages.length === 0 ? (
          <StartingUI />
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
              <div className={`flex gap-3 max-w-[88%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                
                {/* Updated Avatar Label to MANAS */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[8px] font-black shrink-0 shadow-sm border ${
                  msg.sender === "user" ? "bg-indigo-600 text-white border-indigo-500" : "bg-white text-emerald-500 border-slate-100"
                }`}>
                  {msg.sender === "user" ? "YOU" : "MANAS"}
                </div>

                {/* Message Content */}
                {msg.image ? (
                  <img src={msg.image} alt="upload" className="rounded-2xl border-4 border-white shadow-md max-w-sm" />
                ) : (
                  <div className={`px-5 py-3.5 rounded-[22px] text-[15px] leading-relaxed shadow-sm tracking-wide ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none font-medium" 
                      : msg.isError ? "bg-red-50 text-red-600 border border-red-100" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  }`}>
                    {/* Points Formatting Style */}
                    <div className="whitespace-pre-line prose prose-sm max-w-none">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 text-emerald-500 text-[11px] font-bold flex items-center gap-3 shadow-sm">
              <Loader2 size={14} className="animate-spin" /> Manas is thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Section */}
      <div className="p-5 bg-white border-t border-slate-50">
        <div className="max-w-4xl mx-auto flex items-center bg-slate-50/50 border border-slate-200 rounded-3xl px-5 py-1.5 transition-all focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 shadow-inner gap-2">
          
          <button onClick={toggleListening} className={`p-2 transition-colors ${listening ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-emerald-500"}`}>
            <Mic size={20} />
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
            <Camera size={20} />
          </button>
          
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) setMessages(prev => [...prev, { sender: "user", image: URL.createObjectURL(file) }]);
          }} />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
            placeholder="Type symptoms (e.g. fever, headache)..."
            rows={1}
            className="flex-1 bg-transparent outline-none text-slate-700 py-3 text-sm font-medium resize-none placeholder:text-slate-400"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="bg-emerald-500 disabled:bg-slate-200 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Modern Voice Overlay */}
      {listening && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white relative shadow-xl">
              <Mic size={32} />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">I'm Listening</h2>
          <p className="text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">{spokenText || "Speak now..."}</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;