import { useEffect, useRef, useState } from "react";
import { Mic, Send, Camera } from "lucide-react";
import StartingUI from "../components/StartingUI";

// ✅ Chat Page
function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");

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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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
        if (transcript.trim()) handleVoiceSend(transcript.trim());
      }, 1500);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleVoiceSend = (text) => {
    setInput(text);
    sendMessage(text);
    setSpokenText("");
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return alert("Speech recognition not supported.");
    if (!listening) {
      setSpokenText("");
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        image: imageURL,
      },
    ]);

    // Reset input so same image can be selected again
    e.target.value = "";
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async (customText = null) => {
    const text = customText || input;
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setMessages((prev) => [...prev, { sender: "bot", text: "Thinking..." }]);

    try {
      const res = await fetch("http://localhost:5000/api/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: text, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => prev.slice(0, -1));

      if (data.type === "greeting")
        setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      else if (data.type === "medical")
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.remedies?.[0] || "No response" },
        ]);
      else
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Unexpected response from backend." },
        ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "⚠️ Backend not responding. Try again." },
      ]);
    }
  };

  /* ---------------- SCROLL & TEXTAREA ---------------- */
  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[85vh] relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Chat with Manas+
          </h1>
          <p className="text-gray-500">
            Your compassionate health companion — available 24/7
          </p>
        </div>
        <button
          className="bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200"
          onClick={() => setMessages([])}
        >
          New Conversation
        </button>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <StartingUI />
      ) : (
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-3 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="max-w-xs rounded-xl shadow-md border"
                />
              ) : (
                <div
                  className={`px-4 py-2 rounded-2xl max-w-lg text-lg shadow-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-green-400 to-blue-400 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {/* Listening Popup */}
      {listening && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-green-200 rounded-xl p-5 w-[350px] flex flex-col items-center z-20">
          <p className="text-gray-700 text-sm font-medium mb-2">
            Listening...
          </p>
          <p className="text-gray-500 text-xs italic text-center max-w-xs">
            {spokenText || "Speak now..."}
          </p>
        </div>
      )}

      {/* Input Bar */}
      <div className="mt-6 flex items-center bg-white border-2 border-green-100 rounded-full shadow-lg px-4 py-2 relative gap-1">
        {/* Mic */}
        <button
          className={`p-2 transition ${
            listening
              ? "text-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
          onClick={toggleListening}
        >
          <Mic size={20} />
        </button>

        {/* Camera */}
        <button
          className="p-2 text-gray-500 hover:text-green-600 transition"
          onClick={handleImageClick}
        >
          <Camera size={20} />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Describe your symptoms or health concern..."
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-gray-700 px-3 py-2 overflow-y-auto"
        />

        {/* Send */}
        <button
          onClick={() => sendMessage()}
          className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 flex items-center gap-2"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
