

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Lightbulb,
  AlertTriangle,
  Target,
  CheckCircle,
  Beaker,
  Sparkles,
  Check,
  Clock,
  Gauge,
  PenTool,
  Save,
  Activity,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Adjusted UI configs to match the Medium-Dark Premium theme
const SUBJECT_UI = {
  physics: {
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.15)",
    label: "Physics",
    var1: "Velocity",
    var2: "Mass",
  },
  chemistry: {
    color: "#10B981",
    glow: "rgba(16, 185, 129, 0.15)",
    label: "Chemistry",
    var1: "Temperature",
    var2: "Catalyst",
  },
  computer: {
    color: "#0EA5E9",
    glow: "rgba(14, 165, 233, 0.15)",
    label: "Computer",
    var1: "Input Data",
    var2: "Algorithm",
  },
  math: {
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.15)",
    label: "Math",
    var1: "Variable X",
    var2: "Constant",
  },
};

export default function ExperimentDetail() {
  const { subject, id } = useParams();
  const navigate = useNavigate();

  const ui = SUBJECT_UI[subject];

  const [experiment, setExperiment] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labNotes, setLabNotes] = useState("");

  useEffect(() => {
    if (ui) fetchExperiment();
  }, [subject, id]);

  const fetchExperiment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/${subject}/experiments/${id}`);
      setExperiment(response.data);
    } catch (error) {
      console.error("Error fetching experiment:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSaveNotes = () => {
    if (!labNotes.trim()) return;
    toast.success("Observations logged securely!");
  };

  if (!ui) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300 text-xl font-bold tracking-widest uppercase">
        System Error: Invalid Sequence 🚫
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-xl">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-6 text-white">
            Experiment Data Corrupted
          </h2>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-full px-8 py-3 font-bold hover:scale-105 transition-transform cursor-pointer"
          >
            Return to Base
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = experiment.steps?.length
    ? Math.round((completedSteps.length / experiment.steps.length) * 100)
    : 0;

  return (
    // Medium-Dark Slate Background
    <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-24 font-sans relative overflow-hidden">
      {/* Subtle Dynamic Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[120px] rounded-[100%] pointer-events-none opacity-40"
        style={{ backgroundColor: ui.glow }}
      />

      {/* --- PREMIUM HERO HEADER --- */}
      <div className="relative z-10 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <Button
            onClick={() => navigate(`/experiment/${subject}`)}
            variant="ghost"
            className="mb-8 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 font-bold rounded-xl transition-all cursor-pointer h-auto py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {ui.label}
          </Button>

          <div className="max-w-6xl flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest bg-slate-800 border border-slate-700 text-amber-500 shadow-sm">
                  <Beaker className="w-3.5 h-3.5" /> Virtual Lab
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-slate-800/50 border border-slate-700/50 text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Est. 45 Mins
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-slate-800/50 border border-slate-700/50 text-slate-400">
                  <Gauge className="w-3.5 h-3.5" /> Advanced
                </span>

                {progressPercentage === 100 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  >
                    <CheckCircle className="w-4 h-4" /> Analyzed
                  </motion.span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white leading-tight">
                {experiment.title}
              </h1>

              <p className="text-lg text-slate-400 font-medium max-w-3xl leading-relaxed">
                {experiment.description}
              </p>
            </div>

            {/* Premium Gold Progress Block */}
            <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.3)] min-w-[160px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 drop-shadow-sm relative z-10">
                {progressPercentage}%
              </div>
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mt-2 relative z-10">
                Completion
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thin Mobile Progress Bar (Gold gradient) */}
      <div className="lg:hidden h-1.5 w-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="container mx-auto px-4 md:px-12 py-10 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Steps & Notes */}
          <div className="lg:col-span-2 space-y-8">
            {/* --- INTERACTIVE STEPS --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 md:p-10 shadow-xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg text-amber-400 border border-slate-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    Execution Steps
                  </h2>
                </div>
                <span className="text-sm font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md">
                  {completedSteps.length} / {experiment.steps.length}
                </span>
              </div>

              <div className="space-y-4">
                {experiment.steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleStep(index)}
                      className={`group flex items-start gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        isCompleted
                          ? "bg-slate-900/50 border-slate-800 opacity-50"
                          : "bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 hover:shadow-lg"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 transition-colors shadow-inner ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700 text-slate-400 border border-slate-600 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500/50"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <p
                        className={`font-medium pt-1.5 text-base transition-all ${
                          isCompleted
                            ? "text-slate-500 line-through decoration-slate-600"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* --- EXTRA FEATURE: OBSERVATION PANEL --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg border border-slate-600">
                    <PenTool className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    Observation Log
                  </h2>
                </div>
                <Button
                  onClick={handleSaveNotes}
                  className="bg-slate-700 hover:bg-slate-600 text-amber-400 border border-slate-600 shadow-sm rounded-lg px-4 py-1.5 font-bold text-xs h-auto cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Record Data
                </Button>
              </div>
              <textarea
                value={labNotes}
                onChange={(e) => setLabNotes(e.target.value)}
                placeholder="Log your hypotheses, variable changes, and final results here..."
                className="w-full h-36 p-5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-medium placeholder-slate-600 shadow-inner leading-relaxed"
              ></textarea>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Info Panels */}
          <div className="space-y-6">
            {/* --- EXTRA FEATURE: LIVE VARIABLES --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-700/50">
                <Activity className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Active Variables
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                  <span className="text-sm font-medium text-slate-400">
                    {ui.var1}
                  </span>
                  <span className="text-xs font-black text-amber-400 uppercase">
                    Independent
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                  <span className="text-sm font-medium text-slate-400">
                    {ui.var2}
                  </span>
                  <span className="text-xs font-black text-blue-400 uppercase">
                    Dependent
                  </span>
                </div>
              </div>
            </motion.div>

            {/* --- MATERIALS NEEDED --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-700/50">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Materials
                </h2>
              </div>
              <ul className="space-y-3">
                {experiment.materials.map((material, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span className="font-medium text-slate-300 text-sm">
                      {material}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* --- SAFETY WARNING --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-900/10 rounded-[2rem] border border-red-900/30 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-bold text-red-400 tracking-wide">
                  Safety Protocol
                </h2>
              </div>
              <ul className="space-y-3">
                {experiment.safety_notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold mt-[-2px]">•</span>
                    <span className="text-red-200/70 font-medium text-sm leading-snug">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* --- LEARNING OBJECTIVES --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/40 border border-slate-700/50 rounded-[2rem] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/50">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Objectives
                </h2>
              </div>
              <ul className="space-y-3">
                {experiment.learning_objectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-[-2px]">→</span>
                    <span className="font-medium text-slate-400 text-sm leading-snug">
                      {obj}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* --- FLOATING AI TUTOR ACTION --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <Button
                onClick={() => navigate("/tutor")}
                className="w-full group bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900 h-14 rounded-2xl font-black shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex justify-center items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-800 group-hover:rotate-12 transition-transform" />{" "}
                Consult AI Tutor
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}