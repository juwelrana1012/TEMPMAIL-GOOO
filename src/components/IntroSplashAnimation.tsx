import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface IntroSplashAnimationProps {
  onComplete: () => void;
}

// Social icon types
type SocialType = 'instagram' | 'tiktok' | 'facebook';

interface MiniLogo {
  id: number;
  type: SocialType;
  row: number;
  col: number;
  scatterX: number;
  scatterY: number;
  scatterRotate: number;
  delay: number;
}

// The words to rise up one by one
const WORDS = [
  { text: 'TempMail', color: '#1870E9' },
  { text: '.Go', color: '#6865E3' },
];

export const IntroSplashAnimation: React.FC<IntroSplashAnimationProps> = ({ onComplete }) => {
  // Phase sequence:
  // 1. 'covered': Image appears, completely hidden beneath dense mini social media logos
  // 2. 'scattering': The small logos smoothly float and disperse outward in all directions, revealing the image
  // 3. 'imageRevealed': The image is clearly and majestically visible
  // 4. 'words': The words rise up one by one, bold with no borders, strictly on a single line
  const [phase, setPhase] = useState<'covered' | 'scattering' | 'imageRevealed' | 'words'>('covered');
  const [visibleWordIndex, setVisibleWordIndex] = useState<number>(-1);
  const [showWhiteBorder, setShowWhiteBorder] = useState<boolean>(false);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  // Generate a dense, aesthetic 5x5 grid of small Instagram, TikTok, and Facebook logos
  const miniLogos = useMemo<MiniLogo[]>(() => {
    const list: MiniLogo[] = [];
    const types: SocialType[] = ['instagram', 'tiktok', 'facebook'];
    let id = 0;
    const rows = 5;
    const cols = 5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Deterministic outward radial scatter vector from center
        const centerX = (cols - 1) / 2;
        const centerY = (rows - 1) / 2;
        const dx = c - centerX;
        const dy = r - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.8;
        const angle = Math.atan2(dy, dx);

        // Scatter distance between 140px and 260px in varied directions
        const scatterDist = 150 + (id % 5) * 22;
        const scatterX = Math.cos(angle) * scatterDist + (Math.sin(id) * 30);
        const scatterY = Math.sin(angle) * scatterDist + (Math.cos(id) * 30);
        const scatterRotate = (dx >= 0 ? 1 : -1) * (30 + (id % 4) * 25);
        const delay = 0.04 * (r + c);

        list.push({
          id: id++,
          type: types[(r * cols + c) % types.length],
          row: r,
          col: c,
          scatterX,
          scatterY,
          scatterRotate,
          delay,
        });
      }
    }
    return list;
  }, []);

  // Animation timeline coordinator
  useEffect(() => {
    // 1. At 650ms: Small logos smoothly begin drifting and scattering away
    const scatterTimer = setTimeout(() => {
      setPhase('scattering');
      try {
        sounds.playCoverBurst();
      } catch {}
    }, 700);

    // 2. At 1550ms: Logos have dispersed, image is clearly revealed
    const revealTimer = setTimeout(() => {
      setPhase('imageRevealed');
    }, 1550);

    // 3. At 2300ms: Image smoothly transitions to words rising up
    const wordsTimer = setTimeout(() => {
      setPhase('words');
    }, 2350);

    return () => {
      clearTimeout(scatterTimer);
      clearTimeout(revealTimer);
      clearTimeout(wordsTimer);
    };
  }, []);

  // Sequence words rising up one by one
  useEffect(() => {
    if (phase !== 'words') return;

    // Word 1 ("Tempmail") rises up
    const w1 = setTimeout(() => {
      setVisibleWordIndex(0);
      try {
        sounds.playWordRise(0);
      } catch {}
    }, 150);

    // Word 2 (".Go") rises up right next to it on the same line
    const w2 = setTimeout(() => {
      setVisibleWordIndex(1);
      try {
        sounds.playWordRise(1);
      } catch {}
    }, 450);

    // Clean white border frame appears around the words
    const borderTimer = setTimeout(() => {
      setShowWhiteBorder(true);
      try {
        sounds.playIntroEnter();
      } catch {}
    }, 750);

    // Complete intro and transition into the website
    const finishTimer = setTimeout(() => {
      handleFinish();
    }, 1600);

    return () => {
      clearTimeout(w1);
      clearTimeout(w2);
      clearTimeout(borderTimer);
      clearTimeout(finishTimer);
    };
  }, [phase]);

  const handleFinish = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 380);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isDismissing ? 0 : 1 }}
      transition={{ duration: 0.38, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white select-none overflow-hidden"
    >
      {/* Clean top-right skip button */}
      <button
        type="button"
        onClick={handleFinish}
        aria-label="Skip Intro"
        className="absolute top-5 right-5 z-50 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors shadow-xs active:scale-95 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main presentation canvas */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* PHASES 1, 2 & 3: THE IMAGE COVERED BY SMALL LOGOS -> SCATTERS OUTWARD    */}
          {/* ========================================================================= */}
          {(phase === 'covered' || phase === 'scattering' || phase === 'imageRevealed') && (
            <motion.div
              key="image-stage"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.08,
                y: -18,
                transition: { duration: 0.35, ease: 'easeInOut' },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Image Container Card */}
              <div className="relative p-4 sm:p-5 rounded-3xl bg-white shadow-2xl shadow-blue-500/10 border border-slate-100">
                {/* User's Original Logo Image */}
                <img
                  src="/app-logo-new.png"
                  alt="TempMail.Go Logo"
                  referrerPolicy="no-referrer"
                  className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedDirect) {
                      target.dataset.triedDirect = 'true';
                      target.src = 'https://i.ibb.co.com/ccj5C6RL/file-000000005d1c8243b129c010c75e8a65.png';
                    }
                  }}
                />

                {/* ========================================================================= */}
                {/* DENSE MESH OF SMALL LOGOS COMPLETELY COVERING THE IMAGE                  */}
                {/* When 'covered': completely blocks the image with small Instagram,        */}
                {/* TikTok, and Facebook logos.                                               */}
                {/* When 'scattering': each small logo smoothly floats away in its direction */}
                {/* ========================================================================= */}
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl overflow-visible pointer-events-none">
                  {/* Clean white veil beneath the logos so the image is 100% hidden initially */}
                  <motion.div
                    animate={{
                      opacity: phase === 'covered' ? 0.98 : 0,
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-3xl bg-white backdrop-blur-xs"
                  />

                  {/* 5x5 Grid of Small Logos Covering the Image Surface */}
                  <div className="absolute inset-2 sm:inset-3 grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2">
                    {miniLogos.map((logo) => {
                      const isScattering = phase === 'scattering' || phase === 'imageRevealed';

                      return (
                        <div
                          key={`mini-logo-${logo.id}`}
                          className="flex items-center justify-center relative"
                        >
                          <motion.div
                            initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                            animate={
                              isScattering
                                ? {
                                    x: logo.scatterX,
                                    y: logo.scatterY,
                                    scale: 0.15,
                                    rotate: logo.scatterRotate,
                                    opacity: 0,
                                  }
                                : {
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                    rotate: 0,
                                    opacity: 1,
                                  }
                            }
                            transition={{
                              duration: 0.85,
                              delay: isScattering ? logo.delay : 0,
                              ease: [0.22, 1, 0.36, 1], // Ultra-smooth cubic bezier drift
                            }}
                            className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md select-none transform-gpu"
                          >
                            {/* 1. Mini Instagram Logo */}
                            {logo.type === 'instagram' && (
                              <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] flex items-center justify-center text-white shadow-xs">
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                              </div>
                            )}

                            {/* 2. Mini Facebook Logo */}
                            {logo.type === 'facebook' && (
                              <div className="w-full h-full rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs">
                                <span className="font-sans font-black text-sm sm:text-base leading-none">
                                  f
                                </span>
                              </div>
                            )}

                            {/* 3. Mini TikTok Logo */}
                            {logo.type === 'tiktok' && (
                              <div className="w-full h-full rounded-xl sm:rounded-2xl bg-black flex items-center justify-center text-white border border-slate-800 shadow-xs">
                                <svg
                                  className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.883 2.896 2.896 0 0 1-2.888-2.883 2.896 2.896 0 0 1 2.888-2.883c.277 0 .543.037.795.105V9.412a6.34 6.34 0 0 0-.795-.05c-3.528 0-6.388 2.85-6.388 6.366 0 3.515 2.86 6.365 6.388 6.365 3.527 0 6.387-2.85 6.387-6.365V8.82a8.17 8.17 0 0 0 4.717 1.488V6.863a4.77 4.77 0 0 1-1.002-.177Z" />
                                </svg>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* PHASE 4: WORDS RISING UP ONE BY ONE (NO BORDER, EXTRA BOLD, SINGLE LINE) */}
          {/* White border frame displayed around the words at the final phase         */}
          {/* ========================================================================= */}
          {phase === 'words' && (
            <motion.div
              key="words-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Outer container with the requested clean white border framing the words */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  borderColor: showWhiteBorder ? '#FFFFFF' : 'transparent',
                }}
                transition={{ duration: 0.45 }}
                className={`
                  relative flex items-center justify-center
                  px-6 py-4 sm:px-10 sm:py-6 md:px-12 md:py-8
                  rounded-3xl sm:rounded-4xl
                  border-[3px] sm:border-[4px]
                  ${showWhiteBorder ? 'border-white bg-white shadow-2xl shadow-slate-200/90' : 'border-transparent bg-transparent'}
                  transition-all duration-500
                `}
              >
                {/* Single-line Word Row: Strictly NO wrapping, NO extra lines, NO border around words */}
                <div className="flex flex-row flex-nowrap items-baseline justify-center whitespace-nowrap overflow-visible">
                  {WORDS.map((word, idx) => {
                    const isVisible = idx <= visibleWordIndex;

                    return (
                      <div
                        key={`word-${idx}`}
                        className="relative inline-flex items-baseline overflow-visible"
                      >
                        <AnimatePresence>
                          {isVisible && (
                            <motion.span
                              initial={{
                                opacity: 0,
                                y: 55, // Smoothly rises up from bottom to top
                                scale: 0.88,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                              }}
                              transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 24,
                                mass: 0.7,
                              }}
                              style={{ color: word.color }}
                              className={`
                                border-none outline-none ring-0
                                font-sans font-black tracking-tight select-none
                                text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none
                                ${idx > 0 ? 'ml-0.5 sm:ml-1' : ''}
                              `}
                            >
                              {word.text}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
