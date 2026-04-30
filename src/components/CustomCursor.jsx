import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const CustomCursor = () => {
  const mainCursor = useRef(null);
  const outerCursor = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Immediate tracking for main dot
      if (mainCursor.current) {
        mainCursor.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      // Smooth lag tracking for outer ring
      if (outerCursor.current) {
        animate(outerCursor.current, {
          translateX: clientX,
          translateY: clientY,
          duration: 300,
          easing: 'easeOutExpo'
        });
      }
    };

    const handleMouseDown = () => {
      if (outerCursor.current) {
        animate(outerCursor.current, {
          scale: 0.8,
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    };

    const handleMouseUp = () => {
      if (outerCursor.current) {
        animate(outerCursor.current, {
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        ref={mainCursor}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#d4af37] rounded-full z-[10000] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      {/* Outer Glow/Ring */}
      <div 
        ref={outerCursor}
        className="fixed top-0 left-0 w-8 h-8 border border-[#d4af37]/30 rounded-full z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
      />
    </>
  );
};

export default CustomCursor;
