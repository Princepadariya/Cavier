import React, { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "/images/Water Efficiency.png",
    title: "Water Efficiency",
    description: "Advanced designs that optimize water flow, reducing consumption while maintaining powerful performance.",
  },
  {
    icon: "/images/Smart Experience.png",
    title: "Smart Experience",
    description: "Engineered for smooth operation and precise control, ensuring comfort and convenience in every use.",
  },
  {
    icon: "/images/Durability.png",
    title: "Durability",
    description: "High-quality coatings that resist corrosion, retain shine, and deliver long-lasting durability.",
  },
  {
    icon: "/images/Sustainability.png",
    title: "Sustainability",
    description: "Environment-conscious processes focused on reducing impact while maintaining superior product standards.",
  }
];

const Features = () => {
  const sectionRef = useRef(null);

  // GSAP: Keep the epic 4-quadrant background animation (scrub-worthy)
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to('.quad-tl', { x: '0%', y: '0%', duration: 0.9, ease: 'power3.inOut' }, 0)
      .to('.quad-tr', { x: '0%', y: '0%', duration: 0.9, ease: 'power3.inOut' }, 0)
      .to('.quad-bl', { x: '0%', y: '0%', duration: 0.9, ease: 'power3.inOut' }, 0)
      .to('.quad-br', { x: '0%', y: '0%', duration: 0.9, ease: 'power3.inOut' }, 0)
      .to('.quad-overlay', { opacity: 1, duration: 0.7, ease: 'power2.inOut' }, 0.3);
  }, { scope: sectionRef });

  // Anime.js: Elastic pop-in for feature cards with scroll trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.feature-card');
    const icons = el.querySelectorAll('.feature-icon');

    const reset = () => {
      cards.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(60px) scale(0.7)';
      });
      icons.forEach(ic => {
        ic.style.opacity = '0';
        ic.style.transform = 'scale(0) rotate(-180deg)';
      });
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Cards pop in with elastic overshoot
          animate(cards, {
            opacity: [0, 1],
            translateY: [60, 0],
            scale: [0.7, 1],
            duration: 1200,
            delay: stagger(120, { start: 500 }),
            ease: 'outBack',
          });

          // Icons spin in
          animate(icons, {
            opacity: [0, 1],
            scale: [0, 1],
            rotate: [-180, 0],
            duration: 1000,
            delay: stagger(120, { start: 700 }),
            ease: 'outBack',
          });
        } else {
          reset();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const quadStyle = "absolute w-1/2 h-1/2 overflow-hidden bg-no-repeat will-change-transform";

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 md:py-48 lg:py-56 px-4 sm:px-6 md:px-12 bg-[#1F1F21] flex justify-center items-center min-h-[70vh] md:min-h-screen"
    >
      {/* ── 4-quadrant animated background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={`quad-tl ${quadStyle}`}
          style={{ top: 0, left: 0, transform: 'translate(-100%, -100%)', backgroundImage: "url('/images/features_bg.png')", backgroundSize: '200% 200%', backgroundPosition: '0% 0%' }}
        />
        <div
          className={`quad-tr ${quadStyle}`}
          style={{ top: 0, right: 0, transform: 'translate(100%, -100%)', backgroundImage: "url('/images/features_bg.png')", backgroundSize: '200% 200%', backgroundPosition: '100% 0%' }}
        />
        <div
          className={`quad-bl ${quadStyle}`}
          style={{ bottom: 0, left: 0, transform: 'translate(-100%, 100%)', backgroundImage: "url('/images/features_bg.png')", backgroundSize: '200% 200%', backgroundPosition: '0% 100%' }}
        />
        <div
          className={`quad-br ${quadStyle}`}
          style={{ bottom: 0, right: 0, transform: 'translate(100%, 100%)', backgroundImage: "url('/images/features_bg.png')", backgroundSize: '200% 200%', backgroundPosition: '100% 100%' }}
        />
        <div
          className="quad-overlay absolute inset-0 opacity-0"
          style={{ zIndex: 5 }}
        />
      </div>

      {/* ── Feature cards ── */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card flex flex-col items-center text-center opacity-0 will-change-transform"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-6">
              <div className="feature-icon will-change-transform opacity-0"><img src={feature.icon} alt={feature.title} className="w-9 h-9 object-contain" /></div>
              <h3 className="text-xl sm:text-2xl md:text-[1.6rem] font-medium tracking-wide text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-[#949494] text-[0.9rem] sm:text-base md:text-lg leading-relaxed md:leading-[1.8] max-w-md">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
