import React from 'react';
import { Droplets, SlidersHorizontal, ShieldCheck, Leaf } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: <Droplets strokeWidth={1} size={28} />,
    title: "Water Efficiency",
    description: "Advanced designs that optimize water flow, reducing consumption while maintaining powerful performance.",
    delay: 0.5
  },
  {
    icon: <SlidersHorizontal strokeWidth={1} size={28} />,
    title: "Smart Experience",
    description: "Engineered for smooth operation and precise control, ensuring comfort and convenience in every use.",
    delay: 0.7
  },
  {
    icon: <ShieldCheck strokeWidth={1} size={28} />,
    title: "Durability",
    description: "High-quality coatings that resist corrosion, retain shine, and deliver long-lasting durability.",
    delay: 0.9
  },
  {
    icon: <Leaf strokeWidth={1} size={28} />,
    title: "Sustainability",
    description: "Environment-conscious processes focused on reducing impact while maintaining superior product standards.",
    delay: 1.1
  }
];

const Features = () => {
  const sectionRef = useRef(null);
  // Trigger when 10% of the section is in view
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Each quadrant: which corner it covers, where it starts (off-screen), and which bg crop to show
  const quadrants = [
    {
      // Top-Left: starts far top-left, shows 0% 0% crop
      containerStyle: { position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', overflow: 'hidden' },
      initial: { x: '-100%', y: '-100%' },
      animate: isInView ? { x: '0%', y: '0%' } : { x: '-100%', y: '-100%' },
      bgPos: '0% 0%',
    },
    {
      // Top-Right: starts far top-right, shows 100% 0% crop
      containerStyle: { position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', overflow: 'hidden' },
      initial: { x: '100%', y: '-100%' },
      animate: isInView ? { x: '0%', y: '0%' } : { x: '100%', y: '-100%' },
      bgPos: '100% 0%',
    },
    {
      // Bottom-Left: starts far bottom-left, shows 0% 100% crop
      containerStyle: { position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', overflow: 'hidden' },
      initial: { x: '-100%', y: '100%' },
      animate: isInView ? { x: '0%', y: '0%' } : { x: '-100%', y: '100%' },
      bgPos: '0% 100%',
    },
    {
      // Bottom-Right: starts far bottom-right, shows 100% 100% crop
      containerStyle: { position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', overflow: 'hidden' },
      initial: { x: '100%', y: '100%' },
      animate: isInView ? { x: '0%', y: '0%' } : { x: '100%', y: '100%' },
      bgPos: '100% 100%',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-48 md:py-56 px-6 md:px-12 bg-black overflow-hidden flex justify-center items-center min-h-screen"
    >
      {/* ── 4-quadrant animated background ── */}
      <div className="absolute inset-0 z-0">
        {quadrants.map((q, i) => (
          <motion.div
            key={i}
            style={{
              ...q.containerStyle,
              // background properties applied directly on the moving div
              backgroundImage: "url('/features_bg.png')",
              // 200% × 200% means: the full image is spread across 2× the quadrant
              // = the full section. Each bg-position selects the right quarter.
              backgroundSize: '200% 200%',
              backgroundPosition: q.bgPos,
              backgroundRepeat: 'no-repeat',
            }}
            initial={q.initial}
            animate={q.animate}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* Overlay: fades in after panels arrive */}
        <motion.div
          className="absolute inset-0 bg-black/60"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 1.0 }}
        />
      </div>

      {/* ── Feature cards ── */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 lg:gap-x-24 lg:gap-y-28">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1.5, delay: feature.delay, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-white">{feature.icon}</div>
              <h3 className="text-2xl md:text-[1.6rem] font-medium tracking-wide text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-[#a8a8a8] text-[0.95rem] md:text-base leading-relaxed md:leading-[1.8] max-w-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
