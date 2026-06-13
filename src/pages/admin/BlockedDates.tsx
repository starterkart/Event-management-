import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BlockedDate } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BlockedDates() {
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchDates();
  }, []);

  async function fetchDates() {
    try {
      const { data } = await supabase.from('blocked_dates').select('*').order('blocked_date', { ascending: true });
      if (data) setDates(data);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    try {
      const { error } = await supabase.from('blocked_dates').insert([{ blocked_date: newDate, reason }]);
      if (error) throw error;
      setNewDate('');
      setReason('');
      fetchDates();
    } catch (err) {
      console.error(err);
      alert('Failed to add blocked date');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
      if (error) throw error;
      fetchDates();
    } catch (err) {
      console.error(err);
      alert('Failed to remove blocked date');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Blocked Dates</h1>
        <p className="text-gray-500 font-light text-sm">Manage days when the studio is closed or fully booked.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-serif text-gray-900 mb-4">Add Blocked Date</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Date</label>
                <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Reason (Optional)</label>
                <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Holiday, Private Event" className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
                Add Date
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Reason</th>
                  <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dates.map(date => (
                  <tr key={date.id} className="hover:bg-gray-50/50">
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {format(parseISO(date.blocked_date), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {date.reason || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleRemove(date.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dates.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 font-light text-sm">
                      No blocked dates configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
