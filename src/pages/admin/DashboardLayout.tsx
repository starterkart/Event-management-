import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Sparkles, Clock, Ban, Settings, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { settings } = useApp();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
    { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/admin/services', icon: Sparkles, label: 'Services' },
    { to: '/admin/hours', icon: Clock, label: 'Business Hours' },
    { to: '/admin/blocked-dates', icon: Ban, label: 'Blocked Dates' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <span className="font-serif text-lg text-gray-900 truncate">
            {settings?.business_name || 'Admin'}
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
