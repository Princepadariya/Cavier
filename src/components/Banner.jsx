import React, { useRef, useEffect } from 'react';
import { animate, createSpring } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Banner = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);

  // GSAP: Keep parallax scrub on background and text
  useGSAP(() => {
    gsap.fromTo(bgRef.current,
      { y: '-15%' },
      {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );

    gsap.fromTo(textRef.current,
      { y: '30%' },
      {
        y: '-30%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  // Anime.js: Text reveal with character-by-character shimmer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const textSpans = el.querySelectorAll('.banner-char');
    const overlay = el.querySelector('.banner-overlay');

    const reset = () => {
      textSpans.forEach(s => {
        s.style.opacity = '0';
        s.style.transform = 'translateY(30px)';
      });
      if (overlay) { overlay.style.opacity = '0'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Overlay fades in
          if (overlay) {
            animate(overlay, {
              opacity: [0, 1],
              duration: 1200,
              ease: 'outQuart',
            });
          }

          // Characters stagger in with spring
          animate(textSpans, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 1200,
            delay: (_el, i) => 300 + i * 40,
            ease: createSpring({ stiffness: 100, damping: 14, mass: 1 }),
          });
        } else {
          reset();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split text into characters for stagger animation
  const line1 = 'Design For Your Space Built For';
  const line2 = 'Your Way';

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden h-[75vh] md:h-[85vh] lg:h-[95vh] bg-[#1F1F21]">
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-[-15%] w-[130%] h-[130%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
      />

      {/* Dark overlay */}
      <div
        className="banner-overlay absolute inset-0 bg-black/20 bg-cover bg-center pointer-events-none opacity-0"
        style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
      />

      {/* Cursive text with character-by-character reveal */}
      <div ref={textRef} className="absolute bottom-8 left-4 md:bottom-12 md:left-16 z-10 will-change-transform pr-4">
        <p
          className="text-white leading-tight"
          style={{
            fontFamily: "'Brittany Signature', 'Dancing Script', 'Great Vibes', cursive",
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {line1.split('').map((char, i) => (
            <span key={`l1-${i}`} className="banner-char inline-block opacity-0 will-change-transform" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          <br />
          {line2.split('').map((char, i) => (
            <span key={`l2-${i}`} className="banner-char inline-block opacity-0 will-change-transform" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Banner;
