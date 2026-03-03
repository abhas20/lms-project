// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { ArrowLeft, BookOpen, Calculator, Atom, Award } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@radix-ui/themes";
// import Loader from "../components/Loader";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// const SUBJECT_CONFIG = {
//   math: {
//     title: "Math Explorer",
//     subtitle: "Practice, solve, and dominate math challenges.",
//     icon: Calculator,
//     badge: "Math Module",
//     gradient: "from-indigo-600 to-blue-700",
//   },
//   science: {
//     title: "Science Quiz",
//     subtitle: "Test your scientific reasoning skills.",
//     icon: Atom,
//     badge: "Science Module",
//     gradient: "from-green-600 to-emerald-700",
//   },
//   computer: {
//     title: "Computer Quiz",
//     subtitle: "Master logic, coding & CS fundamentals.",
//     icon: BookOpen,
//     badge: "Computer Module",
//     gradient: "from-fuchsia-600 to-pink-700",
//   },
// };

// export default function QuizLearning() {
//   const navigate = useNavigate();
//   const { subject } = useParams();

//   const config = SUBJECT_CONFIG[subject];

//   const [allTopics, setAllTopics] = useState([]);
//   const [filteredTopics, setFilteredTopics] = useState([]);

//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [problems, setProblems] = useState([]);
//   const [currentProblem, setCurrentProblem] = useState(0);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [result, setResult] = useState(null);
//   const [difficulty, setDifficulty] = useState("all");
//   const [loading, setLoading] = useState(true);

//   // Redirect if invalid subject
//   useEffect(() => {
//     if (!config) {
//       navigate("/", { replace: true });
//       return;
//     }
//     // reset selection when subject changes
//     setSelectedTopic(null);
//     setProblems([]);
//     setCurrentProblem(0);
//     setUserAnswer("");
//     setShowResult(false);
//     setResult(null);
//     setDifficulty("all");
//     fetchTopics();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [subject]);

//   const fetchTopics = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/quiz/${subject}/topics`);
//       setAllTopics(response.data || []);
//       setFilteredTopics(response.data || []);
//     } catch (error) {
//       console.error("Error fetching topics:", error);
//       setAllTopics([]);
//       setFilteredTopics([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterTopics = (level) => {
//     setDifficulty(level);

//     if (level === "all") {
//       setFilteredTopics(allTopics);
//     } else {
//       setFilteredTopics(allTopics.filter((t) => t.difficulty === level));
//     }
//   };

//   const selectTopic = async (topic) => {
//     setSelectedTopic(topic);
//     setProblems([]);
//     setCurrentProblem(0);
//     setUserAnswer("");
//     setShowResult(false);
//     setResult(null);

//     try {
//       const response = await axios.get(
//         `${API}/quiz/${subject}/problems/${topic._id}`,
//       );
//       const data = Array.isArray(response.data) ? response.data : [];
//       setProblems(data);
//       setCurrentProblem(0);
//     } catch (error) {
//       console.error("Error fetching problems:", error);
//       setProblems([]);
//     }
//   };

//   const checkAnswer = async () => {
//     if (!userAnswer.trim()) {
//       toast.error("Please enter an answer!");
//       return;
//     }

//     const problem = problems[currentProblem];
//     if (!problem) {
//       toast.error("No problem selected or problems not loaded.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API}/quiz/${subject}/check-answer?problem_id=${problem._id}&user_answer=${encodeURIComponent(
//           userAnswer,
//         )}`,
//       );

//       setResult(response.data);
//       setShowResult(true);

//       response.data.correct
//         ? toast.success("Correct! 🎉")
//         : toast.error("Try again!");
//     } catch (error) {
//       console.error("Error checking answer:", error);
//       toast.error("Error checking answer");
//     }
//   };

//   const nextProblem = () => {
//     if (currentProblem < problems.length - 1) {
//       setCurrentProblem((p) => p + 1);
//       setUserAnswer("");
//       setShowResult(false);
//       setResult(null);
//     } else {
//       toast.success("You've completed all problems! 🌟");
//       setSelectedTopic(null);
//       setProblems([]);
//     }
//   };

//   if (!config) {
//     return null;
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
//     <div className="min-h-screen bg-[#0b1220] text-slate-100 pb-20">
//       {/* Hero */}
//       <div className="relative overflow-hidden border-b border-slate-800">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-900/40" />
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
//         </div>

//         <div className="relative z-10 container mx-auto px-6 md:px-12 py-14">
//           <Button
//             onClick={() => navigate("/")}
//             variant="ghost"
//             className="mb-8 text-slate-300 hover:text-white hover:bg-white/10 font-bold rounded-xl">
//             <ArrowLeft className="mr-2 h-5 w-5" />
//             Back
//           </Button>

//           <div className="flex items-center gap-6">
//             <div
//               className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
//               <Icon className="h-9 w-9 text-white" />
//             </div>

