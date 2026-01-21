export function parseTime(timeStr: string): number {
  // Parse time like "11:10 AM" into minutes since midnight
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

export function getTimeSlots(startHour: number = 8, endHour: number = 22): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(formatTime(hour * 60));
  }
  return slots;
}
