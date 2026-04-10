import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, ChevronRight } from 'lucide-react';

const cockProducts = [
  { id: 1, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/product1.png' },
  { id: 2, title: 'SO 04 102 | Extended Basin Mixer',  price: 'INR 2450', img: '/product2.png' },
  { id: 3, title: 'SO 04 103 | Minimalist Spout',      price: 'INR 1600', img: '/product3.png' },
  { id: 4, title: 'SO 04 104 | Angular Bath Mixer',    price: 'INR 3120', img: '/product4.png' },
];

const accessoryProducts = [
  { id: 1, title: 'SO 04 101 | Pillar Cock with Base', price: 'INR 1930', img: '/product1.png' },
  { id: 2, title: 'SO 04 102 | Extended Basin Mixer',  price: 'INR 2450', img: '/product2.png' },
  { id: 3, title: 'SO 04 103 | Minimalist Spout',      price: 'INR 1600', img: '/product3.png' },
  { id: 4, title: 'SO 04 104 | Angular Bath Mixer',    price: 'INR 3120', img: '/product4.png' },
];

const ProductGrid = ({ title, products, sectionDelay = 0 }) => (
  <div className="mb-24 last:mb-0">
    {/* Section Title */}
    <motion.h2
      className="text-2xl md:text-3xl lg:text-[2rem] font-medium text-white tracking-wide mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: sectionDelay, ease: 'easeOut' }}
    >
      {title}
    </motion.h2>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="flex flex-col group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, delay: sectionDelay + index * 0.12, ease: 'easeOut' }}
        >
          {/* Image Box */}
          <div className="relative w-full aspect-square bg-[#111] rounded-2xl border border-white/10
                          mb-5 overflow-hidden flex items-center justify-center p-8
                          transition-all duration-300
                          group-hover:border-white/25
                          group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
            <div
              className="w-full h-full bg-contain bg-center bg-no-repeat
                          transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${product.img})` }}
            />
            {/* Wishlist */}
            <button className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors duration-200">
              <Heart size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-col items-center text-center px-1">
            <h3 className="text-gray-300 text-xs md:text-sm tracking-wide font-light mb-2 line-clamp-1 w-full">
              {product.title}
            </h3>
            <p className="text-white text-sm font-semibold mb-2 tracking-widest">
              {product.price}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-[3px] mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={9} fill="white" className="text-white" />
              ))}
            </div>

            {/* Add to Cart */}
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5
                         rounded-full border border-white/25 text-white/80 text-[11px]
                         tracking-widest uppercase hover:bg-white hover:text-black
                         hover:border-white transition-all duration-300"
            >
              <ShoppingCart size={12} />
              Add to cart
            </button>
          </div>
        </motion.div>
      ))}
    </div>

    {/* View More */}
    <motion.div
      className="w-full flex justify-center mt-14"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: sectionDelay + 0.6, ease: 'easeOut' }}
    >
      <button
        className="flex items-center gap-3 px-8 py-3 border border-white/40
                   text-white text-xs tracking-[0.2em] uppercase
                   hover:bg-white hover:text-black transition-all duration-300"
      >
        View More
        <ChevronRight size={15} />
      </button>
    </motion.div>
  </div>
);


const Products = () => {
  return (
    <section className="w-full bg-[#181818] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <ProductGrid title="Cavier Sink Mixers"     products={cockProducts}      sectionDelay={0}   />
        <ProductGrid title="Bathroom Accessories"  products={accessoryProducts} sectionDelay={0.1} />
      </div>
    </section>
  );
};

export default Products;
