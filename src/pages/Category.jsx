import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../lib/api';

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(searchParams.get('cat') || '');

  useEffect(() => {
    (async () => {
      try {
        const [prods, cats] = await Promise.all([
          productsApi.list({ activeOnly: true }),
          categoriesApi.list({ activeOnly: true }),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setSelected(searchParams.get('cat') || '');
  }, [searchParams]);

  const activeCategory = categories.find((c) => c.slug === selected) || null;

  const filtered = useMemo(
    () => (selected ? products.filter((p) => p.category?.slug === selected) : products),
    [products, selected]
  );

  const selectCategory = (slug) => {
    setSelected(slug);
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('cat', slug);
    else next.delete('cat');
    setSearchParams(next, { replace: true });
  };

  const heroImage = activeCategory?.hero_image || '/images/category_hero_banner.png';

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen overflow-hidden">

      {/* Hero */}
      <div className="relative h-screen w-full overflow-hidden z-10">
        <div className="absolute inset-0 w-full h-full bg-black">
          <img src={heroImage} alt="Cavier Premium Bath Fittings" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 h-full w-full flex flex-col justify-center px-6 md:px-12 lg:px-32 pt-[102px]">
          <span className="text-black text-[1.2rem] tracking-[0.3em] uppercase font-medium mb-6">
            Explore Our Category
          </span>
          <h1 className="text-black text-3xl md:text-4xl lg:text-5xl font-light leading-[1.5] tracking-tight font-outfit mb-6 max-w-2xl">
            {activeCategory ? activeCategory.name : <>Premium Bath<br />Fittings Collection</>}
          </h1>
          <p className="text-black/70 text-[1.2rem] leading-relaxed font-light max-w-md mb-10">
            {activeCategory?.description ||
              'Explore thoughtfully designed bath fittings that combine contemporary aesthetics, superior craftsmanship, and reliable functionality for residential and commercial spaces.'}
          </p>
        </div>
      </div>

      {/* Filters + Product Grid */}
      <section className="w-full bg-[#1F1F21] pt-16 pb-8 md:pt-20 md:pb-12 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

          {/* Sidebar: category filter */}
          <aside className="w-full lg:w-1/4 xl:w-1/5 flex-shrink-0">
            <div className="w-full h-[1px] bg-white/15" />
            <button
              onClick={() => selectCategory('')}
              className={`w-full flex items-center justify-between py-4 text-base md:text-lg font-light border-b border-white/15 transition-colors ${
                !selected ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>All Products</span>
              <span className="text-sm text-white/40">{products.length}</span>
            </button>
            {categories.map((c) => {
              const count = products.filter((p) => p.category?.slug === c.slug).length;
              return (
                <button
                  key={c.id}
                  onClick={() => selectCategory(c.slug)}
                  className={`w-full flex items-center justify-between py-4 text-base md:text-lg font-light border-b border-white/15 transition-colors ${
                    selected === c.slug ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-sm text-white/40">{count}</span>
                </button>
              );
            })}
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <p className="text-white/50 py-20 text-center">Loading products…</p>
            ) : filtered.length === 0 ? (
              <p className="text-white/50 py-20 text-center">No products in this category yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                {filtered.map((product) => (
                  <div key={product.id} className="flex flex-col group cursor-pointer">
                    <div className="relative w-full aspect-[9/10] bg-[#1F1F21] rounded-md border border-white
                                    mb-4 overflow-hidden flex items-center justify-center p-6 sm:p-8
                                    transition-all duration-300
                                    group-hover:border-white
                                    group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                      <Link to={`/product/${product.slug}`} className="block w-full h-full relative">
                        <img
                          src={product.main_image || ''}
                          alt={product.name}
                          className="w-full h-full object-contain transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08]"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col items-center text-center px-1">
                      <h3 className="font-outfit text-white text-xs sm:text-sm tracking-wide font-light line-clamp-1 w-full">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Explore The Catalog */}
      <section className="w-full bg-[#1F1F21] pt-16 pb-12 px-4 sm:px-6 md:px-12 lg:px-32 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide font-outfit mb-6">
          Download Our Product Catalogue
        </h2>
        <p className="text-[#ffffff] max-w-3xl text-sm md:text-base font-light mb-10 leading-relaxed font-outfit">
          Browse our latest catalogue to explore premium bath fittings, innovative<br className="hidden md:block" />
          designs, and expertly crafted collections for modern bathrooms.
        </p>
        <button className="flex items-center gap-3 text-white border border-white px-10 py-3 text-sm hover:bg-white hover:text-black transition-all duration-300 w-fit font-outfit">
          <span>Download</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
      </section>
    </div>
  );
};

export default Category;
