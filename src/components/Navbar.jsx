import React, { useRef } from 'react';
import { ShoppingCart, Heart, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Drop down the cavier logo exactly as requested for the load entry
    gsap.fromTo(
      ".gsap-nav-logo",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.8, ease: "expo.out" }
    );
  }, { scope: containerRef });

  return (
    <nav ref={containerRef} className="absolute top-0 w-full z-50 px-6 md:px-12 py-8 flex items-center justify-between">
      {/* Left Links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
        <a href="#product" className="hover:text-brand-gold transition-colors relative group text-white">
          Product
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#category" className="hover:text-brand-gold transition-colors relative group text-white">
          Category
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#contact" className="hover:text-brand-gold transition-colors relative group text-white">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>

      {/* Center Brand */}
      <div className="text-3xl md:text-5xl font-bold tracking-tight text-white logo-text absolute left-1/2 transform -translate-x-1/2">
        <div className="gsap-nav-logo opacity-0 will-change-transform lowercase">
          cavier
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-colors text-white"
          >
            <ShoppingCart size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-colors text-white"
          >
            <Heart size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-colors text-white"
          >
            <User size={16} />
          </motion.button>
        </div>
        
        {/* Search */}
        <div className="hidden md:flex items-center border border-white/30 rounded-full px-4 py-2 hover:border-white/60 transition-colors">
          <Search size={14} className="text-white/60 mr-2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-sm w-20 focus:w-32 transition-all duration-300 placeholder-white/50 text-white"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
