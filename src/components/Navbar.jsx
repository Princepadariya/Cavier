import React, { useRef, useEffect, useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger, createSpring } from 'animejs';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ variant = 'default' }) => {
  const containerRef = useRef(null);
  const { cartItems } = useCart();
  const isContact = variant === 'contact';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

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
    <>
    <nav ref={containerRef} className="absolute top-0 w-full z-50 px-4 sm:px-6 md:px-12 lg:px-32 py-5 md:py-8 flex items-center justify-between">
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
      <div className="flex items-center space-x-3 md:space-x-6 ml-auto">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/checkout" className="relative group">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`nav-icon p-2 rounded-full border transition-colors opacity-0 will-change-transform ${isContact ? 'md:border-black/50 md:text-black md:hover:border-black border-white/20 text-white hover:border-brand-gold hover:text-brand-gold' : 'border-white/20 text-white hover:border-brand-gold hover:text-brand-gold'}`}
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
            className={`nav-icon hidden sm:block p-2 rounded-full border transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:border-black' : 'border-white/20 text-white hover:border-brand-gold hover:text-brand-gold'}`}
          >
            <Heart size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-icon hidden sm:block p-2 rounded-full border transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:border-black' : 'border-white/20 text-white hover:border-brand-gold hover:text-brand-gold'}`}
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

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(true)}
          className={`md:hidden p-2 rounded-full border transition-colors border-white/20 text-white`}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </motion.button>
      </div>
    </nav>

    {/* ── Mobile Slide-Out Menu ── */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 h-full w-[75vw] max-w-[320px] bg-[#111] z-[110] md:hidden flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-end p-5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full border border-white/20 text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Mobile nav links */}
            <div className="flex flex-col px-8 gap-1 mt-4">
              {[
                { to: '/product', label: 'Product' },
                { to: '/#category', label: 'Category' },
                { to: '/about', label: 'About Us' },
                { to: '/dealership', label: 'Dealership' },
                { to: '/contact', label: 'Contact' },
              ].map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-4 text-white text-lg font-light tracking-wide border-b border-white/10 hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile menu icons */}
            <div className="mt-auto px-8 pb-10 flex items-center gap-4">
              <Link to="/checkout" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-full border border-white/20 text-white">
                <ShoppingCart size={18} />
              </Link>
              <button className="p-3 rounded-full border border-white/20 text-white">
                <Heart size={18} />
              </button>
              <button className="p-3 rounded-full border border-white/20 text-white">
                <User size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
