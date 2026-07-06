import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { animate, stagger } from 'animejs';

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

// Vertical zigzag offset applied to alternating cards (first up, second down, third up...)
const ZIGZAG_OFFSET = 26;
const zigzagY = (i) => (i % 2 === 0 ? -ZIGZAG_OFFSET : ZIGZAG_OFFSET);

const FinishingTouch = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const trackWrapperRef = useRef(null);
  const outerRef = useRef(null);
  const anchorRef = useRef(null);

  // Dynamic state to hold calculated dimensions for responsive horizontal scaling
  const [metrics, setMetrics] = useState({
    cardW: 280,
    cardGap: 28,
    totalTranslate: 280 * 4,
    textBlockW: 460,
    viewportW: 896,
    extraLeftInset: 0,
    isMobile: false,
  });

  useEffect(() => {
    const measure = () => {
      const isMobile = window.innerWidth < 1024;
      const isSmall = window.innerWidth < 640;
      const cardGap = isMobile ? 16 : 28;

      // How far a `max-w-7xl mx-auto` container would sit inset from this section's
      // own padding — matches the left inset every other section uses, even on
      // ultra-wide screens where that centering adds extra margin.
      let extraLeftInset = 0;
      if (!isMobile && outerRef.current && anchorRef.current) {
        const outerRect = outerRef.current.getBoundingClientRect();
        const outerPaddingLeft = parseFloat(getComputedStyle(outerRef.current).paddingLeft) || 0;
        const anchorRect = anchorRef.current.getBoundingClientRect();
        extraLeftInset = Math.max(0, anchorRect.left - (outerRect.left + outerPaddingLeft));
      }

      if (isMobile) {
        // Single card visible at a time on mobile
        const cardW = isSmall ? window.innerWidth * 0.72 : 320;
        const visibleCount = 1;
        const hiddenCards = Math.max(collections.length - visibleCount, 0);
        const cardStep = cardW + cardGap;
        const totalTranslate = hiddenCards * cardStep;

        setMetrics({
          cardW,
          cardGap,
          totalTranslate,
          textBlockW: window.innerWidth,
          viewportW: cardW,
          extraLeftInset: 0,
          isMobile: true,
        });
        return;
      }

      // Desktop: derive card width from the *actual* rendered track space so the
      // track fills all remaining width (no leftover empty space on wide screens)
      // while still showing exactly 3 full cards at once.
      const visibleCount = 3;
      const availW = trackWrapperRef.current
        ? trackWrapperRef.current.getBoundingClientRect().width
        : 896;
      const cardW = Math.max(180, Math.floor((availW - (visibleCount - 1) * cardGap) / visibleCount));
      const cardStep = cardW + cardGap;
      const hiddenCards = Math.max(collections.length - visibleCount, 0);
      const totalTranslate = hiddenCards * cardStep;
      const viewportW = visibleCount * cardW + (visibleCount - 1) * cardGap;

      setMetrics({
        cardW,
        cardGap,
        totalTranslate,
        textBlockW: 460,
        viewportW,
        extraLeftInset,
        isMobile: false,
      });
    };

    // Applying extraLeftInset shifts the flex row's own padding, which changes
    // the track's available width out from under the cardW we just computed —
    // so settle over a few frames until the measurement stops moving. Needed
    // both on mount and whenever the window resizes.
    let rafIds = [];
    const settle = (frames = 4) => {
      rafIds.forEach(cancelAnimationFrame);
      rafIds = [];
      measure();
      let remaining = frames;
      const step = () => {
        measure();
        remaining -= 1;
        if (remaining > 0) rafIds.push(requestAnimationFrame(step));
      };
      rafIds.push(requestAnimationFrame(step));
    };

    settle();
    window.addEventListener('resize', settle);
    return () => {
      window.removeEventListener('resize', settle);
      rafIds.forEach(cancelAnimationFrame);
    };
  }, []);

  // Framer Motion: horizontal scroll scrub — the sticky inner stays pinned while
  // the section's extra height is scrolled through, driving the track horizontally.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -metrics.totalTranslate]);
  const x = useSpring(xRaw, { stiffness: 120, damping: 30, mass: 0.5 });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });

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
          if (title) {
            animate(title, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1200,
              ease: 'outExpo',
            });
          }

          // Cards settle into their resting position
          animate(cards, {
            opacity: [0, 1],
            translateY: [300, (_el, i) => metrics.isMobile ? 0 : zigzagY(i)],
            rotate: [(_el, i) => 8 + i * 3, 0],
            scale: [0.8, 1],
            duration: 1400,
            delay: stagger(120, { start: 400 }),
            ease: 'outQuart',
          });

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
      // On mobile, trigger only once the section is centered in the viewport
      // (rootMargin shrinks the detection zone to the middle 10% of the screen).
      // On desktop it fires as soon as the pinned section starts entering view.
      metrics.isMobile
        ? { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
        : { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [metrics.isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#1F1F21]"
      style={{ height: `calc(100vh + ${metrics.totalTranslate}px)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={outerRef} className="h-full w-full px-4 sm:px-6 md:px-12">
          {/* Hidden anchor — measures where a max-w-7xl centered container would
              start, so the text block lines up with every other section even on
              ultra-wide screens, without capping the track's available width */}
          <div ref={anchorRef} className="max-w-7xl mx-auto h-0" aria-hidden="true" />

          <div
            className="h-full flex flex-col lg:flex-row items-center justify-start sm:justify-center lg:justify-start gap-6 lg:gap-10"
            style={{ paddingLeft: metrics.isMobile ? 0 : metrics.extraLeftInset }}
          >

            {/* ── Text block (Left on Desktop, Top Context on Mobile) ── */}
            <div
              className="relative z-20 flex flex-col justify-center pointer-events-none flex-shrink-0 w-full lg:w-auto pt-6 sm:pt-20 lg:pt-0 pb-8 lg:pb-0"
              style={{ maxWidth: metrics.isMobile ? '100%' : metrics.textBlockW }}
            >
              <div className="finishing-title pointer-events-auto opacity-0 will-change-transform">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 lg:mb-5 leading-tight tracking-tight mt-0">
                  The Finishing Touch
                </h2>
                <p className="text-[#888] text-xs sm:text-sm lg:text-base leading-relaxed mb-6 lg:mb-10 font-light lg:pr-8">
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

            {/* ── Scrolling track + progress line (Right on Desktop, Centered on Mobile) ── */}
            <div ref={trackWrapperRef} className="relative z-10 flex flex-col items-center lg:items-start justify-center w-full lg:w-auto flex-1 min-w-0">
              <div
                className="overflow-hidden w-full"
                style={{
                  maxWidth: metrics.isMobile ? '100%' : metrics.viewportW,
                  paddingTop: metrics.isMobile ? 0 : ZIGZAG_OFFSET + 12,
                  paddingBottom: metrics.isMobile ? 0 : ZIGZAG_OFFSET + 12,
                }}
              >
                <motion.div
                  ref={trackRef}
                  className="flex items-center"
                  style={{ x, gap: metrics.cardGap }}
                >
                  {collections.map((item, i) => (
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

              {/* Scroll progress line — sized the same way the track viewport is, so it never
                  outgrows the actual visible cards; right padding keeps it off the edge */}
              <div
                className="relative mt-10 lg:mt-14 h-[2px] rounded-full bg-white/20 overflow-hidden w-full"
                style={{ maxWidth: metrics.isMobile ? 'calc(100% - 24px)' : metrics.viewportW - 32 }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 w-full bg-white rounded-full will-change-transform"
                  style={{ scaleX: progress, transformOrigin: 'left center' }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FinishingTouch;
