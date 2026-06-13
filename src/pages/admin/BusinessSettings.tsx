import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BusinessSettings } from '../../types';
import { Save } from 'lucide-react';

export default function BusinessSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data } = await supabase.from('business_settings').select('*').limit(1).maybeSingle();
      if (data) setSettings(data);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('business_settings').update({
        business_name: settings.business_name,
        business_email: settings.business_email,
        business_phone: settings.business_phone,
        business_address: settings.business_address,
        slot_interval_minutes: settings.slot_interval_minutes,
        booking_notice_hours: settings.booking_notice_hours
      }).eq('id', settings.id);
      
      if (error) throw error;
      alert('Settings updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!settings) return <div>No settings found.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Studio Settings</h1>
        <p className="text-gray-500 font-light text-sm">Manage your studio brand and booking behavior.</p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-serif text-gray-900 border-b border-gray-100 pb-2">Studio Identity</h2>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Studio Name</label>
              <input required type="text" value={settings.business_name} onChange={e => setSettings({...settings, business_name: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Studio Email</label>
                <input required type="email" value={settings.business_email} onChange={e => setSettings({...settings, business_email: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Studio Phone</label>
                <input required type="tel" value={settings.business_phone} onChange={e => setSettings({...settings, business_phone: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Studio Address</label>
              <textarea rows={2} required value={settings.business_address} onChange={e => setSettings({...settings, business_address: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
            <h2 className="text-lg font-serif text-gray-900 border-b border-gray-100 pb-2">Booking Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Slot Interval (minutes)</label>
                <input required type="number" step="5" min="5" value={settings.slot_interval_minutes} onChange={e => setSettings({...settings, slot_interval_minutes: parseInt(e.target.value)})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                <p className="text-xs text-gray-400 mt-1">Frequency of available slots (e.g. every 30 mins)</p>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Booking Notice (hours)</label>
                <input required type="number" min="0" value={settings.booking_notice_hours} onChange={e => setSettings({...settings, booking_notice_hours: parseInt(e.target.value)})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                <p className="text-xs text-gray-400 mt-1">Minimum advance notice required</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
             <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
