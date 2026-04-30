import React, { useEffect, useRef } from 'react';
import { animate, createSpring } from 'animejs';

/* ─────────────────────────────────────────────────────────────────
   Industrial scroll-progress line
   FX:
   1. Welding sparks at the tip — arc downward under simulated gravity
   2. Laser-scan shimmer — a bright band sweeps the bar every ~3s
   3. Sharp precision tip marker — a crisp vertical notch, no glow bloat
──────────────────────────────────────────────────────────────────── */

/* Physics-based spark using requestAnimationFrame (not Anime.js) so we
   get real gravity accumulation per frame. */
const spawnSpark = (canvas, tipX, barHeight) => {
  const ctx = canvas.getContext('2d');
  const speed = 1.2 + Math.random() * 1.8;
  const angle = (Math.PI / 2) + (Math.random() - 0.5) * 1.2; // mostly downward
  let vx = Math.cos(angle) * speed;
  let vy = Math.sin(angle) * speed;
  const gravity = 0.18 + Math.random() * 0.12;
  let x = tipX;
  let y = barHeight / 2;
  let life = 1;
  const decay = 0.045 + Math.random() * 0.03;
  const size = 0.8 + Math.random() * 1.2;

  const drawSpark = () => {
    if (life <= 0) return;
    vx *= 0.97;
    vy += gravity;
    x += vx;
    y += vy;
    life -= decay;

    const brightness = Math.floor(220 + Math.random() * 35);
    ctx.save();
    ctx.globalAlpha = Math.max(0, life * 0.9);
    ctx.fillStyle = `rgb(${brightness}, ${Math.floor(brightness * 0.78)}, 30)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (life > 0) requestAnimationFrame(drawSpark);
  };

  requestAnimationFrame(drawSpark);
};

/* ────────────────────────────────────────────────────────────────── */

const ScrollLine = () => {
  const wrapperRef = useRef(null);
  const barRef = useRef(null);
  const tipRef = useRef(null);
  const shimmerRef = useRef(null);
  const canvasRef = useRef(null);
  const isVisible = useRef(false);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef(null);
  const sparkTimer = useRef(null);
  const shimmerLoop = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bar = barRef.current;
    const tip = tipRef.current;
    const shimmer = shimmerRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !bar || !tip || !shimmer || !canvas) return;

    /* Size the canvas to fill the wrapper */
    const resizeCanvas = () => {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight + 40; // extra height for sparks to fall into
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

      /* Clear spark canvas every frame for crisp rendering */
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    /* Laser shimmer: sweeps from left to current tip position */
    const triggerShimmer = () => {
      const p = currentProgress.current;
      if (p < 0.05 || !isVisible.current) return;
      animate(shimmer, {
        scaleX: [0, p],
        opacity: [0, 0.85, 0],
        duration: 520,
        ease: 'inOutQuad',
      });
    };

    /* Spark burst at the tip */
    const startSparks = () => {
      clearInterval(sparkTimer.current);
      sparkTimer.current = setInterval(() => {
        const p = currentProgress.current;
        if (p < 0.01 || p > 0.99 || !isVisible.current) return;
        const tipX = p * wrapper.offsetWidth;
        const count = 2 + Math.floor(Math.random() * 3); // 2–4 sparks
        for (let i = 0; i < count; i++) {
          spawnSpark(canvas, tipX, 3);
        }
      }, 90);

      /* Shimmer every ~2.8s */
      clearInterval(shimmerLoop.current);
      shimmerLoop.current = setInterval(triggerShimmer, 2800);
      // First shimmer right away
      setTimeout(triggerShimmer, 400);
    };

    const stopSparks = () => {
      clearInterval(sparkTimer.current);
      clearInterval(shimmerLoop.current);
    };

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
        startSparks();
      } else if (scroll <= 40 && isVisible.current) {
        isVisible.current = false;
        stopSparks();
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
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(rafId.current);
      stopSparks();
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

      {/* Laser shimmer overlay — brighter band that sweeps the bar */}
      <div
        ref={shimmerRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,200,0.9) 50%, transparent 100%)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          opacity: 0,
          willChange: 'transform, opacity',
          mixBlendMode: 'screen',
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

      {/* Canvas for physics-based sparks */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '0px',
          left: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default ScrollLine;
