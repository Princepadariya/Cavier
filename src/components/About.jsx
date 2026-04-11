import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="w-full bg-[#181818] py-24 md:py-32 px-6 md:px-12 flex justify-center items-center">
      <motion.div 
        className="max-w-4xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <p className="text-[#b3b3b3] text-lg md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-[1.7] font-light tracking-wide">
          <span className="text-white font-semibold">At Cavier, </span>
          we combine precision engineering with refined design to create bath fittings that elevate modern spaces. With advanced manufacturing and superior finishing, every product reflects our commitment to quality, durability, and timeless appeal.
        </p>
      </motion.div>
    </section>
  );
};

export default About;
