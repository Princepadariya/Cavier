import React, { useRef, useEffect } from 'react';

import { animate, stagger, createSpring } from 'animejs';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ─── helper: attach IntersectionObserver + animate on enter, reset on leave ─── */
function useSection(ref, buildConfigs) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const configs = buildConfigs(el);

    const reset = () => configs.forEach(({ targets, from }) =>
      targets.forEach(t => Object.assign(t.style, from))
    );
    reset();

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) configs.forEach(c => animate(c.targets, c.anim));
      else reset();
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

const About = () => {
  const catRef = useRef(null);
  const numRef = useRef(null);
  const craftRef = useRef(null);
  const foundRef = useRef(null);
  const engRef = useRef(null);
  const dealerRef = useRef(null);
  const teamRef = useRef(null);
  const testRef = useRef(null);
  const zScrollRef = useRef(null);


  // ── Category cards: 3D emerge ──
  useSection(catRef, el => {
    const title = el.querySelectorAll('.sec-title');
    const cards = el.querySelectorAll('.cat-card');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(60px) scale(0.9)' },
        anim: { opacity: [0,1], translateY: [60,0], scale: [0.9,1],
          duration: 1400, delay: stagger(120, { start: 300 }), ease: 'outQuart' } },
    ];
  });

  // ── Numbers: counting animation ──
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const title = el.querySelector('.sec-title');
    const counters = el.querySelectorAll('.stat-counter');
    const cards = el.querySelectorAll('.stat-card');

    // Stats config: value, suffix, formatter
    const statsData = [
      { value: 100, suffix: '%' },
      { value: 100000, suffix: '+', format: v => v.toLocaleString('en-IN') },
      { value: 20, suffix: '+' },
      { value: 3000, suffix: '+' },
    ];

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(40px)'; }
      cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; });
      counters.forEach(c => { c.textContent = '0'; });
    };
    reset();

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Title fade-up
        if (title) animate(title, { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' });
        // Cards fade-up with stagger
        animate(cards, { opacity: [0,1], translateY: [20,0], duration: 900, delay: stagger(120, { start: 200 }), ease: 'outQuart' });
        // Count-up each number with stagger
        counters.forEach((counter, i) => {
          const { value, suffix, format } = statsData[i];
          const obj = { val: 0 };
          animate(obj, {
            val: [0, value],
            duration: 1800,
            delay: 300 + i * 150,
            ease: 'outExpo',
            onUpdate: () => {
              const rounded = Math.round(obj.val);
              counter.textContent = (format ? format(rounded) : rounded.toString()) + suffix;
            },
          });
        });
      } else {
        reset();
      }
    }, { threshold: 0.15 });
    obs.observe(el);

    // Magnetic Stats Tilt
    const handleStatTilt = (e) => {
      const cards = el.querySelectorAll('.stat-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
          card.style.borderColor = 'rgba(212,175,55,0.4)';
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
          card.style.borderColor = 'rgba(255,255,255,0.2)';
        }
      });
    };

    window.addEventListener('mousemove', handleStatTilt);
    return () => {
      obs.disconnect();
      window.removeEventListener('mousemove', handleStatTilt);
    };
  }, []);

  // ── Crafted section: slide left/right ──
  useSection(craftRef, el => {
    const text = el.querySelectorAll('.craft-text');
    const img = el.querySelectorAll('.craft-img');
    return [
      { targets: [...text], from: { opacity: '0', transform: 'translateX(-50px)' },
        anim: { opacity: [0,1], translateX: [-50,0], duration: 1400, ease: 'outExpo' } },
      { targets: [...img], from: { opacity: '0', transform: 'translateX(50px) scale(0.95)' },
        anim: { opacity: [0,1], translateX: [50,0], scale: [0.95,1],
          duration: 1600, delay: 200, ease: 'outQuart' } },
    ];
  });

  // ── Foundation cards: stagger wave ──
  useSection(foundRef, el => {
    const title = el.querySelectorAll('.sec-title');
    const cards = el.querySelectorAll('.found-card');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(60px)' },
        anim: { opacity: [0,1], translateY: [60,0],
          duration: 1200, delay: stagger(80, { start: 300 }), ease: 'outQuart' } },
    ];
  });

  // ── Engineered: slide + lines sweep ──
  useSection(engRef, el => {
    const img = el.querySelectorAll('.eng-img');
    const text = el.querySelectorAll('.eng-text');
    const lines = el.querySelectorAll('.eng-line');
    return [
      { targets: [...img], from: { opacity: '0', transform: 'translateX(-60px)' },
        anim: { opacity: [0,1], translateX: [-60,0], duration: 1600, ease: 'outExpo' } },
      { targets: [...text], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0],
          duration: 1200, delay: stagger(100, { start: 300 }), ease: 'outQuart' } },
      { targets: [...lines], from: { transform: 'scaleX(0)' },
        anim: { scaleX: [0,1], duration: 1000, delay: stagger(150, { start: 500 }), ease: 'inOutQuart' } },
    ];
  });

  // ── Dealer showroom: slide left/right ──
  useSection(dealerRef, el => {
    const text = el.querySelectorAll('.dealer-text');
    const img = el.querySelectorAll('.dealer-img');
    return [
      { targets: [...text], from: { opacity: '0', transform: 'translateX(-50px)' },
        anim: { opacity: [0,1], translateX: [-50,0], duration: 1400, ease: 'outExpo' } },
      { targets: [...img], from: { opacity: '0', transform: 'translateX(50px) scale(0.95)' },
        anim: { opacity: [0,1], translateX: [50,0], scale: [0.95,1],
          duration: 1600, delay: 200, ease: 'outQuart' } },
    ];
  });

  // ── Team members: stagger up with spring ──
  useSection(teamRef, el => {
    const title = el.querySelectorAll('.sec-title');
    const members = el.querySelectorAll('.team-member');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: el.querySelectorAll('.team-curtain'), from: { transform: 'translateX(0%)' },
        anim: { translateX: ['0%', '101%'], duration: 1200, delay: stagger(200, { start: 400 }), ease: 'inOutExpo' } },
      { targets: [...members], from: { opacity: '0', transform: 'scale(1.1)' },
        anim: { opacity: [0,1], scale: [1.1,1], duration: 1400, delay: stagger(200, { start: 400 }), ease: 'outQuart' } },
    ];
  });

  // ── Testimonial section: spring ──
  useSection(testRef, el => {
    const text = el.querySelectorAll('.test-left');
    const card = el.querySelectorAll('.test-card');
    return [
      { targets: [...text], from: { opacity: '0', transform: 'translateX(-40px)' },
        anim: { opacity: [0,1], translateX: [-40,0], duration: 1400, ease: 'outExpo' } },
      { targets: [...card], from: { opacity: '0', transform: 'translateY(50px) scale(0.92)' },
        anim: { opacity: [0,1], translateY: [50,0], scale: [0.92,1],
          duration: 1400, delay: 300,
          ease: createSpring({ stiffness: 70, damping: 16, mass: 1 }) } },
    ];
  });

  useGSAP(() => {
    const panels = gsap.utils.toArray('.z-panel');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: zScrollRef.current,
        start: 'top top',
        end: '+=250%', // Reduced from 400% for a faster, tighter experience
        pin: true,
        scrub: 1.2, // Slightly more responsive scrub
      }
    });

    panels.forEach((panel, i) => {
      // Space them out along Z-axis
      gsap.set(panel, { z: -i * 800, opacity: i === 0 ? 1 : 0 });
      
      // Animate them forward
      tl.to(panel, {
        z: 800, 
        opacity: i === panels.length - 1 ? 1 : 0, 
        ease: 'power2.inOut',
      }, i * 0.4); // Faster transitions
    });
  }, { scope: zScrollRef });

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen relative overflow-x-hidden">


      {/* Heritage Depth Z-Scroll Section */}
      <div ref={zScrollRef} className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Dynamic Light Beams */}
          <div className="absolute top-[-20%] left-[-10%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] opacity-30 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Gold Dust Particles */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-[#d4af37] rounded-full blur-[1px]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * -20}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Perspective Tunnel */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
          
          {/* Panel 1: The Vision */}
          <div className="z-panel absolute flex flex-col items-center text-center max-w-2xl px-6">
            <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.6em] mb-4 opacity-50">Origin Story</span>
            <h1 className="text-white text-5xl md:text-8xl font-light tracking-tighter mb-8 font-outfit uppercase leading-[0.9]">
              The Heritage<br/><span className="font-bold text-[#d4af37]">of Cavier</span>
            </h1>
            <div className="w-12 h-[1px] bg-[#d4af37] mb-8" />
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg">
              Every masterpiece begins with a vision. Our journey started with a single block of raw brass and a commitment to precision.
            </p>
          </div>

          {/* Panel 2: The Raw Material (Image) */}
          <div className="z-panel absolute w-[65vw] md:w-[45vw] aspect-[4/5] md:aspect-square overflow-hidden rounded-sm border border-white/5 shadow-2xl">
            <img src="/img5.png" alt="Raw Brass" className="w-full h-full object-cover scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-4xl font-light tracking-[0.5em] uppercase mt-40">Pure Ingot</h2>
            </div>
          </div>

          {/* Panel 3: Engineering Depth */}
          <div className="z-panel absolute flex flex-col items-center text-center max-w-2xl px-6">
            <h1 className="text-white text-4xl md:text-7xl font-bold tracking-widest mb-8 font-outfit uppercase">
              Precision<br/><span className="font-light">Engineering</span>
            </h1>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
              1,00,000 cycles. Aerospace-grade milling. We don't just build faucets; we engineer enduring performance.
            </p>
          </div>

          {/* Panel 4: The Final Form (Image) */}
          <div className="z-panel absolute w-[75vw] md:w-[50vw] aspect-[4/3] md:aspect-video overflow-hidden rounded-sm border border-white/10 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
            <img src="/img6.png" alt="Finished Product" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12 text-left">
              <div className="max-w-md">
                <span className="text-[#d4af37] uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 block">Present Day</span>
                <h2 className="text-white text-3xl md:text-5xl font-light tracking-[0.1em] uppercase leading-tight">The Cavier<br/><span className="font-bold text-[#d4af37]">Standard</span></h2>
                <div className="w-12 h-[1px] bg-white/20 mt-6" />
              </div>
            </div>
          </div>

        </div>

        {/* Floating background elements for depth */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#d4af37]/5 blur-[150px] rounded-full" />
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20 pointer-events-none opacity-20">
          <ChevronDown className="text-white" size={16} />
        </div>
      </div>

      {/* 4-Card Category Grid */}
      <section ref={catRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="sec-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-12 font-outfit will-change-transform">
          Crafted for Every Bath Space
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          {[
            { img: '/fitting_category.png', label: 'Shower' },
            { img: '/accessories_category.png', label: 'Bathroom Accessory' },
            { img: '/img1.png', label: 'Wallness' },
            { img: '/img2.png', label: 'Sanitary Ware' },
          ].map((c) => (
            <div key={c.label} className="cat-card group relative w-full aspect-[4/3] overflow-hidden rounded-lg cursor-pointer will-change-transform">
              <img src={c.img} alt={c.label} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 right-0 p-6 md:p-8">
                <span className="text-white md:text-lg font-light tracking-wide">{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAVIER in Numbers */}
      <section ref={numRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12">
        <h2 className="sec-title text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide mb-12 font-outfit will-change-transform">
          CAVIER in Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Made in India' },
            { label: 'Happy Customers' },
            { label: 'Years of Experience' },
            { label: 'Faucets Manufacture' },
          ].map((s, i) => (
            <div key={i} className="stat-card border border-white/20 rounded-sm px-4 md:px-6 py-6 md:py-10 flex flex-col items-center text-center will-change-transform">
              <span className="stat-counter text-white text-2xl md:text-3xl lg:text-4xl font-semibold font-outfit mb-3">0</span>
              <span className="text-[#a3a3a3] text-xs md:text-sm font-light">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Crafted for Every Bath Space */}
      <section ref={craftRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          <div className="craft-text w-full md:w-[45%] flex flex-col justify-center will-change-transform">
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide leading-snug mb-8 font-outfit">
              Crafted for Every<br />Bath Space
            </h2>
            <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light mb-10 max-w-md">
              <span className="text-white font-medium">At Cavier,</span> we combine precision engineering 
              with refined design to create bath fittings that 
              elevate modern spaces. With advanced 
              manufacturing and superior finishing, every 
              product reflects our commitment to quality, 
              durability, and timeless appeal.
            </p>
            <button className="flex items-center space-x-2 text-white border border-white/30 px-5 py-2.5 text-xs md:text-sm tracking-wide hover:bg-white hover:text-black transition-colors w-fit">
              <span>Explore Location</span><span>›</span>
            </button>
          </div>
          <div className="craft-img w-full md:w-[55%] aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg will-change-transform">
            <img src="/img3.png" alt="Crafted Bath Space" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* The Foundation of Our Excellence */}
      <section ref={foundRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="sec-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-12 font-outfit will-change-transform">
          The Foundation of Our Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
          {[
            { n: '01', t: 'Innovation', d: 'We continuously push the boundaries of design and technology to create modern bathroom solutions that solve real needs and elevate everyday living.' },
            { n: '02', t: 'Quality', d: 'Every CAVIER product is crafted with precision and attention to detail, ensuring durability, reliability, and the highest standards our customers expect.' },
            { n: '03', t: 'Accessibility', d: 'We believe premium design should be within reach. Our products deliver a perfect balance of aesthetics, performance, and value without compromise.' },
          ].map((c) => (
            <div key={c.n} className="found-card border border-white/15 rounded-sm p-6 md:p-8 flex flex-col justify-between min-h-[260px] will-change-transform">
              <span className="text-white/50 text-sm font-light">{c.n}</span>
              <div>
                <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide mb-4 font-outfit uppercase">{c.t}</h3>
                <p className="text-[#a3a3a3] text-xs md:text-sm leading-relaxed font-light">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {[
            { n: '04', t: 'Elegance', d: 'Each CAVIER creation is designed with refined beauty and timeless appeal, enhancing the ambiance of every space with simplicity and sophistication.' },
            { n: '05', t: 'Reliability', d: 'We ensure consistent performance and dependable quality in every product, building long-term trust with our customers through excellence and durability.' },
          ].map((c) => (
            <div key={c.n} className="found-card border border-white/15 rounded-sm p-6 md:p-8 flex flex-col justify-between min-h-[260px] will-change-transform">
              <span className="text-white/50 text-sm font-light">{c.n}</span>
              <div>
                <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide mb-4 font-outfit uppercase">{c.t}</h3>
                <p className="text-[#a3a3a3] text-xs md:text-sm leading-relaxed font-light">{c.d}</p>
              </div>
            </div>
          ))}
          <div className="found-card relative overflow-hidden rounded-sm min-h-[260px] will-change-transform">
            <img src="/img4.png" alt="Cavier Excellence" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Engineered Perfection */}
      <section ref={engRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="eng-img w-full md:w-[45%] will-change-transform">
            <img src="/img6.png" alt="Engineered Perfection" className="w-full h-auto object-contain" />
          </div>
          <div className="w-full md:w-[55%] flex flex-col justify-center">
            <span className="eng-text text-[#a3a3a3] text-xs tracking-[0.3em] uppercase mb-6 font-light will-change-transform">Materiality</span>
            <h2 className="eng-text text-white text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide leading-[1.1] mb-10 md:mb-16 font-outfit uppercase will-change-transform">
              Engineered<br />Perfection.
            </h2>
            <div className="mb-10">
              <div className="eng-line w-full h-px bg-white/10 mb-8" style={{ transformOrigin: 'left center' }} />
              <h3 className="eng-text text-white text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-3 will-change-transform">Precision Milling</h3>
              <p className="eng-text text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light max-w-lg will-change-transform">
                Each component is milled from a single block of aerospace-grade stainless steel.
              </p>
            </div>
            <div>
              <div className="eng-line w-full h-px bg-white/10 mb-8" style={{ transformOrigin: 'left center' }} />
              <h3 className="eng-text text-white text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-3 will-change-transform">Vapor Deposition</h3>
              <p className="eng-text text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light max-w-lg will-change-transform">
                Molecular-level coating for a finish that resists the passage of time and tide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cavier Authorised Dealer Showroom */}
      <section ref={dealerRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-stretch">
          <div className="dealer-text w-full md:w-[45%] flex flex-col justify-center will-change-transform">
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide leading-snug mb-8 font-outfit">
              Cavier Authorised<br />Dealer Showroom
            </h2>
            <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light mb-6 max-w-lg">
              The CAVIER Authorized Showroom is a dedicated retail space designed to showcase our complete range of premium bathroom solutions.
            </p>
            <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light mb-6 max-w-lg">
              Our showrooms feature an extensive collection of bathroom fittings, including elegant faucets, sanitaryware, shower systems, and accessories.
            </p>
            <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light mb-10 max-w-lg">
              From contemporary designs to timeless finishes, CAVIER offers a comprehensive range that caters to residential and commercial spaces.
            </p>
            <button className="flex items-center space-x-2 text-white border border-white/30 px-5 py-2.5 text-xs md:text-sm tracking-wide hover:bg-white hover:text-black transition-colors w-fit">
              <span>Cavier Display Showroom</span><span>›</span>
            </button>
          </div>
          <div className="dealer-img w-full md:w-[55%] overflow-hidden rounded-lg will-change-transform">
            <img src="/img5.png" alt="Cavier Authorised Dealer Showroom" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section ref={teamRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="sec-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-12 font-outfit will-change-transform">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 w-full">
          {[
            { name: 'Varna Ajudiya', img: '/team_varna.png' },
            { name: 'Rakesh Ajudiya', img: '/team_rakesh.png' },
            { name: 'Bhautik Ajudiya', img: '/team_bhautik.png' },
          ].map((m) => (
            <div key={m.name} className="team-member group relative flex flex-col will-change-transform overflow-hidden">
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                {/* Cinematic Curtain */}
                <div className="team-curtain absolute inset-0 bg-[#1F1F21] z-10 will-change-transform" />
                <img src={m.img} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
              </div>
              <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/5 mt-auto">
                <p className="text-white text-sm md:text-base font-medium font-outfit tracking-wider uppercase">{m.name}</p>
                <p className="text-[#a3a3a3] text-[10px] uppercase tracking-[0.2em] mt-1">Directorship</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences That Speak for Quality */}
      <section ref={testRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          <div className="test-left w-full md:w-[35%] flex flex-col justify-center will-change-transform">
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide leading-snug mb-10 font-outfit">
              Experiences That<br />Speak for Quality
            </h2>
            <button className="flex items-center space-x-2 text-white border border-white/30 px-5 py-2.5 text-xs md:text-sm tracking-wide hover:bg-white hover:text-black transition-colors w-fit">
              <span>Explore Products</span><span>›</span>
            </button>
          </div>
          <div className="test-card w-full md:w-[65%] will-change-transform">
            <div className="bg-[#2a2a2c] border border-white/10 rounded-lg p-8 md:p-10 shadow-xl">
              <h3 className="text-white text-lg md:text-xl font-semibold mb-1 font-outfit">James Walker</h3>
              <p className="text-[#a3a3a3] text-xs italic mb-6">— Distributor</p>
              <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light italic mb-6">
                Cavier products have exceeded our expectations in terms of durability and finish. The consistency in quality across orders makes them a reliable partner for our projects.
              </p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-lg">★</span>)}
              </div>
            </div>
            <div className="mt-8 w-full h-[2px] bg-white/10 rounded-full">
              <div className="h-full w-1/3 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
