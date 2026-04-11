import React from 'react';
import { motion } from 'framer-motion';

const Categories = () => {
  return (
    <section className="w-full bg-[#181818] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        
        {/* Title */}
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Crafted for Every Bath Space
        </motion.h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          
          {/* Card 1 */}
          <motion.div 
            className="group relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden bg-black cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/fitting_category.png')" }}
            ></div>
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-10 flex items-center justify-between w-full">
              <span className="text-white md:text-xl font-light tracking-wide">Bathroom Fitting</span>
              <span className="text-white md:text-xl transform transition-transform duration-300 group-hover:translate-x-2">→</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="group relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden bg-black cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/accessories_category.png')" }}
            ></div>
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-10 flex items-center justify-between w-full">
              <span className="text-white md:text-xl font-light tracking-wide">Bathroom Accessories</span>
              <span className="text-white md:text-xl transform transition-transform duration-300 group-hover:translate-x-2">→</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Categories;
