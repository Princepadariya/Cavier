import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const counter = { value: 0 };
    let animationComplete = false;

    // Counter animation
    animate(counter, {
      value: [0, 100],
      duration: 2000,
      round: 1,
      ease: 'inOutQuad',
      update: () => {
        if (counterRef.current) {
          counterRef.current.innerHTML = `${counter.value}%`;
        }
      },
      complete: () => {
        // Only run exit animation once
        if (animationComplete) return;
        animationComplete = true;

        animate(containerRef.current, {
          translateY: [0, '-100%'],
          duration: 1200,
          ease: 'inOutExpo',
          complete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    // Logo fade-in
    animate(logoRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1200,
      delay: 500,
      ease: 'outExpo'
    });

  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#1F1F21] flex flex-col items-center justify-center will-change-transform"
    >
      <div 
        ref={logoRef} 
        className="opacity-0 mb-8"
      >
        <h1 className="text-white text-4xl md:text-6xl font-light tracking-[0.4em] uppercase font-outfit">
          Cavier
        </h1>
      </div>
      
      <div className="overflow-hidden">
        <div
          ref={counterRef}
          className="text-[#a3a3a3] text-5xl md:text-7xl font-light tracking-widest font-outfit"
        >
          0%
        </div>
      </div>
    </div>
  );
};

export default Preloader;
