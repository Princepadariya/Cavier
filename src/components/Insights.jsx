import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import { blogsApi } from '../lib/api';

const Insights = () => {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsApi.list({ publishedOnly: true })
      .then(data => {
        setPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || posts.length === 0) return;

    const title = el.querySelector('.insight-title');
    const cards = el.querySelectorAll('.gsap-insight-card');
    const images = el.querySelectorAll('.insight-image');
    const btn = el.querySelector('.insight-btn');

    const reset = () => {
      if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(40px)'; }
      cards.forEach((c, i) => {
        c.style.opacity = '0';
        // Slide from alternating directions: left, center-up, right
        const directions = [-60, 0, 60];
        c.style.transform = `translateY(80px) translateX(${directions[i % 3]}px)`;
      });
      images.forEach(img => {
        img.style.transform = 'scale(1.15)';
      });
      if (btn) { btn.style.opacity = '0'; btn.style.transform = 'translateY(30px)'; }
    };
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Title
          if (title) {
            animate(title, {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 1000,
              ease: 'outExpo',
            });
          }

          // Cards slide in from alternating directions
          animate(cards, {
            opacity: [0, 1],
            translateY: [80, 0],
            translateX: [(_el, i) => { const d = [-60, 0, 60]; return d[i % 3]; }, 0],
            duration: 1400,
            delay: stagger(180, { start: 250 }),
            ease: 'outQuart',
          });

          // Images zoom from 1.15 to 1 (cinematic reveal)
          animate(images, {
            scale: [1.15, 1],
            duration: 1800,
            delay: stagger(180, { start: 400 }),
            ease: 'outQuart',
          });

          // Button
          if (btn) {
            animate(btn, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 900,
              delay: 900,
              ease: 'outQuart',
            });
          }
        } else {
          reset();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [posts]);

  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-32">
      <div className="w-full flex flex-col items-center md:items-start">

        {/* Title */}
        <h2 className="insight-title text-2xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-8 md:mb-12 opacity-0 will-change-transform">
          Insights & Inspiration
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {posts.map((item) => (
            <Link to={`/blog/${item.slug}`} key={item.id} className="gsap-insight-card opacity-0 will-change-transform flex flex-col group cursor-pointer">
              {/* Image Box */}
              <div className="w-full aspect-square overflow-hidden bg-black mb-6">
                <div
                  className="insight-image w-full h-full bg-cover bg-center transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 will-change-transform origin-center"
                  style={{ backgroundImage: `url(${item.header_image || ''})` }}
                ></div>
              </div>

              {/* Title */}
              <h3 className="text-white text-[0.95rem] md:text-base leading-relaxed tracking-wide font-light pr-4 group-hover:text-gray-300 transition-colors duration-300">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="w-full flex justify-center mt-14 md:mt-14">
          <Link
            to="/blog"
            className="insight-btn flex items-center gap-3 px-5 py-3 border border-white text-white text-sm hover:bg-white hover:text-black transition-colors duration-300 opacity-0 will-change-transform hover:scale-105 active:scale-95"
          >
            View More
            <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Insights;
