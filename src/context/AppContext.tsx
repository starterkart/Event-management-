import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BusinessSettings } from '../types';

interface AppContextType {
  settings: BusinessSettings | null;
  loading: boolean;
}

const AppContext = createContext<AppContextType>({ settings: null, loading: true });

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('business_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <AppContext.Provider value={{ settings, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
