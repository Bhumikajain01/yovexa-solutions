import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { contentService } from '../services/contentService';

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    contentService.getAboutContent().then(data => {
      if (isMounted) {
        setAbout(data || null);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Failed to load active about content:', err);
      if (isMounted) {
        setAbout(null);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const scrollTo = (target) => {
    const id = target?.replace('#', '') || 'contact';
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section id="about" className="py-24 bg-[#F8FAFC] text-[#0B1B3A] relative border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-full w-48 mb-6" />
          <div className="h-12 bg-slate-200 rounded-xl w-3/4 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-4">
              <div className="h-20 bg-slate-200 rounded-xl" />
              <div className="h-20 bg-slate-200 rounded-xl" />
              <div className="h-12 bg-slate-200 rounded-xl w-40" />
            </div>
            <div className="lg:col-span-6">
              <div className="h-64 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (about?.isVisible === false) return null;

  const hasContent = Boolean(about && (about.title || about.heading));
  const focusAreas = Array.isArray(about?.highlights) ? about.highlights : [];

  return (
    <section id="about" className="py-28 sm:py-32 bg-white text-[#0B1B3A] relative border-b border-[#E2E8F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{about?.sectionLabel || "ABOUT US"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
            {about?.title || "Who We Are"}{' '}
            {about?.titleHighlight && (
              <span className="text-[#0284C7]">{about.titleHighlight}</span>
            )}
          </h2>
        </div>

        {hasContent ? (
          /* 2-Column Main Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Business Narrative & Domain Pillars */}
            <div className={`${about?.image ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6 text-left`}>
              {about?.description && (
                <p className="text-lg text-[#334155] leading-relaxed font-normal">
                  {about.description}
                </p>
              )}
              
              {about?.additionalDescription && (
                <p className="text-base text-[#475569] leading-relaxed font-normal">
                  {about.additionalDescription}
                </p>
              )}

              {focusAreas.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#0B1B3A] mb-4">
                    What We Build For Our Partners:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {focusAreas.map((area, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
                        <div className="w-5 h-5 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#0284C7] stroke-[3]" />
                        </div>
                        <span className="text-xs text-[#0B1B3A] font-semibold leading-tight">
                          {area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => scrollTo(about?.primaryCtaLink || 'contact')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
                >
                  <span>{about?.primaryCtaText || "Work With Us"}</span>
                  <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
                </button>

                <button
                  onClick={() => scrollTo(about?.secondaryCtaLink || 'services')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-[#0B1B3A] hover:text-[#0284C7] hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors"
                >
                  <span>{about?.secondaryCtaText || "View Full Services"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Modern Tech Visual Showcase (only if image exists) */}
            {about?.image && (
              <div className="lg:col-span-6">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0284C7]/20 via-[#0EA5E9]/15 to-[#38BDF8]/25 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-card">
                    <img
                      src={about.image}
                      alt={about.imageAlt || about.title || ""}
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />

                    {(about.imageCategory || about.imageTitle || about.imageBadge) && (
                      <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] flex items-center justify-between gap-4">
                        <div>
                          {about.imageCategory && (
                            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider block">
                              {about.imageCategory}
                            </span>
                          )}
                          {about.imageTitle && (
                            <h5 className="text-sm font-bold text-[#0B1B3A] mt-0.5">
                              {about.imageTitle}
                            </h5>
                          )}
                        </div>
                        {about.imageBadge && (
                          <span className="shrink-0 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-xs font-mono font-bold border border-[#BAE6FD]">
                            {about.imageBadge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center text-[#64748B] bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-8">
            <p className="text-base font-medium">No about content available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
