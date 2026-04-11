import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'James Walker',
    role: 'Distributor',
    text: 'Cavier products have exceeded our expectations in terms of durability and finish. The consistency in quality across orders makes them a reliable partner for our projects.',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Interior Designer',
    text: 'The sleek designs and robust build quality of Cavier fittings have completely transformed the modern spaces I design. Clients are always thrilled with the luxurious feel.',
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Property Developer',
    text: 'We switched to Cavier for all our high-end residential projects. The attention to detail and premium materials used are unmatched in the current market.',
  },
  {
    id: 4,
    name: 'Emma Thompson',
    role: 'Architect',
    text: 'A perfect blend of aesthetics and functionality. Integrating Cavier products into my architectural plans adds a layer of sophisticated elegance that is hard to replicate.',
  },
  {
    id: 5,
    name: 'David Rossi',
    role: 'Hotel Manager',
    text: 'Our guests frequently compliment the bathroom fixtures. Upgrading to Cavier was one of the best decisions we made for elevating our hotel\'s luxury experience.',
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-advance the testimonials every 1 second
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate progress for the bar below the card
  const progressPercent = ((currentIndex + 1) / testimonials.length) * 100;

  return (
    <section className="w-full bg-[#181818] py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">
        
        {/* Left Side: Title & Info */}
        <div className="w-full md:w-5/12 flex flex-col items-start pr-0 md:pr-10">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-[3.2rem] font-medium text-white tracking-wide mb-10 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Experiences That Speak for Quality
          </motion.h2>
          
          <motion.button 
            className="flex items-center gap-3 px-8 py-3.5 border border-white/50 text-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Explore Products
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Right Side: Auto-playing Stacked Carousel */}
        <motion.div 
          className="w-full md:w-7/12 relative mt-10 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        >
          {/* Decorative Back Card Outline */}
          <div className="absolute top-0 -right-4 md:-right-8 lg:-right-10 w-[95%] h-full rounded-[1.5rem] border border-white/20 z-0"></div>

          {/* Main Focused Card */}
          <div className="relative z-10 w-full min-h-[320px] bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-white/10 rounded-[1.5rem] p-10 md:p-14 shadow-2xl backdrop-blur-sm -translate-x-2 md:-translate-x-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col h-full"
              >
                <h3 className="text-white text-xl md:text-2xl font-light tracking-wide mb-1">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-gray-400 italic text-xs md:text-sm mb-10 font-light">
                  — {testimonials[currentIndex].role}
                </p>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed italic mb-12 font-light min-h-[80px]">
                  {testimonials[currentIndex].text}
                </p>

                {/* Stars */}
                <div className="flex gap-1.5 text-[#eab308]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={15} strokeWidth={0} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full flex justify-center mt-12 md:mt-16 z-20 relative px-4">
            <div className="w-[85%] h-[2px] bg-white/20 relative overflow-hidden rounded-full">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
