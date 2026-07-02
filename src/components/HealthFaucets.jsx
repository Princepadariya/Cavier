import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { animate, stagger } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const faucets = [
  { id: 1, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/Health%20faucets.png' },
  { id: 2, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/Health%20faucets_2.png' },
  { id: 3, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/Health%20faucets_3.png' },
  { id: 4, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/Health%20faucets_4.png' },
];

const HealthFaucets = () => {
  const containerRef = useRef(null);

  // GSAP: subtle parallax scrub on the product images
  useGSAP(() => {
    gsap.utils.toArray(containerRef.current.querySelectorAll('.faucet-image')).forEach((img) => {
      gsap.fromTo(img,
        { y: '5%' },
        {
          y: '-5%',
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });
  }, { scope: containerRef });

  // Anime.js: wave cascade reveal for the cards
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const titleEl = el.querySelector('.faucet-title');
    const cards = el.querySelectorAll('.faucet-card');
    const viewBtn = el.querySelector('.faucet-view-btn');

    const reset = () => {
      if (titleEl) { titleEl.style.opacity = '0'; titleEl.style.transform = 'translateY(35px)'; }
      cards.forEach((c, i) => {
        c.style.opacity = '0';
        const xOff = i % 2 === 0 ? -30 : 30;
        c.style.transform = `translateY(70px) translateX(${xOff}px) scale(0.92)`;
      });
      if (viewBtn) { viewBtn.style.opacity = '0'; viewBtn.style.transform = 'translateY(25px)'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (titleEl) {
            animate(titleEl, {
              opacity: [0, 1],
              translateY: [35, 0],
              duration: 1000,
              ease: 'outExpo',
            });
          }

          animate(cards, {
            opacity: [0, 1],
            translateY: [70, 0],
            translateX: [(_el, i) => (i % 2 === 0 ? -30 : 30), 0],
            scale: [0.92, 1],
            duration: 1200,
            delay: stagger(100, { start: 300 }),
            ease: 'outQuart',
          });

          if (viewBtn) {
            animate(viewBtn, {
              opacity: [0, 1],
              translateY: [25, 0],
              duration: 900,
              delay: 800,
              ease: 'outQuart',
            });
          }
        } else {
          reset();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#1F1F21] pt-0 pb-16 md:pb-24 px-4 sm:px-6 md:px-12">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="faucet-title text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-8 md:mb-12 opacity-0 will-change-transform">
          Health faucets
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {faucets.map((product) => (
            <div
              key={product.id}
              className="faucet-card flex flex-col group cursor-pointer opacity-0 will-change-transform"
            >
              {/* Image Box — image only */}
              <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                              mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                              transition-all duration-300
                              group-hover:border-[#FFFFFF]
                              group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <div
                  className="faucet-image w-full h-full bg-contain bg-center bg-no-repeat transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08] will-change-transform"
                  style={{ backgroundImage: `url(${product.img})` }}
                />
              </div>

              {/* Details */}
              <div className="flex flex-col items-center text-center px-1">
                <h3 className="text-gray-300 text-[10px] sm:text-xs md:text-sm tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                  {product.title}
                </h3>
                <p className="text-white text-xs sm:text-sm font-semibold tracking-widest">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="w-full flex justify-center mt-12 md:mt-14">
          <button
            className="faucet-view-btn flex items-center gap-3 px-8 py-3 border border-white/40
                       text-white text-xs tracking-[0.2em] uppercase
                       hover:bg-white hover:text-black transition-all duration-300 opacity-0 will-change-transform"
          >
            View More
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HealthFaucets;
