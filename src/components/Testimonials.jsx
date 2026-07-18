import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Quote } from 'lucide-react';
import { animate, stagger, createSpring } from 'animejs';

const testimonials = [
  {
    id: 1,
    name: 'James Walker',
    role: 'Distributor',
    text: 'Cavier products have exceeded our expectations in terms of durability and finish. The consistency in quality across orders makes them a reliable partner for our massive residential projects.',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Interior Designer',
    text: 'The sleek designs and robust build quality of Cavier fittings have completely transformed the modern spaces I design. Clients are consistently thrilled with the luxurious feel.',
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Property Developer',
    text: 'We switched to Cavier for all our high-end residential projects. The meticulous attention to detail and premium materials utilized are unmatched in the current market.',
  },
  {
    id: 4,
    name: 'Emma Thompson',
    role: 'Architect',
    text: 'A perfect blend of aesthetics and functionality. Integrating Cavier products into my architectural plans adds a layer of sophisticated elegance that sets our buildings apart.',
  },
  {
    id: 5,
    name: 'David Rossi',
    role: 'Hotel Manager',
    text: 'Our guests frequently compliment the bathroom fixtures. Upgrading to the Cavier collection was one of the best decisions we made for elevating our hotel\'s luxury experience.',
  }
];

const Testimonials = ({ bgClass = "bg-[#1F1F21]" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // First time the section is in view we reveal the cards one-by-one, then
  // hand off to the continuous auto-advance loop. This also gives the glass
  // (backdrop-filter) layer time to composite before the peeking cards show.
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Carousel timing: sequential intro on first view, then steady 4s loop.
  useEffect(() => {
    if (!entered) return;
    let loopId;
    let step = 0;
    const introId = setInterval(() => {
      step += 1;
      if (step < testimonials.length) {
        setCurrentIndex(step);
      } else {
        clearInterval(introId);
        loopId = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
      }
    }, 2000); // sequential intro cadence between cards
    return () => { clearInterval(introId); clearInterval(loopId); };
  }, [entered]);

  // Anime.js scroll-triggered entrance animations
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const title = el.querySelector('.test-title');
    const stack = el.querySelector('.test-stack-container');

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(50px)'; }
      // NB: do NOT animate the stack's opacity — an opacity < 1 on the ancestor
      // disables the cards' backdrop-filter (glass), which makes them render
      // see-through and pile up. Reveal it with transform only.
      if (stack) { stack.style.transform = 'translateY(60px) scale(0.96)'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);

          // Title with spring physics
          if (title) {
            animate(title, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1400,
              ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
            });
          }

          // Card stack emerges with spring — transform only (no opacity).
          if (stack) {
            animate(stack, {
              translateY: [60, 0],
              scale: [0.96, 1],
              duration: 1400,
              delay: 300,
              ease: createSpring({ stiffness: 70, damping: 16, mass: 1 }),
            });
          }
        } else {
          reset();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Calculate positioning for 3D horizontal carousel
  const getCardAnimation = (index, current) => {
    const total = testimonials.length;
    let diff = index - current;
    // normalize to positive remainder
    if (diff < 0) diff += total;

    // ACTIVE CARD - Front and center
    if (diff === 0) return { x: 0, y: 0, scale: 1, zIndex: 50, opacity: 1 };

    // RIGHT CARD - Next
    if (diff === 1) return { x: "10%", y: 0, scale: 0.9, zIndex: 40, opacity: 1 };

    // LEFT CARD - Previous
    if (diff === total - 1) return { x: "-10%", y: 0, scale: 0.9, zIndex: 40, opacity: 1 };

    // EXITED CARD - Hidden on left
    if (diff === total - 2) return { x: "-40%", y: 0, scale: 0.7, zIndex: 30, opacity: 0 };

    // UPCOMING CARDS - Hidden on right
    return { x: "40%", y: 0, scale: 0.7, zIndex: 30, opacity: 0 };
  }

  return (
    <div ref={containerRef} className={`w-full relative ${bgClass}`}>
      <section ref={sectionRef} className="w-full pt-12 pb-24 px-4 sm:px-6 md:px-12 lg:px-32 overflow-hidden flex items-center justify-center perspective-1000">
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-12 relative z-10">

          {/* Left Side: Title & Info */}
          <div className="w-full lg:w-4/12 flex flex-col items-start">
            <h2 className="test-title text-2xl md:text-4xl lg:text-[2.4rem] font-medium text-white tracking-wide mb-6 sm:mb-8 md:mb-10 leading-[1.5] md:leading-[1.5] lg:leading-[1.5] opacity-0 will-change-transform">
              Experiences That Speak for Quality
            </h2>

            <Link 
              to="/product"
              className="flex items-center gap-3 px-5 py-3 border border-white text-white text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300 will-change-transform hover:scale-105 active:scale-95 w-fit"
            >
              Explore Products
              <ChevronRight size={14} className="sm:hidden" />
              <ChevronRight size={16} className="hidden sm:block" />
            </Link>
          </div>

          {/* Right Side: 3D Stacked Card Engine */}
          <div className="test-stack-container w-full lg:w-8/12 mt-0 lg:mt-0 px-6 sm:px-0 will-change-transform perspective-[1500px]">

            {/* STACK WRAPPER — nudged right */}
            <div className="relative w-full max-w-[700px] mx-auto lg:translate-x-6 xl:translate-x-10 h-[270px] sm:h-[310px] md:h-[270px]">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={getCardAnimation(i, currentIndex)}
                  animate={getCardAnimation(i, currentIndex)}
                  transition={{
                    duration: 1.1,
                    ease: [0.19, 1, 0.22, 1]
                  }}
                  className="absolute inset-0 w-full h-full border border-white/25 bg-gradient-to-br from-white/15 to-white/[0.04] backdrop-blur-2xl rounded-[1.5rem] p-6 md:p-8 shadow-2xl ring-1 ring-inset ring-white/10 flex flex-col overflow-hidden"
                >
                  {/* Glass sheen highlight */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />

                  {/* Background Watermark Quote */}
                  <Quote size={80} className="absolute right-4 top-4 text-white/10" strokeWidth={1} />

                  {/* Content */}
                  <div className="relative z-10 flex-grow flex flex-col min-h-0">
                    <h3 className="text-white text-lg md:text-xl font-light tracking-wide mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-[#a0a0a0] italic text-xs md:text-sm mb-3 md:mb-4 font-light flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-white/30"></span>
                      {testimonial.role}
                    </p>

                    <p className="text-white text-xs md:text-sm leading-snug md:leading-relaxed italic mb-4 font-light opacity-90 line-clamp-3">
                      "{testimonial.text}"
                    </p>

                    <div className="mt-auto flex gap-1.5 text-[#eab308]">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} fill="currentColor" size={17} strokeWidth={0} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full max-w-[600px] mx-auto flex justify-center mt-12 md:mt-16 z-20 relative px-4">
              <div className="w-full md:w-[85%] h-[2px] bg-white/20 relative overflow-hidden rounded-full">
                <motion.div
                  key={currentIndex}
                  className="absolute top-0 left-0 h-full bg-white"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: "linear" }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Testimonials;
