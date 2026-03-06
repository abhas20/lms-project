import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Zap,
  Clock,
  AlertCircle,
  Activity,
  ChevronRight,
  CheckCircle2,
  Flame,
  Unplug,
  Rocket,
  ShieldAlert,
} from "lucide-react";
import { serverUrl } from "../../App";

let socket;

const StudentArena = () => {
  const { userData } = useSelector((state) => state.user);
  const [joined, setJoined] = useState(false);
  const [inputCode, setInputCode] = useState(
    sessionStorage.getItem("studentRoomCode") || "",
  );
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [activeQ, setActiveQ] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [joinError, setJoinError] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  // 🔥 Animation control states
  const [showLaunchVibration, setShowLaunchVibration] = useState(false);
  const [showEruptionparticles, setShowEruptionParticles] = useState(false);

  const barColors = [
    "bg-rose-500",
    "bg-emerald-500",
    "bg-blue-500",
    "bg-amber-500",
  ];

  useEffect(() => {
    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socket.on("connect", () => setConnectionStatus("Connected 🟢"));
    socket.on("connect_error", (err) => setConnectionStatus(`Disconnected 🔴`));

    socket.on("join_success", (data) => {
      sessionStorage.setItem("studentRoomCode", data.roomCode);
      setJoined(true);
      setJoinError("");
    });

    socket.on("error_msg", (data) => setJoinError(data.message));
    socket.on("room_closed", () => {
      sessionStorage.removeItem("studentRoomCode");
      window.location.reload();
    });

    socket.on("receive_question", (data) => {
      setActiveQ(data);
      setSubmitted(false);
      setSelectedOption(null);
      setResultData(null);
      setShowEruptionParticles(false);
    });

    socket.on("question_results", (data) => {
      setResultData(data);
      setLeaderboard(data.leaderboard);
      setTimeout(() => setShowEruptionParticles(true), 150);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (!inputCode.trim()) return;
    socket.emit(
      "student_join_quiz",
      {
        roomCode: inputCode.trim(),
        name: userData?.name || "Guest",
        userId: userData?._id || null,
      },
      (res) => {
        if (res?.status === "error") setJoinError(res.message);
      },
    );
  };

  const submitAnswer = (index) => {
    if (submitted) return;
    setShowLaunchVibration(true); // 🔥 Engagement Vibration
    socket.emit("student_submit_answer", {
      roomCode: inputCode.trim(),
      answerIndex: index,
      userId: userData?._id || null,
      name: userData?.name || "Guest",
    });
    setSelectedOption(index);
    setSubmitted(true);
    setTimeout(() => setShowLaunchVibration(false), 600);
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-[#060A13] flex flex-col items-center justify-center p-6 relative overflow-hidden thermal-hull">
        <style>{`
          .thermal-hull { animation: thermal-pulse 5s infinite alternate ease-in-out; }
          @keyframes thermal-pulse {
            0% { box-shadow: inset 0 0 50px rgba(245, 158, 11, 0.05); }
            100% { box-shadow: inset 0 0 150px rgba(220, 38, 38, 0.2); }
          }
          .lava-border { background: linear-gradient(90deg, #be123c, #fbbf24, #be123c); background-size: 200% 200%; animation: lava-slide 3s infinite linear; }
          @keyframes lava-slide { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        `}</style>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-8 px-5 py-2 bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase flex items-center gap-3"
        >
          <div
            className={`w-2 h-2 rounded-full ${connectionStatus.includes("🟢") ? "bg-emerald-500 animate-pulse" : "bg-rose-600"}`}
          />
          Status: {connectionStatus}
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0A111F] p-12 rounded-[3.5rem] text-center w-full max-w-md border border-white/5 shadow-2xl relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 lava-border" />
          <h1 className="text-5xl text-white font-black mb-2 italic uppercase tracking-tighter flex items-center justify-center gap-4">
            ENTER ARENA{" "}
            <Flame className="text-amber-500 animate-pulse" size={32} />
          </h1>
          <p className="text-slate-500 text-[9px] font-black mb-10 uppercase tracking-[0.4em]">
            Sub-Surface Authorization Needed
          </p>

          <div className="relative group mb-8">
            <input
              className="w-full p-6 rounded-3xl bg-black/40 text-amber-400 text-center text-5xl font-mono tracking-[0.5em] border-2 border-white/5 focus:border-amber-500/60 focus:bg-black/60 transition-all focus:outline-none uppercase shadow-inner"
              placeholder="0000"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {joinError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 text-rose-400 text-[10px] font-bold bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <AlertCircle size={14} /> {joinError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={joinRoom}
            className="w-full py-6 rounded-[2.2rem] text-[#0A1120] font-black text-xl bg-amber-400 hover:bg-amber-300 transition-all shadow-[0_15px_40px_rgba(245,158,11,0.2)] uppercase tracking-[0.1em] flex items-center justify-center gap-3"
          >
            INITIALIZE SYNC <ChevronRight size={26} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060A13] text-slate-200 p-6 flex flex-col items-center overflow-x-hidden relative selection:bg-rose-500/30 thermal-hull">
      <style>{`
        .heat-haze { backdrop-filter: blur(1px); animation: ripple 1.5s infinite linear; pointer-events: none; }
        @keyframes ripple { 0% { transform: skewX(0deg) scale(1); } 50% { transform: skewX(0.4deg) scale(1.005); } 100% { transform: skewX(0deg) scale(1); } }
        .vibration-active { animation: shake 0.1s infinite; }
        @keyframes shake { 0%, 100% { transform: translate(0,0); } 25% { transform: translate(-3px, 3px); } 50% { transform: translate(3px, -3px); } }
        .particle { position: absolute; bottom: 0; width: 8px; height: 8px; border-radius: 50%; animation: float-up 1.2s ease-out forwards; }
        @keyframes float-up { 0% { transform: translateY(0) scale(1.5); opacity: 1; filter: blur(0px); } 100% { transform: translateY(-450px) scale(0); opacity: 0; filter: blur(4px); } }
      `}</style>

      <div className="absolute inset-0 heat-haze opacity-30 z-0" />

      <div
        className={`flex-1 w-full flex flex-col items-center max-w-4xl relative z-10 ${showLaunchVibration ? "vibration-active" : ""}`}
      >
        {/* --- IDLE STATE --- */}
        {!activeQ && !resultData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-32"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-32 h-32 border-4 border-dashed border-amber-500/20 rounded-full mx-auto mb-10 flex items-center justify-center"
            >
              <Activity className="text-amber-500/40 animate-pulse" size={48} />
            </motion.div>
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">
              Awaiting Uplink
            </h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.5em] uppercase mt-4">
              Mission parameters pending...
            </p>
          </motion.div>
        )}

        {/* --- QUESTION VIEW --- */}
        {activeQ && !resultData && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full mt-10"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full font-black text-[10px] tracking-widest uppercase mb-8 shadow-lg">
                <ShieldAlert size={14} className="animate-pulse" />{" "}
                URGENT_RESPONSE_REQUIRED
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase italic">
                {activeQ.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {activeQ.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => submitAnswer(i)}
                  disabled={submitted}
                  className={`p-10 rounded-[3rem] text-2xl font-black transition-all border-b-[12px] active:border-b-0
                    ${submitted && selectedOption === i ? "bg-slate-700 border-white/20" : ""}
                    ${submitted && selectedOption !== i ? "bg-black/60 opacity-20 grayscale" : ""}
                    ${
                      !submitted
                        ? [
                            "bg-rose-600 border-rose-900 text-white shadow-[0_20px_40px_rgba(225,29,72,0.4)]",
                            "bg-emerald-600 border-emerald-900 text-white shadow-[0_20px_40px_rgba(16,185,129,0.3)]",
                            "bg-blue-600 border-blue-900 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)]",
                            "bg-amber-500 border-amber-800 text-[#0A1120] shadow-[0_20px_40px_rgba(245,158,11,0.3)]",
                          ][i]
                        : ""
                    }
                  `}
                >
                  {opt || `choice_${i + 1}`}
                </motion.button>
              ))}
            </div>
            {submitted && (
              <p className="text-center mt-12 text-amber-500 font-black uppercase tracking-[0.5em] animate-pulse text-[11px]">
                Target Verified. Waiting for Launch sequence.
              </p>
            )}
          </motion.div>
        )}

        {/* --- REPORT VIEW (Volcano Eruption) --- */}
        {resultData && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full flex flex-col items-center mt-10 relative"
          >
            {isErupting && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(20)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`particle ${["bg-red-500", "bg-orange-500", "bg-amber-400"][idx % 3]}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.8}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div
              className={`p-12 rounded-[4rem] border-4 text-center w-full max-w-lg shadow-2xl relative overflow-hidden backdrop-blur-3xl z-10 ${selectedOption === resultData.correctIndex ? "bg-emerald-500/10 border-emerald-500/40" : "bg-rose-500/10 border-rose-500/40"}`}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em]">
                  SYNAPTIC_LOG #TLE-DIAX
                </span>
                <Rocket className="text-white/20" size={18} />
              </div>
              <h1
                className={`text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none ${selectedOption === resultData.correctIndex ? "text-emerald-400" : "text-rose-400"}`}
              >
                {selectedOption === resultData.correctIndex
                  ? "IMPACT!"
                  : "NEUTRALIZED!"}
              </h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic leading-tight">
                FINAL REPORT_Mission Standings
              </p>

              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black mb-4">
                  Uplink data Verified
                </p>
                <div className="bg-white/5 py-6 px-10 rounded-3xl border border-white/10 shadow-inner">
                  <p className="text-2xl font-black text-white italic">
                    {activeQ?.options?.[resultData.correctIndex]}
                  </p>
                </div>
              </div>
            </div>

            {/* CLASS GRAPH (Image 8a7e3d style) */}
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="w-full bg-[#0D1525] p-12 md:p-16 rounded-[4.5rem] shadow-2xl border border-white/5 mt-14 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-20">
                <div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Class Heat Map
                  </h3>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-2 italic">
                    Leverage neural analysis response
                  </p>
                </div>
                <Activity size={24} className="text-amber-500 animate-pulse" />
              </div>

              <div className="flex items-end justify-between gap-8 h-[300px] border-b border-white/10 pb-6">
                {resultData.stats.map((count, i) => {
                  const height =
                    (count / Math.max(...resultData.stats, 1)) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                    >
                      <span className="text-2xl font-black mb-4 font-mono text-white/80">
                        {count}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ type: "spring", damping: 10 }}
                        className={`w-full max-w-[85px] rounded-t-2xl relative shadow-lg ${barColors[i]}`}
                      >
                        {i === resultData.correctIndex && (
                          <Zap
                            size={24}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 text-emerald-400 fill-current"
                          />
                        )}
                      </motion.div>
                      <div className="mt-8 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center h-12 line-clamp-2 px-2 italic">
                        {activeQ?.options?.[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* --- LEADERBOARD (Image 89a7ac style) --- */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="w-full max-w-2xl mt-16 mb-20 relative z-20"
        >
          <div className="bg-[#0D1525]/80 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
            <h3 className="text-xs font-black text-amber-500 tracking-[0.4em] uppercase italic mb-10 flex items-center gap-3 border-l-4 border-amber-500 pl-5">
              OPTIMIZATION PROTOCOL
            </h3>
            <ul className="space-y-4">
              {leaderboard.map((p, i) => (
                <li
                  key={i}
                  className={`flex justify-between items-center p-6 rounded-[2.2rem] border-2 transition-all ${p.name === userData?.name ? "bg-amber-500/10 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.1)] scale-[1.03]" : "bg-black/40 border-white/5 opacity-70 hover:opacity-100"}`}
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono font-black text-slate-600 text-xl tracking-tighter italic">
                      0{i + 1}
                    </span>
                    <span className="font-black text-white uppercase tracking-widest text-base italic">
                      {p.name}{" "}
                      {p.name === userData?.name && (
                        <span className="text-amber-500 text-[10px] ml-2 not-italic">
                          (UNIT_YOU)
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-2xl tracking-tighter">
                    {p.score} XP
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentArena;
