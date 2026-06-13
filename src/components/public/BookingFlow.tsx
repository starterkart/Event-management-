import React, { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, startOfWeek, endOfWeek, isBefore, startOfDay } from 'date-fns';
import { generateAvailableSlots } from '../../lib/availability';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Calendar as CalendarIcon, Clock, Check, ArrowLeft, ChevronLeft } from 'lucide-react';

interface BookState {
  step: number;
  serviceId: string | null;
  date: Date | null;
  timeSlot: { start: Date; end: Date } | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

export default function BookingFlow() {
  const { settings } = useApp();
  const [services, setServices] = useState<any[]>([]);
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentMonthView, setCurrentMonthView] = useState<Date>(startOfMonth(startOfToday()));

  const [state, setState] = useState<BookState>({
    step: 1,
    serviceId: null,
    date: startOfToday(),
    timeSlot: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [servRes, hoursRes, blockedRes, apptRes] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true),
          supabase.from('business_hours').select('*'),
          supabase.from('blocked_dates').select('*'),
          supabase.from('appointments').select('appointment_date, start_time, end_time, status').neq('status', 'cancelled')
        ]);
        
        if (servRes.data) setServices(servRes.data);
        if (hoursRes.data) setBusinessHours(hoursRes.data);
        if (blockedRes.data) setBlockedDates(blockedRes.data);
        if (apptRes.data) setAppointments(apptRes.data);
      } catch (err) {
        console.error('Error loading booking data', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadData();
  }, []);

  const selectedService = services.find(s => s.id === state.serviceId);

  // Generate calendar days
  const monthStart = startOfMonth(currentMonthView);
  const monthEnd = endOfMonth(currentMonthView);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  const availableSlots = state.date && selectedService && settings
    ? generateAvailableSlots(state.date, selectedService.duration_minutes, businessHours, blockedDates, appointments, settings)
    : [];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.date || !state.timeSlot || !selectedService) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        full_name: `${state.firstName} ${state.lastName}`.trim(),
        email: state.email,
        phone: state.phone,
        service_id: selectedService.id,
        appointment_date: format(state.date, 'yyyy-MM-dd'),
        start_time: format(state.timeSlot.start, 'HH:mm:ss'),
        end_time: format(state.timeSlot.end, 'HH:mm:ss'),
        status: 'pending',
        notes: state.notes
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error('Booking failed', err);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingConfig) {
    return <div className="py-24 text-center">Loading availability...</div>;
  }

  if (success) {
    return (
      <section id="book" className="py-24 bg-gray-900 text-white min-h-[60vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-serif mb-4">Request Submitted</h2>
          <p className="text-gray-300 font-light text-lg mb-8">
            Thank you, {state.firstName}. We have received your consultation request for {selectedService?.name}.
            Our team will review your timeline and confirm your appointment shortly.
          </p>
          <div className="bg-white/5 border border-white/10 p-6 inline-block text-left mb-8">
            <p className="text-sm font-medium mb-2 capitalize">{format(state.date!, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-sm text-gray-400">
              {format(state.timeSlot!.start, 'h:mm a')} - {format(state.timeSlot!.end, 'h:mm a')}
            </p>
          </div>
          <br/>
          <button onClick={() => { setSuccess(false); setState(s => ({...s, step: 1, serviceId: null, timeSlot: null})) }} className="text-sm text-gray-400 hover:text-white transition-colors">
            Book another session
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="py-24 bg-[#faf9f7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-400 mb-4">Reservation</h2>
          <h3 className="text-4xl font-serif text-gray-900 tracking-tight">
            Schedule a Consultation
          </h3>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row">
          {/* Sidebar steps */}
          <div className="w-full md:w-1/3 bg-gray-50 p-8 border-r border-gray-100">
            <ul className="space-y-6">
              {[
                { num: 1, title: 'Select Service' },
                { num: 2, title: 'Choose Time' },
                { num: 3, title: 'Your Details' }
              ].map(step => (
                <li key={step.num} className={`flex items-center gap-4 ${state.step === step.num ? 'text-gray-900' : state.step > step.num ? 'text-gray-400' : 'text-gray-300'}`}>
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium ${state.step === step.num ? 'border-gray-900 text-gray-900' : state.step > step.num ? 'border-gray-400 text-gray-400' : 'border-gray-200 bg-transparent text-gray-300'}`}>
                    {state.step > step.num ? <Check className="w-4 h-4" /> : step.num}
                  </span>
                  <span className="font-serif tracking-wide">{step.title}</span>
                </li>
              ))}
            </ul>

            {state.serviceId && selectedService && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Summary</h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-serif text-gray-900 leading-tight">{selectedService.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedService.duration_minutes} mins • ₹{selectedService.price}</p>
                  </div>
                  {state.timeSlot && (
                    <div className="flex flex-col gap-1 text-sm text-gray-600 bg-white p-3 border border-gray-100">
                      <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {format(state.date!, 'MMM d, yyyy')}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {format(state.timeSlot.start, 'h:mm a')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="w-full md:w-2/3 p-8">
            {state.step === 1 && (
              <div className="space-y-4">
                <h4 className="text-xl font-serif text-gray-900 mb-6">Select a Planning Service</h4>
                {services.map(service => (
                  <label key={service.id} className={`flex items-start p-4 border cursor-pointer transition-colors ${state.serviceId === service.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="service"
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                        checked={state.serviceId === service.id}
                        onChange={() => setState({ ...state, serviceId: service.id, timeSlot: null })}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">{service.name}</span>
                        <span className="text-gray-900 font-medium">₹{service.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{service.duration_minutes} minutes</p>
                    </div>
                  </label>
                ))}
                
                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!state.serviceId}
                    onClick={() => setState({ ...state, step: 2 })}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {state.step === 2 && (
              <div>
                <h4 className="text-xl font-serif text-gray-900 mb-6 flex items-center gap-4">
                  <button onClick={() => setState({...state, step: 1})} className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></button>
                  Select Date & Time
                </h4>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCurrentMonthView(subMonths(currentMonthView, 1))}
                      disabled={isBefore(currentMonthView, startOfMonth(startOfToday()))}
                      className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h5 className="font-serif text-lg">{format(currentMonthView, 'MMMM yyyy')}</h5>
                    <button 
                      onClick={() => setCurrentMonthView(addMonths(currentMonthView, 1))}
                      className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-xs font-medium uppercase tracking-widest text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(d => {
                      const isPast = isBefore(d, startOfDay(startOfToday()));
                      const notInMonth = !isSameMonth(d, currentMonthView);
                      const isSelected = state.date ? isSameDay(state.date, d) : false;
                      
                      return (
                        <button
                          key={d.toISOString()}
                          onClick={() => {
                            if (!isPast) setState({ ...state, date: d, timeSlot: null });
                          }}
                          disabled={isPast}
                          className={`aspect-square flex items-center justify-center text-sm transition-colors border
                            ${isPast ? 'opacity-30 cursor-not-allowed border-transparent bg-gray-50/50' : 
                              isSelected ? 'bg-gray-900 text-white border-gray-900' : 
                              notInMonth ? 'text-gray-400 border-transparent hover:border-gray-200' : 
                              'bg-white border-gray-100 text-gray-900 hover:border-gray-400'
                            }`}
                        >
                          {format(d, 'd')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <h5 className="font-serif text-gray-900 mb-4">Available Times</h5>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setState({ ...state, timeSlot: slot })}
                        className={`py-3 text-sm font-medium border text-center transition-colors ${state.timeSlot?.start.getTime() === slot.start.getTime() ? 'border-gray-900 bg-gray-50 text-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                      >
                        {format(slot.start, 'h:mm a')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 font-light italic">No available times on this date. Please select another day.</p>
                )}

                <div className="mt-12 flex justify-end">
                  <button
                    disabled={!state.timeSlot}
                    onClick={() => setState({ ...state, step: 3 })}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {state.step === 3 && (
              <form onSubmit={handleBook}>
                 <h4 className="text-xl font-serif text-gray-900 mb-6 flex items-center gap-4">
                  <button type="button" onClick={() => setState({...state, step: 2})} className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></button>
                  Your Details
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input required type="text" value={state.firstName} onChange={e => setState({...state, firstName: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input required type="text" value={state.lastName} onChange={e => setState({...state, lastName: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input required type="email" value={state.email} onChange={e => setState({...state, email: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input required type="tel" value={state.phone} onChange={e => setState({...state, phone: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                    <textarea rows={3} value={state.notes} onChange={e => setState({...state, notes: e.target.value})} className="w-full border-gray-200 p-3 border focus:border-gray-900 focus:ring-0 outline-none transition-colors" placeholder="Tell us about your event vision..."></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white w-full md:w-auto px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Request Appointment'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
