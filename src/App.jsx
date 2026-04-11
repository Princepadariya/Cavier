import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Categories from './components/Categories';
import FinishingTouch from './components/FinishingTouch';
import Products from './components/Products';
import Banner from './components/Banner';
import Insights from './components/Insights';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Ultra-cinematic, buttery smooth Lenis configuration
    // Increased duration and modified easing for a high-end, heavy scroll feel
    const lenis = new Lenis({
      duration: 3.5, // Much slower and more deliberate
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      wheelMultiplier: 0.6, // Slower map to mouse wheel
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

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
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Categories />
      <FinishingTouch />
      <Products />
      <Banner />
      <Insights />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
