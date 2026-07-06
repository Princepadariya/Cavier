import React, { useState, useEffect, useRef } from 'react';
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
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Anime.js scroll-triggered entrance animations
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const title = el.querySelector('.test-title');
    const btn = el.querySelector('.test-btn');
    const stack = el.querySelector('.test-stack-container');

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(50px)'; }
      if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateY(30px) scale(0.9)'; }
      if (stack) { stack.style.opacity = '0'; stack.style.transform = 'translateY(60px) scale(0.92)'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Title with spring physics
          if (title) {
            animate(title, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1400,
              ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
            });
          }

          // Button slides up with slight scale
          if (btn) {
            animate(btn, {
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.9, 1],
              duration: 1000,
              delay: 400,
              ease: 'outQuart',
            });
          }

          // Card stack emerges with spring
          if (stack) {
            animate(stack, {
              opacity: [0, 1],
              translateY: [60, 0],
              scale: [0.92, 1],
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
    if (diff === 1) return { x: "12%", y: 0, scale: 0.9, zIndex: 40, opacity: 0.6 };

    // LEFT CARD - Previous
    if (diff === total - 1) return { x: "-12%", y: 0, scale: 0.9, zIndex: 40, opacity: 0.6 };

    // EXITED CARD - Hidden on left
    if (diff === total - 2) return { x: "-40%", y: 0, scale: 0.7, zIndex: 30, opacity: 0 };

    // UPCOMING CARDS - Hidden on right
    return { x: "40%", y: 0, scale: 0.7, zIndex: 30, opacity: 0 };
  }

  return (
    <div ref={containerRef} className={`w-full relative ${bgClass}`}>
      <section ref={sectionRef} className="w-full py-16 md:py-24 px-4 sm:px-6 md:px-12 overflow-hidden flex items-center justify-center perspective-1000">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 relative z-10">

        {/* Left Side: Title & Info */}
        <div className="w-full lg:w-5/12 flex flex-col items-start pr-0 md:pr-10">
          <h2 className="test-title text-3xl md:text-5xl lg:text-[3.2rem] font-medium text-white tracking-wide mb-8 md:mb-10 leading-[1.4] opacity-0 will-change-transform">
            Experiences That Speak for Quality
          </h2>

          <button className="test-btn flex items-center gap-3 px-8 py-3.5 border border-white/50 text-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 opacity-0 will-change-transform">
            Explore Products
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right Side: 3D Stacked Card Engine */}
        <div className="test-stack-container w-full lg:w-7/12 mt-16 lg:mt-0 opacity-0 will-change-transform perspective-[1500px]">

          {/* STACK WRAPPER */}
          <div className="relative w-full max-w-[600px] mx-auto h-[420px] sm:h-[380px] md:h-[340px]">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                animate={getCardAnimation(i, currentIndex)}
                transition={{
                  duration: 1.1,
                  ease: [0.19, 1, 0.22, 1]
                }}
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-white/60 rounded-[1.5rem] p-8 md:p-12 shadow-2xl flex flex-col"
              >
                {/* Background Watermark Quote */}
                <Quote size={120} className="absolute right-6 top-6 text-white/5" strokeWidth={1} />

                {/* Content */}
                <div className="relative z-10 flex-grow flex flex-col">
                  <h3 className="text-white text-xl md:text-2xl font-light tracking-wide mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-[#a0a0a0] italic text-xs md:text-sm mb-6 md:mb-8 font-light flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-white/30"></span>
                    {testimonial.role}
                  </p>

                  <p className="text-white text-sm md:text-base leading-relaxed italic mb-8 font-light opacity-90 line-clamp-4">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-auto flex gap-1.5 text-[#eab308]">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} fill="currentColor" size={14} strokeWidth={0} />
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
