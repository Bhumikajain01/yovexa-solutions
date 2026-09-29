import React from 'react';
import { ShieldCheck, Cpu, Layout, TrendingUp } from 'lucide-react';
import { TRUST_PILLARS } from '../data/values';

export default function TrustStrip() {
  if (!TRUST_PILLARS || TRUST_PILLARS.length === 0) {
    return null;
  }

  const icons = [
    <Cpu className="w-5 h-5 text-[#0284C7]" />,
    <TrendingUp className="w-5 h-5 text-[#0284C7]" />,
    <Layout className="w-5 h-5 text-[#0284C7]" />,
    <ShieldCheck className="w-5 h-5 text-[#0284C7]" />,
  ];

  return (
    <section className="relative z-20 bg-white border-b border-[#E2E8F0] py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_PILLARS.map((pillar, index) => (
            <div
              key={pillar.label}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0EA5E9] hover:bg-white hover:shadow-card transition-all duration-300"
            >
              <div className="p-2.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] shrink-0 mt-0.5">
                {icons[index]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1B3A] font-display tracking-tight">
                  {pillar.label}
                </h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