//             <div>
//               <span className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-widest">
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

//       <div className="container mx-auto px-6 md:px-12 py-8">
//         {!selectedTopic ? (
//           <>
//             {/* Difficulty Filter */}
//             <div
//               className="flex flex-wrap gap-4 mb-10"
//               data-testid="difficulty-filter">
//               {["all", "easy", "medium", "hard"].map((level) => (
//                 <Button
//                   key={level}
//                   onClick={() => filterTopics(level)}
//                   className={`h-11 px-6 rounded-full font-bold transition-all ${
//                     difficulty === level
//                       ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg"
//                       : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
//                   }`}>
//                   {level.toUpperCase()}
//                 </Button>
//               ))}
//             </div>

//             {/* Topics Grid */}
//             {filteredTopics.length === 0 ? (
//               <div className="text-center text-slate-400 py-20">
//                 No topics available for this subject / difficulty.
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {filteredTopics.map((topic) => (
//                   <div
//                     key={topic._id}
//                     data-testid={`topic-card-${topic._id}`}
//                     onClick={() => selectTopic(topic)}
//                     className="group cursor-pointer rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
//                         <BookOpen className="text-indigo-400" />
//                       </div>

//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-bold ${
//                           topic.difficulty === "easy"
//                             ? "bg-green-500/20 text-green-300"
//                             : topic.difficulty === "medium"
//                               ? "bg-yellow-500/20 text-yellow-300"
//                               : "bg-red-500/20 text-red-300"
//                         }`}>
//                         {topic.difficulty}
//                       </span>
//                     </div>

//                     <h3 className="text-2xl font-black text-white mb-2">
//                       {topic.title}
//                     </h3>
//                     <p className="text-slate-400">{topic.description}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             {/* Problem Solving Panel */}
//             <div className="max-w-3xl mx-auto">
//               <Button
//                 data-testid="back-to-topics-button"
//                 onClick={() => {
//                   setSelectedTopic(null);
//                   setProblems([]);
//                 }}
//                 variant="ghost"
//                 className="mb-6 text-slate-300 hover:text-white hover:bg-white/10 font-bold">
//                 <ArrowLeft className="mr-2 h-5 w-5" />
//                 Back to Topics
//               </Button>

//               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-black text-white">
//                     {selectedTopic.title}
//                   </h2>
//                   <span className="text-slate-400 font-bold">
//                     {problems.length > 0
//                       ? `${currentProblem + 1} / ${problems.length}`
//                       : "0 / 0"}
//                   </span>
//                 </div>

//                 {/* If there are no problems, show friendly message */}
//                 {problems.length === 0 ? (
//                   <div className="text-center py-10 text-slate-400">
//                     No problems available for this topic.
//                     <div className="mt-6">
//                       <Button
//                         onClick={() => {
//                           setSelectedTopic(null);
//                           setProblems([]);
//                         }}
//                         className="bg-amber-600 text-white px-6 py-3 rounded-full">
//                         Back to Topics
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-6">
//                       <p
//                         className="text-2xl font-bold text-white"
//                         data-testid="problem-question">
//                         {problems[currentProblem]?.question ??
//                           "Question missing"}
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-slate-300 mb-2">
//                         Your Answer:
//                       </label>
//                       <input
//                         data-testid="answer-input"
//                         type="text"
//                         value={userAnswer}
//                         onChange={(e) => setUserAnswer(e.target.value)}
//                         onKeyDown={(e) =>
//                           e.key === "Enter" && !showResult && checkAnswer()
//                         }
//                         disabled={showResult}
//                         className="w-full h-12 rounded-2xl bg-black/40 border border-white/10 px-4 text-white font-medium focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none"
//                         placeholder="Type your answer here..."
//                       />
//                     </div>

//                     {!showResult ? (
//                       <Button
//                         data-testid="check-answer-button"
//                         onClick={checkAnswer}
//                         className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 rounded-full font-bold shadow-lg active:shadow-none active:translate-y-[2px] transition-all w-full">
//                         Check Answer
//                       </Button>
//                     ) : (
//                       <div className="space-y-4">
//                         <div
//                           className={`rounded-2xl p-6 border ${
//                             result?.correct
//                               ? "bg-green-500/10 border-green-400/30"
//                               : "bg-red-500/10 border-red-400/30"
//                           }`}>
//                           <div className="flex items-center gap-3 mb-3">
//                             {result?.correct ? (
//                               <Award className="text-green-400 h-8 w-8" />
//                             ) : (
//                               <BookOpen className="text-red-400 h-8 w-8" />
//                             )}
//                             <h3 className="text-xl font-black text-white">
//                               {result?.correct ? "Correct!" : "Try Again"}
//                             </h3>
//                           </div>
//                           <p className="text-slate-300">
//                             <strong className="text-white">Answer:</strong>{" "}
//                             {result?.answer ?? "—"}
//                           </p>
//                           <p className="text-slate-400 mt-2">
//                             {result?.explanation ?? ""}
//                           </p>
//                         </div>

//                         <Button
//                           data-testid="next-problem-button"
//                           onClick={nextProblem}
//                           className="bg-amber-600 text-white hover:bg-amber-700 h-12 px-8 rounded-full font-bold shadow-lg active:shadow-none active:translate-y-[2px] transition-all w-full">
//                           Next Problem
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Atom,
  Award,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SUBJECT_CONFIG = {
  math: {
    title: "Math Explorer",
    subtitle: "Practice, solve, and dominate math challenges.",
    icon: Calculator,
    badge: "Math Module",
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
  },
  science: {
    title: "Science Quiz",
    subtitle: "Test your scientific reasoning skills.",
    icon: Atom,
    badge: "Science Module",
    gradient: "from-yellow-400 to-orange-500",
    glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]",
  },
  computer: {
    title: "Computer Quiz",
    subtitle: "Master logic, coding & CS fundamentals.",
    icon: BookOpen,
    badge: "Computer Module",
    gradient: "from-purple-500 to-indigo-500",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
};

export default function QuizLearning() {
  const navigate = useNavigate();
  const { subject } = useParams();
  const topRef = useRef(null);

  const config = SUBJECT_CONFIG[subject];

  const [allTopics, setAllTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) {
      navigate("/", { replace: true });
      return;
    }
    setSelectedTopic(null);
    setProblems([]);
    setCurrentProblem(0);
    setUserAnswer("");
    setShowResult(false);
    setResult(null);
    setDifficulty("all");
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/quiz/${subject}/topics`);
      setAllTopics(response.data || []);
      setFilteredTopics(response.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setAllTopics([]);
      setFilteredTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = (level) => {
    setDifficulty(level);
    if (level === "all") {
      setFilteredTopics(allTopics);
    } else {
      setFilteredTopics(allTopics.filter((t) => t.difficulty === level));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectTopic = async (topic) => {
    setSelectedTopic(topic);
    setProblems([]);
    setCurrentProblem(0);
    setUserAnswer("");
    setShowResult(false);
    setResult(null);
    scrollToTop();

    try {
      const response = await axios.get(
        `${API}/quiz/${subject}/problems/${topic._id}`,
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setProblems(data);
      setCurrentProblem(0);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setProblems([]);
    }
  };

  const checkAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please enter an answer!");
      return;
    }

    const problem = problems[currentProblem];
    if (!problem) {
      toast.error("No problem selected or problems not loaded.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/quiz/${subject}/check-answer?problem_id=${problem._id}&user_answer=${encodeURIComponent(userAnswer)}`,
      );

      setResult(response.data);
      setShowResult(true);

      response.data.correct
        ? toast.success("Brilliant! 🎉")
        : toast.error("Not quite! Try learning from the explanation.");
    } catch (error) {
      console.error("Error checking answer:", error);
      toast.error("Error checking answer");
    }
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem((p) => p + 1);
      setUserAnswer("");
      setShowResult(false);
      setResult(null);
      scrollToTop();
    } else {
      toast.success("You've dominated all problems here! 🌟");
      setSelectedTopic(null);
      setProblems([]);
      scrollToTop();
    }
  };

  if (!config) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div
      className={`min-h-screen bg-[#0B1120] font-sans relative overflow-hidden ${!selectedTopic ? "pb-8" : "pb-2"}`}
      ref={topRef}
    >
      {/* Background Glows (Slightly reduced blur/size to fit the minimized theme) */}
      <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-5%] w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* --- Dynamic Premium Hero Section --- */}
      <AnimatePresence mode="wait">
        {!selectedTopic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            className="relative z-10 border-b border-white/10 bg-[#151B2B]/60 backdrop-blur-xl"
          >
            {/* Widened container max-w-7xl to max-w-screen-xl, reduced vertical padding */}
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-6 md:py-8">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="mb-4 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 font-bold rounded-lg transition-all cursor-pointer h-8 px-3 text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${config.gradient} ${config.glow} flex items-center justify-center border border-white/20`}
                >
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-[#0B1120]" />
                </div>

                <div>
                  <span className="inline-block mb-1.5 px-3 py-1 rounded-md bg-[#0B1120] border border-slate-700 text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm">
                    {config.badge}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {config.title}
                  </h1>
                  <p className="text-sm md:text-base text-slate-400 mt-1 max-w-2xl">
                    {config.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container - Widened to max-w-screen-xl to create zoom-out effect */}
      <div
        className={`max-w-screen-xl mx-auto px-4 md:px-12 relative z-10 ${!selectedTopic ? "py-6" : "py-2 md:py-3"}`}
      >
        {!selectedTopic ? (
          /* --- TOPIC SELECTION --- */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              {["all", "easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => filterTopics(level)}
                  className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 ${
                    difficulty === level
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0B1120] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-[#151B2B] border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {filteredTopics.length === 0 ? (
              <div className="text-center bg-[#151B2B]/50 border border-white/5 rounded-2xl py-12">
                <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-semibold text-base">
                  No topics unlocked for this criteria yet.
                </p>
              </div>
            ) : (
              // Increased columns for larger screens to show more content (zoom out effect)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filteredTopics.map((topic, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={topic._id}
                    onClick={() => selectTopic(topic)}
                    className="group cursor-pointer rounded-[1.5rem] bg-[#151B2B] border border-white/5 p-5 md:p-6 hover:-translate-y-1.5 hover:border-yellow-400/50 hover:shadow-[0_8px_25px_rgba(250,204,21,0.15)] transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0B1120] border border-white/10 flex items-center justify-center group-hover:border-yellow-400/50 transition-colors">
                          <BookOpen className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider ${
                            topic.difficulty === "easy"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : topic.difficulty === "medium"
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {topic.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors leading-tight">
                        {topic.title}
                      </h3>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {topic.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* --- ULTRA-COMPACT PROBLEM SOLVING PANEL (ZOOMED OUT VIEW) --- */
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-5xl mx-auto pt-2"
          >
            <div className="flex flex-row justify-between items-center mb-3">
              <Button
                onClick={() => {
                  setSelectedTopic(null);
                  setProblems([]);
                }}
                variant="ghost"
                className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 font-bold rounded-lg transition-all cursor-pointer -ml-2 px-2.5 py-1 h-8 text-xs"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Topics
              </Button>

              <div className="bg-[#151B2B] border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <span className="text-white font-bold text-xs tracking-wide truncate max-w-[150px] md:max-w-xs">
                  {selectedTopic.title}
                </span>
                <div className="w-px h-3 bg-white/20" />
                <Zap className="text-cyan-400 w-3.5 h-3.5" />
                <span className="text-cyan-400 font-black tracking-widest text-xs">
                  {problems.length > 0
                    ? `${currentProblem + 1}/${problems.length}`
                    : "0/0"}
                </span>
              </div>
            </div>

            <div className="bg-[#151B2B]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-4 md:p-6 shadow-xl">
              {problems.length === 0 ? (
                <div className="text-center py-6">
                  <Atom className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-spin-slow" />
                  <p className="text-slate-400 font-medium text-sm">
                    Compiling challenges...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Question Box */}
                  <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/5 border border-cyan-500/20 rounded-xl p-4 md:p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                    <p className="text-base md:text-lg font-medium text-white leading-snug">
                      {problems[currentProblem]?.question ??
                        "Loading question..."}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !showResult && checkAnswer()
                      }
                      disabled={showResult}
                      className="w-full h-11 md:h-12 rounded-lg bg-[#0B1120] border border-white/10 px-4 text-white text-sm md:text-base font-medium focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all placeholder-slate-600"
                      placeholder="Enter solution..."
                    />
                  </div>

                  {/* Buttons & Results */}
                  <AnimatePresence mode="wait">
                    {!showResult ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Button
                          onClick={checkAnswer}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-10 md:h-11 rounded-lg font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all w-full text-sm md:text-base cursor-pointer flex justify-center items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" /> Submit
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div
                          className={`rounded-xl p-4 border ${
                            result?.correct
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-rose-500/10 border-rose-500/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`p-1.5 rounded-md ${result?.correct ? "bg-green-500/20" : "bg-rose-500/20"}`}
                            >
                              {result?.correct ? (
                                <Award className="text-green-400 h-4 w-4" />
                              ) : (
                                <Target className="text-rose-400 h-4 w-4" />
                              )}
                            </div>
                            <h3
                              className={`text-base md:text-lg font-bold ${result?.correct ? "text-green-400" : "text-rose-400"}`}
                            >
                              {result?.correct
                                ? "Perfect!"
                                : "Review Solution:"}
                            </h3>
                          </div>

                          <div className="bg-[#0B1120]/50 rounded-md p-2 mb-2 border border-white/5 flex items-center flex-wrap gap-2">
                            <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                              Answer:{" "}
                            </span>
                            <span className="text-white font-medium text-sm md:text-base">
                              {result?.answer ?? "—"}
                            </span>
                          </div>

                          <p className="text-slate-300 leading-snug text-xs md:text-sm">
                            {result?.explanation ?? "No explanation."}
                          </p>
                        </div>

                        <Button
                          onClick={nextProblem}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-[#0B1120] h-10 md:h-11 rounded-lg font-bold transition-all w-full text-sm md:text-base cursor-pointer"
                        >
                          {currentProblem < problems.length - 1
                            ? "Next"
                            : "Finish"}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}