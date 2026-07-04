import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollLine from './components/ScrollLine';
import CustomCursor from './components/CustomCursor';

import Home from './pages/Home';
import About from './pages/About';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Dealership from './pages/Dealership';
import Blog from './pages/Blog';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const isContactOrAbout = location.pathname === '/contact';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      wheelMultiplier: 0.6,
      infinite: false,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      // Dispatch custom event so ScrollLine can track progress
      window.dispatchEvent(new CustomEvent('lenis-scroll', {
        detail: {
          scroll: e.scroll,
          limit: e.limit,
          velocity: e.velocity,
          direction: e.direction,
          progress: e.progress,
        },
      }));
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <div className="film-grain" />
      <CustomCursor />
      <ScrollLine />
      <Navbar variant={isContactOrAbout ? 'contact' : 'default'} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dealership" element={<Dealership />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
      {/* We only render Footer here. If certain pages shouldn't have it, we could conditionally hide it. */}
      {location.pathname !== '/checkout' && <Footer key={location.pathname} variant={(['/about', '/dealership', '/contact', '/blog'].includes(location.pathname) || location.pathname.startsWith('/product')) ? 'light' : 'dark'} />}
    </div>
  );
}

export default App;
