import React, { useRef, useEffect } from 'react';

import { animate, stagger } from 'animejs';
import { ChevronDown, ArrowRight, ChevronRight } from 'lucide-react';
import Testimonials from '../components/Testimonials';

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
      if (e.isIntersecting) {
        configs.forEach(c => animate(c.targets, c.anim));
        obs.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

const About = () => {
  const heroRef = useRef(null);
  const catRef = useRef(null);
  const numRef = useRef(null);
  const craftRef = useRef(null);
  const foundRef = useRef(null);
  const engRef = useRef(null);
  const dealerRef = useRef(null);



  // ── Hero banner: text fade-up + image reveal ──
  useSection(heroRef, el => {
    const text = el.querySelectorAll('.hero-anim');
    const img = el.querySelectorAll('.hero-img');
    return [
      {
        targets: [...text], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: {
          opacity: [0, 1], translateY: [40, 0],
          duration: 600, delay: stagger(60, { start: 50 }), ease: 'outQuart'
        }
      },
      {
        targets: [...img], from: { opacity: '0', transform: 'scale(1.08)' },
        anim: { opacity: [0, 1], scale: [1.08, 1], duration: 700, ease: 'outQuart' }
      },
    ];
  });

  // ── Category cards: 3D emerge ──
  useSection(catRef, el => {
    const title = el.querySelectorAll('.sec-title');
    const cards = el.querySelectorAll('.cat-card');
    return [
      {
        targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' }
      },
      {
        targets: [...cards], from: { opacity: '0', transform: 'translateY(60px) scale(0.9)' },
        anim: {
          opacity: [0, 1], translateY: [60, 0], scale: [0.9, 1],
          duration: 600, delay: stagger(60, { start: 100 }), ease: 'outQuart'
        }
      },
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
        if (title) animate(title, { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' });
        // Cards fade-up with stagger
        animate(cards, { opacity: [0, 1], translateY: [20, 0], duration: 500, delay: stagger(60, { start: 100 }), ease: 'outQuart' });
        // Count-up each number with stagger
        counters.forEach((counter, i) => {
          const { value, suffix, format } = statsData[i];
          const obj = { val: 0 };
          animate(obj, {
            val: [0, value],
            duration: 900,
            delay: 100 + i * 60,
            ease: 'outExpo',
            onUpdate: () => {
              const rounded = Math.round(obj.val);
              counter.textContent = (format ? format(rounded) : rounded.toString()) + suffix;
            },
          });
        });
        obs.disconnect();
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
      {
        targets: [...text], from: { opacity: '0', transform: 'translateX(-50px)' },
        anim: { opacity: [0, 1], translateX: [-50, 0], duration: 600, ease: 'outExpo' }
      },
      {
        targets: [...img], from: { opacity: '0', transform: 'translateX(50px) scale(0.95)' },
        anim: {
          opacity: [0, 1], translateX: [50, 0], scale: [0.95, 1],
          duration: 700, delay: 80, ease: 'outQuart'
        }
      },
    ];
  });

  // ── Foundation cards: stagger wave ──
  useSection(foundRef, el => {
    const title = el.querySelectorAll('.sec-title');
    const cards = el.querySelectorAll('.found-card');
    return [
      {
        targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' }
      },
      {
        targets: [...cards], from: { opacity: '0', transform: 'translateY(60px)' },
        anim: {
          opacity: [0, 1], translateY: [60, 0],
          duration: 600, delay: stagger(50, { start: 100 }), ease: 'outQuart'
        }
      },
    ];
  });

  // ── Engineered: slide + lines sweep ──
  useSection(engRef, el => {
    const img = el.querySelectorAll('.eng-img');
    const text = el.querySelectorAll('.eng-text');
    const lines = el.querySelectorAll('.eng-line');
    return [
      {
        targets: [...img], from: { opacity: '0', transform: 'translateX(-60px)' },
        anim: { opacity: [0, 1], translateX: [-60, 0], duration: 700, ease: 'outExpo' }
      },
      {
        targets: [...text], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: {
          opacity: [0, 1], translateY: [40, 0],
          duration: 600, delay: stagger(60, { start: 100 }), ease: 'outQuart'
        }
      },
      {
        targets: [...lines], from: { transform: 'scaleX(0)' },
        anim: { scaleX: [0, 1], duration: 500, delay: stagger(80, { start: 150 }), ease: 'inOutQuart' }
      },
    ];
  });

  // ── Dealer showroom: slide left/right ──
  useSection(dealerRef, el => {
    const text = el.querySelectorAll('.dealer-text');
    const img = el.querySelectorAll('.dealer-img');
    return [
      {
        targets: [...text], from: { opacity: '0', transform: 'translateX(-50px)' },
        anim: { opacity: [0, 1], translateX: [-50, 0], duration: 600, ease: 'outExpo' }
      },
      {
        targets: [...img], from: { opacity: '0', transform: 'translateX(50px) scale(0.95)' },
        anim: {
          opacity: [0, 1], translateX: [50, 0], scale: [0.95, 1],
          duration: 700, delay: 80, ease: 'outQuart'
        }
      },
    ];
  });


  return (
    <div className="w-full bg-[#1F1F21] min-h-screen relative overflow-x-hidden">

      {/* Hero Banner */}
      <section ref={heroRef} className="relative w-full min-h-screen md:h-screen flex flex-col md:flex-row md:gap-8 lg:gap-12 bg-[#1F1F21]">
        {/* Left: text */}
        <div className="w-full md:w-[calc(52%-1rem)] lg:w-[calc(52%-1.5rem)] flex flex-col justify-center pl-6 pr-0 md:pl-12 lg:pl-32 pt-28 pb-16 md:pt-[102px] md:pb-0">
          <h1 className="hero-anim text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.2] md:leading-[1.2] lg:leading-[1.2] tracking-tight font-outfit mb-8 will-change-transform">
            Redefining<br />Everyday Luxury
          </h1>
          <p className="hero-anim text-[#7E7E7E] text-[1.25rem] md:text-[1.25rem] leading-[1.8] md:leading-[1.8] font-light mb-10 will-change-transform">
            Eco-friendly, lead-free bath fittings designed to meet global safety standards. Pioneering innovation with high-performance solutions for modern info At CAVIER, we craft premium bathroom solutions that blend timeless design with modern functionality—elevating spaces with precision, elegance, and innovation. Infrastructure.
          </p>
          <button className="hero-anim flex items-center gap-3 text-white border border-white px-5 py-3 text-sm hover:bg-white hover:text-black transition-all duration-300 w-fit will-change-transform">
            <span>Scroll Down</span><ChevronDown size={18} />
          </button>
        </div>
        {/* Right: image */}
        <div className="w-full md:w-[calc(48%-1rem)] lg:w-[calc(48%-1.5rem)] h-[45vh] md:h-full overflow-hidden">
          <img src="/images/about_hero.png" alt="Cavier Bath Fittings" className="hero-img w-full h-full object-cover will-change-transform" />
        </div>
      </section>

      {/* 4-Card Category Grid */}
      <section ref={catRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="sec-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-12 font-outfit will-change-transform">
          Crafted for Every Bath Space
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          {[
            { img: '/images/fitting_category.png', label: 'Shower' },
            { img: '/images/accessories_category.png', label: 'Bathroom Accessory' },
            { img: '/images/img1.png', label: 'Wallness' },
            { img: '/images/img2.png', label: 'Sanitary Ware' },
          ].map((c) => (
            <div key={c.label} className="cat-card group relative w-full aspect-[4/3] md:aspect-[16/14] overflow-hidden cursor-pointer will-change-transform">
              <img src={c.img} alt={c.label} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 right-0 p-6 md:p-8">
                <span className="text-white text-xl md:text-2xl font-light tracking-wide">{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAVIER in Numbers */}
      <section ref={numRef} className="w-full bg-[#1F1F21] pt-6 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
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
      <section ref={craftRef} className="w-full bg-[#1F1F21] pt-6 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
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
          <div className="craft-img w-full md:w-[55%] aspect-[4/3] md:aspect-[1/1] overflow-hidden will-change-transform">
            <img src="/images/img3.png" alt="Crafted Bath Space" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* The Foundation of Our Excellence */}
      <section ref={foundRef} className="w-full bg-[#1F1F21] pt-6 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="sec-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-12 font-outfit will-change-transform">
          The Foundation of Our Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4 md:gap-5">
          {[
            { n: '01', t: 'Innovation', d: 'We continuously push the boundaries of design and technology to create modern bathroom solutions that solve real needs and elevate everyday living.' },
            { n: '02', t: 'Quality', d: 'Every CAVIER product is crafted with precision and attention to detail, ensuring durability, reliability, and the highest standards our customers expect.' },
            { n: '03', t: 'Accessibility', d: 'We believe premium design should be within reach. Our products deliver a perfect balance of aesthetics, performance, and value without compromise.' },
            { n: '04', t: 'Elegance', d: 'Each CAVIER creation is designed with refined beauty and timeless appeal, enhancing the ambiance of every space with simplicity and sophistication.' },
            { n: '05', t: 'Reliability', d: 'We ensure consistent performance and dependable quality in every product, building long-term trust with our customers through excellence and durability.' },
          ].map((c) => (
            <div key={c.n} className="found-card relative border border-[#F9F9F9] rounded-sm p-5 md:p-6 min-h-[190px] will-change-transform">
              <span className="text-[#FFFFFF] text-base font-light">{c.n}</span>
              <div className="absolute inset-0 flex items-center px-5 md:px-6">
                <h3 className="text-white text-xl md:text-2xl font-semibold tracking-wide font-outfit uppercase">{c.t}</h3>
              </div>
              <p className="absolute bottom-5 md:bottom-6 left-5 md:left-6 right-5 md:right-6 text-[#a3a3a3] text-[1.025rem] md:text-[1.025rem] leading-relaxed font-light">{c.d}</p>
            </div>
          ))}
          <div className="found-card relative overflow-hidden rounded-sm border border-[#F9F9F9] min-h-[190px] will-change-transform">
            <img src="/images/img4.png" alt="Cavier Excellence" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Engineered Perfection */}
      <section ref={engRef} className="w-full bg-[#1F1F21] pt-6 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="eng-img w-full md:w-1/2 will-change-transform">
            <img src="/images/img6.png" alt="Engineered Perfection" className="w-full h-auto object-contain" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="eng-text text-[#a3a3a3] text-xs tracking-[0.3em] uppercase mb-6 font-light will-change-transform">Materiality</span>
            <h2 className="eng-text text-white text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide leading-[1.4] md:leading-[1.4] lg:leading-[1.4] mb-10 md:mb-16 font-outfit uppercase will-change-transform">
              Engineered<br />Perfection.
            </h2>
            <div className="mb-12">
              <div className="eng-line w-full h-px bg-white/10 mb-8" style={{ transformOrigin: 'left center' }} />
              <h3 className="eng-text text-[#E7E5E5] text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-3 will-change-transform">Precision Milling</h3>
              <p className="eng-text text-[#ACABAB] text-base md:text-lg leading-relaxed font-light will-change-transform">
                Each component is milled from a single block of aerospace-grade stainless steel.
              </p>
            </div>
            <div>
              <div className="eng-line w-full h-px bg-white/10 mb-8" style={{ transformOrigin: 'left center' }} />
              <h3 className="eng-text text-[#E7E5E5] text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-3 will-change-transform">Vapor Deposition</h3>
              <p className="eng-text text-[#ACABAB] text-base md:text-lg leading-relaxed font-light will-change-transform">
                Molecular-level coating for a finish that resists the passage of time and tide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cavier Authorised Dealer Showroom */}
      <section ref={dealerRef} className="w-full bg-[#1F1F21] pt-6 pb-16 md:py-24 px-6 md:pl-12 md:pr-0 lg:pl-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-stretch">
          <div className="dealer-text w-full md:w-[40%] flex flex-col justify-center will-change-transform">
            <h2 className="text-4xl md:text-5xl lg:text-[2.75rem] font-light text-white tracking-wide leading-[1.5] md:leading-[1.5] lg:leading-[1.5] mb-8 font-outfit">
              Cavier Authorised<br />Dealer Showroom
            </h2>
            <p className="text-[#ffffff] text-base md:text-lg leading-relaxed font-light mb-6 max-w-lg">
              The CAVIER Authorized Showroom is a dedicated retail space designed to showcase our complete range of premium bathroom solutions. Located across key markets, these showrooms offer customers an immersive experience where design, quality, and innovation come together.
            </p>
            <p className="text-[#ffffff] text-base md:text-lg leading-relaxed font-light mb-6 max-w-lg">
              Our showrooms feature an extensive collection of bathroom fittings, including elegant faucets, sanitaryware, shower systems, and a wide range of accessories—each crafted to meet modern lifestyle needs. Every product is displayed in thoughtfully designed setups, allowing customers to explore styles, finishes, and functionalities in a real-world environment.
            </p>
            <p className="text-[#ffffff] text-base md:text-lg leading-relaxed font-light mb-10 max-w-lg">
              From contemporary designs to timeless finishes, CAVIER offers a comprehensive range that caters to residential and commercial spaces. Our showrooms are your one-stop destination for creating modern, functional, and aesthetically refined bathrooms.
            </p>
            <button
              className="faucet-view-btn flex items-center gap-3 px-5 py-3 border border-white
                       text-white text-sm
                       hover:bg-white hover:text-black transition-all duration-300 w-fit"
            >
              Cavier Display Showroom
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="dealer-img w-full md:w-[60%] overflow-hidden will-change-transform h-[500px] md:h-[750px]">
            <img src="/images/img5.jpg" alt="Cavier Authorised Dealer Showroom" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>


      <Testimonials bgClass="bg-[#1F1F21]" />
    </div>
  );
};

export default About;
