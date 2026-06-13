import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Appointment, Service } from '../../types';
import { Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { isSameDay, parseISO, isAfter, startOfToday, subMonths, format, isSameMonth } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Overview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appRes, srvRes] = await Promise.all([
          supabase.from('appointments').select('*').order('appointment_date', { ascending: true }),
          supabase.from('services').select('*')
        ]);
        
        if (appRes.data) setAppointments(appRes.data);
        if (srvRes.data) setServices(srvRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = startOfToday();
  
  const pending = appointments.filter(a => a.status === 'pending').length;
  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status) && (isSameDay(parseISO(a.appointment_date), today) || isAfter(parseISO(a.appointment_date), today))).length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const activeServices = services.filter(s => s.is_active).length;

  const stats = [
    { label: 'Pending Requests', value: pending, icon: Clock },
    { label: 'Upcoming', value: upcoming, icon: Calendar },
    { label: 'Completed', value: completed, icon: CheckCircle2 },
    { label: 'Active Services', value: activeServices, icon: Sparkles },
  ];

  // Generate revenue trend for the last 6 months
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(today, 5 - i);
    
    // Find projected/actual revenue for this month (excluding cancelled)
    const revenue = appointments
      .filter(a => a.status !== 'cancelled' && isSameMonth(parseISO(a.appointment_date), d))
      .reduce((sum, a) => {
        const service = services.find(s => s.id === a.service_id);
        return sum + (service?.price || 0);
      }, 0);

    return {
      name: format(d, 'MMM'),
      revenue
    };
  });

  // Calculate total revenue for the period shown in the chart
  const totalPeriodRevenue = chartData.reduce((sum, data) => sum + data.revenue, 0);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-500 font-light text-sm">Welcome to your studio dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium tracking-wide text-gray-500">{stat.label}</span>
              <stat.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-serif text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-serif text-gray-900">Revenue Trend</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Last 6 Months • Total: ₹{totalPeriodRevenue.toLocaleString()}</p>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `₹${value}`}
                dx={-10}
              />
              <Tooltip 
                cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '14px'
                }}
                formatter={(value: number) => [`₹${value}`, 'Revenue']}
                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#111827" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#111827', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#111827', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
