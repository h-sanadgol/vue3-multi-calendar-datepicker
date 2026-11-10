export type CalendarId =
  | 'jalali'
  | 'gregorian'
  | 'hijri'
  | 'hebrew'
  | 'buddhist'
  | 'chinese';

export type HijriProvider = 'ummalqura' | 'tabular';

export type CalendarParts = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  leapMonth?: boolean;
};

export function validateTimeParts(parts: CalendarParts): void {
  const ranges = [
    ['hour', parts.hour, 0, 23],
    ['minute', parts.minute, 0, 59],
    ['second', parts.second, 0, 59],
    ['millisecond', parts.millisecond, 0, 999],
  ] as const;

  for (const [name, value, min, max] of ranges) {
    if (value !== undefined && (!Number.isInteger(value) || value < min || value > max)) {
      throw new RangeError(`Invalid ${name} value: ${value}`);
    }
  }
}

export interface CalendarAdapter {
  readonly id: CalendarId;
  readonly provider?: HijriProvider;
  /**
   * Adapters use native UTC Date values at their transport boundary.
   * Calendar-specific semantics stay inside the adapter and do not require
   * the Jalali/PersianDate implementation.
   */
  getParts(date: Date): CalendarParts;
  fromParts(parts: CalendarParts): Date;
  addDays(date: Date, amount: number): Date;
  addMonths(date: Date, amount: number): Date;
  daysInMonth(year: number, month: number): number;
}
