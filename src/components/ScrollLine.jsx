import React, { useEffect, useRef } from 'react';
import { animate, createSpring } from 'animejs';

/* ─────────────────────────────────────────────────────────────────
   Scroll-progress line — clean gold bar with a precision tip marker.
──────────────────────────────────────────────────────────────────── */

const ScrollLine = () => {
  const wrapperRef = useRef(null);
  const barRef = useRef(null);
  const tipRef = useRef(null);
  const isVisible = useRef(false);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bar = barRef.current;
    const tip = tipRef.current;
    if (!wrapper || !bar || !tip) return;

    const lerp = (a, b, t) => a + (b - a) * t;

    /* RAF loop */
    const tick = () => {
      currentProgress.current = lerp(currentProgress.current, targetProgress.current, 0.09);
      const p = currentProgress.current;
      const w = wrapper.offsetWidth;

      bar.style.transform = `scaleX(${p})`;

      const tipX = p * w;
      tip.style.left = `${tipX}px`;
      tip.style.opacity = p > 0.01 && p < 0.995 ? '1' : '0';

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const handleLenisScroll = ({ detail }) => {
      const { progress, scroll } = detail;
      targetProgress.current = Math.min(Math.max(progress, 0), 1);

      if (scroll > 40 && !isVisible.current) {
        isVisible.current = true;
        wrapper.style.opacity = '1';
        animate(wrapper, {
          translateY: ['-100%', '0%'],
          duration: 800,
          ease: createSpring({ stiffness: 100, damping: 14, mass: 1 }),
        });
      } else if (scroll <= 40 && isVisible.current) {
        isVisible.current = false;
        animate(wrapper, {
          translateY: ['0%', '-100%'],
          duration: 380,
          ease: 'inCubic',
          onComplete: () => { targetProgress.current = 0; },
        });
      }
    };

    window.addEventListener('lenis-scroll', handleLenisScroll);
    return () => {
      window.removeEventListener('lenis-scroll', handleLenisScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 99999,
        opacity: 0,
        transform: 'translateY(-100%)',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Dim track */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.05)',
      }} />

      {/* Gold progress bar */}
      <div
        ref={barRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'linear-gradient(90deg, #8a6a10 0%, #c69c2a 40%, #d4af37 70%, #e8c84a 100%)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          willChange: 'transform',
          boxShadow: '0 0 6px rgba(180,140,30,0.5)',
        }}
      />

      {/* Precision tip marker — sharp vertical notch */}
      <div
        ref={tipRef}
        style={{
          position: 'absolute',
          top: '-2px',
          left: 0,
          width: '2px',
          height: '7px',
          background: '#fff',
          boxShadow: '0 0 4px rgba(255,220,80,0.8)',
          transform: 'translateX(-50%)',
          opacity: 0,
          transition: 'opacity 0.15s linear',
        }}
      />
    </div>
  );
};

export default ScrollLine;
