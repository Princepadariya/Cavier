import React from 'react';
import { ChevronRight } from 'lucide-react';

const products = [
  { id: 1, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/bathroom%20Accessories.png' },
  { id: 2, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/bathroom%20Accessories_2.png' },
  { id: 3, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/bathroom%20Accessories_3.png' },
  { id: 4, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/bathroom%20Accessories_4.png' },
];

const BathroomAccessories = () => {
  return (
    <section className="w-full bg-[#1F1F21] pt-0 pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-32">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Section Title */}
        <h2 className="accessory-title text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-8 md:mb-12">
          Bathroom Accessories
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="accessory-card flex flex-col group cursor-pointer"
            >
              {/* Image Box — image only */}
              <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                              mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                              transition-all duration-300
                              group-hover:border-[#FFFFFF]
                              group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <div
                  className="accessory-image w-full h-full bg-contain bg-center bg-no-repeat transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08] will-change-transform"
                  style={{ backgroundImage: `url(${product.img})` }}
                />
              </div>

              {/* Details */}
              <div className="flex flex-col items-center text-center px-1">
                <h3 className="font-outfit text-gray-300 text-[10px] sm:text-xs md:text-sm tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                  {product.title}
                </h3>
                <p className="font-outfit text-white text-xs sm:text-sm font-semibold tracking-widest">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="w-full flex justify-center mt-12 md:mt-14">
          <button
            className="accessory-view-btn flex items-center gap-3 px-5 py-3 border border-white
                       text-white text-sm
                       hover:bg-white hover:text-black transition-all duration-300"
          >
            View More
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BathroomAccessories;
