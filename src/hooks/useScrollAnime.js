import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Scroll-triggered Anime.js animation hook.
 * Observes the ref element and fires bespoke Anime.js animations
 * when it enters the viewport. Resets on exit so animations replay
 * on both scroll-down and scroll-up.
 *
 * @param {React.RefObject}, ref - The container element to observe
 * @param {Array} animationConfigs - Array of animation definitions:
 *   { targets: '.selector', from: { opacity: 0, translateY: 60 }, to: { opacity: 1, translateY: 0 }, duration, delay, ease, staggerDelay }
 * @param {Object} options - IntersectionObserver options
 */
export function useScrollAnime(ref, animationConfigs = [], options = {}) {
  const animationsRef = useRef([]);

  useEffect(() => {
    const el = ref.current;
    if (!el || animationConfigs.length === 0) return;

    // Set initial (hidden) state
    const resetAll = () => {
      animationConfigs.forEach(config => {
        const targets = el.querySelectorAll(config.targets);
        targets.forEach(t => {
          if (config.from) {
            Object.entries(config.from).forEach(([prop, val]) => {
              if (prop === 'opacity') t.style.opacity = String(val);
              else if (prop === 'translateY') t.style.transform = `translateY(${val}px)`;
              else if (prop === 'translateX') t.style.transform = `translateX(${val}px)`;
              else if (prop === 'scale') t.style.transform = `scale(${val})`;
            });
            // Handle compound transforms
            const transforms = [];
            if (config.from.translateY !== undefined) transforms.push(`translateY(${config.from.translateY}px)`);
            if (config.from.translateX !== undefined) transforms.push(`translateX(${config.from.translateX}px)`);
            if (config.from.scale !== undefined) transforms.push(`scale(${config.from.scale})`);
            if (config.from.rotate !== undefined) transforms.push(`rotate(${config.from.rotate}deg)`);
            if (transforms.length) t.style.transform = transforms.join(' ');
            if (config.from.opacity !== undefined) t.style.opacity = String(config.from.opacity);
          }
        });
      });
    };

    resetAll();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Cancel any pending resets
          animationsRef.current.forEach(a => a?.pause?.());
          animationsRef.current = [];

          animationConfigs.forEach(config => {
            const targets = el.querySelectorAll(config.targets);
            if (targets.length === 0) return;

            const props = {};
            if (config.to.opacity !== undefined) props.opacity = [config.from?.opacity ?? 0, config.to.opacity];
            if (config.to.translateY !== undefined) props.translateY = [config.from?.translateY ?? 60, config.to.translateY];
            if (config.to.translateX !== undefined) props.translateX = [config.from?.translateX ?? 0, config.to.translateX];
            if (config.to.scale !== undefined) props.scale = [config.from?.scale ?? 0.9, config.to.scale];
            if (config.to.rotate !== undefined) props.rotate = [config.from?.rotate ?? 0, config.to.rotate];

            const anim = animate(targets, {
              ...props,
              duration: config.duration || 1000,
              delay: config.staggerDelay ? stagger(config.staggerDelay, { start: config.delay || 0 }) : (config.delay || 0),
              ease: config.ease || 'outExpo',
            });

            animationsRef.current.push(anim);
          });
        } else {
          // Reset for re-animation
          animationsRef.current.forEach(a => a?.pause?.());
          animationsRef.current = [];
          resetAll();
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      animationsRef.current.forEach(a => a?.pause?.());
    };
  }, []);
}
