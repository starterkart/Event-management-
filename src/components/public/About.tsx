import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] w-full">
            <div className="absolute inset-0 bg-gray-100 translate-x-4 translate-y-4" />
            <img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
              alt="Event planner arranging details"
              className="absolute inset-0 w-full h-full object-cover z-10 shadow-sm grayscale-[0.2]"
            />
          </div>
          
          <div className="max-w-xl">
            <h2 className="text-sm font-medium tracking-widest uppercase text-gray-400 mb-4">Our Philosophy</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight leading-tight mb-8">
              Every detail matters.
            </h3>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
              We believe that the best events feel effortless, but they are born from 
              meticulous planning, intentional design, and seamless vendor coordination.
            </p>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              Our studio handles the complexity of timelines, logistics, and design cohesion 
              so you can remain fully present in your celebration.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <h4 className="text-xl font-serif text-gray-900 mb-2">Refined Design</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  Tailored aesthetics that reflect your story.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-serif text-gray-900 mb-2">Flawless Flow</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  Meticulous timelines and coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
