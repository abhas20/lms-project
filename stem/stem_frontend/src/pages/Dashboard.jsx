

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FlaskConical,
  Calculator,
  Atom,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import AdventureSection from "../components/AdventureSection";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const mainUrl = import.meta.env.VITE_MAIN_URL || "http://localhost:5173";

const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("quiz");

  const adventures = [
    {
      id: "quiz",
      title: "Quiz Arena",
      subtitle: "Test your knowledge & sharpen your mind",
      items: [
        {
          id: "math",
          title: "Math Explorer",
          description: "Solve puzzles, logic & challenges.",
          icon: Calculator,
          color: "from-blue-500 to-cyan-400",
          bgImage:
            "https://images.unsplash.com/photo-1735116356965-ad5b323d1af8",
          path: "/quiz/math",
        },
        {
          id: "science",
          title: "Science Quiz",
          description: "Explore biology, physics & chemistry.",
          icon: Atom,
          color: "from-yellow-400 to-orange-500",
          bgImage:
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
          path: "/quiz/science",
        },
        {
          id: "computer",
          title: "Computer Quiz",
          description: "Test your CS & programming skills.",
          icon: Sparkles,
          color: "from-purple-500 to-indigo-500",
          bgImage:
            "https://images.unsplash.com/photo-1518770660439-4636190af475",
          path: "/quiz/computer",
        },
      ],
    },

    {
      id: "experiment",
      title: "Experiment Lab",
      subtitle: "Learn by doing real simulations",
      items: [
        {
          id: "physics",
          title: "Physics Lab",
          description: "Motion, forces & simulations.",
          icon: Atom,
          color: "from-orange-400 to-amber-500",
          bgImage:
            "https://images.unsplash.com/photo-1675627453075-0f170b02186a",
          path: "/experiment/physics",
        },
        {
          id: "chemistry",
          title: "Chemistry Lab",
          description: "React, mix & discover.",
          icon: FlaskConical,
          color: "from-emerald-400 to-teal-500",
          bgImage:
            "https://images.unsplash.com/photo-1633412748213-0cf8268c357f",
          path: "/experiment/chemistry",
        },
        {
          id: "computer",
          title: "Computer Lab",
          description: "Simulate algorithms & systems.",
          icon: TrendingUp,
          color: "from-cyan-500 to-blue-500",
          bgImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
          path: "/experiment/computer",
        },
        {
          id: "math",
          title: "Math Lab",
          description: "Visualise in real life.",
          icon: TrendingUp,
          color: "from-blue-500 to-indigo-500",
          bgImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
          path: "/experiment/math",
        },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#0B1120] text-slate-100 pb-10 font-sans relative"
      data-testid="dashboard-page"
    >
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* ================= HEADER / TOP BAR ================= */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0B1120]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-xl px-4 py-2 font-bold cursor-pointer group"
            onClick={() => (window.location.href = mainUrl)}
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </Button>

          {/* Optional: Add a sleek right-side element like a user profile or 'Pro' badge if needed */}
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 border-b border-white/5">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1633412748213-0cf8268c357f"
            alt="STEM Background"
            className="w-full h-full object-cover"
          />
          {/* Deep Navy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-[#0B1120]/50" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center md:items-start md:text-left mt-[-5%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#151B2B]/80 backdrop-blur-md border border-white/10 text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles className="w-3.5 h-3.5" /> Interactive STEM Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black text-white leading-[1.05] tracking-tight mb-6"
          >
            Explore. Experiment. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.3)]">
              Dominate.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto md:mx-0 mb-12 leading-relaxed font-medium"
          >
            Learn Math, Physics, and Chemistry through challenges, experiments,
            and AI-powered guidance designed for modern achievers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center md:justify-start"
          >
            {/* Ask AI Tutor Button - White & Prominent */}
            <button
              onClick={() => navigate("/tutor")}
              className="group relative px-8 py-4 rounded-[1.25rem] bg-white text-[#0B1120] font-bold text-base tracking-wide shadow-[0_10px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.25)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex justify-center items-center gap-2">
                Ask AI Tutor{" "}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Start Learning Button - Glassmorphism */}
            <button
              onClick={() => navigate("/quiz/math")}
              className="px-8 py-4 rounded-[1.25rem] bg-[#151B2B]/60 backdrop-blur-xl border border-white/10 text-white font-bold text-base tracking-wide hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex justify-center items-center shadow-lg"
            >
              Start Learning
            </button>

            {/* Explore 3D Models - Vibrant Blue */}
            <button
              onClick={() => {
                window.location.href = "https://ai-3d-playground.vercel.app/";
              }}
              className="px-8 py-4 rounded-[1.25rem] bg-gradient-to-r from-blue-600 to-[#2563EB] hover:from-blue-500 hover:to-[#1D4ED8] text-white font-bold text-base tracking-wide shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center"
            >
              Explore 3D models
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= ADVENTURE SECTION ================= */}
      <div className="relative z-10 -mt-10">
        <AdventureSection adventures={adventures} />
      </div>

      {/* ================= PREMIUM STATS SECTION ================= */}
      <section className="py-16 md:py-24 relative z-10 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#151B2B]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 p-10 md:p-14 overflow-hidden relative group"
          >
            {/* Subtle top glare */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Inner background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="grid md:grid-cols-3 gap-10 md:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/5 relative z-10">
              {[
                { value: "100+", label: "Math Challenges" },
                { value: "20+", label: "Experiments" },
                { value: "24/7", label: "AI Tutor Support" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="pt-8 md:pt-0 first:pt-0 flex flex-col items-center justify-center group/stat cursor-default"
                >
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover/stat:from-yellow-400 group-hover/stat:to-yellow-600 drop-shadow-lg mb-3 transition-all duration-500 transform group-hover/stat:scale-105">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs md:text-sm group-hover/stat:text-slate-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}