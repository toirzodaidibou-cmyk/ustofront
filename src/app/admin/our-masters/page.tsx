"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize } from "lucide-react";

// Particles Component for premium background effect
const Particles = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowSize.width === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
          }}
          animate={{
            y: [null, Math.random() * -150 - 50],
            x: [null, Math.random() * 150 - 50],
            opacity: [null, 0],
            scale: [null, Math.random() * 2],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: Math.random() * 8 + 4 + "px",
            height: Math.random() * 8 + 4 + "px",
            boxShadow: "0 0 20px 2px rgba(255, 255, 255, 0.2)",
          }}
        />
      ))}
    </div>
  );
};

export default function OurMastersAppreciationPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  }, []);

  // Word animation
  const titleWords = ["Мо", "бо", "шумо", "мефахрем,"];
  const titleWords2 = ["Устодони", "азиз!"];

  return (
    <div 
      onClick={toggleFullscreen}
      className="fixed inset-0 w-full h-full bg-[#05050A] z-[9999] overflow-hidden font-sans flex items-center justify-center selection:bg-indigo-500/30 cursor-pointer"
    >
      {/* Interactive Cursor Glow */}
      <motion.div 
        className="absolute w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          x: mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth * 0.2 : 0),
          y: mousePosition.y - (typeof window !== 'undefined' ? window.innerWidth * 0.2 : 0),
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />

      {/* Static Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/10 via-[#05050A] to-[#05050A] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[800px] md:h-[800px] bg-purple-600/15 rounded-full blur-[200px] pointer-events-none" />
      
      <Particles />

      <div className="relative z-10 w-full px-4 text-center flex flex-col items-center justify-center">
        
        {/* Flag Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.03] border border-white/10 mb-12 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <span className="text-3xl drop-shadow-lg">🇹🇯</span>
          <span className="text-base font-bold tracking-[0.3em] text-gray-200 uppercase drop-shadow-md">
            UstoTJ Platform
          </span>
        </motion.div>

        {/* Main Massive Text */}
        <h1 className="text-[10vw] md:text-8xl lg:text-[120px] font-black tracking-tighter leading-[1.05] max-w-screen-2xl mx-auto">
          {/* First Line */}
          <div className="flex flex-wrap justify-center gap-[1.5vw] md:gap-6 mb-2">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, ease: "easeOut" }}
                className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
          {/* Second Line */}
          <div className="flex flex-wrap justify-center gap-[1.5vw] md:gap-6">
            {titleWords2.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 1 + (i * 0.2), duration: 1, ease: "easeOut" }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_50px_rgba(168,85,247,0.4)] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="mt-16 text-xl md:text-4xl text-gray-400 font-light max-w-5xl mx-auto leading-relaxed drop-shadow-md"
        >
          Ташаккур барои заҳмат, касбият ва хизмати содиқонаатон.
          <br className="hidden md:block" /> 
          Шумо қаҳрамонони асосии ҷомеаи мо ҳастед!
        </motion.p>

      </div>

      {/* Fullscreen Hint */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          >
            <Maximize size={24} className="animate-bounce" />
            <span className="text-sm tracking-widest uppercase font-light">Барои пурра кардани экран ин ҷоро зер кунед</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
