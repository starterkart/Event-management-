import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-4" />
        <p className="text-sm tracking-widest uppercase text-gray-500 font-medium">Verifying Access</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 text-center shadow-sm">
          <h2 className="text-xl font-serif text-gray-900 mb-2">Unauthorized</h2>
          <p className="text-gray-500 font-light mb-6">
            You are signed in, but you do not have admin privileges for this studio.
          </p>
          <button
            onClick={() => {
              import('../../lib/supabase').then(({ supabase }) => 
                supabase.auth.signOut()
              );
            }}
            className="w-full bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
