
import { ScheduledEvent, CalendarDay } from "@/types";

// Get all days in a month, including days from adjacent months to fill the calendar grid
export function getCalendarDays(year: number, month: number, events: ScheduledEvent[]): CalendarDay[] {
  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday
  
  const daysArray: CalendarDay[] = [];
  
  // Get days from previous month to fill the first week
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    const date = new Date(prevMonthYear, prevMonth, daysInPrevMonth - startingDayOfWeek + i + 1);
    daysArray.push({
      date,
      events: filterEventsByDate(events, date),
      isCurrentMonth: false,
      isToday: isSameDay(date, today)
    });
  }
  
  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    daysArray.push({
      date,
      events: filterEventsByDate(events, date),
      isCurrentMonth: true,
      isToday: isSameDay(date, today)
    });
  }
  
  // Calculate how many days we need from the next month
  const totalDaysAdded = startingDayOfWeek + daysInMonth;
  const daysNeededFromNextMonth = 7 - (totalDaysAdded % 7);
  
  // Get days from next month to complete the grid (if necessary)
  if (daysNeededFromNextMonth < 7) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= daysNeededFromNextMonth; i++) {
      const date = new Date(nextMonthYear, nextMonth, i);
      daysArray.push({
        date,
        events: filterEventsByDate(events, date),
        isCurrentMonth: false,
        isToday: isSameDay(date, today)
      });
    }
  }
  
  return daysArray;
}

// Filter events for a specific date
export function filterEventsByDate(events: ScheduledEvent[], date: Date): ScheduledEvent[] {
  return events.filter(event => {
    const eventStartDate = new Date(event.start);
    const eventEndDate = new Date(event.end);
    
    // Check if the date falls within the event's start and end dates
    return (
      isSameDay(date, eventStartDate) || 
      isSameDay(date, eventEndDate) || 
      (date > eventStartDate && date < eventEndDate)
    );
  });
}

// Check if two dates represent the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Format date as YYYY-MM-DD for input fields
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date as HH:MM for input fields
export function formatTimeForInput(date: Date): string {
  return date.toTimeString().split(' ')[0].substring(0, 5);
}
