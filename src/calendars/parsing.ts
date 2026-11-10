import type { CalendarId, CalendarParts } from './types';

export function parseCalendarParts(
  value: string,
  calendar: CalendarId,
): CalendarParts {
  const values = value.split(/[-/ .,:]/).filter(Boolean);
  const monthToken = values[1] || '1';
  const leapMonth = calendar === 'chinese' && /bis$/i.test(monthToken);
  const month = Number.parseInt(monthToken.replace(/bis$/i, ''), 10);

  return {
    year: Number(values[0]),
    month: month || 1,
    day: Number(values[2]) || 1,
    hour: Number(values[3]) || 0,
    minute: Number(values[4]) || 0,
    second: Number(values[5]) || 0,
    ...(leapMonth ? { leapMonth: true } : {}),
  };
}
