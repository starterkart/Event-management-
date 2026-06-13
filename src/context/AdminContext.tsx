import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({ user: null, isAdmin: false, loading: true });

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSessionAndAdmin = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          if (mounted) setUser(session.user);
          
          const { data: adminRecord, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminError) throw adminError;

          if (mounted) setIsAdmin(!!adminRecord);
        } else {
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSessionAndAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        if (mounted) setUser(session.user);
        
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (mounted) setIsAdmin(!!adminRecord);
        if (mounted) setLoading(false);
      } else {
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AdminContext.Provider value={{ user, isAdmin, loading }}>
        {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
