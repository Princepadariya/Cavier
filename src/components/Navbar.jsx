import React, { useRef, useEffect, useState } from 'react';
import { Store, Download, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger, createSpring } from 'animejs';
import { Link } from 'react-router-dom';

const Navbar = ({ variant = 'default' }) => {
  const containerRef = useRef(null);
  const isContact = variant === 'contact';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <Link to="/about" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/product" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Product
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/#category" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Category
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/contact" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/blog" className="nav-link hover:text-brand-gold transition-colors relative group text-white opacity-0 will-change-transform">
          Blog
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      {/* Center Brand */}
      <div
        className={`logo-text absolute left-1/2 transform -translate-x-1/2 ${isContact ? 'mix-blend-difference' : ''}`}
      >
        <Link to="/" className="gsap-nav-logo opacity-0 block will-change-transform">
          <img src="/images/cavier_logo.png" alt="Cavier" className="h-16 md:h-36 w-auto object-contain" />
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 md:space-x-4 ml-auto">
        {/* Dealership */}
        <Link to="/dealership" className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-icon flex items-center gap-2 border rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:bg-black hover:text-white' : 'border-white/30 text-white hover:bg-white hover:text-black'}`}
          >
            <Store size={15} />
            <span>Dealership</span>
          </motion.button>
        </Link>

        {/* Download */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`nav-icon hidden md:flex items-center gap-2 border rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors opacity-0 will-change-transform ${isContact ? 'border-black/50 text-black hover:bg-black hover:text-white' : 'border-white/30 text-white hover:bg-white hover:text-black'}`}
        >
          <Download size={15} />
          <span>Download</span>
        </motion.button>

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
                { to: '/about', label: 'About' },
                { to: '/product', label: 'Product' },
                { to: '/#category', label: 'Category' },
                { to: '/contact', label: 'Contact' },
                { to: '/blog', label: 'Blog' },
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

            {/* Mobile menu actions */}
            <div className="mt-auto px-8 pb-10 flex flex-col gap-3">
              <Link
                to="/dealership"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-white/30 rounded-full px-5 py-3 text-white text-sm font-medium hover:bg-white hover:text-black transition-colors"
              >
                <Store size={16} />
                <span>Dealership</span>
              </Link>
              <button className="flex items-center justify-center gap-2 border border-white/30 rounded-full px-5 py-3 text-white text-sm font-medium hover:bg-white hover:text-black transition-colors">
                <Download size={16} />
                <span>Download</span>
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
