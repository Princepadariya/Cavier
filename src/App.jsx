import React from 'react';
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

function App() {
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
