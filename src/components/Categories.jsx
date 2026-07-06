import React, { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';

const Categories = () => {
  const containerRef = useRef(null);

  // Anime.js: Scroll-triggered card entrance with 3D emergence effect
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const title = el.querySelector('.cat-title');
    const cards = el.querySelectorAll('.category-card');

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(40px)'; }
      cards.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(100px) scale(0.88) rotate(3deg)';
      });
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Title sweep in
          animate(title, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 600,
            ease: 'outExpo',
          });

          // Cards emerge with 3D-like rotation + scale
          animate(cards, {
            opacity: [0, 1],
            translateY: [100, 0],
            scale: [0.88, 1],
            rotate: [3, 0],
            duration: 700,
            delay: stagger(80, { start: 100 }),
            ease: 'outQuart',
          });
        } else {
          reset();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
    );

    observer.observe(el);

    // Magnetic Tilt Logic
    const handleTilt = (e) => {
      const cards = el.querySelectorAll('.category-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
          // Check if it was tilted, then reset
          if (card.style.transform.includes('rotateX')) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
          }
        }
      });
    };

    window.addEventListener('mousemove', handleTilt);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleTilt);
    };
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        
        {/* Title */}
        <h2 className="cat-title text-2xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-8 md:mb-12 opacity-0 will-change-transform">
          Crafted for Every Bath Space
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          
          {/* Card 1 */}
          <div className="category-card group relative w-full aspect-square sm:aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden bg-black cursor-pointer opacity-0 will-change-transform perspective-1000">
            {/* Editorial Number */}
            <div className="absolute top-6 sm:top-8 left-6 sm:left-8 z-20 text-white/10 text-6xl md:text-8xl font-bold font-outfit select-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4">
              01
            </div>
            
            <div 
              className="category-bg absolute inset-0 w-full h-full bg-cover bg-center will-change-transform transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
              style={{ backgroundImage: "url('/images/fitting_category.png')" }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            <div className="absolute bottom-6 left-6 right-6 p-6 flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-white md:text-lg font-light tracking-widest uppercase font-outfit">Bathroom Fitting</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black">
                <span className="transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="category-card group relative w-full aspect-square sm:aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden bg-black cursor-pointer opacity-0 will-change-transform perspective-1000">
            {/* Editorial Number */}
            <div className="absolute top-6 sm:top-8 left-6 sm:left-8 z-20 text-white/10 text-6xl md:text-8xl font-bold font-outfit select-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4">
              02
            </div>
            
            <div 
              className="category-bg absolute inset-0 w-full h-full bg-cover bg-center will-change-transform transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
              style={{ backgroundImage: "url('/images/accessories_category.png')" }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            <div className="absolute bottom-6 left-6 right-6 p-6 flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-white md:text-lg font-light tracking-widest uppercase font-outfit">Accessories</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black">
                <span className="transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Categories;
