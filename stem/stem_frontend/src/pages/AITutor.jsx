
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  Plus,
  BrainCircuit,
  Bot,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AITutor() {
  const navigate = useNavigate();

  // Session ID
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem("ai_session_id");
    if (stored) return stored;
    const newSession = `session_${crypto.randomUUID()}`;
    localStorage.setItem("ai_session_id", newSession);
    return newSession;
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    fetchHistory();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/chat/history/${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const sendMessage = async (messageText = null) => {
    const text = messageText ?? input;
    if (!text.trim()) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      session_id: sessionId,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: text,
      });

      const aiMessage = {
        id: `msg_${Date.now()}_ai`,
        session_id: sessionId,
        role: "assistant",
        content: response.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    const newSession = `session_${crypto.randomUUID()}`;
    localStorage.setItem("ai_session_id", newSession);
    setSessionId(newSession);
    setMessages([]);
    setInput("");
  };

  const quickQuestions = [
    { text: "How does photosynthesis work?", tag: "Biology" },
    { text: "Explain quantum entanglement", tag: "Physics" },
    { text: "What is the Fibonacci sequence?", tag: "Math" },
    { text: "How do API endpoints work?", tag: "CS" },
  ];

  return (
    <div
      className="min-h-screen bg-[#060913] font-sans flex flex-col relative overflow-hidden"
      data-testid="ai-tutor-page"
    >
      {/* --- Cyberpunk Ambient Glows --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-700/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none" />

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-50 bg-[#060913]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-start">
            <Button
              onClick={() => navigate("/")}
              className="group hover:bg-white/10 text-slate-400 hover:text-white rounded-xl px-3 py-2 font-semibold transition-all cursor-pointer"
              variant="ghost"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E1B4B] to-[#312E81] border border-indigo-500/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <Bot className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  AI{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Tutor
                  </span>
                </h1>
                <p className="text-[10px] font-bold text-slate-500 hidden md:block tracking-[0.2em] uppercase mt-0.5">
                  Always Online
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={newChat}
            className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] border border-slate-600 text-white rounded-xl px-5 py-2.5 font-bold shadow-md hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all w-full md:w-auto cursor-pointer"
          >
            <Plus className="h-5 w-5 text-indigo-400" /> New Chat
          </Button>
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 relative z-10 w-full max-w-4xl mx-auto hide-scrollbar">
        {messages.length === 0 ? (
          /* --- Empty State / Welcome Screen --- */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 md:mt-20 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <BrainCircuit className="h-12 w-12 text-indigo-400 relative z-10 animate-pulse" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              What shall we{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                solve today?
              </span>
            </h2>
            <p className="text-slate-400 font-medium mb-12 text-lg max-w-xl mx-auto">
              Ask me complex formulas, coding logic, or simply have a chat about
              the universe.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {quickQuestions.map((q, idx) => (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => sendMessage(q.text)}
                  className="group relative bg-[#0F1626] border border-white/5 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] rounded-2xl p-5 text-left transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded w-fit">
                      {q.tag}
                    </span>
                    <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                      "{q.text}"
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* --- Messages List --- */
          <div className="flex flex-col gap-6 pb-20">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative rounded-3xl p-5 max-w-[85%] md:max-w-[75%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white rounded-br-sm shadow-[0_10px_25px_rgba(37,99,235,0.3)] font-medium"
                        : "bg-[#111827]/80 backdrop-blur-xl border border-white/10 text-slate-200 rounded-bl-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                        <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/30">
                          <Bot className="h-4 w-4 text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
                          AI System
                        </span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-[15px] md:text-base leading-7">
                      {msg.content}
                    </p>
                    <div
                      className={`text-[10px] mt-4 text-right font-semibold uppercase tracking-wider ${
                        msg.role === "user"
                          ? "text-indigo-200"
                          : "text-slate-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl rounded-bl-sm p-4 px-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                    <span className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">
                      Analyzing query...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* ================= STICKY INPUT AREA ================= */}
      <div className="sticky bottom-0 w-full bg-gradient-to-t from-[#060913] via-[#060913]/95 to-transparent pt-12 pb-6 px-4 md:px-8 z-50">
        <div className="max-w-4xl mx-auto relative group">
          {/* Animated Glow Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-[8px] transition duration-500" />

          <div className="relative bg-[#0F1626] rounded-2xl border border-slate-700/50 p-2 pl-6 flex gap-3 items-center shadow-2xl transition-colors duration-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Enter your prompt..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-base font-medium focus:outline-none disabled:opacity-50 h-12"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white h-12 w-12 rounded-xl font-bold flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}