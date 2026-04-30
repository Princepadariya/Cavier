import React, { useRef, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger, createSpring } from 'animejs';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ variant = 'default' }) => {
  const containerRef = useRef(null);
  const { cartItems } = useCart();
  const isContact = variant === 'contact';

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const logo = el.querySelector('.gsap-nav-logo');
    const links = el.querySelectorAll('.nav-link');
    const icons = el.querySelectorAll('.nav-icon');

    // Logo spring drop-in
    if (logo) {
      animate(logo, {
        opacity: [0, 1],
        translateY: [-30, 0],
        duration: 1800,
        ease: createSpring({ stiffness: 90, damping: 12, mass: 1 }),
      });
    }

    // Nav links stagger from left
    if (links.length > 0) {
      animate(links, {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 900,
        delay: stagger(80, { start: 400 }),
        ease: 'outQuart',
      });
    }

    // Icons stagger from right
    if (icons.length > 0) {
      animate(icons, {
        opacity: [0, 1],
        translateX: [15, 0],
        scale: [0.8, 1],
        duration: 800,
        delay: stagger(60, { start: 600 }),
        ease: 'outBack',
      });
    }
  }, []);

  return (
    <nav ref={containerRef} className="absolute top-0 w-full z-50 px-6 md:px-12 lg:px-32 py-8 flex items-center justify-between">
      {/* Left Links */}
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
        <Link to="/product" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Product
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/#category" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Category
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/about" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          About Us
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/dealership" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Dealership
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/contact" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      {/* Center Brand */}
      <div 
        className={`text-3xl md:text-5xl font-semibold tracking-tight text-white logo-text absolute left-1/2 transform -translate-x-1/2 ${isContact ? 'mix-blend-difference' : ''}`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <Link to="/" className="gsap-nav-logo opacity-0 block will-change-transform lowercase">
          cavier
        </Link>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Link to="/checkout" className="relative group">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-icon p-2 rounded-full border transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:border-black' : 'border-white/20 text-white hover:border-brand-gold hover:text-brand-gold'}`}
            >
              <ShoppingCart size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-gold text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Link>
          <motion.button 
            data-magnetic
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-icon p-2 rounded-full border transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:border-black' : 'border-white/20 text-white hover:border-brand-gold hover:text-brand-gold'}`}
          >
            <Heart size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-icon p-2 rounded-full border transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:border-black' : 'border-white/20 text-white hover:border-brand-gold hover:text-brand-gold'}`}
          >
            <User size={16} />
          </motion.button>
        </div>
        
        {/* Search */}
        <div className={`nav-icon hidden md:flex items-center border rounded-full px-4 py-2 transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 hover:border-black text-black' : 'border-white/30 hover:border-white/60 text-white'}`}>
          <Search size={14} className={isContact ? 'text-black/60 mr-2' : 'text-white/60 mr-2'} />
          <input 
            type="text" 
            placeholder="Search" 
            className={`bg-transparent border-none outline-none text-sm w-20 focus:w-32 transition-all duration-300 ${isContact ? 'placeholder-black/50 text-black' : 'placeholder-white/50 text-white'}`}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
