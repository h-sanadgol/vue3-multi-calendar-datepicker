import type { CalendarAdapter, CalendarParts } from '../calendars';

export function useCalendarAdapter<T extends object>(
  adapter: CalendarAdapter | undefined,
  toDate: (value: T) => Date,
  fromDate: (value: Date) => T,
) {
  return {
    getParts(value: T): CalendarParts {
      if (!adapter) throw new Error('Calendar adapter is not available');
      return adapter.getParts(toDate(value));
    },
    fromParts(parts: CalendarParts): T {
      if (!adapter) throw new Error('Calendar adapter is not available');
      return fromDate(adapter.fromParts(parts));
    },
    addDays(value: T, amount: number): T {
      if (!adapter) throw new Error('Calendar adapter is not available');
      return fromDate(adapter.addDays(toDate(value), amount));
    },
    addMonths(value: T, amount: number): T {
      if (!adapter) throw new Error('Calendar adapter is not available');
      return fromDate(adapter.addMonths(toDate(value), amount));
    },
    daysInMonth(year: number, month: number): number {
      if (!adapter) throw new Error('Calendar adapter is not available');
      return adapter.daysInMonth(year, month);
    },
  };
}
