import React, { useEffect, useRef } from 'react';
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
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Dealership from './pages/Dealership';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

import AdminApp from './admin/AdminApp';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isContactOrAbout = location.pathname === '/contact';
  const lenisRef = useRef(null);

  useEffect(() => {
    // The admin panel is a plain document — no smooth-scroll hijacking.
    if (isAdmin) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });
    lenisRef.current = lenis;

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
      lenisRef.current = null;
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [isAdmin]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Admin panel: its own routes, no marketing chrome (navbar/footer/cursor).
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

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
        <Route path="/category" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dealership" element={<Dealership />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
      {/* We only render Footer here. If certain pages shouldn't have it, we could conditionally hide it. */}
      <Footer key={location.pathname} variant={(['/', '/about', '/dealership', '/contact'].includes(location.pathname) || location.pathname.startsWith('/product') || location.pathname.startsWith('/category') || location.pathname.startsWith('/blog')) ? 'light' : 'dark'} />
    </div>
  );
}

export default App;
