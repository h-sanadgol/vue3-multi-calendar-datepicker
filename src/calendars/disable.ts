export type DisableMatcher<T> =
  | string
  | RegExp
  | ((value: T) => boolean)
  | Array<string | RegExp>;

export type DisableMatchOptions<T> = {
  matchesString: (value: string) => boolean;
  format: (value: T) => string;
};

export function matchesDisable<T>(
  candidate: T,
  matcher: DisableMatcher<T>,
  options: DisableMatchOptions<T>,
): boolean {
  if (typeof matcher === 'string') {
    return options.matchesString(matcher);
  }

  if (matcher instanceof RegExp) {
    matcher.lastIndex = 0;
    const result = matcher.test(options.format(candidate));
    matcher.lastIndex = 0;
    return result;
  }

  if (typeof matcher === 'function') {
    return matcher(candidate);
  }

  return matcher.some((entry) => matchesDisable(candidate, entry, options));
}
