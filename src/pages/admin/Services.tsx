import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';
import { Plus, X, Edit2 } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    is_active: true,
    image_url: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (data) setServices(data);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: service.price,
      is_active: service.is_active,
      image_url: service.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      duration_minutes: 60,
      price: 0,
      is_active: true,
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('services').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Services</h1>
          <p className="text-gray-500 font-light text-sm">Manage your studio offerings and pricing.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className={`bg-white border p-6 flex flex-col ${service.is_active ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl text-gray-900">{service.name}</h3>
              <span className={`text-xs font-medium uppercase tracking-wider px-2 py-1 ${service.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-light mb-6 flex-1">{service.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
              <div className="text-sm text-gray-500">
                {service.duration_minutes} min • ₹{service.price}
              </div>
              <button
                onClick={() => handleEdit(service)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-xl outline-none">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif text-gray-900">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Service Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors"></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Image URL (Optional)</label>
                <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Duration (mins)</label>
                  <input required type="number" min="0" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Price (₹)</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Service is active and visible to clients</label>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
