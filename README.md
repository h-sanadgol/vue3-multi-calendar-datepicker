# Vue3 Persian Datepicker

> **Note:** This is a fork of the original [@alireza-ab/vue3-persian-datepicker](https://github.com/alireza-ab/vue3-persian-datepicker) maintained by [Alireza Alibeiki](https://github.com/alireza-ab). All credits for the original work belong to the original author.

A datepicker component for select persian date.
It's very customizable and easily for use.

## Features

- **nuxt** support
- **single and range selection**
- select **date** and **time**
- select with **keyboard**
- customizable **style**
- localization
- **minute step** and **hour step** support for time selection

## SET (Improvements)

This fork includes the following improvements over the original package:

- **minuteStep prop**: Control the step increment for minute selection in time/datetime pickers
- **hourStep prop**: Control the step increment for hour selection in time/datetime pickers
- Time step bug fixes for better accuracy when navigating through hours and minutes

These features allow more flexible time picking, especially useful for appointment scheduling, time slot selection, and similar use cases.

## Documentation

For full documentation and examples, visit the [documentation site](https://h-sanadgol.github.io/vue3-persian-datepicker).

## Install

```shell
npm i @h-sanadgol/vue3-persian-datepicker
```

or

```shell
pnpm add @h-sanadgol/vue3-persian-datepicker
```

## Usage

```js
import DatePicker from '@h-sanadgol/vue3-persian-datepicker';

const app = Vue.createApp({
  components: { DatePicker },
});

app.mount('#app');
```

```html
<DatePicker />
```

## Basic Example

```html
<template>
  <DatePicker v-model="date" type="date" :minute-step="5" :hour-step="2" />
</template>
```

## Props

| Prop            | Type                                    | Default        | Description                                       |
| --------------- | --------------------------------------- | -------------- | ------------------------------------------------- |
| `type`          | `String`                                | `'date'`       | Type of picker: `date`, `time`, or `datetime`     |
| `format`        | `String`                                | `'YYYY-MM-DD'` | Format of the model value                         |
| `inputFormat`   | `String`                                | same as `type` | Format of the input value                         |
| `displayFormat` | `String`                                | `'?D ?MMMM'`   | Format shown in the footer                        |
| `from`          | `String`                                | `'1300'`       | Start date of the picker                          |
| `to`            | `String`                                | `'1499'`       | End date of the picker                            |
| `mode`          | `String`                                | `'range'`      | Selection mode: `single` or `range`               |
| `locale`        | `String`                                | `'fa'`         | Locale: `fa`, `en`, `fa,en`, etc.                 |
| `column`        | `Number \| Object`                      | `{ 576: 1 }`   | Number of columns                                 |
| `minuteStep`    | `Number`                                | `1`            | Step increment for adding minutes                 |
| `hourStep`      | `Number`                                | `1`            | Step increment for adding hours                   |
| `autoSubmit`    | `Boolean`                               | `true`         | Auto submit when selection is complete            |
| `clearable`     | `Boolean`                               | `false`        | Allow clearing the selected date                  |
| `modal`         | `Boolean`                               | `false`        | Show picker as modal                              |
| `show`          | `Boolean`                               | `false`        | Controlled visibility of picker                   |
| `clickOn`       | `String`                                | `'all'`        | Trigger picker on: `all`, `input`, `icon`, `none` |
| `label`         | `String`                                | `undefined`    | Label text                                        |
| `dualInput`     | `Boolean`                               | `false`        | Use two inputs for display                        |
| `iconInside`    | `Boolean`                               | `false`        | Show icon inside input                            |
| `shortcut`      | `Boolean \| Object`                     | `false`        | Shortcuts for quick selection                     |
| `disable`       | `Array \| String \| Function \| RegExp` | `undefined`    | Disable specific dates/times                      |
| `localeConfig`  | `Object`                                | `undefined`    | Custom locale configuration                       |
| `styles`        | `Object`                                | `undefined`    | Custom styles                                     |
| `color`         | `String`                                | `undefined`    | Preset color: `red`, `green`, `blue`, etc.        |

## Events

| Event               | Payload         | Description                          |
| ------------------- | --------------- | ------------------------------------ |
| `select`            | `date`          | Emitted when a date/time is selected |
| `submit`            | `date \| dates` | Emitted when selection is submitted  |
| `open`              | -               | Emitted when picker opens            |
| `close`             | -               | Emitted when picker closes           |
| `clear`             | -               | Emitted when selection is cleared    |
| `update:modelValue` | `value`         | Emitted when model value changes     |

## Nuxt Module

```js
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@h-sanadgol/vue3-persian-datepicker/nuxt'],
});
```

## License

Vue Persian Datepicker is available under the [MIT](https://opensource.org/licenses/MIT) license.
