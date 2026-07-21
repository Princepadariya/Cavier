import React, { useRef, useEffect, useState } from 'react';
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
      if (e.isIntersecting) {
        configs.forEach(c => animate(c.targets, c.anim));
        obs.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

const DEALERSHIP_FIELDS = [
  ['Dealer Name*', 'Firm Name*'],
  ['GST Number*', 'Contact Number*'],
];

const PROJECT_FIELDS = [
  ['Builder Name*', 'Project Name*'],
  ['Area*', 'City*'],
  ['State*', 'Pincode*'],
  ['Number of Flats*', 'Mobile Number*'],
];

const fieldName = (label) => label.replace('*', '').toLowerCase().replace(/\s+/g, '_');

const Dealership = () => {
  const [profession, setProfession] = useState('dealership');
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
        duration: 700, delay: stagger(60, { start: 100 }),
        ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
      });
    }, 50);
  }, []);

  // Philosophy: quote slide + description fade
  useSection(philRef, el => {
    const label = el.querySelectorAll('.phil-label');
    const quote = el.querySelectorAll('.phil-quote');
    const desc = el.querySelectorAll('.phil-desc');
    return [
      {
        targets: [...label], from: { opacity: '0', transform: 'translateY(20px)' },
        anim: { opacity: [0, 1], translateY: [20, 0], duration: 500, ease: 'outQuart' }
      },
      {
        targets: [...quote], from: { opacity: '0', transform: 'translateX(-50px)' },
        anim: { opacity: [0, 1], translateX: [-50, 0], duration: 600, delay: 80, ease: 'outExpo' }
      },
      {
        targets: [...desc], from: { opacity: '0', transform: 'translateX(50px)' },
        anim: { opacity: [0, 1], translateX: [50, 0], duration: 600, delay: 150, ease: 'outExpo' }
      },
    ];
  });

  // Value Propositions: grid cards stagger
  useSection(valRef, el => {
    const label = el.querySelectorAll('.val-label');
    const cards = el.querySelectorAll('.val-card');
    return [
      {
        targets: [...label], from: { opacity: '0', transform: 'translateY(20px)' },
        anim: { opacity: [0, 1], translateY: [20, 0], duration: 500, ease: 'outQuart' }
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

  // Path to Partnership: steps pop
  useSection(pathRef, el => {
    const title = el.querySelectorAll('.path-title');
    const steps = el.querySelectorAll('.path-step');
    return [
      {
        targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' }
      },
      {
        targets: [...steps], from: { opacity: '0', transform: 'translateY(50px) scale(0.85)' },
        anim: {
          opacity: [0, 1], translateY: [50, 0], scale: [0.85, 1],
          duration: 600, delay: stagger(70, { start: 100 }), ease: 'outBack'
        }
      },
    ];
  });

  // Candidate Profiles: slide up
  useSection(candRef, el => {
    const label = el.querySelectorAll('.cand-label');
    const cards = el.querySelectorAll('.cand-card');
    return [
      {
        targets: [...label], from: { opacity: '0', transform: 'translateY(20px)' },
        anim: { opacity: [0, 1], translateY: [20, 0], duration: 500, ease: 'outQuart' }
      },
      {
        targets: [...cards], from: { opacity: '0', transform: 'translateY(50px)' },
        anim: {
          opacity: [0, 1], translateY: [50, 0],
          duration: 600, delay: stagger(80, { start: 100 }), ease: 'outQuart'
        }
      },
    ];
  });

  // Form: fields wave
  useSection(formRef, el => {
    const title = el.querySelectorAll('.form-title');
    const fields = el.querySelectorAll('.form-field');
    const btn = el.querySelectorAll('.form-btn');
    return [
      {
        targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' }
      },
      {
        targets: [...fields], from: { opacity: '0', transform: 'translateY(30px)' },
        anim: {
          opacity: [0, 1], translateY: [30, 0],
          duration: 500, delay: stagger(40, { start: 100 }), ease: 'outQuart'
        }
      },
      {
        targets: [...btn], from: { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
        anim: { opacity: [0, 1], translateY: [20, 0], scale: [0.9, 1], duration: 500, delay: 250, ease: 'outBack' }
      },
    ];
  });

  // What We Offer: title slide + grid stagger
  useSection(offerRef, el => {
    const title = el.querySelectorAll('.offer-title');
    const items = el.querySelectorAll('.offer-item');
    return [
      {
        targets: [...title], from: { opacity: '0', transform: 'translateX(-40px)' },
        anim: { opacity: [0, 1], translateX: [-40, 0], duration: 600, ease: 'outExpo' }
      },
      {
        targets: [...items], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: {
          opacity: [0, 1], translateY: [40, 0],
          duration: 600, delay: stagger(60, { start: 100 }), ease: 'outQuart'
        }
      },
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
      <div ref={heroRef} className="relative h-[75vh] md:h-screen w-full overflow-hidden">
        {/* Radar Pulse Effect */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="radar-circle w-[1px] h-[1px] rounded-full border border-white/20 animate-radar-pulse" />
          <div className="radar-circle w-[1px] h-[1px] rounded-full border border-white/10 animate-radar-pulse delay-700" />
        </div>

        <div className="absolute inset-0 w-full h-full bg-cover bg-[position:center_top] md:bg-center" style={{ backgroundImage: "url('/images/Dealership_hero_banner.png')" }} />
        <div className="absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-24 md:pt-[102px]">
          <div className="dealer-content flex flex-col items-center">
            <span className="text-white/70 text-xs md:text-sm tracking-[0.35em] uppercase mb-6 font-light will-change-transform">Partnership Opportunity</span>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-[1.15] mb-8 font-outfit will-change-transform">Grow Your Business<br />with CAVIER</h1>
            <p className="text-[#ACABAB] max-w-3xl text-xl md:text-3xl leading-relaxed font-light mb-12 will-change-transform">Define the future of luxury bathrooms through a synthesis of precision engineering, architectural innovation, and timeless design.</p>
            <button onClick={() => philRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3 text-white border border-white px-5 py-3 text-sm hover:bg-white hover:text-black transition-all duration-300 w-fit will-change-transform">
              <span>Scroll Down</span><ChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section ref={philRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <span className="phil-label text-[#757575] text-xs md:text-sm tracking-[0.35em] uppercase block mb-10 font-light will-change-transform">The Philosophy</span>
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="phil-quote w-full md:w-[50%] will-change-transform">
            <p className="text-[#E7E5E5] text-3xl md:text-4xl lg:text-[2.25rem] font-light tracking-wide font-text max-w-[500px]" style={{ lineHeight: 1.4 }}>We believe in the power of enduring partnerships. Our network of dealers are more than distributors; they are ambassadors of high-end architectural living.</p>
          </div>
          <div className="phil-desc w-full md:w-[50%] flex items-end will-change-transform">
            <p className="text-[#ACABAB] text-base md:text-lg font-light" style={{ lineHeight: 1.8 }}>Building a CAVIER partnership means investing in a legacy of excellence. We invite entrepreneurs and distributors who share our obsession with detail and quality to join an ecosystem built for long-term growth and market leadership in the premium segment.</p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section ref={valRef} className="w-full bg-[#1F1F21] pt-4 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="text-center mb-12 md:mb-16"><span className="val-label text-[#FFFFFF] text-xs md:text-sm tracking-[0.35em] uppercase font-light will-change-transform">Value Propositions</span></div>
        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
          {[
            { icon: '/images/Icon.svg', title: 'Premium Product\nRange', desc: 'Meticulously crafted fittings that set new standards in architectural bathroom design.' },
            { icon: '/images/Icon_2.svg', title: 'Strong Brand\nIdentity', desc: 'A minimalist, luxury brand presence that resonates with architects and designers globally.' },
            { icon: '/images/Icon_3.svg', title: 'Business\nOpportunities', desc: 'Competitive margins and strategic growth plans for high-performing regional partners.' },
            { icon: '/images/Icon_4.svg', title: 'Marketing\nSupport', desc: 'Global campaigns and local marketing toolkits designed to drive high-intent traffic.' },
            { icon: '/images/Icon_2.svg', title: 'Reliable Supply\nChain', desc: 'Streamlined logistics and inventory management ensuring consistent product availability.' },
            { icon: '/images/Icon_3.svg', title: 'Exclusive\nTerritories', desc: 'Protected regional distribution rights to ensure your market investment yields high returns.' },
          ].map((c, i) => (
            <div key={i} className={`val-card aspect-square border-white/10 p-10 md:p-16 flex flex-col min-h-[280px] md:min-h-[340px] justify-start will-change-transform border-b md:border-r ${i % 3 === 2 ? 'md:border-r-0' : ''} ${i >= 3 ? 'md:border-b-0' : ''} ${i === 5 ? 'border-b-0' : ''}`}>
              <img src={c.icon} alt="" className="w-5 h-5 md:w-6 md:h-6 mb-4 md:mb-6 opacity-80" />
              <h3 className="text-[#E7E5E5] text-lg md:text-xl font-semibold tracking-wide mb-4 md:mb-6 font-outfit uppercase leading-relaxed whitespace-pre-line">{c.title}</h3>
              <p className="text-[#ACABAB] text-base md:text-[17px] leading-relaxed font-light">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Path To Partnership */}
      <section ref={pathRef} className="w-full bg-[#1F1F21] pt-4 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="path-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-16 font-outfit text-center will-change-transform">The Path To Partnership</h2>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { n: '01', t: 'Inquiry', d: 'Submit your interest via our digital portal.' },
            { n: '02', t: 'Review', d: 'Our team evaluates market compatibility and potential.' },
            { n: '03', t: 'Connect', d: 'Direct dialogue to align on goals and vision.' },
            { n: '04', t: 'Start', d: 'Onboarding, setup, and global launch.' },
          ].map((s, i) => (
            <div key={s.n} className="path-step relative z-10 flex flex-col items-center text-center will-change-transform">
              {/* Desktop Line - Spans all 4 columns from the first item */}
              {i === 0 && <div className="hidden md:block absolute top-12 left-0 w-[calc(400%+4.5rem)] h-px bg-white/15 z-[-1]" />}
              {/* Mobile Lines - Spans 2 columns from the first item of each row */}
              {(i === 0 || i === 2) && <div className="md:hidden absolute top-10 left-0 w-[calc(200%+1rem)] h-px bg-white/15 z-[-1]" />}

              <div className={`relative z-10 w-20 h-20 md:w-24 md:h-24 ${i === 3 ? 'bg-gradient-to-br from-[#888] to-[#444]' : 'bg-[#1c1c1e] border border-white/20'} rounded-sm flex items-center justify-center mb-6`}>
                <span className="text-white text-2xl md:text-3xl font-light font-outfit">{s.n}</span>
              </div>
              <h3 className="text-white text-xs md:text-sm font-semibold tracking-[0.15em] uppercase mb-3">{s.t}</h3>
              <p className="text-[#a3a3a3] text-[11px] md:text-xs font-light uppercase tracking-wide max-w-[230px] mx-auto" style={{ lineHeight: 1.8 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Candidate Profiles */}
      <section ref={candRef} className="w-full bg-[#1F1F21] pb-16 md:pb-24 px-6 md:px-12 lg:px-32 relative z-10">
        <div className="text-center mb-12 md:mb-16"><span className="cand-label text-[#757575] text-xs md:text-sm tracking-[0.35em] uppercase font-light will-change-transform">Candidate Profiles</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { t: 'Retail Showroom Details', d: 'Establishments catering to the luxury residential market with a focus on interior design and bespoke fittings.' },
            { t: 'Regional Distributors', d: 'Established partners with logistics capabilities and a network of sub-dealers in high-growth metropolitan areas.' },
          ].map(c => (
            <div key={c.t} className="cand-card border border-white/10 p-8 md:p-12 min-h-[220px] flex flex-col justify-start will-change-transform transition-all duration-500 hover:border-white/30 hover:bg-white/[0.02] group">
              <h3 className="text-white text-3xl md:text-4xl font-normal tracking-wide mb-6 font-outfit group-hover:text-white transition-colors">{c.t}</h3>
              <p className="text-[#ACABAB] text-lg md:text-xl leading-relaxed font-light group-hover:text-[#d1d1d1] transition-colors">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dealership / Project Form */}
      <section ref={formRef} className="w-full bg-[#1F1F21] pt-4 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="form-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-10 font-outfit text-center will-change-transform">
          {profession === 'dealership' ? 'Dealership Form' : 'Project Form'}
        </h2>

        {/* Profession type selector */}
        <div className="form-field flex items-center justify-center gap-4 mb-10 md:mb-14 will-change-transform">
          <span className="text-white/60 text-xs md:text-sm tracking-[0.2em] uppercase font-light mr-2">Select your profession type:</span>
          <div className="flex border border-white/30 rounded-full overflow-hidden">
            <button
              type="button"
              onClick={() => setProfession('dealership')}
              className={`px-5 md:px-6 py-2 text-xs md:text-sm tracking-wide transition-colors duration-300 ${profession === 'dealership' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            >
              Dealership Form
            </button>
            <button
              type="button"
              onClick={() => setProfession('project')}
              className={`px-5 md:px-6 py-2 text-xs md:text-sm tracking-wide transition-colors duration-300 ${profession === 'project' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            >
              Project Form
            </button>
          </div>
        </div>

        <form
          key={profession}
          className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            console.log(`${profession === 'dealership' ? 'Dealership' : 'Project'} Form Submitted:`, data);
            alert('Thank you for your interest! Our team will review your inquiry and contact you soon.');
            e.target.reset();
          }}
        >
          {profession === 'dealership' ? (
            <>
              {DEALERSHIP_FIELDS.map((row, ri) => (
                <div key={ri} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {row.map(label => (
                    <div key={label} className="form-field will-change-transform">
                      <label className="text-white text-sm font-medium block mb-3">{label}</label>
                      <input name={fieldName(label)} required type="text" className="w-full bg-transparent border border-[#ffffff] text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                  ))}
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="form-field will-change-transform">
                  <label className="text-white text-sm font-medium block mb-3">Visiting Card Photo*</label>
                  <input name="visiting_card" required type="file" accept="image/*" className="w-full bg-transparent border border-[#ffffff] text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors file:mr-4 file:py-1.5 file:px-3 file:border file:border-white/50 file:bg-transparent file:text-white file:text-xs file:tracking-wide file:cursor-pointer" />
                </div>
                <div className="form-field will-change-transform">
                  <label className="text-white text-sm font-medium block mb-3">Email Id <span className="text-white/50 font-normal">(Optional)</span></label>
                  <input name="email" type="email" className="w-full bg-transparent border border-[#ffffff] text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors" />
                </div>
              </div>
            </>
          ) : (
            <>
              {PROJECT_FIELDS.map((row, ri) => (
                <div key={ri} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {row.map(label => (
                    <div key={label} className="form-field will-change-transform">
                      <label className="text-white text-sm font-medium block mb-3">{label}</label>
                      <input name={fieldName(label)} required type="text" className="w-full bg-transparent border border-[#ffffff] text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors" />
                    </div>
                  ))}
                </div>
              ))}
              <div className="form-field will-change-transform">
                <label className="text-white text-sm font-medium block mb-3">Comment*</label>
                <textarea name="comment" required rows={5} className="w-full bg-transparent border border-[#ffffff] text-white px-4 py-3 text-sm outline-none focus:border-white transition-colors resize-none" />
              </div>
            </>
          )}
          <div className="flex justify-center mt-4">
            <button type="submit" className="form-btn text-white border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-colors will-change-transform">Contact Now</button>
          </div>
        </form>
      </section>

      {/* What We Offer */}
      <section ref={offerRef} className="w-full bg-[#1F1F21] pt-4 pb-16 md:py-24 px-6 md:px-12 lg:px-32">
        <div className="w-full flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="w-full md:w-[360px] md:flex-shrink-0">
            <h2 className="offer-title text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] font-outfit max-w-[220px] will-change-transform">What We Offer</h2>
            <div className="offer-title w-12 h-[2px] bg-white mt-6 will-change-transform" />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-16">
            {[
              { s: 'Support I', t: 'Product Training', d: 'In-depth technical workshops for your team on installation, maintenance, and material science.' },
              { s: 'Support II', t: 'Showroom Guidance', d: 'Architectural layout support to ensure the CAVIER experience is perfectly translated in your space.' },
              { s: 'Support III', t: 'Marketing Material', d: 'Premium catalogs, physical finish swatches, and high-fidelity digital assets for your showroom.' },
              { s: 'Support IV', t: 'Dedicated Support', d: 'A direct line to our regional partnership managers for day-to-day operational excellence.' },
            ].map(c => (
              <div key={c.s} className="offer-item will-change-transform">
                <span className="text-[#a3a3a3] text-xs md:text-sm tracking-[0.25em] uppercase block mb-3 font-light">{c.s}</span>
                <h3 className="text-white text-xl md:text-2xl font-normal mb-3 font-outfit">{c.t}</h3>
                <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed font-light">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dealership;
