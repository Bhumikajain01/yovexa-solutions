import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { contentService } from '../services/contentService';

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    contentService.getHeroContent().then(data => {
      if (isMounted) {
        setHero(data || null);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Failed to load active hero:', err);
      if (isMounted) {
        setHero(null);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <section
        id="hero"
        className="relative min-h-[520px] pt-32 pb-20 md:pt-40 md:pb-28 flex items-center bg-[#F8FAFC] overflow-hidden text-[#0B1B3A] tech-grid-bg border-b border-[#E2E8F0]"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-pulse">
          <div className="max-w-4xl space-y-6">
            <div className="w-48 h-8 rounded-full bg-slate-200" />
            <div className="w-3/4 h-14 rounded-xl bg-slate-200" />
            <div className="w-full h-24 rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (hero?.isVisible === false) return null;

  const hasContent = hero && (hero.heading || hero.headline);
  const badge = hero?.badge || hero?.eyebrow;
  const heading = hero?.heading || hero?.headline;
  const highlight = hero?.highlightedText || hero?.highlightedHeadline;
  const description = hero?.description;

  return (
    <section
      id="hero"
      className="relative min-h-[480px] pt-32 pb-20 md:pt-40 md:pb-28 flex items-center bg-[#F8FAFC] overflow-hidden text-[#0B1B3A] tech-grid-bg border-b border-[#E2E8F0]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-5 w-[350px] h-[350px] bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Geometry Accent Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 200L400 500L800 200L1200 500L1440 320" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M200 900L600 600L1000 900L1440 570" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.3" />
          <circle cx="400" cy="500" r="4" fill="#0284C7" />
          <circle cx="800" cy="200" r="4" fill="#0284C7" />
          <circle cx="1200" cy="500" r="4" fill="#0284C7" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {hasContent ? (
          /* Hero Content: Headline & Value Proposition when backend data exists */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl flex flex-col items-start text-left"
          >
            {/* Startup Pill Tag */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{badge}</span>
              </div>
            )}

            {/* Main Headline */}
            {heading && (
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14] text-[#0B1B3A]">
                {heading}{' '}
                {highlight && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0284C7]">
                    {highlight}
                  </span>
                )}
              </h1>
            )}

            {/* High Contrast Supporting Headline */}
            {description && (
              <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#334155] max-w-3xl leading-relaxed font-normal">
                {description}
              </p>
            )}

            {/* Direct CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{hero?.primaryCtaText || hero?.primaryCtaLabel || "Start Your Project"}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[#0B1B3A] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] transition-all"
              >
                <span>{hero?.secondaryCtaText || hero?.secondaryCtaLabel || "Explore Services"}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Clean empty state with section badge and CTA buttons when backend data is pending */
          <div className="max-w-4xl py-12 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>HOME</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14] text-[#0B1B3A]">
              Welcome to <span className="text-[#0284C7]">Yovexa Solutions</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#64748B]">
              No hero content published at the moment.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#0EA5E9] hover:bg-[#0284C7] shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[#0B1B3A] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] transition-all"
              >
                <span>Explore Services</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
