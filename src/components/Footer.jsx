import React, { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Facebook, Linkedin, Twitter, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Footer = ({ variant = 'dark' }) => {
  const isLight = variant === 'light';
  const containerRef = useRef(null);
  const bigTextRef = useRef(null);

  // Theme tokens
  const t = isLight
    ? {
      bg: 'bg-[#F9F9F9]',
      heading: 'text-black',
      link: 'text-neutral-700 hover:text-black',
      text: 'text-neutral-700',
      strong: 'text-black',
      line: 'bg-black/15',
      iconBorder: 'border-black/20',
      iconHover: 'hover:bg-black hover:border-black hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
      icon: 'text-black group-hover:text-white',
      copy: 'text-neutral-600',
      logoGradient: 'linear-gradient(to bottom, #111111 0%, #333333 100%)',
    }
    : {
      bg: 'bg-[#1F1F21]',
      heading: 'text-white',
      link: 'text-white hover:text-white',
      text: 'text-white',
      strong: 'text-white',
      line: 'bg-white/20',
      iconBorder: 'border-white/20',
      iconHover: 'hover:bg-white hover:border-white hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)]',
      icon: 'text-white group-hover:text-black',
      copy: 'text-white',
      logoGradient: 'linear-gradient(to bottom, #FFFFFF 0%, #999999 100%)',
    };

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
            duration: 600,
            delay: stagger(50, { start: 50 }),
            ease: 'outQuart',
          });

          // Address slides in from right
          if (address) {
            animate(address, {
              opacity: [0, 1],
              translateX: [30, 0],
              duration: 600,
              delay: 150,
              ease: 'outExpo',
            });
          }

          // Social icons pop in
          if (socialIcons.length > 0) {
            animate(socialIcons, {
              opacity: [0, 1],
              scale: [0.5, 1],
              duration: 500,
              delay: stagger(50, { start: 200 }),
              ease: 'outBack',
            });
          }

          // Decorative line sweeps in
          if (line) {
            animate(line, {
              scaleX: [0, 1],
              duration: 500,
              delay: 100,
              ease: 'inOutQuart',
            });
          }

          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const socials = [Linkedin, Facebook, Twitter, Pin];

  return (
    <footer ref={containerRef} className={`relative w-full ${t.bg} pt-16 md:pt-24 pb-6 px-4 sm:px-6 md:px-12 lg:px-32 overflow-hidden z-20`}>
      <div className="max-w-[1440px] mx-auto">

        {/* UPPER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-8 mb-12 md:mb-16">
          {/* Column 1 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className={`text-xl font-bold tracking-wide ${t.heading}`}>Cavier</h4>
            <ul className={`flex flex-col gap-4 text-sm font-medium ${t.text}`}>
              <li><Link to="/" className={`transition-colors ${t.link}`}>Home</Link></li>
              <li><Link to="/about" className={`transition-colors ${t.link}`}>About</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Product</Link></li>
              <li><Link to="/dealership" className={`transition-colors ${t.link}`}>Dealership</Link></li>
              <li><Link to="/blog" className={`transition-colors ${t.link}`}>Blog</Link></li>
              <li><Link to="/contact" className={`transition-colors ${t.link}`}>Contact</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className={`text-xl font-bold tracking-wide ${t.heading}`}>Shopping</h4>
            <ul className={`flex flex-col gap-4 text-sm font-medium ${t.text}`}>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Shop</Link></li>
              <li><Link to="/category" className={`transition-colors ${t.link}`}>Categories</Link></li>
              <li><Link to="/checkout" className={`transition-colors ${t.link}`}>Cart</Link></li>
              <li><Link to="/checkout" className={`transition-colors ${t.link}`}>Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className={`text-xl font-bold tracking-wide ${t.heading}`}>Categories</h4>
            <ul className={`flex flex-col gap-4 text-sm font-medium ${t.text}`}>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Premium</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Intermediate</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Economy</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Bath Accessories</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="gsap-footer-col opacity-0 will-change-transform flex flex-col gap-5">
            <h4 className={`text-xl font-bold tracking-wide ${t.heading}`}>Categories</h4>
            <ul className={`flex flex-col gap-4 text-sm font-medium ${t.text}`}>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Cock</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Mixture</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Single Lever</Link></li>
              <li><Link to="/product" className={`transition-colors ${t.link}`}>Concealed  Stop Cock</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          {isLight ? (
            /* Light: contact details block */
            <div className={`gsap-footer-col opacity-0 will-change-transform flex flex-col gap-2 text-[13px] md:text-sm ${t.text}`}>
              <p><span className={`font-bold ${t.strong}`}>Phone:</span> +91 7433993997, 7433993998</p>
              <p><span className={`font-bold ${t.strong}`}>Trade Enq:</span> +91 73 83 93 33 33</p>
              <p><span className={`font-bold ${t.strong}`}>Toll-free:</span> 1800 313 7724</p>
              <p><span className={`font-bold ${t.strong}`}>Email:</span> info@cavierindia.com</p>
              <div className="mt-4 leading-[1.7]">
                <p className={`font-bold ${t.strong}`}>Working Hours:</p>
                <p>Saturday-Thursday: 8:30AM to 7PM</p>
                <p>Fridays: Closed</p>
              </div>
            </div>
          ) : (
            /* Dark: address + social */
            <div className={`gsap-footer-address opacity-0 will-change-transform flex flex-col gap-4 text-[13px] md:text-sm font-medium ${t.text}`}>
              <div className="leading-[1.8]">
                <p>01, Vision Industrial Park</p>
                <p>Changa, Lalpur Road</p>
                <p>Jamnagar 361 012, INDIA</p>
              </div>

              <p className={`font-bold tracking-wide mt-2 ${t.strong}`}>+91  74339 93997</p>

              <div className="flex gap-3 mt-2">
                {socials.map((Icon, i) => (
                  <span key={i} className={`group inline-flex items-center justify-center w-9 h-9 rounded-full border ${t.iconBorder} cursor-pointer transition-all duration-300 ${t.iconHover} hover:-translate-y-1 hover:scale-110`}>
                    <Icon size={17} className={`footer-social-icon ${t.icon} transition-colors opacity-0 will-change-transform`} />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Full-bleed divider — breaks out of the footer's own padding so it spans edge to edge */}
        <div className="h-0.5 bg-black mb-12 md:mb-16 -mx-4 sm:-mx-6 md:-mx-12 lg:-mx-32" />

        {/* Corporate Office label — right aligned (dark only) */}
        {!isLight && (
          <p className={`hidden md:block text-right italic text-base mb-4 ${t.text}`}>Corporate Office cum Manufacturing Unit</p>
        )}

        {/* LOWER SECTION: big logo + (product image / address) */}
        <div className={`${isLight ? 'flex flex-col-reverse md:flex-row items-start md:items-end' : 'flex flex-row items-end'} justify-between gap-6 relative`}>

          {/* Massive Scroll-Linked Logo — gradient filled via PNG mask */}
          <div className={`${isLight ? 'w-full md:w-[70%]' : 'w-[64%] md:w-[70%]'} overflow-hidden pt-4 pb-2`}>
            <div
              ref={bigTextRef}
              role="img"
              aria-label="Cavier Logo"
              className="w-full origin-bottom select-none will-change-transform opacity-0"
              style={{
                aspectRatio: '4530 / 1740',
                maxHeight: '360px',
                background: t.logoGradient,
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

          {isLight ? (
            /* Light: address + phone + social next to logo */
            <div className={`gsap-footer-address opacity-0 will-change-transform w-full md:w-[30%] flex flex-col items-start text-left md:items-end md:text-right gap-4 text-[13px] md:text-sm ${t.text} pb-4`}>
              <div className="leading-[1.8]">
                <p>01, Vision Industrial Park</p>
                <p>Changa, Lalpur Road</p>
                <p>Jamnagar 361 012, INDIA</p>
              </div>

              <p className={`font-bold tracking-wide ${t.strong}`}>+91  74339 93997</p>

              <div className="flex gap-3">
                {socials.map((Icon, i) => (
                  <span key={i} className={`group inline-flex items-center justify-center w-9 h-9 rounded-full border ${t.iconBorder} cursor-pointer transition-all duration-300 ${t.iconHover} hover:-translate-y-1 hover:scale-110`}>
                    <Icon size={17} className={`footer-social-icon ${t.icon} transition-colors opacity-0 will-change-transform`} />
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* Dark: bottom-right product image — bleeds past footer padding */
            <div className="w-[36%] md:w-[30%] flex justify-end items-end -mr-4 sm:-mr-6 md:-mr-12 lg:-mr-32 -mb-6">
              <img
                src="/images/footer_product.png"
                alt="Cavier Product"
                className="w-full h-auto object-contain select-none"
                style={{ maxHeight: '420px', objectPosition: 'right bottom' }}
              />
            </div>
          )}

        </div>

        {/* BOTTOM STRIP / COPYRIGHT LINE */}
        <div className={`footer-line w-full h-px ${t.line} mb-4`} style={{ transformOrigin: 'left center' }}></div>
        <div className={`flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] font-medium tracking-wide pb-4 ${t.copy}`}>
          <p>Copyright 2026 - Cavier India All Copyrights Resereved</p>
          <p className="mt-2 sm:mt-0">Made with <span className="text-red-500 inline-block animate-heartbeat">❤️</span> by <a href="https://codelixitsolutions.com/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline transition-colors">Codelix</a></p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
