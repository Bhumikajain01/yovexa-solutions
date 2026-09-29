import React from 'react';

/**
 * Official Brand Logo Component for Yovexa Solutions
 * State A (Dark/Navy bg): Light/white logo treatment (white text, cyan accent)
 * State B (White/Light bg): Dark/navy logo treatment (deep navy text, blue/cyan accent)
 */
export default function Logo({ variant = 'light', size = 'default', showText = true, className = '' }) {
  // size options: 'sm', 'default', 'lg', 'xl'
  const sizeClasses = {
    sm: 'h-8',
    default: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  // Light/white text treatment when on a dark/navy background
  const isDarkBg = variant === 'dark' || variant === 'dark-bg' || variant === 'white-text';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Geometric Yovexa Symbol Vector / Image Hybrid */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className={`relative overflow-hidden rounded-lg transition-colors ${
          isDarkBg 
            ? 'bg-[#0B1B3A]/80 p-1 border border-cyan-500/20 shadow-glow-cyan-sm' 
            : 'bg-transparent p-0.5'
        }`}>
          <img 
            src="/yovexa-logo.png" 
            alt="Yovexa Solutions Logo" 
            className={`${sizeClasses[size]} w-auto object-contain rounded transition-transform duration-300 hover:scale-105 ${
              isDarkBg ? '' : 'mix-blend-multiply'
            }`}
            loading="eager"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight leading-none text-xl sm:text-2xl transition-colors duration-200 ${
              isDarkBg ? 'text-white' : 'text-[#0B1B3A]'
            }`}>
              YOVEXA
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${isDarkBg ? 'bg-cyan-400' : 'bg-[#0284C7]'} animate-pulse`}></span>
          </div>
          <span className={`text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase leading-tight mt-0.5 transition-colors duration-200 ${
            isDarkBg ? 'text-cyan-400/90' : 'text-[#0284C7]'
          }`}>
            SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
}
