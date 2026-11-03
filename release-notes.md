# Release Notes

## 2.0.0 — Multi-calendar fork

### Package
- Renamed package to `@h-sanadgol/vue3-multi-calendar-datepicker`.
- Added calendar adapters for Jalali, Gregorian, Hijri, Hebrew, Thai Buddhist, and Chinese display.
- Added calendar-aware locales and configurable Hijri providers.
- Added `modelCalendar`, `weekStartsOn`, and `weekendDays` props.

## Historical fork improvements

This release includes the following improvements over the original package:

### New Features
- **minuteStep prop**: Control the step increment for adding minutes in time/datetime pickers
- **hourStep prop**: Control the step increment for adding hours in time/datetime pickers

### Bug Fixes
- Fixed issues with time navigation when using custom step values

### Documentation
- Added GitHub Pages documentation site
- Updated README with improved examples and prop descriptions
- Added sidebar navigation to documentation

### Package
- The historical package name was `@h-sanadgol/vue3-persian-datepicker`.
- Maintains original author credits

Original author: [Alireza Alibeiki](https://github.com/alireza-ab)

Install:
```bash
npm install @h-sanadgol/vue3-multi-calendar-datepicker
```
