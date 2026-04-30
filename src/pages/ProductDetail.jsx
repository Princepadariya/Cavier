import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { animate, stagger, createSpring } from 'animejs';

import { useCart } from '../context/CartContext';

function useSection(ref, buildConfigs) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const configs = buildConfigs(el);
    const reset = () => configs.forEach(({ targets, from }) =>
      targets.forEach(t => Object.assign(t.style, from)));
    reset();
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) configs.forEach(c => animate(c.targets, c.anim));
      else reset();
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

const ProductDetail = () => {
  const { cartItems, addToCart, updateQty, removeItem, subtotal } = useCart();
  const detailRef = useRef(null);
  const featRef = useRef(null);
  const reviewRef = useRef(null);
  const similarRef = useRef(null);

  // Precision Mode State
  const [isPrecisionMode, setIsPrecisionMode] = useState(false);
  const precisionContainerRef = useRef(null);
  const calloutsRef = useRef(null);

  // Material Morph State
  const [selectedFinish, setSelectedFinish] = useState('Chrome');
  const [isMorphing, setIsMorphing] = useState(false);

  // Cart drawer state
  const [cartOpen, setCartOpen] = useState(false);
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);

  const openCart = useCallback((product) => {
    addToCart(product);
    setCartOpen(true);
  }, [addToCart]);

  const closeCart = useCallback(() => setCartOpen(false), []);

  // Animate drawer open/close
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
      animate(backdrop, { opacity: [0, 1], duration: 300, ease: 'outQuart' });
      animate(drawer, { translateX: ['100%', '0%'], duration: 500, ease: 'outExpo' });
    } else {
      document.body.style.overflow = '';
      animate(backdrop, { opacity: [1, 0], duration: 250, ease: 'inQuart' });
      animate(drawer, { translateX: ['0%', '100%'], duration: 400, ease: 'inExpo' });
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  // Detail hero: image slide + info spring (on mount)
  useEffect(() => {
    const el = detailRef.current;
    if (!el) return;
    const img = el.querySelector('.detail-img');
    const info = el.querySelectorAll('.detail-info');
    if (img) { img.style.opacity = '0'; img.style.transform = 'translateX(-60px) scale(0.95)'; }
    info.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });

    setTimeout(() => {
      if (img) animate(img, {
        opacity: [0, 1], translateX: [-60, 0], scale: [0.95, 1],
        duration: 1600, ease: 'outExpo',
      });
      animate(info, {
        opacity: [0, 1], translateY: [40, 0],
        duration: 1400, delay: stagger(100, { start: 400 }),
        ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
      });
    }, 300);
  }, []);

  // Key Features: stagger wave
  useSection(featRef, el => {
    const title = el.querySelectorAll('.feat-title');
    const items = el.querySelectorAll('.feat-item');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(30px)' },
        anim: { opacity: [0,1], translateY: [30,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...items], from: { opacity: '0', transform: 'translateX(-30px)' },
        anim: { opacity: [0,1], translateX: [-30,0],
          duration: 1000, delay: stagger(80, { start: 300 }), ease: 'outQuart' } },
    ];
  });

  // Review section: fade in
  useSection(reviewRef, el => {
    const items = el.querySelectorAll('.review-item');
    return [
      { targets: [...items], from: { opacity: '0', transform: 'translateY(30px)' },
        anim: { opacity: [0,1], translateY: [30,0],
          duration: 1200, delay: stagger(100, { start: 200 }), ease: 'outQuart' } },
    ];
  });

  // Similar Items: card cascade
  useSection(similarRef, el => {
    const title = el.querySelectorAll('.sim-title');
    const cards = el.querySelectorAll('.sim-card');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(70px) scale(0.9)' },
        anim: { opacity: [0,1], translateY: [70,0], scale: [0.9,1],
          duration: 1400, delay: stagger(120, { start: 300 }),
          ease: createSpring({ stiffness: 70, damping: 14, mass: 1 }) } },
    ];
  });

  const finishes = [
    { name: 'Rose Gold', color: '#C27B5C', filter: 'sepia(1) hue-rotate(-20deg) saturate(1.5) brightness(0.9) contrast(1.1)' },
    { name: 'Gold',      color: '#D4B678', filter: 'sepia(1) hue-rotate(5deg) saturate(1.8) brightness(0.9) contrast(1.1)' },
    { name: 'Gunmetal',  color: '#6B6B6B', filter: 'grayscale(1) brightness(0.6) contrast(1.4)' },
    { name: 'Chrome',    color: '#E8E8E8', filter: 'grayscale(0) brightness(1) contrast(1)' },
  ];

  const handleFinishChange = (finish) => {
    if (finish.name === selectedFinish) return;
    setIsMorphing(true);
    
    // Ambient Background Transition
    const root = document.documentElement;
    root.style.setProperty('--ambient-glow', finish.color + '22'); // 22 is ~13% opacity
    
    setTimeout(() => {
      setSelectedFinish(finish.name);
      setIsMorphing(false);
    }, 400); 
  };

  const currentFinishObj = finishes.find(f => f.name === selectedFinish) || finishes[3];

  const thumbs = ['/img2.png', '/img2.png', '/img2.png', '/img2.png'];

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen transition-colors duration-1000" 
         style={{ 
           backgroundImage: `radial-gradient(circle at 50% 20%, var(--ambient-glow, #ffffff11) 0%, transparent 70%)` 
         }}>



      {/* Product Detail + Key Features — single unified section */}
      <section ref={detailRef} className="w-full bg-[#1F1F21] pt-24 pb-16 px-6 md:px-12">
        <div>

          {/* ── Two-column grid: Image | Info ── */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start">

            {/* ── Left: Image + Thumbnails ── */}
            <div className="detail-img w-full md:w-[36%] will-change-transform relative">
              <div 
                ref={precisionContainerRef}
                className={`relative w-full aspect-square rounded-sm overflow-hidden transition-all duration-700 ease-in-out border
                  ${isPrecisionMode ? 'bg-[#0a111a] border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : 'bg-[#181818] border-white/10'}`}
              >
                {/* Blueprint Grid Background (visible in precision mode) */}
                <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700 ${isPrecisionMode ? 'opacity-40' : 'opacity-0'}`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Exploded Layers */}
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                  {/* Layer 1: Main Body */}
                  <div className="relative w-[80%] h-[80%] flex items-center justify-center">
                    <img
                      src="/img2.png"
                      alt="Body"
                      className={`absolute w-full h-full object-contain transition-all duration-1000 
                        ${isPrecisionMode ? 'saturate-150 contrast-125' : ''}`}
                      style={{ 
                        zIndex: 10,
                        filter: `${currentFinishObj.filter} ${isPrecisionMode ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))' : ''}`,
                        clipPath: isPrecisionMode ? 'polygon(0 40%, 100% 40%, 100% 100%, 0 100%)' : 'none',
                      }}
                    />

                    {/* Light Sweep Effect Overlay */}
                    <div 
                      className={`absolute inset-0 z-30 pointer-events-none transition-all duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12
                        ${isMorphing ? 'translate-x-[200%] opacity-100' : '-translate-x-[200%] opacity-0'}`}
                    />
                  </div>

                  {/* Layer 2: Top/Handle (Visible only in precision mode) */}
                  {isPrecisionMode && (
                    <img
                      src="/img2.png"
                      alt="Handle"
                      className="absolute w-[80%] h-[80%] object-contain contrast-125"
                      style={{ 
                        zIndex: 15,
                        transform: 'translateY(-40px) translateX(20px)',
                        filter: `${currentFinishObj.filter} drop-shadow(0 0 15px rgba(6, 182, 212, 0.8))`,
                        clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)',
                      }}
                    />
                  )}

                  {/* Technical Callouts (Lines and Text) */}
                  <div 
                    ref={calloutsRef}
                    className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${isPrecisionMode ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {/* Callout 1: Handle */}
                    <div className="absolute top-[25%] right-[5%] flex items-center gap-2">
                      <div className="h-[1px] w-12 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      <div className="text-[9px] text-cyan-300 font-mono uppercase tracking-tighter bg-black/40 px-2 py-1 border border-cyan-500/20">
                        Precision Handle<br/>Control System
                      </div>
                    </div>
                    {/* Callout 2: Body */}
                    <div className="absolute bottom-[30%] left-[5%] flex items-center gap-2">
                      <div className="text-[9px] text-cyan-300 font-mono uppercase tracking-tighter bg-black/40 px-2 py-1 border border-cyan-500/20 text-right">
                        Solid Brass Ingot<br/>Forged Body
                      </div>
                      <div className="h-[1px] w-12 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    </div>
                    {/* Callout 3: Aerator */}
                    <div className="absolute bottom-[15%] right-[15%] flex flex-col items-start">
                      <div className="h-8 w-[1px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] ml-4" />
                      <div className="text-[9px] text-cyan-300 font-mono uppercase tracking-tighter bg-black/40 px-2 py-1 border border-cyan-500/20">
                        Honeycomb<br/>Flow Regulator
                      </div>
                    </div>
                  </div>
                </div>

                {/* Precision Mode Indicator with Scanning Effect */}
                {isPrecisionMode && (
                  <div className="absolute top-4 left-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
                      <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">Scanning...</span>
                    </div>
                    <div className="text-[8px] text-cyan-500/50 font-mono">
                      LAT: 28.6139° N | LONG: 77.2090° E
                    </div>
                  </div>
                )}
              </div>

              {/* Precision Mode Toggle */}
              <button 
                onClick={() => setIsPrecisionMode(!isPrecisionMode)}
                className={`absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-2
                  ${isPrecisionMode ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black/50 text-white border-white/20 hover:border-white/50'}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                {isPrecisionMode ? 'Exit Tech Mode' : 'Precision Engineering'}
              </button>

              {/* Thumbnail strip */}
              <div className="flex justify-between mt-4">
                {thumbs.map((src, i) => (
                  <button
                    key={i}
                    className={`w-[calc(25%-12px)] aspect-square bg-[#181818] border rounded-sm overflow-hidden flex-shrink-0
                      ${i === 0 ? 'border-white/40' : 'border-white/10 hover:border-white/25'}
                      transition-colors duration-200`}
                  >
                    <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: Product Info ── */}
            <div className="w-full md:w-[58%] flex flex-col">
              <h1 className="detail-info text-white text-2xl md:text-[1.75rem] lg:text-[2rem] font-bold leading-tight font-outfit mb-3 will-change-transform">
                Upper Parts Kit for S/L Concealed<br />Basin Mixer | VL 10 202
              </h1>
              <p className="detail-info text-[#a3a3a3] text-[11px] md:text-xs leading-relaxed font-light mb-3 max-w-md will-change-transform">
                Fully Brass Faucets made out of Brass Ingots. Flow rate: 13.5 LPM at 3 bar pressure. Total Spout Length = 180mm. Sturdy brass aerator housing.
              </p>
              <div className="detail-info flex gap-0.5 mb-5 will-change-transform">
                {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-xs">★</span>)}
              </div>

              <h2 className="detail-info text-white text-lg md:text-xl font-bold font-outfit mb-10 will-change-transform">
                Code :- FR 09- 202
              </h2>

              {/* ── Finishing ── */}
              <div className="detail-info mb-10 will-change-transform">
                <h3 className="text-white text-lg md:text-xl font-bold font-outfit mb-5">Finishing</h3>
                <div className="flex gap-4">
                  {finishes.map(f => (
                    <button
                      key={f.name}
                      title={f.name}
                      onClick={() => handleFinishChange(f)}
                      className={`w-20 h-12 rounded-md border transition-all duration-300 relative overflow-hidden group
                        ${selectedFinish === f.name ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/15 hover:border-white/40'}`}
                      style={{ backgroundColor: f.color }}
                    >
                      {/* Subtle reflection on the button */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price ── */}
              <h3 className="detail-info text-white text-lg md:text-xl font-bold font-outfit mb-8 will-change-transform">
                MRP :- ₹ 2000
              </h3>

              {/* ── Actions ── */}
              <div className="detail-info flex items-center gap-3 will-change-transform">
                <button 
                  onClick={() => openCart({
                    id: 'VL 10 202',
                    name: 'Upper Parts Kit for S/L Concealed Basin Mixer | VL 10 202',
                    finish: 'Dark Anodized Aluminium',
                    height: '180mm',
                    price: 2000,
                    img: '/img2.png',
                  })} 
                  className="flex-1 max-w-[340px] border border-white/30 rounded-full text-white text-[13px] py-3 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors uppercase tracking-wider font-medium"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></svg>
                  <span>Add to cart</span>
                </button>
                <button className="w-11 h-11 border border-white/30 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </button>
                <button className="w-11 h-11 border border-white/30 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 10a4 4 0 01-8 0M3 6h18M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Key Features — same container, below the grid ── */}
          <div ref={featRef} className="mt-14">
            <h2 className="feat-title text-white text-lg md:text-xl font-semibold font-outfit mb-6 will-change-transform">Key Features</h2>
            <ul className="flex flex-col gap-4 text-white text-sm md:text-base font-light">
              {['10 Years Warranty for defects against craftsmanship','Dynamic Color Options','Imported bought out parts','1,00,000 Life cycle tested spindles','Passed 120 hours anti-corrosion finish test'].map(f => (
                <li key={f} className="feat-item flex items-start gap-3 will-change-transform">
                  <span className="text-white/50 mt-0.5">•</span><span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* User Review */}
      <section ref={reviewRef} className="w-full bg-[#1F1F21] py-16 px-6 md:px-12">
        <div className="review-item flex items-center gap-4 mb-6 will-change-transform">
          <div className="w-12 h-12 rounded-full bg-[#333] overflow-hidden border border-white/20">
            <img src="/team_rakesh.png" alt="Yash Patel" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-white text-lg font-semibold font-outfit">Yash Patel</h3>
        </div>
        <textarea placeholder="Enter Your Opinion" className="review-item w-full bg-[#2a2a2c] border border-white/20 rounded-sm text-white text-sm px-5 py-4 h-28 resize-none outline-none focus:border-white/40 transition-colors placeholder:text-white/30 mb-6 will-change-transform" />
        <div className="review-item flex items-center gap-4 will-change-transform">
          <button className="flex items-center gap-2 border border-white/30 rounded-full text-white text-xs px-5 py-2.5 hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            <span>Add a photo</span>
          </button>
          <button className="flex items-center gap-2 border border-white/30 rounded-full text-white text-xs px-5 py-2.5 hover:bg-white/10 transition-colors">
            <span>Share your content</span>
          </button>
        </div>
      </section>

      {/* Similar Items */}
      <section ref={similarRef} className="w-full bg-[#1F1F21] py-16 px-6 md:px-12">
        <h2 className="sim-title text-white text-3xl md:text-4xl font-light tracking-wide font-outfit mb-10 will-change-transform">Similar items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(item => (
            <div key={item} className="sim-card flex flex-col opacity-0 will-change-transform">
              <div className="relative w-full aspect-square bg-[#181818] border border-white/10 rounded-sm overflow-hidden group">
                <Link to={`/product/${item}`} className="block w-full h-full relative">
                  {/* Technical Ghost Layer (Exploded View) */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-all duration-700 pointer-events-none scale-100 group-hover:scale-125 blur-[2px]">
                    <img 
                      src="/img2.png" 
                      alt="" 
                      className="w-full h-full object-contain p-8 invert brightness-200"
                    />
                  </div>
                  
                  {/* Main Image Layer */}
                  <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110 relative z-10">
                    <img 
                      src="/img2.png" 
                      alt="Similar Item" 
                      className="w-full h-full object-contain p-8 transform group-hover:translate-y-[-15px] transition-transform duration-700"
                    />
                  </div>
                </Link>
                <button className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </button>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-white text-sm md:text-base font-medium mb-1">SO 04 101 | Pillar Cock with Base</h3>
                <p className="text-white text-sm font-semibold mb-2">INR 1930</p>
                <div className="flex justify-center gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-xs">★</span>)}
                </div>
              </div>
              <button 
                onClick={() => openCart({
                  id: `SIM-${item}`,
                  name: 'SO 04 101 | Pillar Cock with Base',
                  finish: 'Chrome',
                  height: 'N/A',
                  price: 1930,
                  img: '/img2.png',
                })}
                className="w-full border border-white/20 rounded-sm text-white text-sm py-3 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></svg>
                <span>Add to cart</span>
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* ── Cart Drawer Overlay ── */}
      <div
        ref={backdropRef}
        onClick={closeCart}
        className={`fixed inset-0 bg-black/60 z-[9998] ${
          cartOpen ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* ── Cart Drawer Panel ── */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-[#1A1A1A] z-[9999] flex flex-col shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="px-10 pt-14 pb-6 flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold font-outfit">Your Cart</h2>
          <button onClick={closeCart} className="text-white/30 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mx-10 border-t border-white/10" />

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-10 py-10">
          {cartItems.length === 0 ? (
            <p className="text-white/20 text-sm text-center mt-20">Your cart is empty</p>
          ) : (
            <div className="flex flex-col gap-10">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  {/* Product Thumbnail */}
                  <div className="w-24 h-24 bg-black border border-white/10 rounded-sm overflow-hidden shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col min-h-[96px]">
                    <div className="mb-3">
                      <h3 className="text-white text-[13px] font-bold font-outfit leading-tight mb-2 pr-1">{item.name}</h3>
                      <p className="text-white/40 text-[10px] mb-1">Color / Finish : {item.finish}</p>
                      <p className="text-white/40 text-[10px]">Total Height = {item.height}</p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      {/* Qty Controls */}
                      <div className="flex items-center border border-white/20 rounded-[2px] h-7">
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-full flex items-center justify-center text-white/50 hover:text-white transition-colors text-xs"
                        >+</button>
                        <span className="w-6 h-full flex items-center justify-center text-white text-[11px] border-x border-white/20">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-full flex items-center justify-center text-white/50 hover:text-white transition-colors text-xs"
                        >−</button>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-white text-sm font-bold font-outfit mb-0.5">₹{item.price * item.qty}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/30 text-[10px] underline underline-offset-2 hover:text-white/60 transition-colors"
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-10 pb-12 pt-8">
            <div className="border-t border-white/10 mb-8" />
            <div className="flex items-center justify-between mb-10">
              <span className="text-white text-2xl font-bold font-outfit">Cart Total</span>
              <span className="text-white text-2xl font-bold font-outfit">₹{subtotal}</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 border border-white/30 rounded-sm text-white text-[11px] py-3 hover:bg-white/5 transition-colors uppercase tracking-[0.2em] font-medium">
                View Cart
              </button>
              <Link to="/checkout" className="flex-1 border border-white/30 rounded-sm text-white text-[11px] py-3 hover:bg-white hover:text-black transition-colors uppercase tracking-[0.2em] font-medium text-center">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
