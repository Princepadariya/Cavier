import { useEffect } from 'react';
import { animate, stagger, createSpring } from 'animejs';

/**
 * Reusable scroll-triggered Anime.js entrance hook.
 * Attach a ref to a section, define animations via a config array.
 * Each config: { selector, from (CSS obj), animProps (Anime.js props), delay }
 */
export function useAnimeEntrance(ref, configs = [], options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || configs.length === 0) return;

    const reset = () => {
      configs.forEach(({ selector, from }) => {
        const targets = el.querySelectorAll(selector);
        targets.forEach(t => {
          Object.entries(from).forEach(([prop, val]) => {
            if (prop === 'opacity') t.style.opacity = String(val);
            else if (prop === 'transform') t.style.transform = val;
          });
        });
      });
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          configs.forEach(({ selector, animProps }) => {
            const targets = el.querySelectorAll(selector);
            if (targets.length > 0) animate(targets, animProps);
          });
        } else {
          reset();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, configs, threshold, rootMargin]);
}

// Pre-built animation presets
export const presets = {
  fadeUp: (selector, { delay = 0, staggerMs = 100 } = {}) => ({
    selector,
    from: { opacity: '0', transform: 'translateY(50px)' },
    animProps: {
      opacity: [0, 1], translateY: [50, 0],
      duration: 1200, delay: stagger(staggerMs, { start: delay }),
      ease: 'outQuart',
    },
  }),

  springUp: (selector, { delay = 0 } = {}) => ({
    selector,
    from: { opacity: '0', transform: 'translateY(50px)' },
    animProps: {
      opacity: [0, 1], translateY: [50, 0],
      duration: 1400, delay,
      ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
    },
  }),

  slideLeft: (selector, { delay = 0 } = {}) => ({
    selector,
    from: { opacity: '0', transform: 'translateX(-40px)' },
    animProps: {
      opacity: [0, 1], translateX: [-40, 0],
      duration: 1200, delay, ease: 'outExpo',
    },
  }),

  slideRight: (selector, { delay = 0 } = {}) => ({
    selector,
    from: { opacity: '0', transform: 'translateX(40px)' },
    animProps: {
      opacity: [0, 1], translateX: [40, 0],
      duration: 1200, delay, ease: 'outExpo',
    },
  }),

  scaleIn: (selector, { delay = 0, staggerMs = 80 } = {}) => ({
    selector,
    from: { opacity: '0', transform: 'scale(0.85) translateY(40px)' },
    animProps: {
      opacity: [0, 1], scale: [0.85, 1], translateY: [40, 0],
      duration: 1200, delay: stagger(staggerMs, { start: delay }),
      ease: 'outBack',
    },
  }),

  lineSweep: (selector, { delay = 0 } = {}) => ({
    selector,
    from: { transform: 'scaleX(0)' },
    animProps: {
      scaleX: [0, 1], duration: 1000, delay, ease: 'inOutQuart',
    },
  }),

  zoomReveal: (selector, { delay = 0 } = {}) => ({
    selector,
    from: { opacity: '0', transform: 'scale(1.15)' },
    animProps: {
      opacity: [0, 1], scale: [1.15, 1],
      duration: 1800, delay, ease: 'outQuart',
    },
  }),
};
