import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { animate, stagger, createSpring } from 'animejs';

// 7 images total
const collections = [
  { id: 1, title: 'Premium', img: '/images/img1.png' },
  { id: 2, title: 'Intermediate', img: '/images/img2.png' },
  { id: 3, title: 'Allied & Concealed', img: '/images/img3.png' },
  { id: 4, title: 'Golden Elegance', img: '/images/img4.png' },
  { id: 5, title: 'Vintage Copper', img: '/images/img5.jpg' },
  { id: 6, title: 'Minimalist White', img: '/images/img6.png' },
  { id: 7, title: 'Luxury Suite', img: '/images/banner_bg.jpg' },
];

const FinishingTouch = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // Dynamic state to hold calculated dimensions for responsive Horizontal scaling
  const [metrics, setMetrics] = useState({
    cardW: 320,
    cardGap: 32,
    totalTranslate: 320 * 4,
    textBlockW: 420,
    trackStart: 500
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      const isSmall = window.innerWidth < 640;

      const cardW = isSmall ? window.innerWidth * 0.75 : 320;
      const cardGap = isMobile ? 16 : 32;
      const cardStep = cardW + cardGap;
      const hiddenCards = collections.length - (isMobile ? 1 : 2);
      const totalTranslate = hiddenCards * cardStep;
      const textBlockW = isMobile ? window.innerWidth : 420;
      const trackStart = isMobile ? 0 : 420 + 80;

      setMetrics({
        cardW,
        cardGap,
        totalTranslate,
        textBlockW,
        trackStart,
        isMobile
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Framer Motion: horizontal scroll scrub (keep — Anime.js can't do scroll-linked transforms)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -metrics.totalTranslate]);
  const x = useSpring(xRaw, { stiffness: 100, damping: 25, mass: 0.5 });

  // Anime.js: Scroll-triggered card cascade + title reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const title = el.querySelector('.finishing-title');
    const cards = el.querySelectorAll('.finishing-card');
    const innerBgs = el.querySelectorAll('.card-inner-bg');

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(50px)'; }
      cards.forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = `translateY(300px) rotate(${8 + i * 3}deg) scale(0.8)`;
      });
      innerBgs.forEach(bg => {
        bg.style.transform = 'scale(1.25)';
      });
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Title sweeps in with spring
          if (title) {
            animate(title, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1200,
              ease: 'outExpo',
            });
          }

          // Cards cascade in like a card deck being dealt
          animate(cards, {
            opacity: [0, 1],
            translateY: [300, 0],
            rotate: [(_el, i) => 8 + i * 3, 0],
            scale: [0.8, 1],
            duration: 1400,
            delay: stagger(120, { start: 400 }),
            ease: 'outQuart',
          });

          // Inner images zoom from 1.25 to 1 (cinematic)
          animate(innerBgs, {
            scale: [1.25, 1],
            duration: 1800,
            delay: stagger(100, { start: 600 }),
            ease: 'outQuart',
          });
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
    <section
      ref={sectionRef}
      className="relative bg-[#1F1F21]"
      style={{ height: `calc(100vh + 100px)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start">

        {/* ── Text block (Left on Desktop, Top Context on Mobile) ── */}
        <div
          className="relative lg:absolute lg:left-0 h-auto lg:h-full z-20 flex flex-col justify-start lg:justify-center pointer-events-none flex-shrink-0 pt-16 sm:pt-20 lg:pt-0 pb-8 lg:pb-0"
          style={{ width: metrics.textBlockW, paddingLeft: metrics.isMobile ? '24px' : '64px', paddingRight: metrics.isMobile ? '24px' : '0' }}
        >
          <div className="finishing-title pointer-events-auto opacity-0 will-change-transform">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3 lg:mb-5 leading-tight tracking-tight mt-0">
              The Finishing<br className="hidden lg:block" /> Touch
            </h2>
            <p className="text-[#888] text-sm lg:text-base leading-relaxed mb-6 lg:mb-10 font-light lg:pr-8">
              Precision lies in every detail. Explore our curated bath collections
              designed to enhance modern living with style, performance, and lasting quality.
            </p>
            <button className="flex items-center gap-3 px-6 lg:px-7 py-3 border border-white/40
                                text-white text-xs lg:text-sm tracking-widest hover:bg-white hover:text-black
                                transition-all duration-300">
              View More <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ── Scrolling track (Right on Desktop, Centered Offset on Mobile) ── */}
        <div
          className="relative lg:absolute flex-1 lg:h-full z-10 flex items-center lg:items-center pb-8 lg:pb-0 w-full"
          style={{ left: metrics.isMobile ? 0 : metrics.trackStart, top: 0, overflow: 'hidden', paddingLeft: metrics.isMobile ? '24px' : '0' }}
        >
          <motion.div
            ref={trackRef}
            className="flex items-center"
            style={{ x, gap: metrics.cardGap, paddingRight: 80 }}
          >
            {collections.map((item) => (
              <div
                key={item.id}
                className="finishing-card group flex-shrink-0 cursor-pointer flex flex-col opacity-0 will-change-transform"
                style={{ width: metrics.cardW }}
              >
                <div
                  className="overflow-hidden bg-[#111] shadow-2xl
                              group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)]
                              transition-shadow duration-700 relative"
                  style={{ width: metrics.cardW, height: Math.round(metrics.cardW * 1.35) }}
                >
                  <div
                    className="card-inner-bg w-full h-full bg-cover bg-center transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 will-change-transform"
                    style={{ backgroundImage: `url(${item.img})` }}
                  />
                </div>
                <div className="flex justify-between items-center text-white mt-5 px-1 relative z-20">
                  <span className="text-base lg:text-lg font-light tracking-wide">{item.title}</span>
                  <ArrowUpRight
                    size={20}
                    className="text-white/40 -translate-x-3 opacity-0
                                group-hover:opacity-100 group-hover:translate-x-0
                                group-hover:text-white transition-all duration-300"
                  />
                </div>
                <div className="w-full h-px bg-white/10 mt-4 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-0 bg-white
                                  group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default FinishingTouch;
