import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { animate, stagger } from 'animejs';

/* ─── helper: reveal on scroll ─── */
function useReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animate(items, {
          opacity: [0, 1], translateY: [40, 0],
          duration: 600, delay: stagger(50, { start: 50 }), ease: 'outQuart',
        });
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

const sections = [
  { h: 'Elegant Minimalism Takes Center Stage', p: 'Minimalism continues to influence modern bathroom design in 2026, with homeowners and designers embracing clean lines, uncluttered layouts, and refined details. Faucets with sleek silhouettes, concealed installations, and streamlined accessories create a sense of openness while maintaining a sophisticated appearance. This design approach not only enhances aesthetics but also makes bathrooms easier to maintain, offering a timeless look that remains stylish for years.' },
  { h: 'Premium Finishes for Every Interior', p: "Today's bathrooms are becoming more personalized, and premium finishes play a key role in defining their character. While polished chrome remains a timeless favorite, finishes such as matte black, brushed gold, brushed nickel, and gunmetal are gaining popularity for their luxurious appeal. These versatile finishes complement a wide range of interior styles, from modern and industrial to classic and contemporary, allowing homeowners to create a distinctive and elegant bathroom space." },
  { h: 'Sustainability Meets Performance', p: 'Sustainability is now an essential consideration in bathroom design. Premium bath fittings are being developed with advanced water-saving technologies that reduce water consumption while maintaining strong and consistent performance. These innovations help conserve natural resources, lower utility costs, and support environmentally responsible living without sacrificing comfort or functionality.' },
  { h: 'Precision Engineering That Lasts', p: 'Exceptional quality begins with precision engineering and premium materials. High-grade brass construction, advanced CNC machining, and durable surface treatments ensure bath fittings offer excellent corrosion resistance, leak-free operation, and reliable performance. Combined with rigorous quality testing, these manufacturing standards result in products that retain their beauty and functionality even after years of everyday use.' },
];

const sectionsAfter = [
  { h: 'Smart Design for Modern Lifestyles', p: 'Modern lifestyles demand products that offer both convenience and efficiency. Features such as touchless faucets, thermostatic shower controls, ergonomic handles, and easy-to-clean surfaces improve hygiene while enhancing the overall user experience. These thoughtful innovations simplify daily routines and bring greater comfort to contemporary bathrooms.' },
  { h: 'Coordinated Bathroom Collections', p: 'Rather than selecting products individually, homeowners and designers are choosing complete collections that feature matching faucets, showers, accessories, and valves. A coordinated design language creates visual harmony and elevates the overall bathroom experience.' },
  { h: 'Wellness-Driven Spaces', p: 'Bathrooms are evolving into personal wellness spaces where comfort and relaxation take priority. Features such as rain showers, spacious layouts, premium fixtures, and carefully selected accessories contribute to a calming, spa-inspired atmosphere. By combining functionality with thoughtful design, these spaces encourage relaxation and transform everyday routines into enjoyable experiences.' },
  { h: 'Investing in Long-Term Value', p: 'Premium bath fittings are an investment in quality, durability, and timeless design. Products manufactured with superior materials and precision craftsmanship require less maintenance, perform reliably, and maintain their appearance over time. Whether for residential, hospitality, or commercial projects, choosing high-quality bath fittings ensures lasting value, enhanced aesthetics, and dependable performance for years to come.' },
];

const related = [
  { img: '/images/insight_1.jpg', title: 'The Future of Premium Bath Fittings: Trends to Watch in 2026' },
  { img: '/images/insight_2.jpg', title: 'The Future of Premium Bath Fittings: Trends to Watch in 2026' },
  { img: '/images/insight_3.jpg', title: 'The Future of Premium Bath Fittings: Trends to Watch in 2026' },
];

