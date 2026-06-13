import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';

// Fallback images based on index or service content if we want
const images = [
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542458514-469b2650ea0c?q=80&w=2070&auto=format&fit=crop',
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });
        
        if (data) setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="py-24 text-center">Loading services...</div>;
  }

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-400 mb-4">Our Services</h2>
          <h3 className="text-4xl font-serif text-gray-900 tracking-tight">
            Curated Planning Experiences
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={service.id} className="group cursor-pointer flex flex-col h-full bg-[#faf9f7] border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image_url || images[idx % images.length]} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-serif text-gray-900">{service.name}</h4>
                  <span className="text-sm font-medium text-gray-500">₹{service.price}</span>
                </div>
                <p className="text-gray-600 font-light text-sm mb-6 flex-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
                  <span className="text-sm text-gray-500">{service.duration_minutes} mins</span>
                  <a href="#book" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                    Reserve
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
