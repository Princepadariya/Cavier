import React, { useRef, useEffect } from 'react';
import { animate, stagger, createSpring } from 'animejs';
import { ChevronDown } from 'lucide-react';

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

const Dealership = () => {
  const heroRef = useRef(null);
  const philRef = useRef(null);
  const valRef = useRef(null);
  const pathRef = useRef(null);
  const candRef = useRef(null);
  const formRef = useRef(null);
  const offerRef = useRef(null);

  // Hero: on-mount entrance
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.dealer-content > *');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(50px)'; });
    setTimeout(() => {
      animate(items, {
        opacity: [0, 1], translateY: [50, 0],
        duration: 1400, delay: stagger(130, { start: 500 }),
        ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
      });
    }, 200);
  }, []);

  // Philosophy: quote slide + description fade
  useSection(philRef, el => {
    const label = el.querySelectorAll('.phil-label');
    const quote = el.querySelectorAll('.phil-quote');
    const desc = el.querySelectorAll('.phil-desc');
    return [
      { targets: [...label], from: { opacity: '0', transform: 'translateY(20px)' },
        anim: { opacity: [0,1], translateY: [20,0], duration: 1000, ease: 'outQuart' } },
      { targets: [...quote], from: { opacity: '0', transform: 'translateX(-50px)' },
        anim: { opacity: [0,1], translateX: [-50,0], duration: 1400, delay: 200, ease: 'outExpo' } },
      { targets: [...desc], from: { opacity: '0', transform: 'translateX(50px)' },
        anim: { opacity: [0,1], translateX: [50,0], duration: 1400, delay: 400, ease: 'outExpo' } },
    ];
  });

  // Value Propositions: grid cards stagger
  useSection(valRef, el => {
    const label = el.querySelectorAll('.val-label');
    const cards = el.querySelectorAll('.val-card');
    return [
      { targets: [...label], from: { opacity: '0', transform: 'translateY(20px)' },
        anim: { opacity: [0,1], translateY: [20,0], duration: 1000, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(60px) scale(0.9)' },
        anim: { opacity: [0,1], translateY: [60,0], scale: [0.9,1],
          duration: 1200, delay: stagger(80, { start: 300 }), ease: 'outQuart' } },
    ];
  });

  // Path to Partnership: steps pop
  useSection(pathRef, el => {
    const title = el.querySelectorAll('.path-title');
    const steps = el.querySelectorAll('.path-step');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...steps], from: { opacity: '0', transform: 'translateY(50px) scale(0.85)' },
        anim: { opacity: [0,1], translateY: [50,0], scale: [0.85,1],
          duration: 1200, delay: stagger(120, { start: 300 }), ease: 'outBack' } },
    ];
  });

  // Candidate Profiles: slide up
  useSection(candRef, el => {
    const label = el.querySelectorAll('.cand-label');
    const cards = el.querySelectorAll('.cand-card');
    return [
      { targets: [...label], from: { opacity: '0', transform: 'translateY(20px)' },
        anim: { opacity: [0,1], translateY: [20,0], duration: 1000, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(50px)' },
        anim: { opacity: [0,1], translateY: [50,0],
          duration: 1200, delay: stagger(150, { start: 300 }), ease: 'outQuart' } },
    ];
  });

  // Form: fields wave
  useSection(formRef, el => {
    const title = el.querySelectorAll('.form-title');
    const fields = el.querySelectorAll('.form-field');
    const btn = el.querySelectorAll('.form-btn');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...fields], from: { opacity: '0', transform: 'translateY(30px)' },
        anim: { opacity: [0,1], translateY: [30,0],
          duration: 1000, delay: stagger(60, { start: 300 }), ease: 'outQuart' } },
      { targets: [...btn], from: { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
        anim: { opacity: [0,1], translateY: [20,0], scale: [0.9,1], duration: 1000, delay: 800, ease: 'outBack' } },
    ];
  });

  // What We Offer: title slide + grid stagger
  useSection(offerRef, el => {
    const title = el.querySelectorAll('.offer-title');
    const items = el.querySelectorAll('.offer-item');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateX(-40px)' },
        anim: { opacity: [0,1], translateX: [-40,0], duration: 1400, ease: 'outExpo' } },
      { targets: [...items], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0],
          duration: 1200, delay: stagger(100, { start: 400 }), ease: 'outQuart' } },
    ];
  });

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen">


      {/* Technical Mesh Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 border-[0.5px] border-white/10" style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '160px 160px'
        }} />
      </div>

      {/* Hero */}
      <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Radar Pulse Effect */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="radar-circle w-[1px] h-[1px] rounded-full border border-white/20 animate-radar-pulse" />
          <div className="radar-circle w-[1px] h-[1px] rounded-full border border-white/10 animate-radar-pulse delay-700" />
        </div>

        <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/img3.png')" }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="dealer-content flex flex-col items-center">
            <span className="text-[#a3a3a3] text-xs md:text-sm tracking-[0.35em] uppercase mb-6 font-light will-change-transform">Global Partnership</span>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-[1.15] mb-8 font-outfit will-change-transform">Define The Future<br />Of Luxury With Us</h1>
            <p className="text-[#a3a3a3] max-w-2xl text-sm md:text-base leading-relaxed font-light mb-12 will-change-transform">Join an elite network of architectural ambassadors bringing precision-engineered elegance to the world's most exclusive interiors.</p>
            <button className="flex items-center space-x-3 text-white border border-white/30 px-6 py-3 text-sm hover:bg-white hover:text-black transition-all duration-500 will-change-transform group">
              <span>Explore Potential</span><ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section ref={philRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12">
        <span className="phil-label text-[#a3a3a3] text-xs tracking-[0.35em] uppercase block mb-10 font-light will-change-transform">The Philosophy</span>
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="phil-quote w-full md:w-[50%] will-change-transform">
            <p className="text-white text-2xl md:text-3xl lg:text-[2rem] font-light leading-snug tracking-wide font-outfit">We believe in the power of enduring partnerships. Our network of dealers are more than distributors; they are ambassadors of high-end architectural living.</p>
          </div>
          <div className="phil-desc w-full md:w-[50%] flex items-end will-change-transform">
            <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light">Building a CAVIER partnership means investing in a legacy of excellence. We invite entrepreneurs and distributors who share our obsession with detail and quality to join an ecosystem built for long-term growth and market leadership in the premium segment.</p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section ref={valRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16"><span className="val-label text-[#a3a3a3] text-xs tracking-[0.35em] uppercase font-light will-change-transform">Value Propositions</span></div>
        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
          {[
            { icon: '✦', title: 'Premium Product\nRange', desc: 'Meticulously crafted fittings that set new standards in architectural bathroom design.' },
            { icon: '⊛', title: 'Strong Brand\nIdentity', desc: 'A minimalist, luxury brand presence that resonates with architects and designers globally.' },
            { icon: '↗', title: 'Business\nOpportunities', desc: 'Competitive margins and strategic growth plans for high-performing regional partners.' },
            { icon: '⚙', title: 'Marketing\nSupport', desc: 'Global campaigns and local marketing toolkits designed to drive high-intent traffic.' },
            { icon: '⊕', title: 'Reliable Supply\nChain', desc: 'Streamlined logistics and inventory management ensuring consistent product availability.' },
            { icon: '★', title: 'Exclusive\nTerritories', desc: 'Protected regional distribution rights to ensure your market investment yields high returns.' },
          ].map((c, i) => (
            <div key={i} className={`val-card border-white/10 p-8 md:p-10 flex flex-col min-h-[240px] md:min-h-[280px] will-change-transform border-b md:border-r ${i % 3 === 2 ? 'md:border-r-0' : ''} ${i >= 3 ? 'md:border-b-0' : ''} ${i === 5 ? 'border-b-0' : ''}`}>
              <span className="text-white/40 text-2xl mb-6 md:mb-8">{c.icon}</span>
              <h3 className="text-white text-sm md:text-base font-semibold tracking-wide mb-3 md:mb-4 font-outfit uppercase leading-snug whitespace-pre-line">{c.title}</h3>
              <p className="text-[#a3a3a3] text-xs md:text-sm leading-relaxed font-light mt-auto">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Path To Partnership */}
      <section ref={pathRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12">
        <h2 className="path-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-16 font-outfit text-center will-change-transform">The Path To Partnership</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { n: '01', t: 'Inquiry', d: 'Submit your interest via our digital portal.' },
            { n: '02', t: 'Review', d: 'Our team evaluates market compatibility and potential.' },
            { n: '03', t: 'Connect', d: 'Direct dialogue to align on goals and vision.' },
            { n: '04', t: 'Start', d: 'Onboarding, setup, and global launch.' },
          ].map((s, i) => (
            <div key={s.n} className="path-step flex flex-col items-center text-center will-change-transform">
              <div className={`w-20 h-20 md:w-24 md:h-24 ${i === 3 ? 'bg-gradient-to-br from-[#888] to-[#444]' : 'border border-white/20'} rounded-sm flex items-center justify-center mb-6`}>
                <span className="text-white text-2xl md:text-3xl font-light font-outfit">{s.n}</span>
              </div>
              <h3 className="text-white text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-3">{s.t}</h3>
              <p className="text-[#a3a3a3] text-[11px] md:text-xs leading-relaxed font-light uppercase tracking-wide">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Candidate Profiles */}
      <section ref={candRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 relative z-10">
        <div className="text-center mb-12 md:mb-16"><span className="cand-label text-[#a3a3a3] text-xs tracking-[0.35em] uppercase font-light will-change-transform">Ideal Partners</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { t: 'Luxury Showrooms', d: 'Establishments catering to high-end residential markets with an emphasis on curated, bespoke interior collections.' },
            { t: 'Strategic Distributors', d: 'Partners with robust logistical networks and deep relationships within the architectural and design communities.' },
          ].map(c => (
            <div key={c.t} className="cand-card border border-white/10 p-8 md:p-10 min-h-[240px] md:min-h-[300px] flex flex-col justify-end will-change-transform transition-all duration-500 hover:border-white/30 hover:bg-white/[0.02] group">
              <h3 className="text-white text-3xl md:text-4xl font-light tracking-wide mb-6 font-outfit group-hover:text-white transition-colors">{c.t}</h3>
              <p className="text-[#a3a3a3] text-sm md:text-base leading-relaxed font-light group-hover:text-[#d1d1d1] transition-colors">{c.d}</p>
              <div className="w-full h-[1px] bg-white/5 mt-8 group-hover:bg-white/20 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Project Form */}
      <section ref={formRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="form-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-10 md:mb-14 font-outfit text-center will-change-transform">Project Form</h2>
        <form className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto" onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          console.log('Dealership Form Submitted:', data);
          alert('Thank you for your interest! Our team will review your dealership inquiry and contact you soon.');
          e.target.reset();
        }}>
          {[
            ['Builder Name*', 'Project Name*'],
            ['Area*', 'City*'],
            ['State*', 'Pincode*'],
            ['Number of Flats*', 'Mobile Number*'],
          ].map((row, ri) => (
            <div key={ri} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {row.map(label => (
                <div key={label} className="form-field will-change-transform">
                  <label className="text-white text-sm font-medium block mb-3">{label}</label>
                  <input name={label.replace('*', '').toLowerCase().replace(' ', '_')} required type="text" className="w-full bg-transparent border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-white/60 transition-colors" />
                </div>
              ))}
            </div>
          ))}
          <div className="form-field will-change-transform">
            <label className="text-white text-sm font-medium block mb-3">Comment*</label>
            <textarea name="comment" required rows={5} className="w-full bg-transparent border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-white/60 transition-colors resize-none" />
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="form-btn text-white border border-white/30 px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-colors will-change-transform">Contact Now</button>
          </div>
        </form>
      </section>

      {/* What We Offer */}
      <section ref={offerRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="w-full md:w-[25%]">
            <h2 className="offer-title text-4xl md:text-5xl font-light text-white tracking-wide leading-[1.15] font-outfit will-change-transform">What We<br />Offer</h2>
            <div className="offer-title w-12 h-[3px] bg-white mt-6 will-change-transform" />
          </div>
          <div className="w-full md:w-[75%] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-20 md:gap-y-16">
            {[
              { s: 'Support I', t: 'Product Training', d: 'In-depth technical workshops for your team on installation, maintenance, and material science.' },
              { s: 'Support II', t: 'Showroom Guidance', d: 'Architectural layout support to ensure the CAVIER experience is perfectly translated in your space.' },
              { s: 'Support III', t: 'Marketing Material', d: 'Premium catalogs, physical finish swatches, and high-fidelity digital assets for your showroom.' },
              { s: 'Support IV', t: 'Dedicated Support', d: 'A direct line to our regional partnership managers for day-to-day operational excellence.' },
            ].map(c => (
              <div key={c.s} className="offer-item will-change-transform">
                <span className="text-[#a3a3a3] text-xs tracking-[0.2em] uppercase block mb-3 font-light">{c.s}</span>
                <h3 className="text-white text-lg md:text-xl font-semibold mb-3 font-outfit">{c.t}</h3>
                <p className="text-[#a3a3a3] text-sm leading-relaxed font-light">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dealership;