const BlogDetail = () => {
  const headerRef = useRef(null);
  const relatedRef = useRef(null);

  useReveal(relatedRef);

  // Header entrance on mount
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.head-anim');
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });
    setTimeout(() => {
      animate(items, {
        opacity: [0, 1], translateY: [40, 0],
        duration: 600, delay: stagger(60, { start: 50 }), ease: 'outQuart',
      });
    }, 50);
  }, []);

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen">

      <article className="w-full px-6 md:px-12 lg:px-32 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="w-full">

          {/* ── Article header ── */}
          <div ref={headerRef} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-12 md:mb-16">
            <div className="head-anim w-full md:w-[38%] aspect-square overflow-hidden rounded-sm flex-shrink-0 will-change-transform">
              <img src="/images/insight_1.jpg" alt="The Future of Premium Bath Fittings" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-[62%]">
              <h1 className="head-anim text-white text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.2] md:leading-[1.2] lg:leading-[1.2] tracking-[0.06em] font-outfit mb-6 will-change-transform">
                The Future of Premium Bath Fittings: Trends to Watch in 2026
              </h1>
              <div className="head-anim flex items-center justify-between border-t border-white/10 pt-4 will-change-transform">
                <span className="text-[#a3a3a3] text-sm font-light">By Cavier India</span>
                <span className="text-[#a3a3a3] text-sm font-light">May 31, 2026 &middot; 4 min read</span>
              </div>
            </div>
          </div>

          {/* ── Intro ── */}
          <p className="text-white/80 text-base md:text-lg leading-relaxed font-light mb-12 md:mb-16">
            The modern bathroom has evolved beyond a functional space—it has become a reflection of personal style, comfort, and innovation. As we move through 2026, homeowners, architects, and interior designers are embracing bath fittings that combine elegant aesthetics with intelligent engineering. From luxurious finishes to sustainable solutions, the future of premium bathware is redefining the way we experience everyday living.
          </p>

          {/* ── Sections (first half) ── */}
          {sections.map((s) => (
            <section key={s.h} className="mb-10 md:mb-14">
              <h2 className="text-white text-2xl md:text-3xl font-medium font-outfit mb-4">{s.h}</h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">{s.p}</p>
            </section>
          ))}

          {/* ── Feature image ── */}
          <div className="w-full aspect-[16/10] overflow-hidden rounded-sm my-12 md:my-16">
            <img src="/images/Bath Fitting_blog.jpg" alt="Luxury bathroom" className="w-full h-full object-cover" />
          </div>

          {/* ── Sections (second half) ── */}
          {sectionsAfter.map((s) => (
            <section key={s.h} className="mb-10 md:mb-14">
              <h2 className="text-white text-2xl md:text-3xl font-medium font-outfit mb-4">{s.h}</h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">{s.p}</p>
            </section>
          ))}

          {/* ── Looking Ahead ── */}
          <section className="mb-4">
            <h2 className="text-white text-2xl md:text-3xl font-medium font-outfit mb-4">Looking Ahead</h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-light mb-6">
              The future of bath fittings is defined by innovation, sustainability, and exceptional craftsmanship. As design preferences continue to evolve, the focus remains on creating products that deliver beauty, durability, and everyday performance in equal measure.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">
              At Cavier India, we believe every detail matters. By combining precision manufacturing, premium materials, and contemporary design, we create bath fittings that enhance modern living and stand the test of time.
            </p>
          </section>
        </div>
      </article>

      {/* ── Insights & Inspiration (related) ── */}
      <section ref={relatedRef} className="w-full bg-[#1F1F21] pb-20 md:pb-28 px-6 md:px-12 lg:px-32">
        <div className="w-full">
          <h2 className="reveal text-2xl md:text-3xl lg:text-[2rem] font-light text-white tracking-wide mb-10 md:mb-12 font-outfit will-change-transform">
            Insights &amp; Inspiration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {related.map((p, i) => (
              <Link to={`/blog/${i + 1}`} key={i} className="reveal group cursor-pointer flex flex-col will-change-transform">
                <div className="w-full aspect-square overflow-hidden rounded-sm mb-4">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />
                </div>
                <h3 className="text-white text-sm md:text-base font-light leading-relaxed group-hover:text-[#a3a3a3] transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12 md:mt-14">
            <Link to="/blog" className="reveal flex items-center gap-2 px-8 py-3 border border-white/40 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 will-change-transform">
              View More <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BlogDetail;
