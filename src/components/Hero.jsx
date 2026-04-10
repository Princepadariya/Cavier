import { motion } from "framer-motion";
import heroBg from "./hero-bg.jpeg";

export default function Hero() {
  return (
    <div className="relative h-screen overflow-hidden text-white">

      {/* Background */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* LEFT PANEL (Curtain) */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 1.5, ease: [0.83, 0, 0.17, 1] }}
        className="absolute left-0 top-0 h-full w-1/2 bg-black z-20"
      />

      {/* RIGHT PANEL (Curtain) */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.5, ease: [0.83, 0, 0.17, 1] }}
        className="absolute right-0 top-0 h-full w-1/2 bg-black z-20"
      />



      {/* TEXT CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="relative z-40 flex flex-col items-center justify-center h-full text-center px-4"
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

        <button className="mt-8 px-6 py-3 border border-white hover:bg-white hover:text-black transition">
          Explore more
        </button>
      </motion.div>
    </div>
  );
}