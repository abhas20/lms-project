import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Moon, Dumbbell, Clock, Coffee, ChevronRight, AlertCircle } from "lucide-react";
import { serverUrl } from "../App";

export default function StressAnalysis() {
  const [form, setForm] = useState({
    sleepHours: "",
    exerciseDays: "",
    assignmentPressure: "medium",
    mood: "neutral",
    breakHabit: "sometimes"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analysis =
    typeof result?.analysis === "string"
      ? (() => {
          try {
            return JSON.parse(result.analysis);
          } catch {
            return null;
          }
        })()
      : result?.analysis;

  const analyze = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/stress/analyze`, form, { withCredentials: true });
      setResult(res.data);
    } catch (err) {
      console.error("Stress analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-white/50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-indigo-100 rounded-2xl text-indigo-600">
            <Brain size={32} />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
            Mind<span className="text-indigo-600">Check</span> AI
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-md mx-auto">
            Leverage neural analysis to balance your academic life and mental well-being.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white/70 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={20} />
              Daily Metrics
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Moon size={16} /> Sleep (Hrs/Day)
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    value={form.sleepHours}
                    onChange={(e) => setForm({ ...form, sleepHours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Dumbbell size={16} /> Exercise (Days/Wk)
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    value={form.exerciseDays}
                    onChange={(e) => setForm({ ...form, exerciseDays: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Clock size={16} /> Assignment Pressure
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setForm({...form, assignmentPressure: level})}
                        className={`flex-1 py-2 px-4 rounded-lg capitalize transition-all ${form.assignmentPressure === level ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Current Mood</label>
                    <select className={inputStyle} value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}>
                      <option value="good">😊 Good</option>
                      <option value="neutral">😐 Neutral</option>
                      <option value="tired">🥱 Tired</option>
                      <option value="stressed">😫 Stressed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <Coffee size={16} /> Break Habit
                    </label>
                    <select className={inputStyle} value={form.breakHabit} onChange={(e) => setForm({ ...form, breakHabit: e.target.value })}>
                      <option value="often">Often</option>
                      <option value="sometimes">Sometimes</option>
                      <option value="rarely">Rarely</option>
                    </select>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyze}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Generate Analysis <ChevronRight size={20}/></>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results Side */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-indigo-900 text-white rounded-3xl p-8 shadow-2xl h-full flex flex-col"
                >
                  <div className="mb-8">
                    <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest">Your Report</p>
                    <h2 className="text-3xl font-bold mt-1">AI Insights</h2>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 mb-6">
                    <div className="text-indigo-200 text-sm mb-1">Weekly Study Time</div>
                    <div className="text-4xl font-black">{result.studyHoursLastWeek} <span className="text-lg font-normal">hrs</span></div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${analysis?.stressLevel === 'High' ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-emerald-500/20 border-emerald-400 text-emerald-200'}`}>
                      Stress: {analysis?.stressLevel}
                    </div>
                    <p className="text-indigo-100 leading-relaxed italic">
                      "{analysis?.explanation}"
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-bold text-indigo-300 uppercase mb-4">Action Plan</h4>
                    <div className="space-y-3">
                      {analysis?.suggestions?.map((s, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 text-sm bg-white/5 p-3 rounded-xl border border-white/5"
                        >
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                          {s}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-400">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <AlertCircle size={40} />
                  </div>
                  <p className="font-medium text-slate-500">No analysis generated yet.</p>
                  <p className="text-sm mt-1">Complete the form to see your stress report.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}