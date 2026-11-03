import { createIntlAdapter } from './intl';
import { createTabularHijriAdapter } from './tabular-hijri';
import type { CalendarAdapter, CalendarId, HijriProvider } from './types';

export function createCalendarAdapter(
  calendar: Exclude<CalendarId, 'jalali'>,
  options: { hijriProvider?: HijriProvider } = {},
): CalendarAdapter {
  if (calendar === 'hijri' && options.hijriProvider === 'tabular') {
    return createTabularHijriAdapter();
  }
  return createIntlAdapter(calendar, options.hijriProvider);
}
