import type { CalendarAdapter, CalendarParts } from './types';

/**
 * The adapter-owned value used while moving between calendar parts and the
 * UTC timestamp transport boundary. It deliberately contains no PersianDate
 * value so non-Jalali calendars can be exercised independently.
 */
export type CalendarValue = {
  date: Date;
  parts: CalendarParts;
};

export function calendarValueFromDate(
  adapter: CalendarAdapter,
  date: Date,
): CalendarValue {
  const normalized = new Date(date.getTime());
  return {
    date: normalized,
    parts: adapter.getParts(normalized),
  };
}

export function calendarValueFromParts(
  adapter: CalendarAdapter,
  parts: CalendarParts,
): CalendarValue {
  return calendarValueFromDate(adapter, adapter.fromParts(parts));
}

export function addCalendarDays(
  adapter: CalendarAdapter,
  value: CalendarValue,
  amount: number,
): Date {
  return adapter.addDays(value.date, amount);
}

export function addCalendarMonths(
  adapter: CalendarAdapter,
  value: CalendarValue,
  amount: number,
): Date {
  return adapter.addMonths(value.date, amount);
}
