import { addMinutes, isBefore, isSameDay, parseISO, startOfDay, addDays, getDay, isAfter, isWithinInterval } from 'date-fns';
import { Appointment, BlockedDate, BusinessHours, BusinessSettings } from '../types';

interface Slot {
  start: Date;
  end: Date;
  label: string;
}

export function generateAvailableSlots(
  targetDate: Date,
  selectedServiceDuration: number,
  businessHours: BusinessHours[],
  blockedDates: BlockedDate[],
  appointments: Appointment[],
  settings: BusinessSettings
): Slot[] {
  // Check if date is blocked
  const isBlocked = blockedDates.some(b => isSameDay(parseISO(b.blocked_date), targetDate));
  if (isBlocked) return [];

  // Get business hours for this weekday
  const weekday = getDay(targetDate);
  const dayHours = businessHours.find(h => h.weekday === weekday);
  
  if (!dayHours || !dayHours.is_open || !dayHours.start_time || !dayHours.end_time) return [];

  // Parse open and close times
  const [openHour, openMinute] = dayHours.start_time.split(':').map(Number);
  const [closeHour, closeMinute] = dayHours.end_time.split(':').map(Number);
  
  const startTime = new Date(targetDate);
  startTime.setHours(openHour, openMinute, 0, 0);
  
  const endTime = new Date(targetDate);
  endTime.setHours(closeHour, closeMinute, 0, 0);

  // Apply booking notice window
  const minNoticeTime = addMinutes(new Date(), settings.booking_notice_hours * 60);

  const slots: Slot[] = [];
  let currentSlotStart = new Date(startTime);

  while (isBefore(currentSlotStart, endTime)) {
    const currentSlotEnd = addMinutes(currentSlotStart, selectedServiceDuration);
    
    // Check if slot exceeds closing time
    if (isAfter(currentSlotEnd, endTime)) {
      break;
    }

    // Check notice period
    if (isBefore(currentSlotStart, minNoticeTime)) {
      currentSlotStart = addMinutes(currentSlotStart, settings.slot_interval_minutes);
      continue;
    }

    // Check existing appointments overlap
    const hasOverlap = appointments.some(app => {
      if (app.status === 'cancelled') return false;
      const appStart = parseISO(`${app.appointment_date}T${app.start_time}`);
      const appEnd = parseISO(`${app.appointment_date}T${app.end_time}`);
      
      // Overlap condition: start1 < end2 && end1 > start2
      return isBefore(currentSlotStart, appEnd) && isAfter(currentSlotEnd, appStart);
    });

    if (!hasOverlap) {
      slots.push({
        start: new Date(currentSlotStart),
        end: new Date(currentSlotEnd),
        label: currentSlotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    currentSlotStart = addMinutes(currentSlotStart, settings.slot_interval_minutes);
  }

  return slots;
}
