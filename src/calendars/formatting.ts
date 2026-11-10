import type { CalendarId, CalendarParts } from './types';

type FormatOptions = {
  calendar: CalendarId;
  monthName?: string;
};

/**
 * PersianDate uses a `j` prefix for Jalali date tokens, while the adapter
 * formatters use the same token names for their native calendar. Keep the
 * public format contract stable when a model is serialized in another
 * calendar.
 */
export function normalizeCalendarFormat(
  format: string,
  calendar: CalendarId,
): string {
  return format.replace(
    /j?(YYYY|YY|MMMM|MM|M|DD|D)/g,
    (token, name: string) =>
      calendar === 'jalali'
        ? token.startsWith('j')
          ? token
          : `j${name}`
        : token.startsWith('j')
          ? name
          : token,
  );
}

export function formatCalendarParts(
  parts: CalendarParts,
  format: string,
  options: FormatOptions,
): string {
  const pad = (value: number, size = 2) =>
    String(value).padStart(size, '0');
  const leapSuffix =
    options.calendar === 'chinese' && parts.leapMonth ? 'bis' : '';
  const normalizedFormat = normalizeCalendarFormat(format, options.calendar)
    .replace(/\?MMMM/g, 'MMMM')
    .replace(/\?D/g, 'D');

  const tokens: Record<string, string> = {
    YYYY: String(parts.year),
    YY: String(parts.year).slice(-2),
    MMMM: options.monthName || 'MMMM',
    MM: `${pad(parts.month)}${leapSuffix}`,
    M: `${parts.month}${leapSuffix}`,
    DD: pad(parts.day),
    D: String(parts.day),
    HH: pad(parts.hour || 0),
    H: String(parts.hour || 0),
    mm: pad(parts.minute || 0),
    m: String(parts.minute || 0),
    ss: pad(parts.second || 0),
    s: String(parts.second || 0),
  };

  return normalizedFormat.replace(
    /YYYY|MMMM|YY|MM|DD|HH|mm|ss|M|D|H|m|s/g,
    (token) => tokens[token],
  );
}
