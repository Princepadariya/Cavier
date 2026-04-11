import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Facebook, Linkedin, Twitter, Pin } from 'lucide-react';

const Footer = () => {
  const containerRef = useRef(null);
  const bigTextRef = useRef(null);

  useGSAP(() => {
    // Vervaunt-style scroll parallax for the massive footer text using ScrollTrigger scrub
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

    // Stagger links entrance
    gsap.fromTo(".gsap-footer-col",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.25,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      }
    );

    gsap.fromTo(".gsap-footer-address",
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".gsap-footer-address",
          start: "top 95%",
        }
      }
    );

  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="relative w-full bg-[#f8f8f8] pt-24 pb-6 px-6 md:px-12 lg:px-24 overflow-hidden z-20">
      <div className="max-w-[1400px] mx-auto">
        
        {/* UPPER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          {/* Column 1 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Cavier</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#444]">
              <li><a href="#" className="hover:text-black transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-black transition-colors">About</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Dealership</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Shopping</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#555]">
              <li><a href="#" className="hover:text-black transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Cart</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Wishlist</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#555]">
              <li><a href="#" className="hover:text-black transition-colors">Premium</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Intermediate</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Economy</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Bath Accessories</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className="text-xl font-bold tracking-wide text-[#222]">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[#555]">
              <li><a href="#" className="hover:text-black transition-colors">Cock</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Mixture</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Single Lever</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Concealed Stop Cock</a></li>
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
        <div className="w-full h-px bg-black/20 my-16"></div>

        {/* LOWER SECTION */}
        <div className="flex justify-between items-end mb-16 relative">
          
          {/* Vervaunt-style Massive Scroll-Linked Logo */}
          <div className="w-full md:w-3/4 overflow-hidden pt-4 pb-2">
            <h1 
              ref={bigTextRef}
              className="text-[12vw] sm:text-[14vw] md:text-[13vw] font-bold tracking-tighter text-[#1a1a1a] leading-[0.8] origin-bottom select-none will-change-transform"
            >
              cavier
            </h1>
          </div>

          {/* Right Address Block */}
          <div className="gsap-footer-address opacity-0 will-change-transform hidden md:flex flex-col gap-4 text-sm font-medium text-[#333] mb-4">
            <div className="leading-relaxed">
              <p>01, Vision Industrial Park</p>
              <p>Changa, Lalpur Road</p>
              <p>Jamnagar 361 012, INDIA</p>
            </div>
            
            <p className="font-bold tracking-wide mt-2">+91 74339 93997</p>

            <div className="flex gap-4 mt-2">
              <Linkedin size={20} className="hover:text-black cursor-pointer transition-colors" />
              <Facebook size={20} className="hover:text-black cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-black cursor-pointer transition-colors" />
              <Pin size={20} className="hover:text-black cursor-pointer transition-colors" />
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
