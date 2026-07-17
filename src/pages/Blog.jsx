import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, stagger, createSpring } from 'animejs';
import { ChevronDown } from 'lucide-react';
import { blogsApi } from '../lib/api';

/* ─── helper: attach IntersectionObserver + animate on enter ─── */
function useSection(ref, buildConfigs, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const configs = buildConfigs(el);
    const reset = () => configs.forEach(({ targets, from }) =>
      targets.forEach(t => Object.assign(t.style, from)));
    reset();
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        configs.forEach(c => animate(c.targets, c.anim));
        obs.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, deps);
}

const Blog = () => {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    blogsApi.list({ publishedOnly: true }).then(setPosts).catch(() => {});
  }, []);

  // Hero: on-mount entrance
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.blog-content > *');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(50px)'; });
    setTimeout(() => {
      animate(items, {
        opacity: [0, 1], translateY: [50, 0],
        duration: 700, delay: stagger(60, { start: 100 }),
        ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }),
      });
    }, 50);
  }, []);

  useSection(gridRef, el => {
    const title = el.querySelectorAll('.blog-sec-title');
    const cards = el.querySelectorAll('.blog-card');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' }, anim: { opacity: [0, 1], translateY: [40, 0], duration: 600, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(60px) scale(0.95)' }, anim: { opacity: [0, 1], translateY: [60, 0], scale: [0.95, 1], duration: 600, delay: stagger(60, { start: 100 }), ease: 'outQuart' } },
    ];
  }, [posts]);

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen">

      {/* Hero */}
      <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="radar-circle w-[1px] h-[1px] rounded-full border border-white/20 animate-radar-pulse" />
          <div className="radar-circle w-[1px] h-[1px] rounded-full border border-white/10 animate-radar-pulse delay-700" />
        </div>
        <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/blog_hero_banner.png')" }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-20">
          <div className="blog-content flex flex-col items-center">
            <span className="text-white/70 text-xs md:text-sm tracking-[0.35em] uppercase mb-6 font-light will-change-transform">The Cavier Blog</span>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-light tracking-wide mb-8 font-outfit will-change-transform"><span className="block mb-2 md:mb-4">Insights That Inspire</span><span className="block">Better Bathrooms</span></h1>
            <p className="text-[#ACABAB] max-w-3xl text-xl md:text-3xl leading-relaxed font-light mb-12 will-change-transform">Explore the latest bathroom trends, product innovations, expert insights, and design inspiration from Cavier India.</p>
            <button onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3 text-white border border-white px-5 py-3 text-sm hover:bg-white hover:text-black transition-all duration-300 w-fit will-change-transform group">
              <span>Scroll Down</span><ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Insights & Inspiration */}
      <section ref={gridRef} className="w-full bg-[#1F1F21] py-16 md:py-24 px-6 md:px-12 lg:px-32">
        <h2 className="blog-sec-title text-3xl md:text-4xl lg:text-[2.5rem] font-light text-white tracking-wide mb-12 md:mb-16 font-outfit will-change-transform">
          Insights &amp; Inspiration
        </h2>
        {posts.length === 0 ? (
          <p className="text-white/50 py-10">No posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {posts.map((p) => (
              <Link to={`/blog/${p.slug}`} key={p.id} className="blog-card group cursor-pointer flex flex-col will-change-transform">
                <div className="w-full aspect-square overflow-hidden rounded-sm mb-5">
                  <img src={p.header_image || ''} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />
                </div>
                <h3 className="text-white text-base md:text-lg font-normal leading-relaxed group-hover:text-[#a3a3a3] transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
