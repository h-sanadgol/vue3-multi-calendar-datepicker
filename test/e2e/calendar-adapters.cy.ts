import { createCalendarAdapter, type CalendarId } from '../../src/calendars';
import {
  addCalendarDays,
  addCalendarMonths,
  calendarValueFromDate,
  calendarValueFromParts,
} from '../../src/calendars/value';
import { parseCalendarParts } from '../../src/calendars/parsing';
import { isWithinCalendarBounds } from '../../src/calendars/constraints';
import { matchesDisable } from '../../src/calendars/disable';
import {
  formatCalendarParts,
  normalizeCalendarFormat,
} from '../../src/calendars/formatting';
import { Core } from '../../src/components/utils/modules/core';

describe('calendar adapters', () => {
  const calendars: Exclude<CalendarId, 'jalali'>[] = [
    'gregorian',
    'hijri',
    'hebrew',
    'buddhist',
    'chinese',
  ];

  it('exposes the supported non-Jalali calendar adapters', () => {
    calendars.forEach((calendar) => {
      expect(Boolean(createCalendarAdapter(calendar))).to.equal(true);
    });
  });

  it('uses Umm al-Qura as the default Hijri provider', () => {
    const adapter = createCalendarAdapter('hijri');
    expect(adapter.provider).to.equal('ummalqura');
  });

  it('supports the configurable tabular Hijri provider', () => {
    const adapter = createCalendarAdapter('hijri', {
      hijriProvider: 'tabular',
    });
    const parts = adapter.getParts(new Date(Date.UTC(2021, 2, 30)));

    expect(adapter.provider).to.equal('tabular');
    expect(parts).to.deep.include({ year: 1442, month: 8, day: 16 });
  });

  it('parses calendar parts without relying on PersianDate', () => {
    expect(parseCalendarParts('2025-04-05 13:27:42', 'gregorian')).to.deep.include({
      year: 2025,
      month: 4,
      day: 5,
      hour: 13,
      minute: 27,
      second: 42,
    });
    expect(parseCalendarParts('2023-02bis-01', 'chinese')).to.deep.include({
      year: 2023,
      month: 2,
      day: 1,
      leapMonth: true,
    });
  });

  it('checks calendar-day and exact-time constraints independently', () => {
    const from = new Date(Date.UTC(2025, 3, 4, 9, 0));
    const to = new Date(Date.UTC(2025, 3, 5, 17, 0));

    expect(
      isWithinCalendarBounds(
        new Date(Date.UTC(2025, 3, 4, 23, 59)),
        from,
        to,
        'date',
      ),
    ).to.equal(true);
    expect(
      isWithinCalendarBounds(
        new Date(Date.UTC(2025, 3, 5, 17, 1)),
        from,
        to,
        'time',
      ),
    ).to.equal(false);
  });

  it('dispatches disable matchers without leaking RegExp state', () => {
    const candidate = '2025-04-05';
    const matcher = /2025-04-05/g;
    const options = {
      matchesString: (value: string) => value === candidate,
      format: (value: string) => value,
    };

    expect(matchesDisable(candidate, matcher, options)).to.equal(true);
    expect(matchesDisable(candidate, matcher, options)).to.equal(true);
    expect(matchesDisable(candidate, [candidate], options)).to.equal(true);
    expect(matchesDisable(candidate, () => true, options)).to.equal(true);
  });

  it('formats adapter parts with calendar-safe tokens', () => {
    expect(
      formatCalendarParts(
        {
          year: 2023,
          month: 2,
          day: 1,
          hour: 13,
          minute: 7,
          leapMonth: true,
        },
        'YYYY/MM/DD HH:mm MMMM',
        { calendar: 'chinese', monthName: 'Second month' },
      ),
    ).to.equal('2023/02bis/01 13:07 Second month');

    expect(
      formatCalendarParts(
        { year: 5785, month: 1, day: 6 },
        '?D ?MMMM',
        { calendar: 'hebrew', monthName: 'Nisan' },
      ),
    ).to.equal('6 Nisan');
  });

  it('normalizes calendar-specific model tokens at the serialization boundary', () => {
    expect(normalizeCalendarFormat('jYYYY/jMM/jDD HH:mm', 'gregorian')).to.equal(
      'YYYY/MM/DD HH:mm',
    );
    expect(normalizeCalendarFormat('YYYY-MM-DD HH:mm', 'jalali')).to.equal(
      'jYYYY-jMM-jDD HH:mm',
    );
    expect(normalizeCalendarFormat('jYYYY/jMM/jDD', 'hijri')).to.equal(
      'YYYY/MM/DD',
    );
  });

  it('rejects invalid parts instead of normalizing them into another date', () => {
    const adapter = createCalendarAdapter('hijri', {
      hijriProvider: 'tabular',
    });

    expect(() =>
      adapter.fromParts({ year: 1446, month: 13, day: 1 }),
    ).to.throw();
    expect(() =>
      adapter.fromParts({ year: 1446, month: 2, day: 30 }),
    ).to.throw();
  });

  it('rejects out-of-range time parts instead of overflowing the date', () => {
    calendars.forEach((calendar) => {
      const adapter = createCalendarAdapter(calendar);

      expect(() =>
        adapter.fromParts({
          year: calendar === 'gregorian' || calendar === 'chinese' ? 2025 :
            calendar === 'hijri' ? 1446 :
              calendar === 'hebrew' ? 5785 : 2568,
          month: 1,
          day: 1,
          hour: 24,
        }),
      ).to.throw();
      expect(() =>
        adapter.fromParts({
          year: calendar === 'gregorian' || calendar === 'chinese' ? 2025 :
            calendar === 'hijri' ? 1446 :
              calendar === 'hebrew' ? 5785 : 2568,
          month: 1,
          day: 1,
          minute: 60,
        }),
      ).to.throw();
    });
  });

  it('round-trips the demo date with the tabular Hijri provider', () => {
    const adapter = createCalendarAdapter('hijri', {
      hijriProvider: 'tabular',
    });
    const gregorian = adapter.fromParts({ year: 1446, month: 10, day: 6 });
    expect(gregorian).to.be.instanceOf(Date);
    expect(adapter.getParts(gregorian)).to.deep.include({
      year: 1446,
      month: 10,
      day: 6,
    });
  });

  it('round-trips a Gregorian date through the Gregorian adapter', () => {
    const adapter = createCalendarAdapter('gregorian');
    const date = new Date(Date.UTC(2021, 2, 30));
    const parts = adapter.getParts(date);

    expect(parts).to.deep.include({ year: 2021, month: 3, day: 30 });
    expect(adapter.fromParts(parts).toISOString()).to.equal(
      '2021-03-30T00:00:00.000Z',
    );
  });

  it('converts the known Gregorian date to Umm al-Qura', () => {
    const adapter = createCalendarAdapter('hijri');
    const parts = adapter.getParts(new Date(Date.UTC(2021, 2, 30)));

    expect(parts).to.deep.include({ year: 1442, month: 8, day: 17 });
  });

  it('converts the demo Umm al-Qura sample back to Gregorian', () => {
    const adapter = createCalendarAdapter('hijri');
    expect(
      adapter.getParts(adapter.fromParts({ year: 1446, month: 10, day: 6 })),
    ).to.deep.include({
      year: 1446,
      month: 10,
      day: 6,
    });
  });

  it('converts the demo Hijri range boundaries', () => {
    const adapter = createCalendarAdapter('hijri');
    expect(
      adapter.getParts(adapter.fromParts({ year: 1400, month: 1, day: 1 })),
    ).to.deep.include({ year: 1400, month: 1, day: 1 });
    expect(
      adapter.getParts(adapter.fromParts({ year: 1500, month: 1, day: 1 })),
    ).to.deep.include({ year: 1500, month: 1, day: 1 });
  });

  it('supports adding months without mutating the original Date', () => {
    const adapter = createCalendarAdapter('gregorian');
    const original = new Date(Date.UTC(2021, 0, 31));
    const next = adapter.addMonths(original, 1);

    expect(original.toISOString()).to.equal('2021-01-31T00:00:00.000Z');
    expect(adapter.getParts(next)).to.deep.include({
      year: 2021,
      month: 2,
      day: 28,
    });
  });

  it('reports calendar-native month lengths at leap boundaries', () => {
    const gregorian = createCalendarAdapter('gregorian');
    expect(gregorian.daysInMonth(2020, 2)).to.equal(29);
    expect(gregorian.daysInMonth(2021, 2)).to.equal(28);

    const hebrew = createCalendarAdapter('hebrew');
    expect(hebrew.daysInMonth(5784, 13)).to.be.greaterThan(0);
    let invalidMonthError: unknown;
    try {
      hebrew.daysInMonth(5785, 13);
    } catch (error) {
      invalidMonthError = error;
    }
    expect(String(invalidMonthError)).to.contain(
      'Unable to convert 5785/13/1 from hebrew',
    );
  });

  it('preserves UTC time parts through adapter round-trips', () => {
    calendars.forEach((calendar) => {
      const adapter = createCalendarAdapter(calendar);
      const source = new Date(Date.UTC(2025, 3, 4, 13, 27, 42, 125));
      const parts = adapter.getParts(source);
      const roundTrip = adapter.fromParts(parts);

      expect(adapter.getParts(roundTrip)).to.deep.include({
        hour: 13,
        minute: 27,
        second: 42,
        millisecond: 125,
      });
    });
  });

  it('keeps day arithmetic immutable across adapter boundaries', () => {
    calendars.forEach((calendar) => {
      const adapter = createCalendarAdapter(calendar);
      const source = adapter.fromParts({ year: 2025, month: 3, day: 7 });
      const originalParts = adapter.getParts(source);
      const next = adapter.addDays(source, 1);

      expect(adapter.getParts(source)).to.deep.equal(originalParts);
      expect(next).to.not.equal(source);
    });
  });

  it('keeps every non-Jalali adapter on the native Date boundary', () => {
    const samples = {
      gregorian: { year: 2021, month: 3, day: 30 },
      hijri: { year: 1446, month: 10, day: 6 },
      hebrew: { year: 5785, month: 7, day: 6 },
      buddhist: { year: 2568, month: 4, day: 4 },
      chinese: { year: 2025, month: 3, day: 7 },
    } as const;

    (Object.keys(samples) as Exclude<CalendarId, 'jalali'>[]).forEach(
      (calendar) => {
        const adapter = createCalendarAdapter(calendar);
        const date = adapter.fromParts(samples[calendar]);
        const day = adapter.addDays(date, 1);
        const month = adapter.addMonths(date, 1);

        expect(date).to.be.instanceOf(Date);
        expect(day).to.be.instanceOf(Date);
        expect(month).to.be.instanceOf(Date);
        expect(adapter.getParts(date)).to.deep.include(samples[calendar]);
      },
    );
  });

  it('provides an adapter-owned CalendarValue boundary', () => {
    const adapter = createCalendarAdapter('gregorian');
    const value = calendarValueFromParts(adapter, {
      year: 2021,
      month: 1,
      day: 31,
    });

    expect(value.date).to.be.instanceOf(Date);
    expect(value.parts).to.deep.include({ year: 2021, month: 1, day: 31 });
    expect(
      calendarValueFromDate(adapter, addCalendarMonths(adapter, value, 1)).parts,
    ).to.deep.include({ year: 2021, month: 2, day: 28 });
    expect(
      calendarValueFromDate(adapter, addCalendarDays(adapter, value, 1)).parts,
    ).to.deep.include({ year: 2021, month: 2, day: 1 });
  });

  it('does not allow mergeObject to modify the result prototype', () => {
    const changed = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(changed, '__proto__', {
      value: { polluted: true },
      enumerable: true,
    });
    Object.defineProperty(changed, 'constructor', {
      value: { polluted: true },
      enumerable: true,
    });

    const result = Core.mergeObject({ safe: true }, changed);

    expect(Object.getPrototypeOf(result)).to.equal(Object.prototype);
    expect((result as Record<string, unknown>).polluted).to.equal(undefined);
    expect(result).to.deep.equal({ safe: true });
  });

  it('round-trips Hebrew, Buddhist, and Chinese sample dates', () => {
    (['hebrew', 'buddhist', 'chinese'] as const).forEach((calendar) => {
      const adapter = createCalendarAdapter(calendar);
      const sample =
        calendar === 'hebrew'
          ? { year: 5785, month: 7, day: 6 }
          : calendar === 'buddhist'
            ? { year: 2568, month: 4, day: 4 }
            : { year: 2025, month: 3, day: 7 };
      const parts = adapter.getParts(adapter.fromParts(sample));
      expect(parts).to.deep.include(sample);
    });
  });

  it('preserves the Chinese leap-month marker', () => {
    const adapter = createCalendarAdapter('chinese');
    const leapMonth = adapter.getParts(new Date(Date.UTC(2023, 2, 22)));

    expect(leapMonth).to.deep.include({
      year: 2023,
      month: 2,
      day: 1,
      leapMonth: true,
    });
    expect(adapter.getParts(adapter.fromParts(leapMonth))).to.deep.include(
      leapMonth,
    );
  });

  it('rolls Hebrew month 13 into month 1 of the next year', () => {
    const adapter = createCalendarAdapter('hebrew');
    const next = adapter.addMonths(
      adapter.fromParts({ year: 5784, month: 13, day: 1 }),
      1,
    );

    expect(adapter.getParts(next)).to.deep.include({
      year: 5785,
      month: 1,
      day: 1,
    });
  });
});
