import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

// 7 images total (5 original + 2 new)
const collections = [
  { id: 1, title: 'Premium',            img: '/img1.png' },
  { id: 2, title: 'Intermediate',       img: '/img2.png' },
  { id: 3, title: 'Allied & Concealed', img: '/img3.png' },
  { id: 4, title: 'Golden Elegance',    img: '/img4.png' },
  { id: 5, title: 'Vintage Copper',     img: '/img5.png' },
  { id: 6, title: 'Minimalist White',   img: '/img6.png' },
  { id: 7, title: 'Luxury Suite',       img: '/banner_bg.png' },
];

// ─── Layout constants ────────────────────────────────────────────
const TEXT_BLOCK_W = 420;   // px — width of the left text column
const TEXT_GAP     = 80;    // px — clear gap between text and first card
const CARD_W       = 320;   // px — card width
const CARD_GAP     = 32;    // px — gap between cards

const CARD_STEP    = CARD_W + CARD_GAP;

// Initially visible cards = those that fit after the text block
// Screen ~ 1440px, text+gap = 500px → remaining ≈ 940px → ~2-3 visible cards
// We show first 3 cards fully, rest scroll in (7 - 3 = 4 hidden)
const HIDDEN_CARDS = 4;
const TOTAL_TRANSLATE = HIDDEN_CARDS * CARD_STEP; // 1408 px

// Track starts at this left offset so first card is always clear of text
const TRACK_START = TEXT_BLOCK_W + TEXT_GAP;

const FinishingTouch = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Scroll down → images move LEFT (negative X)
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -TOTAL_TRANSLATE]);
  const x    = useSpring(xRaw, { stiffness: 50, damping: 18, mass: 1 });

  return (
    <>
      {/* ──────────── DESKTOP ──────────── */}
      <section
        ref={sectionRef}
        className="hidden md:block relative bg-[#1a1a1a]"
        style={{ height: `calc(100vh + ${TOTAL_TRANSLATE * 1.8}px)` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">

          {/* ── LEFT: Text block — fixed, behind images ── */}
          <div
            className="absolute left-0 top-0 h-full z-10 flex flex-col justify-center pointer-events-none flex-shrink-0"
            style={{ width: TEXT_BLOCK_W, paddingLeft: 64 }}
          >
            <motion.div
              className="pointer-events-auto"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-5 leading-tight tracking-tight">
                The Finishing<br />Touch
              </h2>
              <p className="text-[#888] text-sm lg:text-base leading-relaxed mb-10 font-light pr-8">
                Precision lies in every detail. Explore our curated bath collections
                designed to enhance modern living with style, performance, and lasting quality.
              </p>
              <button className="flex items-center gap-3 px-7 py-3 border border-white/40
                                 text-white text-sm tracking-widest hover:bg-white hover:text-black
                                 transition-all duration-300">
                View More <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Clip container — starts exactly at TRACK_START.
               overflow-hidden ensures images that scroll leftward are
               clipped at this boundary and NEVER appear over the text.
          ── */}
          <div
            className="absolute top-0 h-full z-10"
            style={{
              left: TRACK_START,
              right: 0,
              overflow: 'hidden',
            }}
          >
            {/* Inner scrolling track — x translation happens here */}
            <motion.div
              className="h-full flex items-center"
              style={{
                x,
                gap: CARD_GAP,
                display: 'flex',
                paddingRight: 80,
              }}
            >
              {collections.map((item) => (
                <div
                  key={item.id}
                  className="group flex-shrink-0 cursor-pointer flex flex-col"
                  style={{ width: CARD_W }}
                >
                  {/* Image */}
                  <div
                    className="overflow-hidden bg-[#111] shadow-2xl
                                group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)]
                                transition-shadow duration-700"
                    style={{ width: CARD_W, height: Math.round(CARD_W * 1.35) }}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center
                                  transition-transform duration-700 ease-out
                                  group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.img})` }}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex justify-between items-center text-white mt-5 px-1">
                    <span className="text-lg font-light tracking-wide">{item.title}</span>
                    <ArrowUpRight
                      size={20}
                      className="text-white/40 -translate-x-3 opacity-0
                                 group-hover:opacity-100 group-hover:translate-x-0
                                 group-hover:text-white transition-all duration-300"
                    />
                  </div>

                  {/* Underline */}
                  <div className="w-full h-px bg-white/10 mt-4 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-0 bg-white
                                    group-hover:w-full transition-all duration-700 ease-out" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* ──────────── MOBILE ──────────── */}
      <section className="md:hidden bg-[#1a1a1a] py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-14"
        >
          <h2 className="text-3xl font-semibold text-white mb-5 leading-tight">
            The Finishing Touch
          </h2>
          <p className="text-[#888] text-sm leading-relaxed mb-8">
            Precision lies in every detail. Explore our curated bath collections
            designed to enhance modern living with style, performance, and lasting quality.
          </p>
          <button className="flex items-center gap-3 px-6 py-3 border border-white/40 text-white text-sm">
            View More <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="flex flex-col gap-10">
          {collections.map((item, idx) => (
            <motion.div
              key={item.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.08 }}
            >
              <div className="w-full aspect-[4/5] overflow-hidden bg-[#111] mb-4">
                <div
                  className="w-full h-full bg-cover bg-center
                              transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="text-lg font-light">{item.title}</span>
                <ArrowUpRight size={18} className="text-white/60" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FinishingTouch;
