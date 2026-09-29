import React from 'react';
import { Target, Cpu, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { VALUES_DATA } from '../data/values';

export default function WhyYovexa() {
  if (!VALUES_DATA || VALUES_DATA.length === 0) {
    return null;
  }
  const getIcon = (id) => {
    switch (id) {
      case 'business-focused': return <Target className="w-6 h-6 text-[#0284C7]" />;
      case 'scalable-architecture': return <Cpu className="w-6 h-6 text-[#0284C7]" />;
      case 'modern-ux': return <Sparkles className="w-6 h-6 text-[#0284C7]" />;
      case 'transparent-collaboration': return <ShieldCheck className="w-6 h-6 text-[#0284C7]" />;
      default: return <Sparkles className="w-6 h-6 text-[#0284C7]" />;
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="why-us" className="py-24 bg-[#F8FAFC] text-[#0B1B3A] relative tech-grid-bg overflow-hidden border-b border-[#E2E8F0]">
      {/* Background Accent Lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Our Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
            Why Work With <span className="text-[#0284C7]">Yovexa Solutions?</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#334155] font-normal">
            We operate as an extension of your team, delivering pragmatic digital systems with engineering clarity and genuine accountability.
          </p>
        </div>

        {/* 4 Value Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {VALUES_DATA.map((value) => (
            <div
              key={value.id}
              className="group relative flex flex-col justify-between p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0EA5E9] shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform text-[#0284C7]">
                  {getIcon(value.id)}
                </div>

                <div className="text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
                  {value.highlight}
                </div>

                <h3 className="text-xl font-bold text-[#0B1B3A] font-display">
                  {value.title}
                </h3>

                <p className="text-xs text-[#0369A1] font-semibold mt-1">
                  {value.subtitle}
                </p>

                <p className="mt-3.5 text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                  {value.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1.5 text-xs font-semibold text-[#0284C7]">
                <span>Committed to quality</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-16 text-center">
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Partner With Yovexa On Your Next Project</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
}
