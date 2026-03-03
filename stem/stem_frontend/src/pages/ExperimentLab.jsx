// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { ArrowLeft, Atom, Zap, FlaskConical, Monitor } from "lucide-react";
// import { Button } from "@radix-ui/themes";
// import Loader from "../components/Loader";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// const SUBJECT_CONFIG = {
//   physics: {
//     title: "Physics Lab",
//     subtitle: "Explore forces, motion & energy.",
//     icon: Atom,
//     badge: "Physics Lab",
//     gradient: "from-orange-500 to-yellow-400",
//     bg: "from-orange-900 via-orange-800/90 to-orange-900/50",
//   },
//   chemistry: {
//     title: "Chemistry Lab",
//     subtitle: "React, mix & discover chemical wonders.",
//     icon: FlaskConical,
//     badge: "Chemistry Lab",
//     gradient: "from-lime-500 to-emerald-600",
//     bg: "from-emerald-900 via-emerald-800/90 to-emerald-900/50",
//   },
//   computer: {
//     title: "Computer Lab",
//     subtitle: "Simulate algorithms & systems.",
//     icon: Monitor,
//     badge: "Computer Lab",
//     gradient: "from-cyan-500 to-blue-600",
//     bg: "from-cyan-900 via-cyan-800/90 to-cyan-900/50",
//   },
//   math: {
//     title: "Math Lab",
//     subtitle: "Visualise mathematical concepts in real life.",
//     icon: Zap,
//     badge: "Math Lab",
//     gradient: "from-purple-500 to-pink-600",
//     bg: "from-purple-900 via-purple-800/90 to-purple-900/50",
//   }
// };

// export default function ExperimentLab() {
//   const navigate = useNavigate();
//   const { subject } = useParams();
//   const config = SUBJECT_CONFIG[subject];

//   const [experiments, setExperiments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (config) fetchExperiments();
//   }, [subject]);

//   const fetchExperiments = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/${subject}/experiments`);
//       setExperiments(response.data);
//     } catch (error) {
//       console.error("Error fetching experiments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!config) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white text-xl">
//         Invalid Lab 🚫
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader />
//       </div>
//     );
//   }

//   const Icon = config.icon;

//   return (
//     <div className="min-h-screen bg-[#1b1f2a] text-slate-100 pb-20">
//       {/* Hero */}
//       <div className="relative overflow-hidden border-b border-slate-800">
//         <div className="absolute inset-0">
//           <div className={`absolute inset-0 bg-gradient-to-r ${config.bg}`} />
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-10 mix-blend-overlay" />
//         </div>

//         <div className="relative z-10 container mx-auto px-6 md:px-12 py-14">
//           <Button
//             onClick={() => navigate("/")}
//             variant="ghost"
//             className="mb-8 p-2 text-slate-300 hover:text-white hover:bg-white/10 font-bold rounded-xl">
//             <ArrowLeft className="mr-2 h-5 w-5" />
//             Back
//           </Button>

//           <div className="flex items-center gap-6">
//             <div
//               className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
//               <Icon className="h-9 w-9 text-white" />
//             </div>

//             <div>
//               <span className="inline-block mb-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest">
//                 {config.badge}
//               </span>

//               <h1 className="text-4xl md:text-5xl font-black text-white">
//                 {config.title}
//               </h1>

