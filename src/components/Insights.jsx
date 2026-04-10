import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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
  return (
    <section className="w-full bg-[#181818] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start">
        
        {/* Title */}
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Insights & Inspiration
        </motion.h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {insights.map((item, index) => (
            <motion.div 
              key={item.id}
              className="flex flex-col group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              {/* Image Box */}
              <div className="w-full aspect-square overflow-hidden bg-black mb-6">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
              </div>
              
              {/* Title */}
              <h3 className="text-white text-[0.95rem] md:text-base leading-relaxed tracking-wide font-light pr-4">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Bottom Button */}
        <motion.div 
          className="w-full flex justify-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <button className="flex items-center gap-3 px-8 py-3 border border-white/50 text-white text-xs md:text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            View More
            <ChevronRight size={16} />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Insights;
