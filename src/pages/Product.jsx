import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../lib/api';

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2000, max: 4000 },
  { label: 'Over ₹4,000', min: 4000, max: Infinity },
];

const PAGE_SIZE = 9;

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null); // index into PRICE_RANGES
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

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

  // Keep category filter in sync with the URL (?category=slug from home links).
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Distinct finish names across all products, for the Color Finishes filter.
  const finishOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => (p.finishes || []).forEach((f) => f?.name && set.add(f.name)));
    return [...set].sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery && !p.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory && p.category?.slug !== selectedCategory) return false;
      if (selectedFinish && !(p.finishes || []).some((f) => f.name === selectedFinish)) return false;
      if (selectedPrice != null) {
        const { min, max } = PRICE_RANGES[selectedPrice];
        if (!(Number(p.price) >= min && Number(p.price) < max)) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedFinish, selectedPrice, searchQuery]);

  useEffect(() => setPage(1), [selectedCategory, selectedFinish, selectedPrice, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setCategory = (slug) => {
    setSelectedCategory(slug);
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    setSearchParams(next, { replace: true });
    setActiveDropdown(null);
  };

  const activeFilterLabel = (name) => {
    if (name === 'Category') return categories.find((c) => c.slug === selectedCategory)?.name;
    if (name === 'Color Finishes') return selectedFinish;
    if (name === 'Price') return selectedPrice != null ? PRICE_RANGES[selectedPrice].label : null;
    return null;
  };

  const filters = ['Category', 'Color Finishes', 'Price'];

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen overflow-hidden">

      {/* Hero */}
      <div className="relative h-screen w-full overflow-hidden z-10">
        <div className="absolute inset-0 w-full h-full bg-black">
          <img
            src="/images/product_page_banner.png"
            alt="Cavier Premium Bath Fittings"
            className="w-full h-full object-cover opacity-70"
          />
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        </div>

        {/* Text Content */}
        <div className="relative z-20 h-full w-full flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-32 pt-[102px]">
          <span className="text-white/70 text-xs md:text-sm tracking-[0.35em] uppercase mb-6 font-light will-change-transform">
            Premium Bath Fittings
          </span>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-light leading-[1.5] tracking-tight font-outfit mb-6 max-w-2xl">
            Crafted to Elevate<br />Every Bathroom
          </h1>
          <p className="text-white/70 text-[1.2rem] leading-relaxed font-light max-w-md mb-10">
            Discover premium faucets, showers, and bathroom accessories that blend elegant design with precision engineering. Built for lasting performance and finished to perfection, every Cavier product transforms everyday spaces into luxurious experiences.
          </p>
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/50 text-white text-xs sm:text-sm hover:bg-white hover:text-black transition-colors duration-300 w-fit font-outfit"
          >
            <span className="tracking-wide">Scroll Down</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <section className="w-full bg-[#1F1F21] pt-8 md:pt-12 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="w-full">
          <div className="w-full h-[1px] bg-white/10" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-16 py-5">
            <div className="w-full flex items-center justify-between flex-wrap">
              {filters.map((name) => {
                const label = activeFilterLabel(name);
                return (
                  <div key={name} className="relative flex-shrink-0">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === name ? null : name)}
                      className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base md:text-lg font-medium whitespace-nowrap hover:text-white/70 transition-colors"
                    >
                      <span>{name}{label ? `: ${label}` : ''}</span>
                      <svg width="14" height="14" className={`sm:w-4 sm:h-4 transition-transform duration-200 ${activeDropdown === name ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {activeDropdown === name && (
                      <div className={`absolute top-full mt-4 w-56 md:w-64 bg-[#2A2A2D] border border-white/10 rounded-lg shadow-xl z-50 py-2 max-h-72 overflow-auto ${name === 'Price' ? 'right-0' : name === 'Color Finishes' ? 'left-1/2 -translate-x-1/2' : 'left-0'}`}>
                        {name === 'Category' && (
                          <>
                            <FilterOption active={!selectedCategory} onClick={() => setCategory('')}>All categories</FilterOption>
                            {categories.map((c) => (
                              <FilterOption key={c.id} active={selectedCategory === c.slug} onClick={() => setCategory(c.slug)}>
                                {c.name}
                              </FilterOption>
                            ))}
                          </>
                        )}
                        {name === 'Color Finishes' && (
                          <>
                            <FilterOption active={!selectedFinish} onClick={() => { setSelectedFinish(''); setActiveDropdown(null); }}>All finishes</FilterOption>
                            {finishOptions.length === 0 && <div className="px-4 py-3 text-sm text-white/40">No finishes</div>}
                            {finishOptions.map((f) => (
                              <FilterOption key={f} active={selectedFinish === f} onClick={() => { setSelectedFinish(f); setActiveDropdown(null); }}>
                                {f}
                              </FilterOption>
                            ))}
                          </>
                        )}
                        {name === 'Price' && (
                          <>
                            <FilterOption active={selectedPrice == null} onClick={() => { setSelectedPrice(null); setActiveDropdown(null); }}>Any price</FilterOption>
                            {PRICE_RANGES.map((r, i) => (
                              <FilterOption key={r.label} active={selectedPrice === i} onClick={() => { setSelectedPrice(i); setActiveDropdown(null); }}>
                                {r.label}
                              </FilterOption>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 text-sm sm:text-base px-1 py-1.5 pr-8 focus:outline-none focus:border-white transition-colors"
              />
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/10" />
        </div>
      </section>

      {activeDropdown && <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />}

      {/* Product Grid */}
      <section className="w-full bg-[#1F1F21] py-6 md:py-8 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="w-full">
          {loading ? (
            <p className="text-white/50 py-20 text-center">Loading products…</p>
          ) : pageItems.length === 0 ? (
            <p className="text-white/50 py-20 text-center">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-14 sm:gap-y-20">
              {pageItems.map((product) => (
                <div key={product.id} className="flex flex-col group cursor-pointer">
                  <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                                mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                                transition-all duration-300
                                group-hover:border-[#FFFFFF]
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
                    <h3 className="font-outfit text-white text-sm sm:text-base md:text-lg tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                      {product.name}
                    </h3>
                    <p className="font-text text-white text-base sm:text-lg font-normal tracking-widest">
                      INR {Number(product.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {!loading && filtered.length > PAGE_SIZE && (
        <section className="w-full bg-[#1F1F21] py-8 md:py-10 px-4 sm:px-6 md:px-12 lg:px-32">
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-white/60 text-sm">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 border flex items-center justify-center text-sm transition-colors ${page === i + 1 ? 'border-white/40 text-white bg-white/10' : 'border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Download Our Product Catalogue */}
      <section className="w-full bg-[#1F1F21] py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="w-full flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-4 md:mb-6">
            Download Our Product Catalogue
          </h2>
          <p className="text-white/80 font-medium text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            Browse our latest catalogue to explore premium bath fittings, innovative<br className="hidden md:block" />
            designs, and expertly crafted collections for modern bathrooms.
          </p>
          <button className="flex items-center gap-2 md:gap-3 text-white border border-white/50 px-8 py-2 md:py-2.5 text-xs md:text-sm hover:bg-white hover:text-black transition-colors">
            <span className="font-medium tracking-wide">Download</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

function FilterOption({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-base md:text-lg transition-colors ${active ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
    >
      {children}
    </button>
  );
}

export default Product;
