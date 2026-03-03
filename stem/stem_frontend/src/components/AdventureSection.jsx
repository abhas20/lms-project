// import { useState } from "react";
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function AdventureSection({ adventures }) {
//   const [mode, setMode] = useState("quiz");
//   const navigate = useNavigate();

//   const activeSection = adventures.find((a) => a.id === mode);

//   return (
//     <section className="py-24 px-6 bg-gradient-to-r from-blue-200 to-indigo-400">
//       <div className="max-w-7xl mx-auto">
//         {/* Heading */}
//         <motion.h2
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           className="text-4xl md:text-5xl font-black text-center mb-10">
//           Choose Your{" "}
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-lime-500">
//             Adventure
//           </span>
//         </motion.h2>

//         {/* Toggle */}
//         <div className="flex justify-center mb-16">
//           <div className="bg-white/80 backdrop-blur-lg p-1 rounded-2xl shadow-lg flex">
//             {["quiz", "experiment"].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setMode(type)}
//                 className={`px-8 py-3 rounded-xl font-black uppercase text-sm transition-all
//                   ${
//                     mode === type
//                       ? "bg-slate-900 text-white shadow-lg scale-105"
//                       : "text-slate-700 hover:bg-slate-200"
//                   }
//                 `}>
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Cards */}
//         <motion.div
//           key={mode}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.35 }}
//           className="grid md:grid-cols-3 gap-8">
//           {activeSection.items.map((item, i) => {
//             const Icon = item.icon;

//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.12 }}
//                 whileHover={{ y: -10 }}
//                 onClick={() => navigate(item.path)}
//                 className="group cursor-pointer rounded-[2.5rem] overflow-hidden relative shadow-2xl">
//                 <div
//                   className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700"
//                   style={{ backgroundImage: `url(${item.bgImage})` }}
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

//                 <div className="relative z-10 p-8 h-full flex flex-col justify-end">
//                   <div
//                     className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl mb-6 shadow-lg`}>
//                     <Icon />
//                   </div>

//                   <h3 className="text-3xl font-black text-white mb-2">
//                     {item.title}
//                   </h3>

//                   <p className="text-white/90 mb-6">{item.description}</p>

//                   <div className="flex items-center font-bold text-white">
//                     Explore
//                     <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BrainCircuit, Rocket, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdventureSection({ adventures }) {
  const [mode, setMode] = useState("quiz");
  const navigate = useNavigate();

  const activeSection = adventures.find((a) => a.id === mode);

  return (
    // Rich Navy Blue background (Not too dark, very professional)
    <section className="py-24 px-6 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] relative overflow-hidden font-sans min-h-screen">
      {/* Soft Ambient Lights (Lighter and more colorful) */}
      <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-blue-500/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-yellow-400/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- Hero Heading Area --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold tracking-[0.3em] text-blue-300 uppercase mb-4 drop-shadow-md">
            Interactive STEM Platform
          </h2>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
            Explore. Experiment. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              Dominate.
            </span>
          </h1>
        </motion.div>

        {/* --- Smooth Toggle Button --- */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="bg-[#1E293B]/80 border border-slate-600/50 p-1.5 rounded-full shadow-xl backdrop-blur-md flex relative">
            {["quiz", "experiment"].map((type) => (
              <button
                key={type}
                onClick={() => setMode(type)}
                className={`relative px-12 py-3.5 rounded-full font-bold uppercase text-sm tracking-widest transition-all duration-300 ${
                  mode === type
                    ? "text-[#0F172A]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {mode === type && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full -z-10 shadow-[0_4px_15px_rgba(250,204,21,0.4)]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- Cards Grid (WITH IMAGES) --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {activeSection.items.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(item.path)}
                  className="group cursor-pointer rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-slate-700/50 hover:border-yellow-400/60 transition-all duration-500 min-h-[400px]"
                >
                  {/* BEAUTIFUL VISIBLE BACKGROUND IMAGE */}
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700 opacity-90"
                    style={{ backgroundImage: `url(${item.bgImage})` }}
                  />

                  {/* Navy to Transparent Overlay (So text is visible but image shines through) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent group-hover:from-[#0F172A] transition-colors duration-500" />

                  {/* Card Content */}
                  <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                    {/* Floating Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl mb-6 shadow-lg ring-1 ring-white/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all duration-300`}
                    >
                      <Icon />
                    </div>

                    <h3 className="text-3xl font-black text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-slate-300 text-base leading-relaxed mb-6 group-hover:text-white transition-colors duration-300 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center text-yellow-400 font-bold text-lg">
                      Explore
                      <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* --- Stats Bar --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#1E293B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center shadow-2xl"
        >
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="text-4xl font-black text-yellow-400 flex items-center justify-center md:justify-start gap-2 mb-1">
              <BrainCircuit className="w-8 h-8" /> 100+
            </div>
            <p className="text-slate-300 text-sm uppercase tracking-wider font-bold">
              Math Challenges
            </p>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-600/50" />

          <div className="text-center mb-6 md:mb-0">
            <div className="text-4xl font-black text-blue-400 flex items-center justify-center gap-2 mb-1">
              <Activity className="w-8 h-8" /> 20+
            </div>
            <p className="text-slate-300 text-sm uppercase tracking-wider font-bold">
              Experiments
            </p>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-600/50" />

          <div className="text-center">
            <div className="text-4xl font-black text-white flex items-center justify-center gap-2 mb-1">
              <Rocket className="w-8 h-8" /> 24/7
            </div>
            <p className="text-slate-300 text-sm uppercase tracking-wider font-bold">
              AI Tutor
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}