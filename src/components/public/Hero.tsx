import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-[#faf9f7] overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
          alt="Elegant event table setup"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        <span className="inline-block py-1 px-3 border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-medium tracking-widest uppercase mb-6">
          Premium Event Design & Coordination
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight mb-8 leading-[1.1]">
          Crafting Unforgettable <br className="hidden md:block" />
          <span className="opacity-90">Celebrations</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 font-light mb-12">
          From intimate gatherings to grand affairs, our studio curates bespoke event 
          experiences marked by flawless execution and refined details.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#book" 
            className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-4 px-8 text-sm font-medium hover:bg-gray-100 transition-colors rounded-none whitespace-nowrap"
          >
            Start Planning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#services" 
            className="flex items-center gap-2 border border-white/30 bg-black/20 backdrop-blur-sm text-white px-8 py-4 text-sm font-medium hover:bg-black/30 transition-colors rounded-none whitespace-nowrap"
          >
            View Our Services
          </a>
        </div>
      </div>
    </div>
  );
}
