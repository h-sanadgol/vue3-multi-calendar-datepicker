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

export interface CalendarAdapter {
  readonly id: CalendarId;
  readonly provider?: HijriProvider;
  getParts(date: Date): CalendarParts;
  fromParts(parts: CalendarParts): Date;
  addDays(date: Date, amount: number): Date;
  addMonths(date: Date, amount: number): Date;
  daysInMonth(year: number, month: number): number;
}
