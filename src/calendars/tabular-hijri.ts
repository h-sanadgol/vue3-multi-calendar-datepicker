import type { CalendarAdapter, CalendarParts } from './types';

const dayMilliseconds = 86_400_000;
const islamicEpoch = 1_948_439.5;

function islamicToJulianDay(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    islamicEpoch -
    1
  );
}

function julianDayToGregorian(julianDay: number): Date {
  return new Date((julianDay - 2_440_587.5) * dayMilliseconds);
}

function gregorianToJulianDay(date: Date): number {
  return date.getTime() / dayMilliseconds + 2_440_587.5;
}

function gregorianToIslamic(date: Date): CalendarParts {
  const julianDay = Math.floor(gregorianToJulianDay(date)) + 0.5;
  const year = Math.floor((30 * (julianDay - islamicEpoch) + 10_646) / 10_631);
  const month = Math.min(
    12,
    Math.ceil((julianDay - (29 + islamicToJulianDay(year, 1, 1))) / 29.5) + 1,
  );
  const day = Math.floor(julianDay - islamicToJulianDay(year, month, 1) + 1);

  return {
    year,
    month,
    day,
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
  };
}

export function createTabularHijriAdapter(): CalendarAdapter {
  return {
    id: 'hijri',
    provider: 'tabular',
    getParts: gregorianToIslamic,
    fromParts(parts) {
      const date = julianDayToGregorian(
        islamicToJulianDay(parts.year, parts.month, parts.day),
      );
      date.setUTCHours(
        parts.hour || 0,
        parts.minute || 0,
        parts.second || 0,
        parts.millisecond || 0,
      );
      return date;
    },
    addDays(date, amount) {
      return new Date(date.getTime() + amount * dayMilliseconds);
    },
    addMonths(date, amount) {
      const current = gregorianToIslamic(date);
      const absoluteMonth = current.year * 12 + current.month - 1 + amount;
      const year = Math.floor(absoluteMonth / 12);
      const month = (((absoluteMonth % 12) + 12) % 12) + 1;
      const maxDay = month % 2 === 1 ? 30 : 29;
      return this.fromParts({
        ...current,
        year,
        month,
        day: Math.min(current.day, maxDay),
      });
    },
    daysInMonth(year, month) {
      if (month % 2 === 1) return 30;
      if (month !== 12) return 29;
      return (year * 11 + 14) % 30 < 11 ? 30 : 29;
    },
  };
}
