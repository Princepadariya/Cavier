import React, { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import heroBg from "./hero-bg.jpeg";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  useGSAP(() => {
    // 6. Hero Section: subtle background movement scale: 1 -> 1.1 (slow)
    // Linked to ScrollTrigger per your exact requirements
    gsap.to(bgRef.current, {
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden text-white">

      {/* Background with GSAP ScrollTrigger Parallax */}
      <div
        ref={bgRef}
        className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

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
        className="relative z-40 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none"
      >
        <h1 className="text-5xl md:text-7xl font-light leading-tight">
          Live Extra Ordinary with <br />
          <span className="font-semibold">Cavier</span>
        </h1>

        <p className="mt-6 max-w-xl text-gray-300">
          Eco-friendly, lead-free bath fittings designed to meet global
          safety standards. Pioneering innovation with high-performance
          solutions for modern infrastructure.
        </p>

        {/* Rule 8. Buttons: Use Motion: hover scale: 1 -> 1.05 tap scale: 0.95 */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 border border-white hover:bg-white hover:text-black transition uppercase text-sm tracking-widest pointer-events-auto"
        >
          Explore more
        </motion.button>
      </motion.div>
    </div>
  );
}