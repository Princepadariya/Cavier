import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <section className="relative w-full overflow-hidden h-[75vh] md:h-[85vh] lg:h-[95vh] bg-black">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/banner_bg.png')" }}
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />

      {/* Cursive text — bottom left, exactly like reference */}
      <div className="absolute bottom-6 left-8 md:bottom-12 md:left-16 z-10">
        <motion.p
          className="text-white leading-tight"
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          Design For Your Space Built For
          <br />
          Your Way
        </motion.p>
      </div>
    </section>
  );
};

export default Banner;
