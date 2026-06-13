import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Appointment, Service } from '../../types';
import { format, parseISO } from 'date-fns';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [appRes, srvRes] = await Promise.all([
        supabase.from('appointments').select('*').order('appointment_date', { ascending: true }),
        supabase.from('services').select('id, name')
      ]);

      if (srvRes.data) {
        const srvMap = srvRes.data.reduce((acc, s) => ({ ...acc, [s.id]: s.name }), {});
        setServices(srvMap);
      }
      if (appRes.data) setAppointments(appRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-500 font-light text-sm">Manage your client consultations and events.</p>
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="mt-4 md:mt-0 border-gray-200 p-2 sm:text-sm focus:ring-gray-900 focus:border-gray-900 w-48 transition-colors outline-none cursor-pointer"
        >
          <option value="all">All Appointments</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Client</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Service</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{app.full_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{app.email}</p>
                    <p className="text-xs text-gray-500">{app.phone}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {services[app.service_id] || 'Unknown Service'}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {format(parseISO(app.appointment_date), 'MMM d, yyyy')}
                    <br />
                    <span className="text-gray-400 text-xs">{app.start_time?.slice(0,5) || ''} - {app.end_time?.slice(0,5) || ''}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider
                      ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                        app.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        app.status === 'completed' ? 'bg-green-50 text-green-800 border border-green-200' :
                        'bg-red-50 text-red-800 border border-red-200'
                      }
                    `}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="text-sm border-gray-200 py-1 pl-2 pr-6 rounded focus:ring-gray-900 focus:border-gray-900 text-gray-600 outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-light text-sm">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
