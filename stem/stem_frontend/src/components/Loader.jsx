// import React from "react";

// const Loader = () => {
//   return (
//     <div className="flex items-center justify-center">
//       <div
//         aria-label="Orange and tan hamster running in a metal wheel"
//         role="img"
//         className="wheel-and-hamster">
//         <div className="wheel" />
//         <div className="hamster">
//           <div className="hamster__body">
//             <div className="hamster__head">
//               <div className="hamster__ear" />
//               <div className="hamster__eye" />
//               <div className="hamster__nose" />
//             </div>
//             <div className="hamster__limb hamster__limb--fr" />
//             <div className="hamster__limb hamster__limb--fl" />
//             <div className="hamster__limb hamster__limb--br" />
//             <div className="hamster__limb hamster__limb--bl" />
//             <div className="hamster__tail" />
//           </div>
//         </div>
//         <div className="spoke" />
//       </div>
//     </div>
//   );
// };

// export default Loader;

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react"; // Ya koi bhi STEM icon use kar sakte ho

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full bg-transparent">
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* --- Outer Glow / Nebula --- */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-[-20%] bg-blue-600/20 blur-[30px] rounded-full"
        />

        {/* --- Outer Rotating Ring (Blue) --- */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        />

        {/* --- Inner Rotating Ring (Gold) --- */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-3 rounded-full border-t-2 border-l-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        />

        {/* --- Center Pulsing Core --- */}
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative z-10 w-12 h-12 bg-[#0F172A] border border-yellow-500/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)]"
        >
          <BrainCircuit className="text-yellow-400 w-6 h-6" />
        </motion.div>
      </div>

      {/* --- Loading Text --- */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mt-6 text-sm font-bold tracking-[0.3em] text-blue-400 uppercase drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
      >
        Initializing...
      </motion.div>
    </div>
  );
};

export default Loader;