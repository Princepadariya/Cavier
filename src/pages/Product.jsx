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
      if (selectedCategory && p.category?.slug !== selectedCategory) return false;
      if (selectedFinish && !(p.finishes || []).some((f) => f.name === selectedFinish)) return false;
      if (selectedPrice != null) {
        const { min, max } = PRICE_RANGES[selectedPrice];
        if (!(Number(p.price) >= min && Number(p.price) < max)) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedFinish, selectedPrice]);

  useEffect(() => setPage(1), [selectedCategory, selectedFinish, selectedPrice]);

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
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <section className="w-full bg-[#1F1F21] pt-8 md:pt-12 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="w-full h-[1px] bg-white/10" />
        <div className="flex items-center justify-between gap-3 sm:gap-6 py-5 flex-wrap">
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
                  <div className="absolute top-full left-0 mt-4 w-56 md:w-64 bg-[#2A2A2D] border border-white/10 rounded-lg shadow-xl z-50 py-2 max-h-72 overflow-auto">
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
        <div className="w-full h-[1px] bg-white/10" />
      </section>

      {activeDropdown && <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />}

      {/* Product Grid */}
      <section className="w-full bg-[#1F1F21] py-6 md:py-8 px-4 sm:px-6 md:px-12 lg:px-32">
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
      </section>

      {/* Pagination */}
      {!loading && filtered.length > PAGE_SIZE && (
        <section className="w-full bg-[#1F1F21] py-8 md:py-10 px-4 sm:px-6 md:px-12">
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/60 text-sm">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 border flex items-center justify-center text-sm transition-colors ${
                    page === i + 1 ? 'border-white/40 text-white bg-white/10' : 'border-white/20 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore The Catalog */}
      <section className="w-full bg-[#1F1F21] py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <h2 className="text-2xl md:text-4xl font-light text-white tracking-wide font-outfit">Explore The catalog</h2>
          <button className="flex items-center gap-2 md:gap-3 text-white border border-white/30 px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm hover:bg-white hover:text-black transition-colors">
            <span>Download</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      className={`w-full text-left px-4 py-3 text-base md:text-lg transition-colors ${
        active ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

export default Product;
