import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { animate, stagger } from 'animejs';

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const title = el.querySelector('.insight-title');
    const cards = el.querySelectorAll('.gsap-insight-card');
    const images = el.querySelectorAll('.insight-image');
    const btn = el.querySelector('.insight-btn');

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(40px)'; }
      cards.forEach((c, i) => {
        c.style.opacity = '0';
        // Slide from alternating directions: left, center-up, right
        const directions = [-60, 0, 60];
        c.style.transform = `translateY(80px) translateX(${directions[i % 3]}px)`;
      });
      images.forEach(img => {
        img.style.transform = 'scale(1.15)';
      });
      if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateY(30px)'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Title
          if (title) {
            animate(title, {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 1000,
              ease: 'outExpo',
            });
          }

          // Cards slide in from alternating directions
          animate(cards, {
            opacity: [0, 1],
            translateY: [80, 0],
            translateX: [(_el, i) => { const d = [-60, 0, 60]; return d[i % 3]; }, 0],
            duration: 1400,
            delay: stagger(180, { start: 250 }),
            ease: 'outQuart',
          });

          // Images zoom from 1.15 to 1 (cinematic reveal)
          animate(images, {
            scale: [1.15, 1],
            duration: 1800,
            delay: stagger(180, { start: 400 }),
            ease: 'outQuart',
          });

          // Button
          if (btn) {
            animate(btn, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 900,
              delay: 900,
              ease: 'outQuart',
            });
          }
        } else {
          reset();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#181818] py-16 md:py-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center md:items-start">
        
        {/* Title */}
        <h2 className="insight-title text-2xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-8 md:mb-12 opacity-0 will-change-transform">
          Insights & Inspiration
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {insights.map((item) => (
            <div key={item.id} className="gsap-insight-card opacity-0 will-change-transform flex flex-col group cursor-pointer">
              {/* Image Box */}
              <div className="w-full aspect-square overflow-hidden bg-black mb-6">
                <div 
                  className="insight-image w-full h-full bg-cover bg-center transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 will-change-transform origin-center"
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
        <div className="w-full flex justify-center mt-12 md:mt-20">
          <button 
            className="insight-btn flex items-center gap-3 px-6 md:px-8 py-3 border border-white/50 text-white text-xs md:text-sm tracking-widest hover:bg-white hover:text-black transition-colors duration-300 opacity-0 will-change-transform hover:scale-105 active:scale-95"
          >
            View More
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Insights;
