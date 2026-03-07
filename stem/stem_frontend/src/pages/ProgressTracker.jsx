
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  TrendingUp,
  Award,
  BookOpen,
  FlaskConical,
  Atom,
  Monitor,
  Target,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api/stem`;

export default function ProgressTracker() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${API}/progress`);
      setProgress(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching progress:", error);
      setLoading(false);
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case "math":
        return BookOpen;
      case "chemistry":
        return FlaskConical;
      case "physics":
        return Atom;
      case "computer":
        return Monitor;
      default:
        return Award;
    }
  };

  const getSubjectTheme = (subject) => {
    switch (subject) {
      case "math":
        return {
          color: "#8B5CF6",
          bg: "bg-violet-500/10",
          border: "border-violet-500/20",
        };
      case "chemistry":
        return {
          color: "#10B981",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        };
      case "physics":
        return {
          color: "#F59E0B",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
        };
      case "computer":
        return {
          color: "#0EA5E9",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/20",
        };
      default:
        return {
          color: "#FBBF24",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
        };
    }
  };

  const stats = {
    math: progress.filter((p) => p.subject === "math").length,
    science: progress.filter((p) => p.subject === "science").length,
    computer: progress.filter((p) => p.subject === "computer").length,
    total: progress.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0F172A] text-slate-200 pb-20 font-sans relative overflow-hidden"
      data-testid="progress-tracker-page"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[120px] rounded-[100%] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="relative z-10 border-b border-slate-800 bg-[#1E293B]/60 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
          <Button
            data-testid="back-button"
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-8 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 font-bold rounded-xl transition-all cursor-pointer h-auto py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Base
          </Button>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.2)] border border-amber-300/30">
              <TrendingUp
                className="h-10 w-10 text-slate-900"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <span className="inline-block mb-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-amber-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                Analytics
              </span>
              <h1
                className="text-4xl md:text-5xl font-black text-white tracking-tight"
                data-testid="page-heading"
              >
                My Progress
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                Track your learning journey and mastery levels.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <Award className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-4xl font-black text-white">
                {stats.total}
              </span>
            </div>
            <div className="text-slate-400 font-bold uppercase tracking-wider text-xs relative z-10">
              Total Missions
            </div>
          </motion.div>

          {/* Math */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>
              <span className="text-4xl font-black text-white">
                {stats.math}
              </span>
            </div>
            <div className="text-slate-400 font-bold uppercase tracking-wider text-xs relative z-10">
              Math Challenges
            </div>
          </motion.div>

          {/* Science */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <FlaskConical className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-4xl font-black text-white">
                {stats.science}
              </span>
            </div>
            <div className="text-slate-400 font-bold uppercase tracking-wider text-xs relative z-10">
              Science Quizzes
            </div>
          </motion.div>

          {/* Computer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Monitor className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="text-4xl font-black text-white">
                {stats.computer}
              </span>
            </div>
            <div className="text-slate-400 font-bold uppercase tracking-wider text-xs relative z-10">
              Computer Quizzes
            </div>
          </motion.div>
        </div>

        {/* --- ACTIVITY LIST --- */}
        {progress.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#1E293B]/50 border border-slate-800 rounded-[2rem] p-12 text-center max-w-2xl mx-auto mt-12"
          >
            <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Target className="h-8 w-8 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">
              No Data Found
            </h2>
            <p className="text-slate-400 font-medium mb-8">
              You haven't completed any challenges or experiments yet. It's time
              to start dominating.
            </p>
            <Button
              onClick={() => navigate("/quiz/math")}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:scale-105 h-12 px-8 rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
            >
              Start First Mission
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700 rounded-[2rem] p-6 md:p-8 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Recent Activity Log
              </h2>
            </div>

            <div className="space-y-4">
              {progress.slice(0, 20).map((item, index) => {
                const IconComponent = getSubjectIcon(item.subject);
                const theme = getSubjectTheme(item.subject);

                return (
                  <div
                    key={item._id || index}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 transition-all hover:bg-slate-800 hover:border-slate-600 group"
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${theme.bg} ${theme.border}`}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: theme.color }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-bold text-slate-200 capitalize text-base group-hover:text-white transition-colors">
                        {item.subject}{" "}
                        <span className="text-slate-500 mx-1">/</span>{" "}
                        {item.topic_id?.title || "Unknown Topic"}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </div>
                    </div>

                    {/* Status & Score */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                          item.completed
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.completed ? "Mission Passed" : "In Progress"}
                      </div>

                      {item.score !== undefined && (
                        <div className="flex flex-col items-end bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">
                            Score
                          </span>
                          <span className="text-sm font-black text-white">
                            {item.score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}