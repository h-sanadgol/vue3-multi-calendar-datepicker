export type CalendarConstraintPart = 'year' | 'month' | 'date' | 'time';

const dayMilliseconds = 86_400_000;

function startOfUtcDay(value: Date): number {
  return Math.floor(value.getTime() / dayMilliseconds) * dayMilliseconds;
}

export function isWithinCalendarBounds(
  value: Date,
  from: Date,
  to: Date,
  part: CalendarConstraintPart,
): boolean {
  if (part === 'year' || part === 'month' || part === 'date') {
    const day = startOfUtcDay(value);
    return day >= startOfUtcDay(from) && day <= startOfUtcDay(to);
  }

  const timestamp = value.getTime();
  return timestamp >= from.getTime() && timestamp <= to.getTime();
}
