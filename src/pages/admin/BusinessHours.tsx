import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BusinessHours } from '../../types';
import { Save } from 'lucide-react';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BusinessHoursConfig() {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    try {
      const { data } = await supabase.from('business_hours').select('*').order('weekday', { ascending: true });
      if (data) setHours(data);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (id: string, field: keyof BusinessHours, value: any) => {
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      for (const h of hours) {
        await supabase.from('business_hours').update({
          is_open: h.is_open,
          start_time: h.start_time,
          end_time: h.end_time
        }).eq('id', h.id);
      }
      alert('Business hours saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save business hours');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Business Hours</h1>
          <p className="text-gray-500 font-light text-sm">Define your weekly operating schedule.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
        <div className="divide-y divide-gray-100 p-6 space-y-6">
          {hours.map(h => (
            <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 first:pt-0">
              <div className="flex items-center gap-4 w-48 mb-4 sm:mb-0">
                <input 
                  type="checkbox" 
                  checked={h.is_open} 
                  onChange={e => handleChange(h.id, 'is_open', e.target.checked)}
                  className="w-4 h-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <span className="font-medium text-gray-900">{WEEKDAYS[h.weekday]}</span>
              </div>
              
              <div className={`flex items-center gap-4 transition-opacity ${h.is_open ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <input
                  type="time"
                  value={h.start_time?.slice(0,5) || ''}
                  onChange={e => handleChange(h.id, 'start_time', e.target.value)}
                  className="border border-gray-200 p-2 focus:border-gray-900 focus:ring-0 outline-none text-sm"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="time"
                  value={h.end_time?.slice(0,5) || ''}
                  onChange={e => handleChange(h.id, 'end_time', e.target.value)}
                  className="border border-gray-200 p-2 focus:border-gray-900 focus:ring-0 outline-none text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
