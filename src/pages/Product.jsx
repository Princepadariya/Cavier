import React from 'react';
import { Link } from 'react-router-dom';

const Product = () => {
  const products = [
    { id: 1, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, image: '/images/productt.png' },
    { id: 2, name: 'SO 04 102 | Bib Cock with Wall Flange', price: 1540, image: '/images/productt_2.png' },
    { id: 3, name: 'SO 04 103 | Angle Valve', price: 1200, image: '/images/productt_3.png' },
    { id: 4, name: 'SO 04 104 | Long Body Bib Cock', price: 1850, image: '/images/productt_4.png' },
    { id: 5, name: 'SO 04 105 | Concealed Stop Cock', price: 2100, image: '/images/productt_5.png' },
    { id: 6, name: 'SO 04 106 | Sink Mixer with Swinging Spout', price: 4250, image: '/images/productt_6.png' },
    { id: 7, name: 'SO 04 101 | Pillar Cock with Base', price: 1930, image: '/images/productt.png' },
    { id: 8, name: 'SO 04 102 | Bib Cock with Wall Flange', price: 1540, image: '/images/productt_2.png' },
    { id: 9, name: 'SO 04 103 | Angle Valve', price: 1200, image: '/images/productt_3.png' },
    { id: 10, name: 'SO 04 104 | Long Body Bib Cock', price: 1850, image: '/images/productt_4.png' },
    { id: 11, name: 'SO 04 105 | Concealed Stop Cock', price: 2100, image: '/images/productt_5.png' },
    { id: 12, name: 'SO 04 106 | Sink Mixer with Swinging Spout', price: 4250, image: '/images/productt_6.png' },
  ];

  return (
    <div className="w-full bg-[#1F1F21] min-h-screen overflow-hidden">

      {/* Hero Section - Full Screen Product Showcase */}
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
        <div className="flex items-center justify-between gap-3 sm:gap-6 py-5 overflow-x-auto no-scrollbar">
          {['Price', 'Color Finishes', 'Category', 'Shape'].map((filter) => (
            <button key={filter} className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm font-medium whitespace-nowrap hover:text-white/70 transition-colors">
              <span>{filter}</span>
              <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>
        <div className="w-full h-[1px] bg-white/10" />
      </section>

      {/* Product Grid */}
      <section className="w-full bg-[#1F1F21] py-6 md:py-8 px-4 sm:px-6 md:px-12 lg:px-32">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-14 sm:gap-y-20">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col group cursor-pointer">
              {/* Image Box */}
              <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                              mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                              transition-all duration-300
                              group-hover:border-[#FFFFFF]
                              group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <Link to={`/product/${product.id}`} className="block w-full h-full relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08]"
                  />
                </Link>
              </div>

              {/* Details */}
              <div className="flex flex-col items-center text-center px-1">
                <h3 className="font-outfit text-white text-sm sm:text-base md:text-lg tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                  {product.name}
                </h3>
                <p className="font-text text-white text-base sm:text-lg font-normal tracking-widest">
                  INR {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <section className="w-full bg-[#1F1F21] py-8 md:py-10 px-4 sm:px-6 md:px-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/60 text-sm">Page 1 of 6</p>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 border border-white/40 flex items-center justify-center text-white text-sm bg-white/10">1</span>
            <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 text-sm hover:bg-white/10 cursor-pointer transition-colors">2</span>
            <span className="text-white/40 text-sm px-1">...</span>
            <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/60 text-sm hover:bg-white/10 cursor-pointer transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </div>
        </div>
      </section>

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

export default Product;
