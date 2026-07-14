import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { blogsApi } from '../lib/api';

/* ─── helper: reveal on scroll ─── */
function useReveal(ref, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animate(items, { opacity: [0, 1], translateY: [40, 0], duration: 600, delay: stagger(50, { start: 50 }), ease: 'outQuart' });
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, deps);
}

const BlogDetail = () => {
  const { id } = useParams(); // slug
  const headerRef = useRef(null);
  const relatedRef = useRef(null);

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const b = await blogsApi.getBySlug(id);
        if (!alive) return;
        setBlog(b);
        const all = await blogsApi.list({ publishedOnly: true });
        if (alive) setRelated(all.filter((x) => x.slug !== id).slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
    return () => { alive = false; };
  }, [id]);

  useReveal(relatedRef, [related]);

  // Header entrance
  useEffect(() => {
    const el = headerRef.current;
    if (!el || !blog) return;
    const items = el.querySelectorAll('.head-anim');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });
    setTimeout(() => {
      animate(items, { opacity: [0, 1], translateY: [40, 0], duration: 600, delay: stagger(60, { start: 50 }), ease: 'outQuart' });
    }, 50);
  }, [blog]);

  if (loading) {
    return (
      <div className="w-full bg-[#1F1F21] min-h-screen flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full bg-[#1F1F21] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/60 text-xl">Post not found.</p>
        <Link to="/blog" className="text-white border border-white px-6 py-3 text-sm hover:bg-white hover:text-black transition-colors">Back to blog</Link>
      </div>
    );
  }

  const dateStr = new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen">
      <article className="w-full px-6 md:px-12 lg:px-32 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="w-full">

          {/* Header */}
          <div ref={headerRef} className="flex flex-col md:flex-row gap-8 md:gap-16 items-center mb-12 md:mb-16">
            <div className="head-anim w-full md:w-[30%] aspect-square overflow-hidden rounded-sm flex-shrink-0 will-change-transform">
              {blog.header_image && <img src={blog.header_image} alt={blog.title} className="w-full h-full object-cover" />}
            </div>
            <div className="w-full md:w-[60%] flex flex-col justify-center">
              <h1 className="head-anim text-white text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.2] lg:leading-[1.4] tracking-wide font-outfit mb-16 md:mb-20 will-change-transform">
                {blog.title}
              </h1>
              <div className="head-anim flex items-center justify-between w-full will-change-transform">
                <span className="text-[#a3a3a3] text-sm md:text-base font-semibold">{blog.author}</span>
                <span className="text-[#a3a3a3] text-xs md:text-sm font-light">{dateStr}{blog.read_time ? `  -  ${blog.read_time}` : ''}</span>
              </div>
            </div>
          </div>

          {/* Intro / excerpt */}
          {blog.excerpt && (
            <p className="text-white text-lg md:text-xl leading-[1.8] font-light mb-12 md:mb-16">{blog.excerpt}</p>
          )}

          {/* Content blocks */}
          {(blog.content || []).map((block, i) => {
            if (block.type === 'heading') {
              return (
                <h2 key={i} className="text-white text-4xl md:text-[2.75rem] font-medium leading-[1.3] md:leading-[1.4] font-outfit mb-6 md:mb-8 mt-8 md:mt-10">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p key={i} className="text-white text-lg md:text-xl leading-[1.8] font-light mb-8 md:mb-10">{block.text}</p>
              );
            }
            if (block.type === 'image') {
              return (
                <div key={i} className="w-full overflow-hidden rounded-sm my-12 md:my-16">
                  {block.url && <img src={block.url} alt="" className="w-full h-full object-cover" />}
                </div>
              );
            }
            return null;
          })}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section ref={relatedRef} className="w-full bg-[#1F1F21] pb-20 md:pb-28 px-6 md:px-12 lg:px-32">
          <div className="w-full">
            <h2 className="reveal text-2xl md:text-3xl lg:text-[2rem] font-light text-white tracking-wide mb-10 md:mb-12 font-outfit will-change-transform">
              Insights &amp; Inspiration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {related.map((p) => (
                <Link to={`/blog/${p.slug}`} key={p.id} className="reveal group cursor-pointer flex flex-col will-change-transform">
                  <div className="w-full aspect-square overflow-hidden rounded-sm mb-4">
                    {p.header_image && <img src={p.header_image} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />}
                  </div>
                  <h3 className="text-white text-sm md:text-base font-light leading-relaxed group-hover:text-[#a3a3a3] transition-colors">{p.title}</h3>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-12 md:mt-14">
              <Link to="/blog" className="reveal flex items-center gap-3 px-5 py-3 border border-white text-white text-sm hover:bg-white hover:text-black transition-all duration-300 will-change-transform">
                View More <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
