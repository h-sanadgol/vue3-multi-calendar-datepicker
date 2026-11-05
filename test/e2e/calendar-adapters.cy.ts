import { createCalendarAdapter, type CalendarId } from '../../src/calendars';
import { Core } from '../../src/components/utils/modules/core';
import PersianDate from '@alireza-ab/persian-date';

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

  it('round-trips the demo date with the tabular Hijri provider', () => {
    const adapter = createCalendarAdapter('hijri', {
      hijriProvider: 'tabular',
    });
    const gregorian = adapter.fromParts({ year: 1446, month: 10, day: 6 });
    expect(
      new PersianDate().fromGregorian(gregorian.getTime()).valueOf(),
    ).to.be.a('number');
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
