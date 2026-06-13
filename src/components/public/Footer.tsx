import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { settings } = useApp();

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-serif text-gray-900 mb-4">{settings?.business_name || 'Event Studio'}</h2>
            <p className="text-gray-500 font-light max-w-sm">
              Creating beautifully orchestrated events that allow you to remain present in the moments that matter.
            </p>
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-gray-900 font-medium mb-1">{settings?.business_email}</p>
            <p className="text-gray-600 font-light mb-1">{settings?.business_phone}</p>
            <p className="text-gray-500 text-sm font-light">{settings?.business_address}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex justify-between items-center text-sm font-light text-gray-400">
          <p>© {new Date().getFullYear()} {settings?.business_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
