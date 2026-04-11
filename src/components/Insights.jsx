import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const insights = [
  { 
    id: 1, 
    title: 'The Future of Premium Bath Fittings: Trends to Watch in 2026', 
    img: '/banner_bg.png' 
  },
  { 
    id: 2, 
    title: 'The Future of Premium Bath Fittings: Trends to Watch in 2026', 
    img: '/accessories_category.png' 
  },
  { 
    id: 3, 
    title: 'The Future of Premium Bath Fittings: Trends to Watch in 2026', 
    img: '/img3.png' 
  },
];

const Insights = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Stagger fade up 40px
    gsap.fromTo(
      ".gsap-insight-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1.5, stagger: 0.25, ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      }
    );

    // Subtle image zoom mapping to scroll position
    gsap.utils.toArray('.insight-image').forEach(img => {
      gsap.fromTo(img,
        { scale: 1 },
        {
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            scrub: true,
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#181818] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start">
        
        {/* Title */}
        <h2 className="gsap-insight-card opacity-0 will-change-transform text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-12">
          Insights & Inspiration
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {insights.map((item) => (
            <div key={item.id} className="gsap-insight-card opacity-0 will-change-transform flex flex-col group cursor-pointer">
              {/* Image Box */}
              <div className="w-full aspect-square overflow-hidden bg-black mb-6">
                <div 
                  className="insight-image w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 origin-center"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
              </div>
              
              {/* Title */}
              <h3 className="text-white text-[0.95rem] md:text-base leading-relaxed tracking-wide font-light pr-4 group-hover:text-gray-300 transition-colors duration-300">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="gsap-insight-card opacity-0 will-change-transform w-full flex justify-center mt-20">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-3 border border-white/50 text-white text-xs md:text-sm tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            View More
            <ChevronRight size={16} />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default Insights;
