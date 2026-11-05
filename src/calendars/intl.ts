import type {
  CalendarAdapter,
  CalendarId,
  CalendarParts,
  HijriProvider,
} from './types';

type IntlCalendar =
  | 'gregory'
  | 'islamic-umalqura'
  | 'hebrew'
  | 'buddhist'
  | 'chinese';

const calendarNames: Record<Exclude<CalendarId, 'jalali'>, IntlCalendar> = {
  gregorian: 'gregory',
  hijri: 'islamic-umalqura',
  hebrew: 'hebrew',
  buddhist: 'buddhist',
  chinese: 'chinese',
};

const dayMilliseconds = 86_400_000;

function parsePart(value: string | undefined): number {
  return Number.parseInt(value || '0', 10);
}

function isHebrewLeapYear(year: number): boolean {
  return (7 * year + 1) % 19 < 7;
}

function parseHebrewMonth(value: string | undefined, year: number): number {
  const month = value || '';
  const names = isHebrewLeapYear(year)
    ? [
        'Tishri',
        'Heshvan',
        'Kislev',
        'Tevet',
        'Shevat',
        'Adar I',
        'Adar II',
        'Nisan',
        'Iyar',
        'Sivan',
        'Tamuz',
        'Av',
        'Elul',
      ]
    : [
        'Tishri',
        'Heshvan',
        'Kislev',
        'Tevet',
        'Shevat',
        'Adar',
        'Nisan',
        'Iyar',
        'Sivan',
        'Tamuz',
        'Av',
        'Elul',
      ];
  const index = names.findIndex(
    (name) => month.toLowerCase() === name.toLowerCase(),
  );
  return index >= 0 ? index + 1 : parsePart(value);
}

function parseChineseMonth(value: string | undefined): {
  month: number;
  leapMonth: boolean;
} {
  const month = (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const names = [
    'first month',
    'second month',
    'third month',
    'fourth month',
    'fifth month',
    'sixth month',
    'seventh month',
    'eighth month',
    'ninth month',
    'tenth month',
    'eleventh month',
    'twelfth month',
  ];
  const leapMonth = month.endsWith('bis');
  const normalized = leapMonth ? month.slice(0, -3).trim() : month;
  const index = names.indexOf(normalized);
  return {
    month: index >= 0 ? index + 1 : parsePart(value),
    leapMonth,
  };
}

function sameDate(left: CalendarParts, right: CalendarParts): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    Boolean(left.leapMonth) === Boolean(right.leapMonth)
  );
}

function compareDateParts(left: CalendarParts, right: CalendarParts): number {
  const leftValues = [left.year, left.month, left.leapMonth ? 1 : 0, left.day];
  const rightValues = [
    right.year,
    right.month,
    right.leapMonth ? 1 : 0,
    right.day,
  ];
  for (let index = 0; index < leftValues.length; index++) {
    if (leftValues[index] !== rightValues[index])
      return leftValues[index] < rightValues[index] ? -1 : 1;
  }
  return 0;
}

function formatParts(
  formatter: Intl.DateTimeFormat,
  date: Date,
): CalendarParts {
  const values = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  const year = parsePart(values.year || values.relatedYear);
  const calendar = formatter.resolvedOptions().calendar;
  const chineseMonth =
    calendar === 'chinese' ? parseChineseMonth(values.month) : undefined;

  return {
    year,
    month:
      calendar === 'hebrew'
        ? parseHebrewMonth(values.month, year)
        : chineseMonth?.month || parsePart(values.month),
    day: parsePart(values.day),
    ...(chineseMonth?.leapMonth ? { leapMonth: true } : {}),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
  };
}

