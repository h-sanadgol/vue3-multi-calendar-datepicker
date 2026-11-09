# Vue 3 Multi-Calendar Datepicker

[![npm version](https://img.shields.io/npm/v/%40h-sanadgol%2Fvue3-multi-calendar-datepicker)](https://www.npmjs.com/package/@h-sanadgol/vue3-multi-calendar-datepicker)
[![Documentation](https://img.shields.io/badge/docs-online-0f766e)](https://h-sanadgol.github.io/vue3-multi-calendar-datepicker)
[![License](https://img.shields.io/badge/license-MIT-22c55e)](./LICENSE)

A lightweight, customizable datepicker for Vue 3 and Nuxt 3 with support for multiple calendar systems in one component.

Use the same API for Jalali, Gregorian, Hijri, Hebrew, Thai Buddhist, and Chinese calendars, with single-date, range, time, and datetime selection modes.

## Features

- Vue 3 and Nuxt 3 support
- Jalali/Persian, Gregorian, Hijri, Hebrew, Thai Buddhist, and Chinese calendars
- Calendar-aware default locales with explicit locale overrides
- Hijri calculation providers: Umm al-Qura (default) and Tabular
- Single-date and range selection
- Date, time, and datetime pickers
- Keyboard-friendly navigation
- Configurable first day of week and weekly holidays
- Date and time boundaries through `from` and `to`
- Configurable minute and hour steps
- Clearable values, shortcuts, dual inputs, and icon-inside-input layouts
- Custom colors, styles, and locale configuration
- Disable dates or times with arrays, strings, functions, or regular expressions
- Responsive multi-month layouts

## Installation

```bash
npm install @h-sanadgol/vue3-multi-calendar-datepicker
```

```bash
pnpm add @h-sanadgol/vue3-multi-calendar-datepicker
```

## Vue 3 Usage

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import DatePicker from '@h-sanadgol/vue3-multi-calendar-datepicker';

  const date = ref('1404/01/15');
</script>

<template>
  <DatePicker
    v-model="date"
    calendar="jalali"
    mode="single"
    type="date"
    locale="fa"
    clearable
  />
</template>
```

The component includes its styles when bundled. No separate CSS import is required for the standard build.

## Calendar Examples

### Gregorian

```vue
<DatePicker
  v-model="date"
  calendar="gregorian"
  locale="en"
  mode="single"
  type="date"
/>
```

### Jalali / Persian

```vue
<DatePicker
  v-model="date"
  calendar="jalali"
  locale="fa"
  mode="single"
  type="date"
/>
```

### Hijri / Islamic

Umm al-Qura is the default Hijri calculation provider. Use `tabular` when a tabular Islamic calculation is required.

```vue
<DatePicker
  v-model="date"
  calendar="hijri"
  locale="ar"
  hijri-provider="ummalqura"
  mode="single"
  type="date"
/>
```

```vue
<DatePicker
  v-model="date"
  calendar="hijri"
  locale="ar"
  hijri-provider="tabular"
  mode="single"
  type="date"
/>
```

### Hebrew, Thai Buddhist, and Chinese

```vue
<DatePicker v-model="hebrewDate" calendar="hebrew" locale="he" />
<DatePicker v-model="thaiDate" calendar="buddhist" locale="th" />
<DatePicker v-model="chineseDate" calendar="chinese" locale="zh" />
```

These calendars use the browser's `Intl.DateTimeFormat` calendar support. Use a current browser/runtime with the relevant `Intl` calendar implementation enabled.

## Date, Time, and Datetime

```vue
<DatePicker v-model="time" type="time" mode="single" />

<DatePicker
  v-model="appointment"
  calendar="gregorian"
  type="datetime"
  mode="single"
  minute-step="5"
  hour-step="1"
/>
```

The default model formats are:

| Type       | Default format     |
| ---------- | ------------------ |
| `date`     | `YYYY-MM-DD`       |
| `time`     | `HH:mm`            |
| `datetime` | `YYYY-MM-DD HH:mm` |

The actual calendar representation depends on the selected calendar and the configured `format` or `input-format`.

## Range Selection

In range mode, `v-model` is an array containing the start and end values.

```vue
<script setup lang="ts">
  import { ref } from 'vue';

  const range = ref(['1404/01/01', '1404/01/15']);
</script>

<template>
  <DatePicker
    v-model="range"
    calendar="jalali"
    locale="fa"
    mode="range"
    type="date"
    auto-submit
  />
</template>
```

## Manual input and live synchronization

The input is editable by default. When a complete valid value is entered and
the field loses focus (or `Enter` is pressed), the component updates
`v-model`, the selected day, and the visible calendar month together. This
also works with the non-Jalali adapters; the adapter calendar remains the
source of truth for parsing, validation, and navigation.

```vue
<DatePicker
  v-model="date"
  calendar="hijri"
  locale="en"
  input-format="YYYY-MM-DD"
  @submit="onSubmit"
/>
```

Invalid characters are filtered according to the active mask. Invalid dates
are not committed, so the previous valid selection remains in place.

## Calendar vs. Locale

`calendar` controls the calendar system used for parsing, displaying, and navigating dates. `locale` controls the language and localized labels. They are independent:

```vue
<!-- Jalali calendar with English labels -->
<DatePicker v-model="date" calendar="jalali" locale="en" />

<!-- Gregorian calendar with Persian labels -->
<DatePicker v-model="date" calendar="gregorian" locale="fa" />
```

When `locale` is omitted, the component uses a calendar-aware default:

| Calendar      | Default locale |
| ------------- | -------------- |
| Jalali        | `fa`           |
| Gregorian     | `en`           |
| Hijri         | `ar`           |
| Hebrew        | `he`           |
| Thai Buddhist | `th`           |
| Chinese       | `zh`           |

## Model Calendar

By default, `modelValue` is serialized using the active calendar. Set `model-calendar` to serialize the value using another supported calendar while keeping the displayed calendar unchanged.

```vue
<DatePicker
  v-model="date"
  calendar="jalali"
  model-calendar="gregorian"
  locale="fa"
/>
```

Supported values are `active`, `jalali`, `gregorian`, `hijri`, `hebrew`, `buddhist`, and `chinese`.

For Chinese leap months, the model value preserves the leap marker with the `bis` suffix, for example `2023-02bis-01`.

## Week Configuration

Weekday values use JavaScript numbering: Sunday is `0` and Saturday is `6`.

```vue
<DatePicker
  v-model="date"
  calendar="gregorian"
  :week-starts-on="1"
  :weekend-days="[0, 6]"
/>
```

Use `week-starts-on="auto"` to use the calendar's default. If `weekend-days` is omitted, the component uses calendar-aware weekly holidays.

## Props

| Prop            | Type                                    | Default        | Description                                                                 |
| --------------- | --------------------------------------- | -------------- | --------------------------------------------------------------------------- |
| `calendar`      | `Calendar`                              | Locale-based   | `jalali`, `gregorian`, `hijri`, `hebrew`, `buddhist`, or `chinese`          |
| `modelCalendar` | `Calendar \| 'active'`                  | `'active'`     | Calendar used to serialize `modelValue`                                     |
| `type`          | `'date' \| 'time' \| 'datetime'`        | `'date'`       | Picker value type                                                           |
| `mode`          | `'single' \| 'range'`                   | `'range'`      | Single value or range selection                                             |
| `locale`        | `String`                                | Calendar-aware | UI language, with comma-separated fallback locales supported                |
| `hijriProvider` | `'ummalqura' \| 'tabular'`              | `'ummalqura'`  | Hijri calculation method                                                    |
| `format`        | `String`                                | Type-based     | `v-model` serialization format; independent from the input field format     |
| `inputFormat`   | `String`                                | Type-based     | Input field display and parsing format                                      |
| `displayFormat` | `String`                                | Type-based     | Footer display format; does not change `v-model` or input serialization     |
| `inputMask`     | `String \| Object`                      | Calendar-based | Input mask with `autoInsert`, `strict`, `allowedDigits`, and per-token `blocks` ranges |
| `from`          | `String`                                | `'1300'`       | Minimum selectable date/time                                                |
| `to`            | `String`                                | `'1499'`       | Maximum selectable date/time                                                |
| `column`        | `Number \| Record<number, number>`      | `{ 576: 1 }`   | Number of visible calendar columns by breakpoint                            |
| `weekStartsOn`  | `Number \| 'auto'`                      | `'auto'`       | First weekday, from `0` to `6`                                              |
| `weekendDays`   | `Number[]`                              | Calendar-aware | Weekly holiday weekdays                                                     |
| `minuteStep`    | `Number`                                | `1`            | Minute increment                                                            |
| `hourStep`      | `Number`                                | `1`            | Hour increment                                                              |
| `autoSubmit`    | `Boolean`                               | `true`         | Submit automatically after selection                                        |
| `clearable`     | `Boolean`                               | `false`        | Show a clear control                                                        |
| `clickOn`       | `'all' \| 'input' \| 'icon' \| 'none'`  | `'all'`        | Area that opens the picker                                                  |
| `modal`         | `Boolean`                               | `false`        | Use modal picker presentation                                               |
| `show`          | `Boolean`                               | `false`        | Control picker visibility                                                   |
| `label`         | `String`                                | —              | Input label                                                                 |
| `dualInput`     | `Boolean`                               | `false`        | Render separate inputs for a range                                          |
| `iconInside`    | `Boolean`                               | `false`        | Render the calendar icon inside the input                                   |
| `shortcut`      | `Boolean \| Object`                     | `false`        | Enable date/time shortcuts                                                  |
| `disable`       | `Array \| String \| Function \| RegExp` | —              | Disable dates or times                                                      |
| `localeConfig`  | `Object`                                | —              | Extend or override locale strings                                           |
| `styles`        | `Object`                                | —              | Custom component styles                                                     |
| `color`         | `String`                                | —              | Preset color: `blue`, `red`, `pink`, `orange`, `green`, `purple`, or `gray` |

The demo has a separate **Complete props guide** section with every prop in
this table, its type, default, purpose, and multiple copyable examples. The
section is available in English, فارسی, and العربية through the language
switcher, so the same API can be reviewed without changing the code examples.

**راهنمای فارسی:** در بخش «راهنمای کامل پراپ‌ها» هر پراپ ورودی با نوع، مقدار
پیش‌فرض، کاربرد و چند مثال توضیح داده شده است. زبان فارسی را از بالای دمو
انتخاب کنید.

**الدليل العربي:** يعرض قسم «الدليل الكامل للخصائص» كل خاصية مع النوع والقيمة
الافتراضية والوظيفة وأمثلة متعددة. اختر العربية من أعلى العرض التفاعلي.

### Input mask

`inputMask` accepts a format string or an object. When omitted, a calendar-aware
default is used. Object configuration can override the pattern per picker type:

```vue
<DatePicker
  v-model="date"
  calendar="gregorian"
  :input-mask="{
    date: {
      pattern: 'YYYY/MM/DD',
      placeholder: 'YYYY/MM/DD',
      allowedDigits: 'both',
      strict: true,
      autoInsert: true,
      blocks: {
        YYYY: { from: 1970, to: 2030 },
        MM: { from: 1, to: 12 },
        DD: { from: 1, to: 31 },
      },
    },
  }"
/>
```

With `autoInsert: true` (the default), users can type only the digits and the
mask inserts its literals as they go. For example, `050415` becomes
`05/04-15` for the pattern `jYY/jMM-jDD`. Set `autoInsert: false` when the
application should filter characters without inserting separators.

Date-like mask blocks behave like date blocks in IMask: month values are
limited to `01`–`12`, day values to `01`–`31`, hours to `00`–`23`, and minutes
and seconds to `00`–`59` while typing. With `strict: true`, complete calendar
dates are also validated on commit, so values such as `2025/02/31` are rejected.
For example:

```vue
<DatePicker
  v-model="date"
  calendar="gregorian"
  input-format="YYYY/MM/DD"
  :input-mask="{
    date: {
      pattern: 'YYYY/MM/DD',
      autoInsert: true,
      strict: true,
    },
  }"
/>
```

For per-token ranges, use the independent `blocks` configuration. It follows
the same idea as IMask's `MaskedRange`, but it is implemented inside this
component and does not install or depend on IMask:

```vue
<DatePicker
  v-model="dateTime"
  calendar="gregorian"
  input-format="YYYY/MM/DD HH:mm"
  :input-mask="{
    pattern: 'YYYY/MM/DD HH:mm',
    blocks: {
      YYYY: { from: 1970, to: 2030 },
      MM: { from: 1, to: 12 },
      DD: { from: 1, to: 31 },
      HH: { from: 0, to: 23 },
      mm: { from: 0, to: 59 },
    },
  }"
/>
```

The token names in `blocks` must match tokens in `pattern`. `jYYYY` can use
the `YYYY` block, and omitted ranges keep the built-in calendar-safe defaults.
The Interactive playground exposes **Custom mask blocks** to try these ranges
live and includes the generated configuration in its HTML example.

`allowedDigits` can be `latin`, `locale`, or `both`. The `format` prop controls
the serialized `v-model`; `inputFormat` controls the input representation.
The `displayFormat` prop controls only the human-readable footer label inside
the open picker. These three contracts are independent:

```vue
<DatePicker
  v-model="date"
  calendar="gregorian"
  format="YYYY-MM-DD"
  input-format="DD.MM.YYYY"
  display-format="D MMMM YYYY"
/>
```

### Format token guide

Formats use the Persian Date token convention:

| Token            | Meaning                            | Example         |
| ---------------- | ---------------------------------- | --------------- |
| `YYYY` / `jYYYY` | four-digit Gregorian / Jalali year | `2025` / `1404` |
| `YY` / `jYY`     | two-digit Gregorian / Jalali year  | `25` / `04`     |
| `MM` / `M`       | month, padded / unpadded           | `01` / `1`      |
| `DD` / `D`       | day, padded / unpadded             | `05` / `5`      |
| `HH` / `H`       | hour, padded / unpadded            | `08` / `8`      |
| `mm` / `m`       | minute, padded / unpadded          | `10` / `10`     |

For example, use `jYY/jMM/jDD` for a short Jalali date and `YY-MM-DD` for a
Gregorian date. `YY-mm-DD` is different: `mm` means minutes, so it is intended
for a date-time format such as `YY-MM-DD HH:mm`. `displayFormat` affects only
the footer shown inside the open calendar; use `inputFormat` for the text field
and `format` for the serialized `v-model` value.

When `inputMask` is omitted, the component uses a calendar-aware default:
`jYYYY/jMM/jDD` for Jalali and `YYYY-MM-DD` for the other date calendars.
Datetime and time inputs add the corresponding `HH:mm` portion. Use
`input-mask="calendar-default"` to make that choice explicit, or provide an
object with `date`, `datetime`, and `time` entries to customize each type.

The Interactive playground includes live fields for `inputFormat`, `inputMask`,
and `displayFormat`. Type directly into the preview input, then blur the field
to verify that both the selected day and the visible month follow the entered
value.

#### Quick guide in فارسی و العربية

**فارسی**

- **Input format** (`inputFormat`): قالبی است که متن داخل فیلد ورودی با آن
  خوانده و parse می‌شود؛ برای جلالی از `jYY/jMM/jDD` استفاده کنید.
- **Input mask** (`inputMask`): کاراکترها و ترتیب مجاز تایپ را کنترل می‌کند.
  با `autoInsert: true` جداکننده‌ها هنگام تایپ درج می‌شوند؛ مثلاً `050415`
  با mask `jYY/jMM-jDD` به `05/04-15` تبدیل می‌شود.
- **Display format** (`displayFormat`): فقط عنوان خوانای پایین تقویم باز را
  تغییر می‌دهد و مقدار فیلد ورودی یا `v-model` را تغییر نمی‌دهد.

**العربية**

- **Input format** (`inputFormat`): يحدد تنسيق النص الذي يقرأه الحقل؛ استخدم
  `jYY/jMM/jDD` للتاريخ الجلالي.
- **Input mask** (`inputMask`): يقيّد الأحرف وترتيب الإدخال. عند تفعيل
  `autoInsert: true` تتم إضافة الفواصل أثناء الكتابة؛ فمثلاً تتحول `050415`
  إلى `05/04-15` مع القناع `jYY/jMM-jDD`.
- **Display format** (`displayFormat`): يغير تسمية التاريخ أسفل التقويم المفتوح
  فقط، ولا يغير قيمة الحقل أو `v-model`.

### Custom input field

Use the `input` scoped slot to replace the native field while keeping the
picker's canonical value and handlers:

```vue
<DatePicker v-model="date" calendar="gregorian">
  <template #input="{ value, inputAttrs, open, onInput, onBlur, onKeydown }">
    <input
      v-bind="inputAttrs"
      :value="value"
      @focus="open"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeydown"
    />
  </template>
</DatePicker>
```

The slot also exposes `clear`, which can be connected to a custom clear
button. The default input remains available when the slot is omitted.

## Events

| Event               | Payload                | Description                             |
| ------------------- | ---------------------- | --------------------------------------- |
| `update:modelValue` | `string \| string[]`   | Emitted when the model value changes    |
| `select`            | Selected date          | Emitted when a date or time is selected |
| `submit`            | Selected date or dates | Emitted when the selection is submitted |
| `open`              | —                      | Emitted when the picker opens           |
| `close`             | —                      | Emitted when the picker closes          |
| `clear`             | —                      | Emitted when the value is cleared       |

## Nuxt 3

The base Vue package does not install Nuxt tooling. The `/nuxt` entry declares `@nuxt/kit` as an optional peer because Nuxt projects provide it; install `@nuxt/kit` explicitly only when your Nuxt setup does not already include it.

Add the module to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@h-sanadgol/vue3-multi-calendar-datepicker/nuxt'],
});
```

The module registers `DatePicker` globally. It can then be used directly in any component:

```vue
<DatePicker v-model="date" calendar="gregorian" locale="en" />
```

To enable the `usePersianDate` auto-import, enable the module option:

```ts
export default defineNuxtConfig({
  modules: [
    ['@h-sanadgol/vue3-multi-calendar-datepicker/nuxt', { PersianDate: true }],
  ],
});
```

## Development

```bash
pnpm install
pnpm dev
```

Available scripts:

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start the Vite demo application    |
| `pnpm lint`       | Run ESLint                         |
| `pnpm test`       | Run Cypress component tests        |
| `pnpm test:open`  | Open the Cypress test runner       |
| `pnpm build:lib`  | Build the library bundles          |
| `pnpm build:nuxt` | Build the Nuxt module              |
| `pnpm build`      | Build the Nuxt module and library  |
| `pnpm pretty`     | Format project files with Prettier |

## Project Structure

```text
src/
├── components/DatePicker.vue       # Main public component
├── calendars/                      # Calendar adapters and registry
├── nuxt/                           # Nuxt module and composables
└── App.vue                         # Interactive demo application
test/e2e/                           # Cypress component tests
docs/                               # Documentation site assets
```

Calendar adapters keep calendar-specific conversion and navigation logic separate from the picker UI. The Jalali implementation uses the bundled Persian date engine; the other calendar systems use `Intl.DateTimeFormat` adapters, with a dedicated tabular Hijri adapter.

## Documentation and Demo

- [Interactive documentation and API guide](https://h-sanadgol.github.io/vue3-multi-calendar-datepicker/)
- [Live library demo](https://h-sanadgol.github.io/vue3-multi-calendar-datepicker/demo/)
- [GitHub repository](https://github.com/h-sanadgol/vue3-multi-calendar-datepicker)
- [npm package](https://www.npmjs.com/package/@h-sanadgol/vue3-multi-calendar-datepicker)
- [Issue tracker](https://github.com/h-sanadgol/vue3-multi-calendar-datepicker/issues)

## Contributing

This project is actively developed with the help of AI-assisted development and code review. AI is used to explore implementation options, improve the code, write tests, and identify edge cases; changes are still reviewed and validated against the project's behavior and build requirements.

The project is open to community contributions. Issues and pull requests are welcome:

1. Keep the public API backward-compatible unless the change is intentional and documented.
2. Add or update tests for behavior changes.
3. Run `pnpm lint` and `pnpm build`.
4. Update the README or release notes when changing public behavior.

If you find a bug, an incorrect calendar conversion, a locale problem, or a documentation issue, please [open an issue](https://github.com/h-sanadgol/vue3-multi-calendar-datepicker/issues) with a minimal reproduction, the calendar and locale used, the browser/runtime, and the expected result. This helps the maintainers reproduce and fix the problem quickly.

## License

This project is released under the [MIT License](./LICENSE).

This project began from a copied working tree inspired by [@alireza-ab/vue3-persian-datepicker](https://github.com/alireza-ab/vue3-persian-datepicker), not from a direct fork workflow. Most of the current codebase has since been redesigned, extended, and adapted for multiple calendar systems. The original project and author are acknowledged for the foundation and inspiration; the current implementation is maintained independently in this repository.
