import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import { animate, stagger, createSpring } from 'animejs';

import { useCart } from '../context/CartContext';
import { productsApi } from '../lib/api';

function useSection(ref, buildConfigs, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const configs = buildConfigs(el);
    const reset = () => configs.forEach(({ targets, from }) =>
      targets.forEach(t => Object.assign(t.style, from)));
    reset();
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) configs.forEach(c => animate(c.targets, c.anim));
      else reset();
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, deps);
}

const ProductDetail = () => {
  const { id } = useParams(); // slug
  const { cartItems, addToCart, updateQty, removeItem, subtotal } = useCart();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const detailRef = useRef(null);
  const featRef = useRef(null);
  const similarRef = useRef(null);

  const [selectedFinish, setSelectedFinish] = useState(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  const [cartOpen, setCartOpen] = useState(false);
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);

  // Fetch product + similar items
  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const p = await productsApi.getBySlug(id);
        if (!alive) return;
        setProduct(p);
        setSelectedFinish(p?.finishes?.[0] || null);
        setActiveThumb(0);
        if (p?.category_id) {
          const sim = await productsApi.list({ activeOnly: true, categoryId: p.category_id, limit: 4 });
          if (alive) setSimilar(sim.filter((s) => s.id !== p.id).slice(0, 3));
        } else {
          setSimilar([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const openCart = useCallback((p) => { addToCart(p); setCartOpen(true); }, [addToCart]);
  const closeCart = useCallback(() => setCartOpen(false), []);

  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
      animate(backdrop, { opacity: [0, 1], duration: 300, ease: 'outQuart' });
      animate(drawer, { translateX: ['100%', '0%'], duration: 500, ease: 'outExpo' });
    } else {
      document.body.style.overflow = '';
      animate(backdrop, { opacity: [1, 0], duration: 250, ease: 'inQuart' });
      animate(drawer, { translateX: ['0%', '100%'], duration: 400, ease: 'inExpo' });
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  // Detail hero entrance — re-run when product loads
  useEffect(() => {
    const el = detailRef.current;
    if (!el || !product) return;
    const img = el.querySelector('.detail-img');
    const info = el.querySelectorAll('.detail-info');
    if (img) { img.style.opacity = '0'; img.style.transform = 'translateX(-60px) scale(0.95)'; }
    info.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(40px)'; });
    const t = setTimeout(() => {
      if (img) animate(img, { opacity: [0, 1], translateX: [-60, 0], scale: [0.95, 1], duration: 1600, ease: 'outExpo' });
      animate(info, { opacity: [0, 1], translateY: [40, 0], duration: 1400, delay: stagger(100, { start: 400 }), ease: createSpring({ stiffness: 80, damping: 14, mass: 1 }) });
    }, 200);
    return () => clearTimeout(t);
  }, [product]);

  useSection(featRef, el => {
    const title = el.querySelectorAll('.feat-title');
    const items = el.querySelectorAll('.feat-item');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(30px)' }, anim: { opacity: [0, 1], translateY: [30, 0], duration: 1200, ease: 'outQuart' } },
      { targets: [...items], from: { opacity: '0', transform: 'translateX(-30px)' }, anim: { opacity: [0, 1], translateX: [-30, 0], duration: 1000, delay: stagger(80, { start: 300 }), ease: 'outQuart' } },
    ];
  }, [product]);

  useSection(similarRef, el => {
    const title = el.querySelectorAll('.sim-title');
    const cards = el.querySelectorAll('.sim-card');
    return [
      { targets: [...title], from: { opacity: '0', transform: 'translateY(40px)' }, anim: { opacity: [0, 1], translateY: [40, 0], duration: 1200, ease: 'outQuart' } },
      { targets: [...cards], from: { opacity: '0', transform: 'translateY(70px) scale(0.9)' }, anim: { opacity: [0, 1], translateY: [70, 0], scale: [0.9, 1], duration: 1400, delay: stagger(120, { start: 300 }), ease: createSpring({ stiffness: 70, damping: 14, mass: 1 }) } },
    ];
  }, [similar]);

  const handleFinishChange = (finish) => {
    if (!finish || finish.name === selectedFinish?.name) return;
    setIsMorphing(true);
    const root = document.documentElement;
    root.style.setProperty('--ambient-glow', (finish.color || '#ffffff') + '22');
    setTimeout(() => { setSelectedFinish(finish); setIsMorphing(false); }, 400);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#1F1F21] min-h-screen flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#1F1F21] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/60 text-xl">Product not found.</p>
        <Link to="/product" className="text-white border border-white px-6 py-3 text-sm hover:bg-white hover:text-black transition-colors">
          Back to products
        </Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : (product.main_image ? [product.main_image] : []);
  const heroImage = gallery[activeThumb] || product.main_image || '';
  const finishFilter = selectedFinish?.filter || 'none';

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen transition-colors duration-1000"
      style={{ backgroundImage: `radial-gradient(circle at 50% 20%, var(--ambient-glow, #ffffff11) 0%, transparent 70%)` }}>

      <section ref={detailRef} className="w-full bg-[#1F1F21] pt-32 md:pt-40 pb-16 px-6 md:px-12 lg:px-32">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch pt-8 md:pt-12">

            {/* Image + thumbnails */}
            <div className="detail-img w-full will-change-transform relative">
              <div className="relative w-full aspect-[9/8] rounded-sm overflow-hidden p-6 md:p-10" style={{ border: '0.5px solid #FFFFFF' }}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={heroImage} alt={product.name} className="absolute w-full h-full object-contain" style={{ filter: finishFilter }} />
                  <div className={`absolute inset-0 z-30 pointer-events-none transition-all duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 ${isMorphing ? 'translate-x-[200%] opacity-100' : '-translate-x-[200%] opacity-0'}`} />
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-2 sm:gap-0 sm:justify-between mt-5 w-full">
                  {gallery.slice(0, 4).map((src, i) => (
                    <button key={i} onClick={() => setActiveThumb(i)}
                      className={`flex-1 sm:flex-initial sm:w-24 md:w-32 aspect-[4/3] rounded-sm overflow-hidden min-w-0 sm:flex-shrink-0 transition-colors duration-200 ${activeThumb === i ? 'ring-1 ring-white' : ''}`}
                      style={{ border: '0.5px solid #FFFFFF' }}>
                      <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-contain p-2" style={{ filter: finishFilter }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="w-full flex flex-col py-4 md:py-2">
              <h1 className="detail-info text-white text-2xl md:text-3xl lg:text-[2rem] font-medium leading-[1.4] font-outfit mb-4 will-change-transform">
                {product.name}
              </h1>
              {product.short_desc && (
                <p className="detail-info text-white text-sm md:text-base leading-relaxed font-light mb-4 max-w-md will-change-transform">
                  {product.short_desc}
                </p>
              )}
              <div className="detail-info flex gap-1 mb-6 will-change-transform">
                {[1, 2, 3, 4, 5].map(s => <span key={s} className={s <= (product.rating || 5) ? 'text-white text-xl' : 'text-white/20 text-xl'}>★</span>)}
              </div>

              {product.code && (
                <h2 className="detail-info text-white text-2xl md:text-3xl font-normal font-outfit mb-10 will-change-transform">
                  Code :- {product.code}
                </h2>
              )}

              {product.finishes?.length > 0 && (
                <div className="detail-info mb-16 mt-auto will-change-transform">
                  <h3 className="text-white text-2xl md:text-3xl font-bold font-outfit mb-5">Finishing</h3>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {product.finishes.map(f => (
                      <button key={f.name} title={f.name} onClick={() => handleFinishChange(f)}
                        className={`w-[45%] sm:w-24 h-14 rounded-sm border transition-all duration-300 relative overflow-hidden group ${selectedFinish?.name === f.name ? 'border-white scale-105 md:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/15 hover:border-white/40'}`}
                        style={{ backgroundColor: f.color }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.description && (
                <p className="detail-info text-white/70 text-sm md:text-base leading-relaxed font-light mb-8 max-w-md will-change-transform">
                  {product.description}
                </p>
              )}

              <h3 className="detail-info text-white text-2xl md:text-3xl font-bold font-outfit mb-6 will-change-transform">
                MRP :- ₹ {Number(product.price).toLocaleString('en-IN')}
              </h3>

              <button
                onClick={() => openCart({
                  id: product.code || product.slug,
                  name: product.name,
                  finish: selectedFinish?.name || '—',
                  height: product.specifications?.find(s => /height|length/i.test(s.label))?.value || '—',
                  price: Number(product.price),
                  img: product.main_image || heroImage,
                })}
                className="detail-info flex items-center justify-center gap-2 w-full border border-white text-white rounded-full py-2 text-sm md:text-base font-medium tracking-wide hover:bg-white hover:text-black transition-colors will-change-transform"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></svg>
                <span>Buy now</span>
              </button>
            </div>
          </div>

          {/* Key features */}
          {product.features?.length > 0 && (
            <div ref={featRef} className="mt-14">
              <h2 className="feat-title text-white text-2xl md:text-3xl font-semibold font-outfit mb-6 will-change-transform">Key Features</h2>
              <ul className="flex flex-col gap-7 text-white text-2xl md:text-3xl font-light">
                {product.features.map(f => (
                  <li key={f} className="feat-item flex items-start sm:items-center gap-3 will-change-transform">
                    <span className="text-white text-lg leading-none mt-2 sm:mt-0">•</span><span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="mt-14">
              <h2 className="text-white text-2xl md:text-3xl font-semibold font-outfit mb-6">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-3xl">
                {product.specifications.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-white/10 py-3 text-white">
                    <span className="text-white/60">{s.label}</span>
                    <span className="font-light">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Similar items */}
      {similar.length > 0 && (
        <section ref={similarRef} className="w-full bg-[#1F1F21] pt-6 pb-16 md:py-16 px-6 md:px-12 lg:px-32">
          <h2 className="sim-title text-white text-3xl md:text-4xl font-light tracking-wide font-outfit mb-10 will-change-transform">Similar items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-14 sm:gap-y-6">
            {similar.map(item => (
              <div key={item.id} className="sim-card flex flex-col group cursor-pointer opacity-0 will-change-transform">
                <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                                mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                                transition-all duration-300 group-hover:border-[#FFFFFF] group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                  <Link to={`/product/${item.slug}`} className="block w-full h-full relative">
                    <img src={item.main_image || ''} alt={item.name} className="w-full h-full object-contain transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08] will-change-transform" />
                  </Link>
                </div>
                <div className="flex flex-col items-center text-center px-1">
                  <h3 className="font-outfit text-white text-sm sm:text-base md:text-lg tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">{item.name}</h3>
                  <p className="font-text text-white text-base sm:text-lg font-normal tracking-widest">INR {Number(item.price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cart drawer */}
      <div ref={backdropRef} onClick={closeCart} className={`fixed inset-0 bg-black/60 z-[9998] ${cartOpen ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`} />
      <div ref={drawerRef} className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-[#1A1A1A] z-[9999] flex flex-col shadow-2xl" style={{ transform: 'translateX(100%)' }}>
        <div className="px-6 md:px-10 pt-10 md:pt-14 pb-5 md:pb-6 flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold font-outfit">Your Cart</h2>
          <button onClick={closeCart} className="text-white/30 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="mx-6 md:mx-10 border-t border-white/10" />
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 md:py-10">
          {cartItems.length === 0 ? (
            <p className="text-white/20 text-sm text-center mt-20">Your cart is empty</p>
          ) : (
            <div className="flex flex-col gap-10">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-black border border-white/10 rounded-sm overflow-hidden shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 flex flex-col min-h-[96px]">
                    <div className="mb-3">
                      <h3 className="text-white text-[13px] font-bold font-outfit leading-tight mb-2 pr-1">{item.name}</h3>
                      <p className="text-white/40 text-[10px] mb-1">Color / Finish : {item.finish}</p>
                      <p className="text-white/40 text-[10px]">Total Height = {item.height}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-white/20 rounded-[2px] h-7">
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-full flex items-center justify-center text-white/50 hover:text-white transition-colors text-xs">+</button>
                        <span className="w-6 h-full flex items-center justify-center text-white text-[11px] border-x border-white/20">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-full flex items-center justify-center text-white/50 hover:text-white transition-colors text-xs">−</button>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-white text-sm font-bold font-outfit mb-0.5">₹{item.price * item.qty}</span>
                        <button onClick={() => removeItem(item.id)} className="text-white/30 text-[10px] underline underline-offset-2 hover:text-white/60 transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="px-6 md:px-10 pb-10 md:pb-12 pt-6 md:pt-8">
            <div className="border-t border-white/10 mb-8" />
            <div className="flex items-center justify-between mb-10">
              <span className="text-white text-2xl font-bold font-outfit">Cart Total</span>
              <span className="text-white text-2xl font-bold font-outfit">₹{subtotal}</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 border border-white/30 rounded-sm text-white text-[11px] py-3 hover:bg-white/5 transition-colors uppercase tracking-[0.2em] font-medium">View Cart</button>
              <Link to="/checkout" className="flex-1 border border-white/30 rounded-sm text-white text-[11px] py-3 hover:bg-white hover:text-black transition-colors uppercase tracking-[0.2em] font-medium text-center">Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
