import React, { useState, useEffect, useRef } from 'react';
import slide1 from '../assets/01.png';
import slide2 from '../assets/02.png';
import slide3 from '../assets/03.png';

interface SlideData {
  id: number;
  image: string;
  category: string;
  title: string;
  highlightText: string;
  subtitle: string;
  specChips: string[];
}

const slides: SlideData[] = [
  {
    id: 1,
    image: slide1,
    category: 'BRUTAL AGE WAR ACCOUNTS',
    title: 'TOP ACCOUNTS | VERIFIED OWNERS',
    highlightText: 'TOP LEADING SELLER | 11+ YEARS OF GAME EXPERIENCE | 6+ YEARS OF MARKET EXPERIENCE',
    subtitle: 'Admin-inspected Brutal Age war account ready for immediate kingdom handover. Reply within 24hr.',
    specChips: ['TOP ACCOUNTS', 'VERIFIED OWNERS', 'RELOCATION TICKETS', 'LEADERSHIP ACCOUNTS'],
  },
  {
    id: 2,
    image: slide2,
    category: 'BRUTAL AGE KINGDOM LORDS',
    title: 'POWERFUL ACCOUNTS & LEGENDARY PARTNER SET',
    highlightText: 'TOP ACCOUNTS | VERIFIED OWNERS',
    subtitle: 'POWERFUL ACCOUNTS with LEGENDARY PARTNER SET, resource service & clan coin service available.',
    specChips: ['POWERFUL ACCOUNTS', 'VERIFIED OWNERS', 'LEGENDARY PARTNER SET', 'DIRECT TRANSFER'],
  },
  {
    id: 3,
    image: slide3,
    category: 'BRUTAL AGE COMMUNITY TRUST',
    title: 'TRUSTED & LOVED BY COMMUNITY',
    highlightText: 'TOP LEADING SELLER | 11+ YEARS OF GAME EXPERIENCE | 6+ YEARS OF MARKET EXPERIENCE',
    subtitle: 'Strong alliance war account with account/partner service and high defense research.',
    specChips: ['TRUSTED BY COMMUNITY', 'POWERFUL ACCOUNTS', 'VERIFIED OWNERS', 'DIRECT ACCESS'],
  },
];

export const AutoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (!isHovered) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
      }, 4000);
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="w-full relative h-[320px] sm:h-[480px] md:h-[560px] lg:h-[620px] bg-slate-950 overflow-hidden border-b border-slate-300 group font-heading"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress Bar */}
      {!isHovered && (
        <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-slate-800">
          <div key={currentIndex} className="h-full bg-indigo-500 animate-progress" />
        </div>
      )}

      {/* Slide Items */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1]"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Centered Content Container */}
          <div className="absolute inset-0 flex flex-col justify-end z-20">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
              
              <span className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2 font-heading">
                {slide.category}
              </span>

              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-heading mb-2 max-w-4xl uppercase">
                {slide.title}
              </h2>

              <p className="text-emerald-400 text-xs sm:text-base font-bold uppercase tracking-wide mb-3 font-heading">
                ✓ {slide.highlightText}
              </p>

              <p className="hidden sm:block text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl line-clamp-2 mb-6 font-medium">
                {slide.subtitle}
              </p>

              {/* Spec Chips */}
              <div className="hidden sm:flex flex-wrap items-center gap-2 mb-6">
                {slide.specChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-bold uppercase"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div>
                <a
                  href="#listings"
                  className="btn-indigo inline-block px-5 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
                >
                  Browse Listings & Services
                </a>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 px-3.5 py-2.5 bg-slate-950/80 text-white text-xs font-bold border border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-950"
      >
        PREV
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 px-3.5 py-2.5 bg-slate-950/80 text-white text-xs font-bold border border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-950"
      >
        NEXT
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 right-6 lg:right-12 z-30 px-3 py-1 bg-slate-950/80 text-white text-xs font-bold border border-slate-800 font-mono-num">
        0{currentIndex + 1} / 0{slides.length}
      </div>

    </div>
  );
};
