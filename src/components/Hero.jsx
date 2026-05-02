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
    // 6. Hero Section: 3D Depth Parallax
    // Background moves slower (20%) while foreground moves faster
    gsap.to(bgRef.current, {
      y: 150,
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(".hero-text-content", {
      y: -100,
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
    <div ref={containerRef} className="relative h-[100dvh] md:h-screen overflow-hidden text-white">

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
        className="hero-text-content relative z-40 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 pointer-events-none"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light leading-tight">
          Live Extra Ordinary with <br className="hidden md:block" />
          <span className="font-semibold">Cavier</span>
        </h1>

        <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-md md:max-w-xl text-sm sm:text-base text-gray-300">
          Eco-friendly, lead-free bath fittings designed to meet global
          safety standards. Pioneering innovation with high-performance
          solutions for modern infrastructure.
        </p>

        {/* Rule 8. Buttons: Use Motion: hover scale: 1 -> 1.05 tap scale: 0.95 */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 sm:mt-8 px-5 sm:px-6 py-2.5 sm:py-3 border border-white hover:bg-white hover:text-black transition uppercase text-xs sm:text-sm tracking-widest pointer-events-auto"
        >
          Explore more
        </motion.button>
      </motion.div>
    </div>
  );
}