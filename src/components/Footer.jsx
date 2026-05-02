import React, { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Facebook, Linkedin, Twitter, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef(null);
  const bigTextRef = useRef(null);

  // GSAP: Keep the massive scroll-linked parallax text (needs scrub)
  useGSAP(() => {
    gsap.fromTo(bigTextRef.current,
      { y: "60%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  // Anime.js: Scroll-triggered wave entrance for columns and address
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cols = el.querySelectorAll('.gsap-footer-col');
    const address = el.querySelector('.gsap-footer-address');
    const socialIcons = el.querySelectorAll('.footer-social-icon');
    const line = el.querySelector('.footer-line');

    const reset = () => {
      cols.forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = `translateY(50px) translateX(${-20 + i * 5}px)`;
      });
      if (address) { address.style.opacity = '0'; address.style.transform = 'translateX(30px)'; }
      socialIcons.forEach(ic => {
        ic.style.opacity = '0';
        ic.style.transform = 'scale(0.5)';
      });
      if (line) { line.style.transform = 'scaleX(0)'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Columns wave stagger — each has a slight x-offset that resolves
          animate(cols, {
            opacity: [0, 1],
            translateY: [50, 0],
            translateX: [(_el, i) => -20 + i * 5, 0],
            duration: 1200,
            delay: stagger(100, { start: 200 }),
            ease: 'outQuart',
          });

          // Address slides in from right
          if (address) {
            animate(address, {
              opacity: [0, 1],
              translateX: [30, 0],
              duration: 1200,
              delay: 600,
              ease: 'outExpo',
            });
          }

          // Social icons pop in
          if (socialIcons.length > 0) {
            animate(socialIcons, {
              opacity: [0, 1],
              scale: [0.5, 1],
              duration: 800,
              delay: stagger(80, { start: 800 }),
              ease: 'outBack',
            });
          }

          // Decorative line sweeps in
          if (line) {
            animate(line, {
              scaleX: [0, 1],
              duration: 1000,
              delay: 400,
              ease: 'inOutQuart',
            });
          }
        } else {
          reset();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={containerRef} className="relative w-full bg-[#f8f8f8] pt-16 md:pt-24 pb-6 px-4 sm:px-6 md:px-12 lg:px-32 overflow-hidden z-20">
      <div className="max-w-[1440px] mx-auto">
        
        {/* UPPER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-8 mb-12 md:mb-20">
          {/* Column 1 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Cavier</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#444]">
              <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-black transition-colors">About</Link></li>
              <li><Link to="/dealership" className="hover:text-black transition-colors">Dealership</Link></li>
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Shopping</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#555]">
              <li><Link to="/product" className="hover:text-black transition-colors">Shop</Link></li>
              <li><Link to="/#category" className="hover:text-black transition-colors">Categories</Link></li>
              <li><Link to="/checkout" className="hover:text-black transition-colors">Cart</Link></li>
              <li><Link to="/checkout" className="hover:text-black transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#555]">
              <li><Link to="/product" className="hover:text-black transition-colors">Premium</Link></li>
              <li><Link to="/product" className="hover:text-black transition-colors">Intermediate</Link></li>
              <li><Link to="/product" className="hover:text-black transition-colors">Economy</Link></li>
              <li><Link to="/product" className="hover:text-black transition-colors">Bath Accessories</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#555]">
              <li><Link to="/product" className="hover:text-black transition-colors">Cock</Link></li>
              <li><Link to="/product" className="hover:text-black transition-colors">Mixture</Link></li>
              <li><Link to="/product" className="hover:text-black transition-colors">Single Lever</Link></li>
              <li><Link to="/product" className="hover:text-black transition-colors">Concealed Stop Cock</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-1 text-[13px] md:text-sm text-[#333] leading-relaxed">
            <p><span className="font-bold text-[#222]">Phone:</span> +91 7433993997, 7433993998</p>
            <p><span className="font-bold text-[#222]">Trade Enq:</span> +91 73 83 93 33 33</p>
            <p><span className="font-bold text-[#222]">Toll-free:</span> 1800 313 7724</p>
            <p><span className="font-bold text-[#222]">Email:</span> info@cavierindia.com</p>
            <div className="mt-4">
              <p className="font-bold text-[#222]">Working Hours:</p>
              <p className="text-[#555]">Saturday-Thursday: 8:30AM to 7PM</p>
              <p className="text-[#555]">Fridays: Closed</p>
            </div>
          </div>
        </div>

        {/* THIN LINE */}
        <div className="footer-line w-full h-px bg-black/20 my-10 md:my-16" style={{ transformOrigin: 'left center' }}></div>

        {/* LOWER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative gap-10">
          
          {/* Vervaunt-style Massive Scroll-Linked Logo */}
          <div className="w-full md:w-[70%] overflow-hidden pt-4 pb-2">
            <img 
              ref={bigTextRef}
              src="/cavier_logo_text.png"
              alt="Cavier Logo"
              className="w-full h-auto origin-bottom select-none will-change-transform opacity-0"
              style={{ objectFit: 'contain', objectPosition: 'left bottom', maxHeight: '280px' }}
            />
          </div>

          {/* Right Address Block */}
          <div className="gsap-footer-address opacity-0 will-change-transform hidden md:flex flex-col gap-4 text-[13px] md:text-sm font-medium text-[#333] mb-4 md:w-[30%] lg:pl-10">
            <div className="leading-[1.8]">
              <p>01, Vision Industrial Park</p>
              <p>Changa, Lalpur Road</p>
              <p>Jamnagar 361 012, INDIA</p>
            </div>
            
            <p className="font-bold tracking-wide mt-2">+91 74339 93997</p>

            <div className="flex gap-5 mt-2 text-[#444]">
              <Linkedin size={18} className="footer-social-icon hover:text-black cursor-pointer transition-colors opacity-0 will-change-transform" />
              <Facebook size={18} className="footer-social-icon hover:text-black cursor-pointer transition-colors opacity-0 will-change-transform" />
              <Twitter size={18} className="footer-social-icon hover:text-black cursor-pointer transition-colors opacity-0 will-change-transform" />
              <Pin size={18} className="footer-social-icon hover:text-black cursor-pointer transition-colors opacity-0 will-change-transform" />
            </div>
          </div>

        </div>

        {/* Mobile Address Block (Visible only on small screens) */}
        <div className="md:hidden flex flex-col gap-3 text-sm font-medium text-[#333] mb-12">
          <div className="leading-relaxed">
            <p>01, Vision Industrial Park</p>
            <p>Changa, Lalpur Road</p>
            <p>Jamnagar 361 012, INDIA</p>
          </div>
          <p className="font-bold tracking-wide">+91 74339 93997</p>
          <div className="flex gap-4 mt-2">
            <Linkedin size={20} />
            <Facebook size={20} />
            <Twitter size={20} />
            <Pin size={20} />
          </div>
        </div>

        {/* BOTTOM STRIP / COPYRIGHT LINE */}
        <div className="w-full h-px bg-black/20 mb-4"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] text-[#555] font-medium tracking-wide pb-4">
          <p>Copyright 2026 - Cavier India All Copyrights Reserved</p>
          <p className="mt-2 sm:mt-0">Made with <span className="text-red-500">❤️</span> by Codelix</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
