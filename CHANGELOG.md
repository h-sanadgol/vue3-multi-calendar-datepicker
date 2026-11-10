# Changelog

## [2.1.0] - 2026-11-10

### Added

- Independent calendar adapters for Gregorian, Hijri, Hebrew, Thai Buddhist, and Chinese calendars.
- `modelCalendar` for serializing `v-model` independently from the visible calendar.
- Independent `format`, `inputFormat`, `displayFormat`, and `inputMask` contracts.
- Calendar-aware input masks with automatic separators, strict validation, digit policies, and custom token ranges.
- Manual input synchronization that moves the visible calendar to the committed date.
- Synchronized `input` scoped slot support.
- Expanded shortcut documentation and live playground examples.
- Multilingual prop documentation and live examples for advanced props.

### Fixed

- Dates before the Unix epoch being incorrectly disabled in non-Jalali calendars.
- Gregorian, Thai Buddhist, and Chinese date bounds and year/Now controls in the demo.
- Jalali format prefixes leaking into non-Jalali `v-model` values.
- `modelCalendar` changes not immediately updating `v-model`.
- Time mode in the demo using date bounds instead of time bounds.
- Invalid manual dates being accepted or normalized unexpectedly.

### Verification

- 13 Cypress component specs, 265 tests passing.
- ESLint passing.
- Library and Nuxt builds passing.

