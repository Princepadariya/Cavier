import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mobile uses hero-bg.jpg; desktop (≥768px) uses hero-bg_desktop.png
const HERO_BG_MOBILE = "/images/hero-bg.jpg";
const HERO_BG_DESKTOP = "/images/hero-bg_desktop.png";

export default function Hero() {
  const [hero, setHero] = useState({ bg: HERO_BG_DESKTOP, pos: "center bottom" });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setHero(mq.matches
      ? { bg: HERO_BG_MOBILE, pos: "center 70%" }
      : { bg: HERO_BG_DESKTOP, pos: "center bottom" });
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="relative h-[100svh] md:h-screen overflow-hidden text-white">

      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover"
        style={{
          backgroundImage: `url(${hero.bg})`,
          backgroundPosition: hero.pos,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* LEFT PANEL (Curtain) - Framer Motion Slower Easing */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
        className="absolute left-0 top-0 h-full w-1/2 bg-black z-20 pointer-events-none"
      />

      {/* RIGHT PANEL (Curtain) - Framer Motion Slower Easing */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1] }}
        className="absolute right-0 top-0 h-full w-1/2 bg-black z-20 pointer-events-none"
      />

      {/* TEXT CONTENT - Original Framer Motion Sequence (Much slower and delayed) */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
        className="hero-text-content relative z-40 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 pointer-events-none"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-loose">
          Live Extra Ordinary with <br className="hidden md:block" />
          <span className="font-semibold inline-block mt-4 md:mt-6">Cavier</span>
        </h1>

        <p className="mt-4 sm:mt-6 max-w-md sm:max-w-2xl md:max-w-4xl text-sm sm:text-base md:text-lg text-white-400 leading-loose">
          Eco-friendly, lead-free bath fittings designed to meet global
          safety standards. Pioneering innovation with high-performance
          solutions for modern infrastructure.
        </p>

        {/* Rule 8. Buttons: Use Motion: hover scale: 1 -> 1.05 tap scale: 0.95 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 sm:mt-12 px-3 sm:px-4 py-2.5 sm:py-3 border border-white hover:bg-white hover:text-black transition text-[11px] sm:text-[15px] tracking-widest pointer-events-auto"
        >
          Explore more
        </motion.button>
      </motion.div>
    </div>
  );
}