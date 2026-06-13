import React from 'react';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import Services from '../../components/public/Services';
import About from '../../components/public/About';
import BookingFlow from '../../components/public/BookingFlow';
import Footer from '../../components/public/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-gray-200">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <BookingFlow />
      </main>
      <Footer />
    </div>
  );
}
