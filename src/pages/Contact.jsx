import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

import Testimonials from '../components/Testimonials';
import { animate, stagger, createSpring } from 'animejs';

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

const Contact = () => {
  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

  // Hero: spring entrance on mount
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.contact-content > *');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });
    const img = el.querySelector('.contact-hero-img');
    if (img) { img.style.opacity = '0'; img.style.transform = 'scale(1.08)'; }

    setTimeout(() => {
      animate(items, {
        opacity: [0, 1], translateY: [40, 0],
        duration: 1400, delay: stagger(120, { start: 400 }),
        ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
      });
      if (img) animate(img, {
        opacity: [0, 1], scale: [1.08, 1],
        duration: 2000, delay: 300, ease: 'outQuart',
      });
    }, 200);
  }, []);

  // Info cards: stagger pop
  useSection(infoRef, el => {
    const cards = el.querySelectorAll('.info-card');
    return [
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(40px) scale(0.9)' },
        anim: { opacity: [0,1], translateY: [40,0], scale: [0.9,1],
          duration: 1200, delay: stagger(80, { start: 200 }), ease: 'outBack' } },
    ];
  });

  // Form: title + fields wave + button pop
  useSection(formRef, el => {
    const title = el.querySelectorAll('.form-title');
    const fields = el.querySelectorAll('.form-field');
    const btn = el.querySelectorAll('.form-btn');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...fields], from: { opacity: '0', transform: 'translateY(25px)' },
        anim: { opacity: [0,1], translateY: [25,0],
          duration: 1000, delay: stagger(50, { start: 300 }), ease: 'outQuart' } },
      { targets: [...btn], from: { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
        anim: { opacity: [0,1], translateY: [20,0], scale: [0.9,1], duration: 1000, delay: 700, ease: 'outBack' } },
    ];
  });

  // Map: cinematic zoom reveal
  useSection(mapRef, el => {
    const title = el.querySelectorAll('.map-title');
    const img = el.querySelectorAll('.map-img');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0,1], translateY: [40,0], duration: 1200, ease: 'outQuart' } },
      { targets: [...img], from: { opacity: '0', transform: 'scale(1.1)' },
        anim: { opacity: [0,1], scale: [1.1,1], duration: 1800, delay: 300, ease: 'outQuart' } },
    ];
  });

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen">


      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden">

        <div className="w-full md:w-1/2 h-full bg-[#1F1F21] flex flex-col justify-center px-6 md:px-12 z-10">
          <div className="contact-content max-w-lg pt-20">
            <h1 className="text-white text-4xl md:text-[64px] font-extralight tracking-tight leading-[1.1] mb-6 md:mb-10 font-outfit will-change-transform">
              We're Here to<br />Assist You<br />Anytime
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-[1.8] mb-8 md:mb-10 font-outfit font-thin max-w-sm tracking-wider will-change-transform">
              At CAVIER, we value every connection. Whether you have a question
              about our products, need expert guidance, or are interested in
              partnering with us, our team is always ready to help.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="flex items-center space-x-3 md:space-x-4 px-6 py-3 md:px-10 md:py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 rounded-none text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-outfit font-extralight will-change-transform"
            >
              <span>Scroll Down</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>
          </div>
        </div>
        <div className="hidden md:block w-1/2 h-full relative">
          <div className="contact-hero-img absolute inset-0 bg-cover bg-center will-change-transform" style={{ backgroundImage: 'url("/images/contact-bg.png")' }} />
          <div className="absolute inset-0 bg-[#EFECE8] mix-blend-multiply opacity-20" />
        </div>
      </div>

      {/* Contact Info & Form Section */}
      <div className="w-full px-6 md:px-12 lg:px-32 py-16 md:py-24 bg-[#1F1F21]">
        
        {/* Info Grid */}
        <div ref={infoRef} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-16 md:mb-32 max-w-7xl mx-auto">
          {[
            { t: 'Contact', v: '(91) 288 2730 052, 53' },
            { t: 'Fax', v: '(91) 288 2730 054' },
            { t: 'Service Related', v: '(91) 96876 20054.' },
            { t: 'Email', v: 'info@cavierindia.com' },
            { t: 'Trade Enquiry', v: '(91) 73839 33333' },
          ].map(c => (
            <div key={c.t} className="info-card border border-white/20 p-6 md:p-8 flex flex-col items-center justify-center text-center will-change-transform">
              <h3 className="text-white text-sm font-outfit font-light mb-4 tracking-wide">{c.t}</h3>
              <p className="text-white/70 text-xs font-outfit tracking-wide">{c.v}</p>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div ref={formRef} className="max-w-4xl mx-auto pb-16 relative">
          <div className="text-center mb-16 relative z-10">
            <h2 className="form-title text-white text-4xl md:text-5xl font-outfit font-extralight tracking-tight will-change-transform">Experience CAVIER</h2>
            <div className="w-20 h-[1px] bg-white/20 mx-auto mt-6" />
          </div>

          <div className="relative p-1 bg-black/10 backdrop-blur-md overflow-hidden group">
            {/* Laser Frame SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
              <rect
                x="0" y="0" width="100%" height="100%"
                fill="none"
                stroke="white"
                strokeWidth="1"
                className="animate-laser-trace opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </svg>
            
            <form className="space-y-6 md:space-y-10 p-6 md:p-12 relative z-10" onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            console.log('Form Submitted:', data);
            alert('Thank you for contacting CAVIER! We will get back to you shortly.');
            e.target.reset();
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {['Name', 'Email'].map(l => (
                <div key={l} className="form-field flex flex-col will-change-transform">
                  <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">{l}</label>
                  <input name={l.toLowerCase()} required type={l === 'Email' ? 'email' : 'text'} className="bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {['Contact', 'Designation'].map(l => (
                <div key={l} className="form-field flex flex-col will-change-transform">
                  <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">{l}</label>
                  <input name={l.toLowerCase()} required type="text" className="bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light" />
                </div>
              ))}
            </div>
            <div className="form-field flex flex-col will-change-transform">
              <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">Subject</label>
              <input name="subject" required type="text" className="bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light" />
            </div>
            <div className="form-field flex flex-col will-change-transform">
              <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">Message</label>
              <textarea name="message" required rows="4" className="bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light resize-none" />
            </div>
            <div className="flex justify-center pt-10">
              <button 
                type="submit" 
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translate(0, 0)`;
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
                className="form-btn px-12 py-4 border border-white/30 text-white text-[10px] uppercase tracking-[0.4em] font-outfit font-light transition-all duration-200 ease-out will-change-transform"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

        {/* Map Section */}
        <div ref={mapRef} className="max-w-7xl mx-auto pt-16 pb-16 md:pb-24 border-t border-white/10">
          <h2 className="map-title text-white text-4xl md:text-5xl font-outfit font-extralight tracking-tight mb-8 md:mb-12 will-change-transform">Open In Map</h2>
          <div className="map-img w-full h-[350px] md:h-[500px] bg-[#2a2a2a] relative overflow-hidden will-change-transform flex items-center justify-center border border-white/10 rounded-sm">
            <div className="text-center px-6">
              <div className="text-white/20 text-6xl mb-6">📍</div>
              <h3 className="text-white text-xl md:text-2xl font-outfit font-light mb-3">CAVIER India Pvt. Ltd.</h3>
              <p className="text-white/50 text-sm font-outfit font-light mb-6 max-w-md mx-auto">Plot No. 2519, Phase-IV, GIDC, Vatva, Ahmedabad - 382445, Gujarat, India</p>
              <a 
                href="https://maps.google.com/?q=GIDC+Vatva+Ahmedabad+Gujarat+India" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-xs font-outfit tracking-wider hover:bg-white hover:text-black transition-all duration-300"
              >
                <span>Open in Google Maps</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Testimonials bgClass="bg-[#1F1F21]" />
    </div>
  );
};

export default Contact;
