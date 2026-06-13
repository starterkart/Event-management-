import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-serif tracking-tight text-gray-900">
              {settings?.business_name || 'Event Studio'}
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Services</a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Philosophy</a>
            <a href="#book" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-none">
              Reserve Consultation
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <a href="#services" className="block text-base font-medium text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>Services</a>
            <a href="#about" className="block text-base font-medium text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>Philosophy</a>
            <a href="#book" className="block text-base font-medium text-gray-900" onClick={() => setIsOpen(false)}>Reserve Consultation</a>
          </div>
        </div>
      )}
    </nav>
  );
}
