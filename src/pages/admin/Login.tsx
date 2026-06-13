import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { user, isAdmin, loading } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      // ProtectedRoute will handle redirecting once context updates
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-gray-900 mb-2">Studio Access</h1>
          <p className="text-sm text-gray-500 font-light text-center">Log in to manage appointments and settings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
          >
            {isSubmitting || loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
