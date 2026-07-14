import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import Testimonials from '../components/Testimonials';
import { animate, stagger, createSpring } from 'animejs';
import { contactApi } from '../lib/api';

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
  const [submitState, setSubmitState] = useState('idle'); // idle | sending | success | error

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
        duration: 700, delay: stagger(60, { start: 100 }),
        ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
      });
      if (img) animate(img, {
        opacity: [0, 1], scale: [1.08, 1],
        duration: 800, delay: 100, ease: 'outQuart',
      });
    }, 50);
  }, []);

  // Info cards: stagger pop
  useSection(infoRef, el => {
    const cards = el.querySelectorAll('.info-card');
    return [
      {
        targets: [...cards], from: { opacity: '0', transform: 'translateY(40px) scale(0.9)' },
        anim: {
          opacity: [0, 1], translateY: [40, 0], scale: [0.9, 1],
          duration: 600, delay: stagger(60, { start: 100 }), ease: 'outBack'
        }
      },
    ];
  });

  // Form: title + fields wave + button pop
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
        targets: [...fields], from: { opacity: '0', transform: 'translateY(25px)' },
        anim: {
          opacity: [0, 1], translateY: [25, 0],
          duration: 500, delay: stagger(40, { start: 100 }), ease: 'outQuart'
        }
      },
      {
        targets: [...btn], from: { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
        anim: { opacity: [0, 1], translateY: [20, 0], scale: [0.9, 1], duration: 500, delay: 250, ease: 'outBack' }
      },
    ];
  });

  // Map: cinematic zoom reveal
  useSection(mapRef, el => {
    const title = el.querySelectorAll('.map-title');
    const img = el.querySelectorAll('.map-img');
    return [
      {
        targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' },
        anim: { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' }
      },
      {
        targets: [...img], from: { opacity: '0', transform: 'scale(1.1)' },
        anim: { opacity: [0, 1], scale: [1.1, 1], duration: 700, delay: 100, ease: 'outQuart' }
      },
    ];
  });

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen">


      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen md:h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#1F1F21]">

        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-32 pt-28 pb-12 md:py-0 z-10">
          <div className="contact-content max-w-lg">
            <h1 className="text-white text-4xl md:text-[64px] font-extralight tracking-tight leading-[1.1] mb-6 md:mb-10 font-outfit will-change-transform">
              We're Here to Assist You Anytime
            </h1>
            <p className="text-[#7E7E7E] text-base md:text-lg leading-[1.8] mb-8 md:mb-10 font-text font-thin tracking-wider will-change-transform">
              At CAVIER, we value every connection. Whether you have a question
              about our products, need expert guidance, or are interested in
              partnering with us, our team is always ready to help.
            </p>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="flex items-center w-fit space-x-3 md:space-x-4 px-4 py-3 md:px-6 md:py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-500 rounded-none text-[10px] md:text-[12px] uppercase font-outfit font-extralight will-change-transform"
            >
              <span>Scroll Down</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-[45vh] md:h-full relative overflow-hidden">
          <div className="contact-hero-img absolute inset-0 bg-cover bg-center will-change-transform" style={{ backgroundImage: 'url("/images/contact-bg.png")' }} />
          <div className="absolute inset-0 bg-[#EFECE8] mix-blend-multiply opacity-20" />
        </div>
      </div>

      {/* Contact Info & Form Section */}
      <div className="w-full px-6 md:px-12 lg:px-32 py-16 md:py-24 bg-[#1F1F21]">

        {/* Info Grid */}
        <div ref={infoRef} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-16 md:mb-32 max-w-7xl mx-auto">
          {[
            { t: 'Contact', v: '(91) 288 2730 052, 53', href: 'tel:+912882730052' },
            { t: 'Fax', v: '(91) 288 2730 054', href: 'tel:+912882730054' },
            { t: 'Service Related', v: '(91) 96876 20054.', href: 'tel:+919687620054' },
            { t: 'Email', v: 'info@cavierindia.com', href: 'mailto:info@cavierindia.com' },
            { t: 'Trade Enquiry', v: '(91) 73839 33333', href: 'tel:+917383933333' },
          ].map(c => (
            <a
              key={c.t}
              href={c.href}
              className="info-card border border-white py-6 md:py-10 px-3 md:px-4 flex flex-col items-center justify-center text-center will-change-transform hover:bg-white hover:text-black transition-colors duration-300 group"
            >
              <h3 className="text-white group-hover:text-black text-base md:text-lg font-outfit font-light mb-4 tracking-wide transition-colors duration-300">{c.t}</h3>
              <p className="text-white group-hover:text-black text-sm md:text-base font-text tracking-wide transition-colors duration-300">{c.v}</p>
            </a>
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

            <form className="space-y-6 md:space-y-10 p-6 md:p-12 relative z-10" onSubmit={async e => {
              e.preventDefault();
              const formEl = e.target;
              const formData = new FormData(formEl);
              const data = Object.fromEntries(formData.entries());
              setSubmitState('sending');
              try {
                await contactApi.submit({
                  name: data.name,
                  email: data.email,
                  contact: data.contact || '',
                  designation: data.designation || '',
                  subject: data.subject || '',
                  message: data.message,
                });
                setSubmitState('success');
                formEl.reset();
                setTimeout(() => setSubmitState('idle'), 5000);
              } catch (err) {
                console.error(err);
                setSubmitState('error');
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {['Name', 'Email'].map(l => (
                  <div key={l} className="form-field flex flex-col will-change-transform">
                    <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">{l}</label>
                    <input name={l.toLowerCase()} required type={l === 'Email' ? 'email' : 'text'} className="bg-transparent border border-[#ffffff] px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {['Contact', 'Designation'].map(l => (
                  <div key={l} className="form-field flex flex-col will-change-transform">
                    <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">{l}</label>
                    <input name={l.toLowerCase()} required type="text" className="bg-transparent border border-[#ffffff] px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light" />
                  </div>
                ))}
              </div>
              <div className="form-field flex flex-col will-change-transform">
                <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">Subject</label>
                <input name="subject" required type="text" className="bg-transparent border border-[#ffffff] px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light" />
              </div>
              <div className="form-field flex flex-col will-change-transform">
                <label className="text-white text-sm font-outfit font-light mb-3 tracking-wide">Message</label>
                <textarea name="message" required rows="4" className="bg-transparent border border-[#ffffff] px-4 py-3 text-white outline-none focus:border-[#d4af37]/50 focus:animate-[focus-pulse_2s_infinite] transition-all duration-300 font-outfit font-light resize-none" />
              </div>
              <div className="flex flex-col items-center gap-4 pt-10">
                <button
                  type="submit"
                  disabled={submitState === 'sending'}
                  className="form-btn text-white border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-colors duration-300 will-change-transform disabled:opacity-50"
                >
                  {submitState === 'sending' ? 'Sending…' : 'Contact Now'}
                </button>
                {submitState === 'success' && (
                  <p className="text-sm text-green-400">Thank you! We'll get back to you shortly.</p>
                )}
                {submitState === 'error' && (
                  <p className="text-sm text-red-400">Something went wrong. Please try again or email us directly.</p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div ref={mapRef} className="max-w-7xl mx-auto pt-16 border-t border-white/10">
          <h2 className="map-title text-white text-4xl md:text-5xl font-outfit font-extralight tracking-tight mb-8 md:mb-12 will-change-transform">Open In Map</h2>
          <div className="map-img w-full h-[350px] md:h-[500px] bg-[#2a2a2a] relative overflow-hidden will-change-transform border border-white/10 rounded-sm">
            <iframe
              title="Cavier Bath Fittings Ltd Location"
              src="https://www.google.com/maps?q=Cavier+Bath+Fittings+Ltd,+Plot+No+1,+Vision+Industrial+Park,+Changa,+Jamnagar+-+Lalpur+Rd,+Jamnagar,+Gujarat+361012&z=15&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <Testimonials bgClass="bg-[#1F1F21]" />
    </div>
  );
};

export default Contact;
