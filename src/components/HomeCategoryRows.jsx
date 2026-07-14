import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categoriesApi, productsApi } from '../lib/api';

const formatINR = (n) => `INR ${Number(n).toLocaleString('en-IN')}`;

function CategoryRow({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;
    productsApi
      .list({ activeOnly: true, categoryId: category.id, limit: 4 })
      .then((data) => alive && setProducts(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [category.id]);

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-[#1F1F21] pt-0 pb-16 md:pb-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-white tracking-wide mb-8 md:mb-12">
          {category.name}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link
              to={`/product/${product.slug}`}
              key={product.id}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] bg-[#1F1F21] rounded-2xl border border-[#FFFFFF]
                              mb-4 sm:mb-5 overflow-hidden flex items-center justify-center p-6 sm:p-10
                              transition-all duration-300
                              group-hover:border-[#FFFFFF]
                              group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08] will-change-transform"
                  style={{ backgroundImage: `url(${product.main_image || ''})` }}
                />
              </div>

              <div className="flex flex-col items-center text-center px-1">
                <h3 className="font-outfit text-gray-300 text-[10px] sm:text-xs md:text-sm tracking-wide font-light mb-1.5 sm:mb-2 line-clamp-1 w-full">
                  {product.name}
                </h3>
                <p className="font-outfit text-white text-xs sm:text-sm font-semibold tracking-widest">
                  {formatINR(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="w-full flex justify-center mt-12 md:mt-14">
          <Link
            to={`/product?category=${category.slug}`}
            className="flex items-center gap-3 px-5 py-3 border border-white text-white text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            View More
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const HomeCategoryRows = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesApi
      .homeFeatured()
      .then(setCategories)
      .catch(() => {});
  }, []);

  return (
    <>
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </>
  );
};

export default HomeCategoryRows;
