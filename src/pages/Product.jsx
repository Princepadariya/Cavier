import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { animate, stagger, createSpring } from 'animejs';
import { Heart } from 'lucide-react';

const Product = () => {
  const heroRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);
  const paginationRef = useRef(null);
  const catalogRef = useRef(null);

  const products = [
    { id: 1, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, image: '/images/Health%20faucets.png' },
    { id: 2, name: 'SO 04 102 | Bib Cock with Wall Flange', price: 1540, image: '/images/Health%20faucets_2.png' },
    { id: 3, name: 'SO 04 103 | Angle Valve', price: 1200, image: '/images/Health%20faucets_3.png' },
    { id: 4, name: 'SO 04 104 | Long Body Bib Cock', price: 1850, image: '/images/Health%20faucets_4.png' },
    { id: 5, name: 'SO 04 105 | Concealed Stop Cock', price: 2100, image: '/images/Health%20faucets.png' },
    { id: 6, name: 'SO 04 106 | Sink Mixer with Swinging Spout', price: 4250, image: '/images/Health%20faucets_2.png' },
  ];

  // Hero: Laser-Scan Reveal
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const img = el.querySelector('.product-hero-img');
    const scanLine = el.querySelector('.laser-scan-line');
    if (!img || !scanLine) return;

    // Initial state
    img.style.clipPath = 'inset(0 100% 0 0)';
    scanLine.style.left = '0%';
    scanLine.style.opacity = '0';

    const t = setTimeout(() => {
      // 1. Fade in laser
      animate(scanLine, {
        opacity: [0, 1],
        duration: 400,
        ease: 'linear'
      });

      // 2. Scan across
      animate(scanLine, {
        left: ['0%', '100%'],
        duration: 1800,
        ease: 'inOutExpo'
      });

      // 3. Reveal image behind laser
      animate(img, {
        clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
        duration: 1800,
        ease: 'inOutExpo',
        complete: () => {
          scanLine.style.opacity = '0';
        }
      });
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // Ambient Mouse Parallax for background particles
  useEffect(() => {
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('.ambient-particle');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      particles.forEach((p, i) => {
        const factor = (i + 1) * 20;
        p.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter bar: staggered sweep-in
  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.filter-item');
    const lines = el.querySelectorAll('.filter-line');

    const reset = () => {
      items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(20px)'; });
      lines.forEach(l => { l.style.transform = 'scaleX(0)'; });
    };
    reset();

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animate(lines, {
          scaleX: [0, 1],
          duration: 900,
          delay: stagger(150),
          ease: 'inOutQuart',
        });
        animate(items, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 1000,
          delay: stagger(60, { start: 200 }),
          ease: 'outQuart',
        });
      } else { reset(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Product grid: 3D card cascade
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.product-card');

    const reset = () => {
      cards.forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = `translateY(80px) scale(0.88) rotate(${i % 2 === 0 ? 3 : -3}deg)`;
      });
    };
    reset();

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animate(cards, {
          opacity: [0, 1],
          translateY: [80, 0],
          scale: [0.88, 1],
          rotate: [(_el, i) => (i % 2 === 0 ? 3 : -3), 0],
          duration: 1400,
          delay: stagger(100, { start: 200 }),
          ease: createSpring({ stiffness: 80, damping: 16, mass: 1 }),
        });
      } else { reset(); }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pagination: scale-pop
  useEffect(() => {
    const el = paginationRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.9)';

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animate(el, {
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.9, 1],
          duration: 1000,
          ease: 'outBack',
        });
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.9)';
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Catalog CTA: spring-in
  useEffect(() => {
    const el = catalogRef.current;
    if (!el) return;
    const title = el.querySelector('.catalog-title');
    const btn = el.querySelector('.catalog-btn');
    if (title) { title.style.opacity = '0'; title.style.transform = 'translateX(-40px)'; }
    if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateX(40px)'; }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (title) animate(title, { opacity: [0, 1], translateX: [-40, 0], duration: 1200, ease: 'outExpo' });
        if (btn) animate(btn, { opacity: [0, 1], translateX: [40, 0], duration: 1200, delay: 200, ease: 'outExpo' });
      } else {
        if (title) { title.style.opacity = '0'; title.style.transform = 'translateX(-40px)'; }
        if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateX(40px)'; }
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen overflow-hidden">


      {/* Ambient Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
        <div className="ambient-particle absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-white/5 blur-3xl" />
        <div className="ambient-particle absolute top-[60%] left-[80%] w-48 h-48 rounded-full bg-white/5 blur-3xl" />
        <div className="ambient-particle absolute top-[10%] left-[70%] w-24 h-24 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Hero Section - Full Screen Product Showcase */}
      <div ref={heroRef} className="relative h-screen w-full overflow-hidden z-10">
        <div className="product-hero-img absolute inset-0 w-full h-full will-change-transform bg-black">
          <img
            src="/images/product_page_banner.png"
            alt="Cavier Premium Bath Fittings"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        {/* The Laser Scan Line */}
        <div className="laser-scan-line absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,1)] z-20 pointer-events-none" />
      </div>

      {/* Filter Header */}
      <section ref={filterRef} className="w-full bg-[#1F1F21] pt-8 md:pt-12 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="relative flex items-center justify-between pb-6">
          <div className="filter-item flex items-center gap-2 text-white opacity-0 will-change-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 md:w-5 md:h-5">
              <path d="M4 6h16M6 12h12M8 18h8" />
            </svg>
            <span className="text-base md:text-lg font-medium font-outfit">Filter</span>
          </div>
          <h2 className="filter-item absolute right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 text-white text-xl md:text-3xl font-light tracking-wide font-outfit opacity-0 will-change-transform">Themes</h2>
          <div className="filter-item hidden md:flex items-center gap-2 text-white/70 text-xs md:text-sm opacity-0 will-change-transform">
            <span>Single Lever</span>
            <span className="text-white/30">|</span>
            <span>Quarter Turn</span>
            <span className="text-white/30">|</span>
            <span>Fully Brass</span>
          </div>
        </div>
        <div className="filter-line w-full h-[1px] bg-white/10" style={{ transformOrigin: 'left center' }} />
        <div className="flex items-center justify-start md:justify-between py-5 overflow-x-auto no-scrollbar space-x-6 md:space-x-0">
          {['Price', 'Area', 'Color Finishes', 'Category', 'Shape'].map((filter) => (
            <button key={filter} className="filter-item flex-shrink-0 flex items-center gap-2 text-white text-sm font-medium whitespace-nowrap hover:text-white/70 transition-colors opacity-0 will-change-transform md:pr-4 last:pr-0">
              <span>{filter}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>
        <div className="filter-line w-full h-[1px] bg-white/10" style={{ transformOrigin: 'left center' }} />
      </section>

      {/* Product Grid */}
      <section ref={gridRef} className="w-full bg-[#1F1F21] py-6 md:py-8 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
          {products.map((product) => (
            <div key={product.id} className="product-card flex flex-col group cursor-pointer opacity-0 will-change-transform">
              {/* Image Box */}
              <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                              mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                              transition-all duration-300
                              group-hover:border-[#FFFFFF]
                              group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <Link to={`/product/${product.id}`} className="block w-full h-full relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08] will-change-transform"
                  />
                </Link>
                <button className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Heart size={18} />
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-col items-center text-center px-1">
                <h3 className="text-white text-xs sm:text-sm md:text-base tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                  {product.name}
                </h3>
                <p className="text-white text-sm sm:text-base font-semibold tracking-widest">
                  INR {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <section className="w-full bg-[#1F1F21] py-8 md:py-10 px-4 sm:px-6 md:px-12">
        <div ref={paginationRef} className="flex flex-col items-center gap-4 opacity-0 will-change-transform">
          <p className="text-white/60 text-sm">Page 1 of 6</p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 border border-white/40 flex items-center justify-center text-white text-sm bg-white/10">1</span>
            <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 text-sm hover:bg-white/10 cursor-pointer transition-colors">2</span>
            <span className="text-white/40 text-sm px-1">...</span>
            <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 text-sm hover:bg-white/10 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {/* Explore The Catalog */}
      <section ref={catalogRef} className="w-full bg-[#1F1F21] py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <h2 className="catalog-title text-2xl md:text-4xl font-light text-white tracking-wide font-outfit opacity-0 will-change-transform">Explore The catalog</h2>
          <button className="catalog-btn flex items-center gap-2 md:gap-3 text-white border border-white/30 px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm hover:bg-white hover:text-black transition-colors opacity-0 will-change-transform">
            <span>Download</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
};

export default Product;
