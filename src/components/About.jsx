import React, { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const wrapper = el.querySelector('.about-wrapper');
    const line = el.querySelector('.about-line');
    const words = el.querySelectorAll('.about-word');

    // Initial hidden state
    const reset = () => {
      if (wrapper) { wrapper.style.opacity = '0'; wrapper.style.transform = 'translateY(50px)'; }
      if (line) { line.style.transform = 'scaleX(0)'; line.style.opacity = '0'; }
      words.forEach(w => { w.style.opacity = '0'; w.style.transform = 'translateY(20px)'; });
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 1. Wrapper fades up
          animate(wrapper, {
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 700,
            ease: 'outExpo',
          });

          // 2. Gold decorative line sweeps in
          animate(line, {
            scaleX: [0, 1],
            opacity: [0, 1],
            duration: 500,
            delay: 150,
            ease: 'inOutQuart',
          });

          // 3. Words stagger in with spring-like feel
          animate(words, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            delay: stagger(12, { start: 150 }),
            ease: 'outQuart',
          });
        } else {
          reset();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split the text into words for staggered animation
  const highlightText = 'At Cavier,';
  const bodyText = 'we combine precision engineering with refined design to create bath fittings that elevate modern spaces. With advanced manufacturing and superior finishing, every product reflects our commitment to quality, durability, and timeless appeal.';
  const allWords = bodyText.split(' ');

  return (
    <section ref={sectionRef} className="w-full bg-[#1F1F21] py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-32 flex justify-center items-center">
      <div className="about-wrapper w-full text-center opacity-0 will-change-transform">
        {/* Decorative gold line */}
        <div
          className="about-line w-16 h-[1px] mx-auto mb-8 will-change-transform"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)', transformOrigin: 'center' }}
        />

        <p className="font-heading text-xl md:text-3xl lg:text-[2.75rem] leading-normal md:leading-normal lg:leading-[1.4] font-light tracking-wide">
          <span className="about-word text-white font-semibold will-change-transform inline-block opacity-0">
            {highlightText}&nbsp;
          </span>
          {allWords.map((word, i) => (
            <span key={i} className="about-word text-[#bebebe] will-change-transform inline-block opacity-0">
              {word}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default About;
