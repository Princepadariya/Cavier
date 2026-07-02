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
    <footer ref={containerRef} className="relative w-full bg-[#1F1F21] pt-16 md:pt-24 pb-6 px-4 sm:px-6 md:px-12 lg:px-32 overflow-hidden z-20">
      <div className="max-w-[1440px] mx-auto">

        {/* UPPER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-8 mb-12 md:mb-16">
          {/* Column 1 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-white">Cavier</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-white">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/dealership" className="hover:text-white transition-colors">Dealership</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-white">Shopping</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-white">
              <li><Link to="/product" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/#category" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/checkout" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/checkout" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-white">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-white">
              <li><Link to="/product" className="hover:text-white transition-colors">Premium</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Intermediate</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Economy</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Bath Accessories</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-white">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-white">
              <li><Link to="/product" className="hover:text-white transition-colors">Cock</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Mixture</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Single Lever</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Concealed  Stop Cock</Link></li>
            </ul>
          </div>

          {/* Column 5: Address + Social */}
          <div className="gsap-footer-address opacity-0 will-change-transform flex flex-col gap-4 text-[13px] md:text-sm font-medium text-white">
            <div className="leading-[1.8]">
              <p>01, Vision Industrial Park</p>
              <p>Changa, Lalpur Road</p>
              <p>Jamnagar 361 012, INDIA</p>
            </div>

            <p className="font-bold tracking-wide text-white mt-2">+91  74339 93997</p>

            <div className="flex gap-3 mt-2">
              <span className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white hover:border-white hover:-translate-y-1 hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)]">
                <Linkedin size={17} className="footer-social-icon text-white group-hover:text-black transition-colors opacity-0 will-change-transform" />
              </span>
              <span className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white hover:border-white hover:-translate-y-1 hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)]">
                <Facebook size={17} className="footer-social-icon text-white group-hover:text-black transition-colors opacity-0 will-change-transform" />
              </span>
              <span className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white hover:border-white hover:-translate-y-1 hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)]">
                <Twitter size={17} className="footer-social-icon text-white group-hover:text-black transition-colors opacity-0 will-change-transform" />
              </span>
              <span className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/20 cursor-pointer transition-all duration-300 hover:bg-white hover:border-white hover:-translate-y-1 hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)]">
                <Pin size={17} className="footer-social-icon text-white group-hover:text-black transition-colors opacity-0 will-change-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* Corporate Office label — right aligned */}
        <p className="hidden md:block text-right italic text-base text-white mb-4">Corporate Office cum Manufacturing Unit</p>

        {/* LOWER SECTION: big logo + product image */}
        <div className="flex flex-row justify-between items-end gap-6 relative">

          {/* Massive Scroll-Linked Logo — gradient filled via PNG mask */}
          <div className="w-[64%] md:w-[70%] overflow-hidden pt-4 pb-2">
            <div
              ref={bigTextRef}
              role="img"
              aria-label="Cavier Logo"
              className="w-full origin-bottom select-none will-change-transform opacity-0"
              style={{
                aspectRatio: '4530 / 1740',
                maxHeight: '360px',
                background: 'linear-gradient(to bottom, #FFFFFF 0%, #999999 100%)',
                WebkitMaskImage: "url('/images/cavier_logo_text.png')",
                maskImage: "url('/images/cavier_logo_text.png')",
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'left bottom',
                maskPosition: 'left bottom',
              }}
            />
          </div>

          {/* Bottom-right product image — bleeds past footer padding */}
          <div className="w-[36%] md:w-[30%] flex justify-end items-end -mr-4 sm:-mr-6 md:-mr-12 lg:-mr-32 -mb-6">
            <img
              src="/images/footer_product.png"
              alt="Cavier Product"
              className="w-full h-auto object-contain select-none"
              style={{ maxHeight: '420px', objectPosition: 'right bottom' }}
            />
          </div>

        </div>

        {/* BOTTOM STRIP / COPYRIGHT LINE */}
        <div className="footer-line w-full h-px bg-white/20 mb-4" style={{ transformOrigin: 'left center' }}></div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] text-white font-medium tracking-wide pb-4">
          <p>Copyright 2026 - Cavier India All Copyrights Resereved</p>
          <p className="mt-2 sm:mt-0">Made with <span className="text-red-500">❤️</span> by Codelix</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
