import React, { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FinishingTouch from '../components/FinishingTouch';
import HealthFaucets from '../components/HealthFaucets';
import OpalPrime from '../components/OpalPrime';
import BathroomAccessories from '../components/BathroomAccessories';
import Products from '../components/Products';

import Banner from '../components/Banner';
import Insights from '../components/Insights';
import Testimonials from '../components/Testimonials';
import Preloader from '../components/Preloader';

const Home = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#1F1F21] w-full overflow-x-clip">
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <Hero />
      <About />
      <Features />
      <Categories />
      <FinishingTouch />
      <HealthFaucets />
      <OpalPrime />
      <BathroomAccessories />
      <Banner />
      <Insights />
      <Testimonials />
    </div>
  );
};

export default Home;
