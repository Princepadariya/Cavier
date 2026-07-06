import React from 'react';

const Banner = () => {
  // Split text into characters (kept as separate spans for consistent styling)
  const line1 = 'Design For Your Space Built For Your Way';
  const line2 = '';

  return (
    <section className="relative w-full overflow-hidden h-[75vh] md:h-[85vh] lg:h-[95vh] bg-[#1F1F21]">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
      />

      {/* Cursive text */}
      <div className="absolute bottom-8 left-4 md:bottom-12 md:left-16 z-10 pr-4">
        <p
          className="text-white leading-tight"
          style={{
            fontFamily: "'Brittany Signature', 'Dancing Script', 'Great Vibes', cursive",
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {line1.split('').map((char, i) => (
            <span key={`l1-${i}`} className="inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          <br />
          {line2.split('').map((char, i) => (
            <span key={`l2-${i}`} className="inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default Banner;
