import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { animate, stagger, createSpring } from 'animejs';
import { useCart } from '../context/CartContext';

const Product = () => {
  const heroRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);
  const paginationRef = useRef(null);
  const catalogRef = useRef(null);
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, image: '/img2.png' },
    { id: 2, name: 'SO 04 102 | Bib Cock with Wall Flange', price: 1540, image: '/img2.png' },
    { id: 3, name: 'SO 04 103 | Angle Valve', price: 1200, image: '/img2.png' },
    { id: 4, name: 'SO 04 104 | Long Body Bib Cock', price: 1850, image: '/img2.png' },
    { id: 5, name: 'SO 04 105 | Concealed Stop Cock', price: 2100, image: '/img2.png' },
    { id: 6, name: 'SO 04 106 | Sink Mixer with Swinging Spout', price: 4250, image: '/img2.png' },
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
      <div ref={heroRef} className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden z-10">
        <div className="product-hero-img absolute inset-0 w-full h-full will-change-transform bg-black">
          <img 
            src="/img1.png" 
            alt="Cavier Premium Bath Fittings" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        {/* The Laser Scan Line */}
        <div className="laser-scan-line absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,1)] z-20 pointer-events-none" />
        
        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-white text-4xl md:text-8xl font-light tracking-[0.3em] md:tracking-[0.5em] uppercase font-outfit opacity-20 text-center px-4">
            Precision
          </h1>
        </div>
      </div>

      {/* Filter Header */}
      <section ref={filterRef} className="w-full bg-[#1F1F21] pt-8 md:pt-12 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="relative flex items-center justify-between pb-6">
          <div className="filter-item flex items-center gap-2 text-white opacity-0 will-change-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 md:w-5 md:h-5">
              <path d="M4 6h16M6 12h12M8 18h8" />
            </svg>
            <span className="text-base md:text-lg font-medium font-outfit hidden sm:inline">Filter</span>
          </div>
          <h2 className="filter-item absolute left-1/2 -translate-x-1/2 text-white text-xl md:text-3xl font-light tracking-wide font-outfit opacity-0 will-change-transform">Thames</h2>
          <div className="filter-item hidden md:flex items-center gap-2 text-white/70 text-xs md:text-sm opacity-0 will-change-transform">
            <span>Single Lever</span>
            <span className="text-white/30">|</span>
            <span>Quarter Turn</span>
            <span className="text-white/30">|</span>
            <span>Fully Brass</span>
          </div>
        </div>
        <div className="filter-line w-full h-[1px] bg-white/10" style={{ transformOrigin: 'left center' }} />
        <div className="flex items-center justify-between py-5 overflow-x-auto no-scrollbar">
          {['Price', 'Area', 'Color Finishes', 'Category', 'Shape'].map((filter) => (
            <button key={filter} className="filter-item flex items-center gap-2 text-white text-sm font-medium whitespace-nowrap hover:text-white/70 transition-colors opacity-0 will-change-transform pr-4 last:pr-0">
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="product-card flex flex-col opacity-0 will-change-transform">
              <div className="relative w-full aspect-square bg-[#181818] border border-white/10 rounded-sm overflow-hidden group">
                <Link to={`/product/${product.id}`} className="block w-full h-full relative">
                  {/* Technical Ghost Layer (Exploded View) */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-all duration-700 pointer-events-none scale-100 group-hover:scale-125 blur-[2px]">
                    <img 
                      src={product.image} 
                      alt="" 
                      className="w-full h-full object-contain p-8 invert brightness-200"
                    />
                  </div>
                  
                  {/* Main Image Layer */}
                  <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110 relative z-10">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-8 transform group-hover:translate-y-[-15px] transition-transform duration-700"
                    />
                  </div>
                </Link>
                <button className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="text-center mt-3 md:mt-4 px-1">
                <h3 className="text-white text-xs md:text-base font-medium mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-white text-xs md:text-sm font-semibold mb-1.5 md:mb-2">INR {product.price}</p>
                <div className="flex justify-center gap-[2px] md:gap-0.5 mb-3 md:mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => addToCart({ ...product, quantity: 1 })}
                className="w-full border border-white/20 text-white text-[10px] md:text-sm py-2.5 md:py-3 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-white hover:text-black transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="md:w-4 md:h-4">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <span>Add to cart</span>
              </button>
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
      <section ref={catalogRef} className="w-full bg-[#1F1F21] py-12 md:py-16 px-4 sm:px-6 md:px-12">
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