function createFormatter(calendar: IntlCalendar): Intl.DateTimeFormat {
  const formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}-nu-latn`, {
    timeZone: 'UTC',
    year: 'numeric',
    month: calendar === 'chinese' ? 'long' : 'numeric',
    day: 'numeric',
  });

  if (formatter.resolvedOptions().calendar !== calendar) {
    throw new Error(`Calendar is not supported by this runtime: ${calendar}`);
  }
  return formatter;
}

function estimateGregorianYear(
  calendar: Exclude<CalendarId, 'jalali'>,
  year: number,
): number {
  switch (calendar) {
    case 'hijri':
      return Math.floor((year - 1) * 0.970224 + 622);
    case 'hebrew':
      return year - 3760;
    case 'buddhist':
      return year - 543;
    default:
      return year;
  }
}

function findGregorianDate(
  formatter: Intl.DateTimeFormat,
  calendar: Exclude<CalendarId, 'jalali'>,
  wanted: CalendarParts,
): Date {
  const estimate = new Date(
    Date.UTC(
      estimateGregorianYear(calendar, wanted.year),
      Math.max(0, wanted.month - 1),
      Math.max(1, wanted.day),
    ),
  );
  // Hijri years drift roughly one month per Gregorian year, so a calendar
  // month-shaped estimate can be several months away from the target date.
  const searchWindow = calendar === 'hijri' ? 900 : 450;
  const start = estimate.getTime() - searchWindow * dayMilliseconds;
  const end = estimate.getTime() + searchWindow * dayMilliseconds;

  const startParts = formatParts(formatter, new Date(start));
  const endParts = formatParts(formatter, new Date(end));
  if (
    compareDateParts(startParts, wanted) > 0 ||
    compareDateParts(endParts, wanted) < 0
  ) {
    throw new RangeError(
      `Unable to convert ${wanted.year}/${wanted.month}/${wanted.day} from ${calendar}`,
    );
  }

  let lower = start;
  let upper = end;
  while (lower <= upper) {
    const middle =
      lower +
      Math.floor((upper - lower) / (2 * dayMilliseconds)) * dayMilliseconds;
    const candidate = new Date(middle);
    const comparison = compareDateParts(
      formatParts(formatter, candidate),
      wanted,
    );
    if (comparison === 0) return candidate;
    if (comparison < 0) lower = middle + dayMilliseconds;
    else upper = middle - dayMilliseconds;
  }

  throw new RangeError(
    `Unable to convert ${wanted.year}/${wanted.month}/${wanted.day} from ${calendar}`,
  );
}

export function createIntlAdapter(
  id: Exclude<CalendarId, 'jalali'>,
  provider: HijriProvider = 'ummalqura',
): CalendarAdapter {
  if (id === 'hijri' && provider !== 'ummalqura') {
    throw new Error(`Hijri provider is not implemented yet: ${provider}`);
  }

  const formatter = createFormatter(calendarNames[id]);

  return {
    id,
    ...(id === 'hijri' ? { provider } : {}),
    getParts(date) {
      return formatParts(formatter, date);
    },
    fromParts(parts) {
      const date = findGregorianDate(formatter, id, parts);
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
      const current = formatParts(formatter, date);
      let targetYear = current.year;
      let normalizedMonth = current.month;
      const monthCount = (year: number) =>
        id === 'hebrew' && isHebrewLeapYear(year) ? 13 : 12;
      const direction = amount < 0 ? -1 : 1;
      for (let step = 0; step < Math.abs(amount); step++) {
        normalizedMonth += direction;
        if (normalizedMonth > monthCount(targetYear)) {
          normalizedMonth = 1;
          targetYear += 1;
        } else if (normalizedMonth < 1) {
          targetYear -= 1;
          normalizedMonth = monthCount(targetYear);
        }
      }
      const targetDay = Math.min(
        current.day,
        (() => {
          const first = findGregorianDate(formatter, id, {
            year: targetYear,
            month: normalizedMonth,
            day: 1,
          });
          let days = 1;
          while (
            sameDate(
              formatParts(
                formatter,
                new Date(first.getTime() + days * dayMilliseconds),
              ),
              { year: targetYear, month: normalizedMonth, day: days + 1 },
            )
          ) {
            days += 1;
          }
          return days;
        })(),
      );
      return findGregorianDate(formatter, id, {
        ...current,
        year: targetYear,
        month: normalizedMonth,
        day: targetDay,
      });
    },
    daysInMonth(year, month) {
      const first = findGregorianDate(formatter, id, { year, month, day: 1 });
      let count = 1;
      while (
        sameDate(
          formatParts(
            formatter,
            new Date(first.getTime() + count * dayMilliseconds),
          ),
          { year, month, day: count + 1 },
        )
      ) {
        count += 1;
      }
      return count;
    },
  };
}
