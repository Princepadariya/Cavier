import React from 'react';
import { Heart, ShoppingCart, Star, ChevronRight } from 'lucide-react';

const cockProducts = [
  { id: 1, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/product1.png' },
  { id: 2, title: 'SO 04 102 | Extended Basin Mixer',  price: 'INR 2450', img: '/images/product2.png' },
  { id: 3, title: 'SO 04 103 | Minimalist Spout',      price: 'INR 1600', img: '/images/product3.png' },
  { id: 4, title: 'SO 04 104 | Angular Bath Mixer',    price: 'INR 3120', img: '/images/product4.png' },
];

const accessoryProducts = [
  { id: 1, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/images/product1.png' },
  { id: 2, title: 'SO 04 102 | Extended Basin Mixer',  price: 'INR 2450', img: '/images/product2.png' },
  { id: 3, title: 'SO 04 103 | Minimalist Spout',      price: 'INR 1600', img: '/images/product3.png' },
  { id: 4, title: 'SO 04 104 | Angular Bath Mixer',    price: 'INR 3120', img: '/images/product4.png' },
];

const ProductGrid = ({ title, products, gridIndex }) => {
  return (
    <div className="mb-24 last:mb-0">
      {/* Section Title */}
      <h2 className="product-title text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-medium text-white tracking-wide mb-8 md:mb-10">
        {title}
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card flex flex-col group cursor-pointer"
          >
            {/* Image Box */}
            <div className="relative w-full aspect-square bg-[#111] rounded-2xl border border-white/10
                            mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-4 sm:p-8
                            transition-all duration-300
                            group-hover:border-white/25
                            group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
              <div
                className="product-image w-full h-full bg-contain bg-center bg-no-repeat transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.15] will-change-transform"
                style={{ backgroundImage: `url(${product.img})` }}
              />
              {/* Wishlist */}
              <button className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors duration-200">
                <Heart size={17} strokeWidth={1.5} />
              </button>
            </div>

            {/* Details */}
            <div className="flex flex-col items-center text-center px-1">
              <h3 className="font-outfit text-gray-300 text-[10px] sm:text-xs md:text-sm tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                {product.title}
              </h3>
              <p className="font-outfit text-white text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 tracking-widest">
                {product.price}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-[2px] sm:gap-[3px] mb-3 sm:mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={8} fill="white" className="text-white sm:w-[9px] sm:h-[9px]" />
                ))}
              </div>

              {/* Add to Cart */}
              <button
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5
                           rounded-full border border-white/25 text-white/80 text-[9px] sm:text-[11px]
                           tracking-wider sm:tracking-widest uppercase hover:bg-white hover:text-black
                           hover:border-white transition-all duration-300"
              >
                <ShoppingCart size={10} className="sm:w-3 sm:h-3" />
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More - only show after first grid */}
      {gridIndex === 0 && (
         <div className="w-full flex justify-center mt-14">
            <button
            className="view-more-btn flex items-center gap-3 px-8 py-3 border border-white/40
                        text-white text-xs tracking-[0.2em] uppercase
                        hover:bg-white hover:text-black transition-all duration-300"
            >
            View More
            <ChevronRight size={15} />
            </button>
        </div>
      )}
    </div>
  );
};


const Products = () => {
  return (
    <section className="w-full bg-[#181818] pt-8 md:pt-12 pb-16 md:pb-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <ProductGrid title="Cavier Sink Mixers" products={cockProducts} gridIndex={0} />
        <ProductGrid title="Bathroom Accessories" products={accessoryProducts} gridIndex={1} />
      </div>
    </section>
  );
};

export default Products;
