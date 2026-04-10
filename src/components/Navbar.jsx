import React from 'react';
import { ShoppingCart, Heart, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full z-50 px-6 md:px-12 py-8 flex items-center justify-between">
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
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="lowercase"
        >
          cavier
        </motion.div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all text-white">
            <ShoppingCart size={16} />
          </button>
          <button className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all text-white">
            <Heart size={16} />
          </button>
          <button className="p-2 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all text-white">
            <User size={16} />
          </button>
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