//               <p className="text-lg text-slate-300 mt-2">{config.subtitle}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="container mx-auto px-6 md:px-12 py-8">
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {experiments.map((experiment) => (
//             <div
//               key={experiment._id}
//               onClick={() =>
//                 navigate(`/experiment/${subject}/${experiment._id}`)
//               }
//               className="group cursor-pointer rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
//                   <Zap className="text-white" />
//                 </div>

//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-bold ${
//                     experiment.difficulty === "easy"
//                       ? "bg-green-500/20 text-green-300"
//                       : experiment.difficulty === "medium"
//                         ? "bg-yellow-500/20 text-yellow-300"
//                         : "bg-red-500/20 text-red-300"
//                   }`}>
//                   {experiment.difficulty}
//                 </span>
//               </div>

//               <h3 className="text-2xl font-black text-white mb-2">
//                 {experiment.title}
//               </h3>

//               <p className="text-slate-400 font-medium mb-4">
//                 {experiment.description}
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 {experiment.materials.slice(0, 3).map((m, idx) => (
//                   <span
//                     key={idx}
//                     className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-slate-300">
//                     {m}
//                   </span>
//                 ))}

//                 {experiment.materials.length > 3 && (
//                   <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-slate-300">
//                     +{experiment.materials.length - 3} more
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Atom,
  Zap,
  FlaskConical,
  Monitor,
  Target,
  ArrowRight,
  Filter,
  Beaker,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Loader from "../components/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Medium-Dark Theme with Premium Gold/Amber Undertones
const SUBJECT_CONFIG = {
  physics: {
    title: "Physics Lab",
    subtitle: "Explore forces, motion & energy.",
    icon: Atom,
    badge: "Physics Module",
    gradient: "from-amber-400 to-amber-600",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.2)]",
    cardGlow:
      "hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] hover:border-amber-500/40",
  },
  chemistry: {
    title: "Chemistry Lab",
    subtitle: "React, mix & discover chemical wonders.",
    icon: FlaskConical,
    badge: "Chemistry Module",
    gradient: "from-amber-400 to-yellow-500", // Shifted to Gold vibe
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.2)]",
    cardGlow:
      "hover:shadow-[0_10px_30px_rgba(234,179,8,0.1)] hover:border-yellow-500/40",
  },
  computer: {
    title: "Computer Lab",
    subtitle: "Simulate algorithms & systems.",
    icon: Monitor,
    badge: "Computer Module",
    gradient: "from-amber-500 to-orange-500", // Shifted to Gold/Orange vibe
    glow: "shadow-[0_0_40px_rgba(249,115,22,0.2)]",
    cardGlow:
      "hover:shadow-[0_10px_30px_rgba(249,115,22,0.1)] hover:border-orange-500/40",
  },
  math: {
    title: "Math Lab",
    subtitle: "Visualise mathematical concepts in real life.",
    icon: Zap,
    badge: "Math Module",
    gradient: "from-yellow-400 to-amber-500", // Shifted to Gold vibe
    glow: "shadow-[0_0_40px_rgba(250,204,21,0.2)]",
    cardGlow:
      "hover:shadow-[0_10px_30px_rgba(250,204,21,0.1)] hover:border-amber-400/40",
  },
};

export default function ExperimentLab() {
  const navigate = useNavigate();
  const { subject } = useParams();
  const config = SUBJECT_CONFIG[subject];

  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (config) fetchExperiments();
  }, [subject]);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/${subject}/experiments`);
      setExperiments(response.data);
    } catch (error) {
      console.error("Error fetching experiments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300 text-xl font-bold tracking-widest uppercase">
        Invalid Laboratory Sequence 🚫
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

  const Icon = config.icon;

  // Filter logic
  const filteredExperiments =
    activeFilter === "all"
      ? experiments
      : experiments.filter(
          (exp) => exp.difficulty.toLowerCase() === activeFilter,
        );

  return (
    // Medium-Dark Background (Slate 900)
    <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-24 font-sans relative overflow-hidden">
      {/* Soft Ambient Glows (Not too bright) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 border-b border-slate-800 bg-[#1E293B]/80 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-8 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 font-bold rounded-xl transition-all cursor-pointer h-auto py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Base
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div
              className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${config.gradient} ${config.glow} flex items-center justify-center border border-white/20 shrink-0 shadow-inner`}
            >
              <Icon className="h-12 w-12 text-slate-900" />
            </div>

            <div>
              <span className="inline-block mb-3 px-4 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                {config.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3">
                {config.title}
              </h1>

              <p className="text-lg text-slate-400 font-medium max-w-2xl">
                {config.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
        {/* --- EXTRA FEATURE: FILTERS & STATS BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Filter className="text-slate-500 w-5 h-5" />
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              {["all", "easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveFilter(level)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeFilter === level
                      ? "bg-slate-700 text-amber-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1E293B] px-4 py-2 rounded-xl border border-slate-700 shadow-sm">
              <Beaker className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-300">
                {filteredExperiments.length}{" "}
                {filteredExperiments.length === 1 ? "Lab" : "Labs"} Found
              </span>
            </div>
          </div>
        </div>

        {filteredExperiments.length === 0 ? (
          <div className="text-center py-20 bg-[#1E293B]/50 rounded-[2rem] border border-slate-800">
            <FlaskConical className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">
              No laboratories match this criteria currently.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredExperiments.map((experiment, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={experiment._id}
                onClick={() =>
                  navigate(`/experiment/${subject}/${experiment._id}`)
                }
                // Medium-Dark Card bg-[#1E293B]
                className={`group cursor-pointer rounded-[2rem] bg-[#1E293B] border border-slate-700 p-6 md:p-8 transition-all duration-300 relative flex flex-col h-full ${config.cardGlow}`}
              >
                <div className="relative z-10 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors shadow-inner">
                      <Target className="text-amber-500 w-5 h-5 transition-colors" />
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                        experiment.difficulty === "easy"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : experiment.difficulty === "medium"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {experiment.difficulty}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-amber-400 transition-colors">
                    {experiment.title}
                  </h3>

                  <p className="text-slate-400 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                    {experiment.description}
                  </p>
                </div>

                <div className="relative z-10 mt-auto pt-6 border-t border-slate-700/60 flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {experiment.materials.slice(0, 2).map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md text-[10px] font-semibold text-slate-300"
                      >
                        {m}
                      </span>
                    ))}

                    {experiment.materials.length > 2 && (
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md text-[10px] font-bold text-amber-500">
                        +{experiment.materials.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}