<template>
  <div
    ref="root"
    :class="[
      'pdp',
      { 'pdp-range': mode === 'range' },
      { 'pdp-modal': modal },
      { 'pdp-dual': dualInput },
      { 'pdp-open': showDatePicker },
      lang.dir.input,
    ]"
  >
    <slot name="before">
      <label v-if="label" :for="attrs.firstInput.id" v-bind="attrs.label">
        {{ label }}
      </label>
    </slot>
    <div v-bind="attrs.div">
      <template v-for="(input, index) in inputs" :key="input"
        ><div
          v-if="!$slots.hasOwnProperty('icon') || $slots?.icon?.()?.length"
          :key="`icon-${input}`"
          :class="[
            'pdp-icon',
            { 'pdp-pointer': ['all', 'icon'].includes(clickOn) },
            { 'pdp-inside': iconInside },
          ]"
          @click="showPicker('icon', index)"
        >
          <slot name="icon">
            <PDPIcon :icon="type" width="23" height="23"></PDPIcon>
          </slot>
        </div>
        <slot name="input" v-bind="inputSlotProps(index)">
          <input
            ref="inputs"
            :value="displayValue[index] || ''"
            type="text"
            autocomplete="off"
            v-bind="attrs[input]"
            :placeholder="
              inputMaskConfig().placeholder || attrs[input].placeholder
            "
            @focus="showPicker('input', index)"
            @input="sanitizeInput(index, $event)"
            @blur="
              sanitizeInput(index, $event);
              commitInput(index);
            "
            @keydown="selectWithArrow"
          /> </slot
        ><button
          v-if="clearable"
          :key="`clear-${input}`"
          class="pdp-clear"
          type="button"
          @click="clear(input)"
        >
          <slot name="clear"><PDPIcon icon="clear"></PDPIcon></slot></button
      ></template>
    </div>
    <slot name="after"></slot>
    <PDPAlt
      v-if="attrs.alt.name"
      :name="attrs.alt.name"
      :format="formats.alt"
      :dates="altDates"
    />
    <div v-if="showDatePicker">
      <div class="pdp-overlay" @click="showDatePicker = false"></div>
      <div v-bind="attrs.picker" ref="pdpPicker">
        <div class="pdp-auto">
          <div v-if="type.includes('date')">
            <ul v-show="showMonthSelect" class="pdp-select-month">
              <li
                v-for="(month, index) in months"
                :key="index"
                :class="[
                  { selected: month.selected },
                  { disabled: month.disabled },
                ]"
                @click="changeSelectedMonth(index)"
              >
                {{ month.label }}
              </li>
            </ul>
            <ul
              v-show="showYearSelect"
              ref="pdpSelectYear"
              class="pdp-select-year"
            >
              <li
                v-for="(year, index) in years"
                :key="index"
                :class="{ selected: displayYear(displayDate) == year }"
                @click="changeSelectedYear(year)"
              >
                {{ year }}
              </li>
            </ul>
          </div>
          <div v-if="type.includes('date')" class="pdp-header">
            <div v-if="effectiveLocale.includes(',')" class="top">
              <div>{{ lang.translations.text }}</div>
              <button type="button" :tabindex="tabIndex" @click="changeLocale">
                {{ nextLocale }}
              </button>
            </div>
            <div class="bottom">
              <button
                tabindex="-1"
                type="button"
                :class="[
                  'pdp-arrow',
                  {
                    disabled: !checkDate(
                      calendarMonthDate(displayDate, -1),
                      'month',
                    ),
                  },
                ]"
                :title="lang.translations.prevMonth"
                @click="changeSelectedMonth('sub')"
              >
                <slot name="right-arrow"
                  ><PDPArrow
                    direction="right"
                    width="10"
                    height="10"
                    :inverse="lang.dir.picker == 'ltr'"
                  ></PDPArrow
                ></slot>
              </button>
              <div>
                <div v-for="(item, i) in columnCount" :key="i">
                  <button
                    class="pdp-month"
                    type="button"
                    tabindex="-1"
                    @click="showPart('month')"
                  >
                    {{
                      months[displayMonth(calendarMonthDate(displayDate, i))]
                        .label
                    }}</button
                  ><button
                    class="pdp-year"
                    type="button"
                    tabindex="-1"
                    @click="showPart('year')"
                  >
                    {{ displayYear(calendarMonthDate(displayDate, i)) }}
                  </button>
                </div>
              </div>
              <button
                tabindex="-1"
                type="button"
                :class="[
                  'pdp-arrow',
                  {
                    disabled: !checkDate(
                      calendarMonthDate(displayDate, 1),
                      'month',
                    ),
                  },
                ]"
                :title="lang.translations.nextMonth"
                @click="changeSelectedMonth('add')"
              >
                <slot name="left-arrow"
                  ><PDPArrow
                    direction="left"
                    width="10"
                    height="10"
                    :inverse="lang.dir.picker == 'ltr'"
                  ></PDPArrow
                ></slot>
              </button>
            </div>
          </div>
          <div ref="pdpMain" class="pdp-main">
            <div v-if="type.includes('date')" class="pdp-date">
              <div
                v-for="(item, i) in columnCount"
                :key="i"
                class="pdp-column"
                :data-column="i"
              >
                <div class="pdp-week">
                  <div
                    v-for="(weekday, index) in orderedWeekdays"
                    :key="index"
                    class="pdp-weekday"
                  >
                    {{ weekday }}
                  </div>
                </div>
                <div class="pdp-days">
                  <div v-for="(week, wIndex) in monthDays[i]" :key="wIndex">
                    <div
                      v-for="day in week"
                      :key="day.raw ? day.raw.toString() : undefined"
                      :class="[
                        'pdp-day',
                        { empty: day.empty },
                        { friday: day.friday },
                        { weekend: day.weekend },
                        { today: day.today },
                        { 'start-range': day.startRange },
                        { 'end-range': day.endRange },
                        { disabled: day.disabled },
                        { 'in-range': day.inRange },
                      ]"
                      :value="day.val"
                      @click="day.raw && selectDate(day.raw, 'date')"
                    >
                      {{ day.val }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="type.includes('time')" class="pdp-time inline">
              <div v-if="type == 'time'" class="pdp-column">
                <div v-for="(c, i) in columnCount" :key="i"></div>
              </div>
              <div
                :class="[
                  'pdp-moment',
                  { 'column-direction': mode == 'range' && columnCount == 1 },
                ]"
              >
                <div
                  v-for="(n, i) in mode == 'range' ? 2 : 1"
                  :key="n"
                  :class="[
                    {
                      disabled: selectedTimes[i] && isSelectedTimeDisabled(i),
                    }, // FIXME: go to method
                  ]"
                >
                  <div class="hour">
                    <button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'hour', 'add')"
                      @mousedown.prevent="startChangeTime(i, 'hour', 'add')"
                      @keydown.enter.prevent="startChangeTime(i, 'hour', 'add')"
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="up-arrow"><PDPArrow></PDPArrow></slot></button
                    >{{
                      selectedTimes[i]
                        ? selectedTimes[i].hour('HH')
                        : core.hour('HH')
                    }}<button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'hour', 'sub')"
                      @mousedown.prevent="startChangeTime(i, 'hour', 'sub')"
                      @keydown.enter.prevent="startChangeTime(i, 'hour', 'sub')"
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="down-arrow"
                        ><PDPArrow direction="down"></PDPArrow
                      ></slot>
                    </button>
                  </div>
                  :
                  <div class="minute">
                    <button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'minute', 'add')"
                      @mousedown.prevent="startChangeTime(i, 'minute', 'add')"
                      @keydown.enter.prevent="
                        startChangeTime(i, 'minute', 'add')
                      "
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="up-arrow"><PDPArrow></PDPArrow></slot></button
                    >{{
                      selectedTimes[i]
                        ? selectedTimes[i].minute('mm')
                        : core.minute('mm')
                    }}<button
                      type="button"
                      @touchstart.prevent="startChangeTime(i, 'minute', 'sub')"
                      @mousedown.prevent="startChangeTime(i, 'minute', 'sub')"
                      @keydown.enter.prevent="
                        startChangeTime(i, 'minute', 'sub')
                      "
                      @touchend.prevent="stopChangeTime"
                      @mouseup.prevent="stopChangeTime"
                      @keyup.enter.prevent="stopChangeTime"
                    >
                      <slot name="down-arrow"
                        ><PDPArrow direction="down"></PDPArrow
                      ></slot>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pdp-footer">
            <div>
              <slot name="footer"></slot>
              <small v-if="selectedDates[0]">
                {{ formatDateValue(selectedDates[0], formats.display) }}
              </small>
              <small v-if="selectedDates.length == 2">
                - {{ formatDateValue(selectedDates[1], formats.display) }}
              </small>
            </div>
            <div>
              <button
                v-if="checkDate(core, 'date')"
                class="pdp-today"
                type="button"
                :tabindex="tabIndex"
                @click="goToToday"
              >
                {{ lang.translations.now }}</button
              ><button
                v-if="
                  !autoSubmit &&
                  !selectedDates.some((date) => isInDisable(date))
                "
                class="pdp-submit"
                type="button"
                :tabindex="tabIndex"
                @click="submitDate()"
              >
                {{ lang.translations.submit }}
              </button>
            </div>
          </div>
        </div>
        <ul
          v-if="shortcuts && Object.keys(shortcuts).length > 0"
          class="pdp-shortcut"
        >
          <li
            v-for="(dates, name) in shortcuts"
            :key="name"
            :class="{
              selected: !dates.some(
                (date, i) =>
                  !date.isSame(
                    selectedDates[i] && selectedDates[i].toString('datetime'),
                  ),
              ),
            }"
            @click="selectShorcut(dates)"
          >
            {{ name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  //TODO: use scoped slots
  //TODO: add time config
  //TODO: add tip for days
  //TODO: test the project with attention and test in nuxt
  //TODO: refactor and write comment --> pay a high attention

  // ************************ Core ************************
  import { defineComponent, markRaw, type PropType } from 'vue';
  import { PersianDate, Core } from './utils/modules/core';
  import {
    createCalendarAdapter,
    type CalendarAdapter,
    type CalendarParts,
    type HijriProvider,
  } from '../calendars';
  // ************************ Types ************************
  import type {
    Obj,
    Attrs,
    Langs,
    RecursivePartial,
    Styles,
    Inputs,
    PickerPlace,
    TypePart,
    CalendarPart,
    Disable,
    Formats,
    MonthDays,
    Months,
    Shortcuts,
    DefaultDate,
    Calendar,
    Units,
    InputMask,
    InputMaskConfig,
  } from './utils/modules/types';
  // ************************ Components ************************
  import PDPArrow from './utils/components/PDPArrow.vue';
  import PDPIcon from './utils/components/PDPIcon.vue';
  import PDPAlt from './utils/components/PDPAlt.vue';

  const isClient = typeof window !== 'undefined';

  // PersianDate exposes overloaded methods whose structural type is not
  // compatible with Vue's inferred template proxy type. The helpers cast at
  // the runtime boundary after accepting the template's date-like object.
  type CalendarDateLike = object;
  type AltDateLike = { toString: (format?: string) => string };
  const jalaliDisableFormats = {
    date: 'jYYYY/jM/jD',
    datetime: 'jYYYY/jM/jD H:m',
    time: 'H:m',
  } as const;

  export { PersianDate };
  export default defineComponent({
    components: {
      PDPArrow,
      PDPIcon,
      PDPAlt,
    },
    inheritAttrs: false,
    props: {
      /**
       * the format of the model value
       * @type String
       * @see https://alireza-ab.ir/persian-date/formats#
       * @desc default value in "date" type is "YYYY-MM-DD"
       * 		default value in "datetime" type is "YYYY-MM-DD HH:mm"
       * 		default value in "time" type is "HH:mm"
       */
      format: {
        type: String,
      },

      /**
       * the format of the input value
       * @type String
       * @see https://alireza-ab.ir/persian-date/formats#
       * @desc default value equal to the value of "type" prop
       */
      inputFormat: {
        type: String,
      },

      /**
       * input mask configuration. A string is a pattern or
       * "calendar-default"; an object can customize each picker type.
       */
      inputMask: {
        type: [String, Object] as PropType<InputMask>,
      },

      /**
       * the format of the value that shows in the footer of picker
       * @type String
       * @see https://alireza-ab.ir/persian-date/formats#
       * @desc default value in "date" type is "?D ?MMMM"
       * 		default value in "datetime" type is "?D ?MMMM HH:mm"
       * 		default value in "time" type is "HH:mm"
       */
      displayFormat: {
        type: String,
      },

      /**
       * the type of picker
       * @default "date"
       * @type String
       * @values date | time | datetime
       * @since 2.0.0
       */
      type: {
        type: String as PropType<'date' | 'time' | 'datetime'>,
        default: 'date',
        validator: (val: string) => ['date', 'time', 'datetime'].includes(val),
      },

      /**
       * the date of start of the picker
       * @type String
       * @example 1400/7/1 | 1400-7
       */
      from: {
        type: String,
        default: (props: Obj) => (props.type === 'time' ? '' : '1300'),
      },

      /**
       * the date of end of the picker
       * @type String
       * @example 1400/7/1 | 1400-7
       */
      to: {
        type: String,
        default: (props: Obj) => (props.type === 'time' ? '23:59' : '1499'),
      },

      /**
       * show or hide the picker
       * @default false
       * @type Boolean
       */
      show: {
        default: false,
        type: Boolean,
      },

      /**
       * show the picker with click on the some sections
       * @default "all"
       * @type String
       * @values all | input | icon | none
       */
      clickOn: {
        default: 'all',
        type: String as PropType<'all' | 'input' | 'icon' | 'none'>,
        validator: (val: string) =>
          ['all', 'input', 'icon', 'none'].includes(val),
      },

      /**
       * show the picker in modal mode
       * @default true
       * @type Boolean
       */
      modal: {
        default: false,
        type: Boolean,
      },

      /**
       * text for label tag
       * @type String
       */
      label: {
        type: String,
      },

      /**
       * number of column
       * @default "{ 576: 1 }"
       * @type Object | Number
       * @desc 1. you can send the number of column
       *  	or send the object of the number of
       *  	column in the breakpoint.
       * 		2. if the breaking point in the object
       * 		is not specified, the default value it's 2
       */
      column: {
        default: () => ({ 576: 1 }),
        type: [Number, Object] as PropType<number | Record<number, number>>,
      },

      /**
       * minute Step
       * @default "1"
       * @type Number
       * @desc 1. you can send the number of step for minute.
       */
      minuteStep: {
        default: () => 1,
        type: [Number] as PropType<number>,
      },

      /**
       * hour Step
       * @default "1"
       * @type Number
       * @desc 1. you can send the number of step for hour.
       */
      hourStep: {
        default: () => 1,
        type: [Number] as PropType<number>,
      },

      /**
       * submit when date selected or not
       * @default true
       * @type Boolean
       */
      autoSubmit: {
        default: true,
        type: Boolean,
      },

      /**
       * mode of select date
       * @default "range"
       * @type String
       * @values range | single
       */
      mode: {
        default: 'range',
        type: String as PropType<'single' | 'range'>,
        validator: (val: string) => ['single', 'range'].includes(val),
      },

      /**
       * the locale of datepicker
       * @default calendar-aware (fa for jalali, en for gregorian, ar for hijri,
       * he for hebrew, th for buddhist, zh for chinese)
       * @type String
       * @values fa | en | fa,en |  en,fa
       * @desc Except above values, you can add
       *  	the language in "localeConfig" prop and use it.
       * @since 2.0.0
       */
      locale: {
        default: undefined,
        type: String,
      },

      /**
       * the calendar system used for the picker
       * @default undefined (uses the selected locale calendar)
       * @values jalali | gregorian
       */
      calendar: {
        type: String as PropType<Calendar>,
        validator: (val: string) =>
          [
            'jalali',
            'gregorian',
            'hijri',
            'hebrew',
            'buddhist',
            'chinese',
          ].includes(val),
      },

      /** Calendar used to serialize modelValue. Defaults to the active calendar for compatibility. */
      modelCalendar: {
        type: String as PropType<Calendar | 'active'>,
        default: 'active',
        validator: (val: string) =>
          val === 'active' ||
          [
            'jalali',
            'gregorian',
            'hijri',
            'hebrew',
            'buddhist',
            'chinese',
          ].includes(val),
      },

      /** First weekday as a JavaScript weekday (0=Sunday ... 6=Saturday). */
      weekStartsOn: {
        type: [Number, String] as PropType<number | 'auto'>,
        default: 'auto',
      },

      /** Weekly official holidays as JavaScript weekdays. */
      weekendDays: {
        type: Array as PropType<number[]>,
      },

      /**
       * Hijri calculation provider
       * @default "ummalqura"
       */
      hijriProvider: {
        type: String as PropType<HijriProvider>,
        default: 'ummalqura',
        validator: (val: string) => ['ummalqura', 'tabular'].includes(val),
      },

      /**
       * user can clear the selected dates or not
       * @default false
       * @type Boolean
       * @since 2.0.0
       */
      clearable: {
        default: false,
        type: Boolean,
      },

      /**
       * disable some dates or time
       * @type [Array, String, Function, RegExp]
       * @since 2.0.0
       */
      disable: {
        type: [Array, String, Function, RegExp] as PropType<Disable>,
      },

      /**
       * the config for locales
       * @type Object
       * @since 2.0.0
       */
      localeConfig: {
        type: Object as PropType<RecursivePartial<Langs>>,
      },

      /**
       * the styles of the picker
       * @type Object
       * @since 2.0.0
       */
      styles: {
        type: Object as PropType<Styles>,
      },

      /**
       * the color of the picker
       * @type String
       * @values red | pink | orange | green | purple | gray
       * @since 2.0.0
       */
      color: {
        type: String as PropType<
          'blue' | 'red' | 'pink' | 'orange' | 'green' | 'purple' | 'gray'
        >,
        validator: (val: string) =>
          ['blue', 'red', 'pink', 'orange', 'green', 'purple', 'gray'].includes(
            val,
          ),
      },

      /**
       * use two input for dispaly
       * @type Boolean
       * @default false
       * @since 2.2.0
       */
      dualInput: {
        type: Boolean,
        default: false,
      },

      /**
       * show icon inside of input
       * @type Boolean
       * @default false
       * @since 2.2.0
       */
      iconInside: {
        type: Boolean,
        default: false,
      },

      /**
       * shortcut for select date and time quickly
       * @type Boolean | Object
       * @since 2.2.0
       */
      shortcut: {
        type: [Boolean, Object] as PropType<boolean | Shortcuts>,
        default: false,
      },
    },
    emits: ['open', 'close', 'select', 'submit', 'clear', 'update:modelValue'],
    data() {
      return {
        core: new PersianDate(),
        onDisplay: undefined as PersianDate | undefined,
        fromDate: undefined as PersianDate | undefined,
        toDate: undefined as PersianDate | undefined,
        selectedDates: [] as PersianDate[],
        selectedTimes: [] as PersianDate[],
        showDatePicker: false,
        showYearSelect: false,
        showMonthSelect: false,
        showTopOfInput: false,
        displayValue: [] as string[],
        inputName: 'firstInput' as Inputs,
        pickerPlace: {} as PickerPlace,
        documentWidth: isClient ? window.innerWidth : Infinity,
        langs: Core.langs,
        currentLocale: (
          this.locale || this.defaultLocaleForCalendar(this.calendar)
        ).split(',')[0],
        interval: null as ReturnType<typeof setInterval> | null,
        resizeHandler: null as (() => void) | null,
        submitedValue: [] as PersianDate[],
      };
    },
    computed: {
      lang(): Langs[string] {
        return this.langs[this.currentLocale] || this.langs.en;
      },
      effectiveLocale(): string {
        return this.locale || this.defaultLocaleForCalendar(this.calendar);
      },
      activeCalendar(): Calendar {
        return this.calendar || this.lang.calendar;
      },
      calendarLang(): Langs[string] {
        return this.lang;
      },
      calendarWeekStart(): number {
        if (this.weekStartsOn !== 'auto') return Number(this.weekStartsOn);
        switch (this.activeCalendar) {
          case 'jalali':
          case 'hijri':
            return 6;
          default:
            return 0;
        }
      },
      calendarWeekendDays(): number[] {
        if (this.weekendDays) return this.weekendDays;
        switch (this.activeCalendar) {
          case 'jalali':
            return [5];
          case 'hijri':
            return [5, 6];
          case 'hebrew':
            return [6];
          default:
            return [0, 6];
        }
      },
      orderedWeekdays(): string[] {
        const labels = this.calendarLang.weekdays as unknown as string[];
        const sourceStart = this.currentLocale === 'fa' ? 6 : 0;
        return Array.from(
          { length: 7 },
          (_, index) =>
            labels[(this.calendarWeekStart - sourceStart + index + 7) % 7],
        );
      },
      calendarMonthNames(): string[] {
        const year = this.onDisplay
          ? this.getCalendarParts(this.onDisplay).year
          : undefined;
        return this.monthNamesForYear(year);
      },
      calendarAdapter(): CalendarAdapter | undefined {
        if (
          this.activeCalendar === 'jalali' ||
          this.activeCalendar === 'gregorian'
        )
          return undefined;
        return createCalendarAdapter(this.activeCalendar, {
          hijriProvider: this.hijriProvider,
        });
      },
      attrs(): Attrs {
        const attrs: Attrs = {
          div: { class: 'pdp-group' },
          label: { class: 'pdp-label' },
          alt: {},
          picker: { class: 'pdp-picker' },
          firstInput: { class: 'pdp-input' },
          secondInput: { class: 'pdp-input' },
        };
        for (const key in this.$attrs) {
          try {
            // @ts-expect-error type
            const [, group, attr] = key.match(
              /(div|label|alt|picker|firstInput|secondInput)-(.*)/,
            ) as [void, keyof Attrs, string];
            attrs[group][attr] = this.$attrs[key];
          } catch {
            attrs['firstInput'][key] = this.$attrs[key] as string;
          }
        }
        attrs.picker.class = [
          attrs.picker.class,
          {
            'pdp-top': this.pickerPlace.top,
            'pdp-left': this.pickerPlace.left,
            'pdp-right': this.pickerPlace.right,
          },
          this.lang.dir.picker,
        ];
        if (this.mode == 'single' && this.dualInput) {
          attrs['secondInput'].disabled = 'disabled';
        }
        if (this.showDatePicker) {
          attrs[this.inputName].class += ' pdp-focus';
        }
        return attrs;
      },
      altDates(): AltDateLike[] {
        return this.submitedValue as unknown as AltDateLike[];
      },
      displayDate(): PersianDate {
        return (this.onDisplay || this.core) as unknown as PersianDate;
      },
      years(): number[] {
        let start: number = this.displayYear(this.fromDate!);
        const end: number = this.displayYear(this.toDate!);
        return Array(end - start + 1)
          .fill(null)
          .map(() => start++);
      },
      columnCount(): number {
        let column = 2;
        if (Core.isNumber(this.column)) {
          column = this.column as number;
        } else {
          const breakpoint = Object.keys(this.column)
            .sort((a, b) => +a - +b)
            .find((bp) => this.documentWidth <= +bp);
          if (breakpoint) column = (this.column as Obj)[breakpoint] as number;
        }
        if (this.type.includes('time')) {
          const scale = column / (this.mode == 'single' ? 1 : 2);
          (this.$refs.root as HTMLElement).style.setProperty(
            '--time-scale',
            (scale > 1 ? scale : 1) + '',
          );
        }
        return column;
      },
      minuteStepCount(): number {
        let step = 1;
        if (Core.isNumber(this.minuteStep)) {
          step = this.minuteStep as number;
        }
        return step;
      },
      hourStepCount(): number {
        let step = 1;
        if (Core.isNumber(this.hourStep)) {
          step = this.hourStep as number;
        }
        return step;
      },
      monthDays(): MonthDays[][] {
        const months: MonthDays[][] = [];
        for (let i = 0; i < this.columnCount; i++) {
          let emptyCells;
          const monthDate = this.calendarMonthDate(this.onDisplay!, i);
          const selectedParts = this.getCalendarParts(monthDate);
          const selectedYear = selectedParts.year;
          const selectedMonth = selectedParts.month;
          const firstDay = this.calendarDayDate(monthDate, 1);
          emptyCells = this.calendarWeekdayOffset(firstDay);
          let daysOfMonthNumber = this.calendarDaysInMonth(
            selectedYear,
            selectedMonth,
          );
          const numberOfWeek = Math.ceil((daysOfMonthNumber + emptyCells) / 7);
          const month: MonthDays[] = [];
          let showDay = 1;
          for (let week = 0; week < numberOfWeek; week++) {
            month[week] = [];
            for (let day = 0; day < 7; day++) {
              if (emptyCells) {
                month[week][day] = { empty: true };
                --emptyCells;
              } else if (daysOfMonthNumber) {
                //FIXME: refactor
                const dayDate = this.calendarDayDate(monthDate, showDay);
                month[week][day] = {
                  friday: this.calendarWeekendDays.includes(
                    new Date(this.getDateTimestamp(dayDate)).getUTCDay(),
                  ),
                  weekend: this.calendarWeekendDays.includes(
                    new Date(this.getDateTimestamp(dayDate)).getUTCDay(),
                  ),
                  raw: dayDate,
                  startRange:
                    this.selectedDates[0] &&
                    this.isSameCalendarDate(this.selectedDates[0], dayDate),
                  endRange:
                    this.selectedDates[1] &&
                    this.isSameCalendarDate(this.selectedDates[1], dayDate),
                  inRange:
                    this.selectedDates.length == 2 &&
                    this.isBetweenSelectedDates(dayDate),
                  disabled:
                    !this.checkDate(dayDate, 'date') ||
                    this.isInDisable(dayDate),
                  today: this.isToday(dayDate),
                  val: showDay++,
                };
                --daysOfMonthNumber;
              } else month[week][day] = { empty: true };
            }
          }
          months.push(month);
        }
        return months;
      },
      months(): Months {
        const months: Months = {};
        const count =
          this.activeCalendar === 'hebrew'
            ? this.calendarMonthNames.length
            : 12;
        for (let i = 1; i <= count; i++) {
          months[i] = {
            label: this.calendarMonthNames[i - 1] || `Month ${i}`,
            selected: this.displayMonth(this.onDisplay!) == i,
            disabled: !this.checkDate(
              this.calendarMonthDate(
                this.onDisplay!,
                i - this.displayMonth(this.onDisplay!),
              ),
              'month',
            ),
          };
        }
        return months;
      },
      nextLocale(): string {
        const locales = this.effectiveLocale.split(',');
        const index = locales.indexOf(this.currentLocale);
        const locale = locales[index + 1] || locales[0];
        return this.langs[locale].translations.label;
      },
      formats(): Formats {
        const displayFormat: Obj<string, TypePart | 'datetime'> = {
          date: '?D ?MMMM',
          datetime: '?D ?MMMM HH:mm',
          time: 'HH:mm',
        };
        const format: Obj<string, TypePart | 'datetime'> = {
          date: 'YYYY-MM-DD',
          datetime: 'YYYY-MM-DD HH:mm',
          time: 'HH:mm',
        };
        return {
          model: this.format || format[this.type],
          input:
            this.inputFormat ||
            this.lang.inputFormat ||
            (this.calendarAdapter ? format[this.type] : this.type),
          display:
            this.displayFormat ||
            this.lang.displayFormat ||
            displayFormat[this.type],
          alt:
            (this.attrs.alt.format as string) ||
            this.format ||
            format[this.type],
        };
      },
      defaultDate(): DefaultDate {
        const prefix =
          this.type === 'time' ? this.core.toString('jYYYY/jMM/jDD') + ' ' : '';
        return {
          from: prefix + this.from,
          to: prefix + this.to,
        };
      },
      inputs(): Inputs[] {
        return !this.dualInput ? ['firstInput'] : ['firstInput', 'secondInput'];
      },
      tabIndex(): number | undefined {
        return (
          +(this.attrs.secondInput.tabindex || this.attrs.firstInput.tabindex) +
            1 || undefined
        );
      },
      shortcuts(): Shortcuts | false {
        if (!this.shortcut) {
          return false;
        }
        const shortcuts: Shortcuts = {};
        const part = this.type.includes('date') ? 'date' : 'time';
        let d = this.core.clone().now();
        if (part == 'time' && !this.validate(d, part))
          d = this.toDate!.clone().subDay().now();

        const checkDate = (dates: PersianDate[]) => {
          return this.mode === 'single'
            ? this.validate(dates[0], part)
            : dates.some((d) => this.validate(d, part)) &&
                !this.isDisableBetween(
                  ...(dates as [PersianDate, PersianDate]),
                );
        };
        const setShortcut = (obj: Shortcuts, fromProps = false) => {
          for (const phrase in obj) {
            const dates = fromProps
              ? obj[phrase].map((date: PersianDate) =>
                  part == 'date'
                    ? d.clone().fromJalali(date)
                    : d.clone().time(date),
                )
              : obj[phrase];
            if (checkDate(dates)) {
              shortcuts[phrase] =
                this.type == 'date'
                  ? dates.map((d: PersianDate) => d.startOf('date'))
                  : dates;
            }
          }
        };

        if (this.shortcut === true) {
          setShortcut(
            Core.getShortcuts(
              d,
              `${part}-${this.mode}`,
              this.lang.translations,
            )!,
          );
        } else {
          setShortcut(this.shortcut, true);
        }
        return shortcuts;
      },
    },
    watch: {
      show: {
        handler: function (val) {
          this.showDatePicker = val;
        },
      },
      calendar: {
        handler: function (val) {
          if (!this.locale)
            this.currentLocale = this.defaultLocaleForCalendar(val);
        },
      },
      showDatePicker: {
        handler: function (val) {
          if (val) this.$emit('open');
          else {
            if (!this.modal)
              document.removeEventListener('scroll', this.locate);
            this.$emit('close');
          }
        },
      },
      from: {
        handler: function (val) {
          this.fromDate = this.parseCalendarDate(val);
        },
      },
      to: {
        handler: function (val) {
          this.toDate = this.normalizeEndDate(
            this.parseCalendarDate(val),
            Core.getLastUnit(this.to, this.type),
          );
        },
      },
      mode: {
        handler: function (val) {
          if (val == 'single' && this.selectedDates.length == 2)
            this.selectedDates.pop();
        },
      },
      locale: {
        handler: function (val, oldVal) {
          const next = val || this.defaultLocaleForCalendar(this.calendar);
          const previous = oldVal || this.effectiveLocale;
          const index = previous.split(',').indexOf(this.currentLocale);
          this.currentLocale = next.split(',')[index] || next.split(',')[0];
          if (!this.langs[this.currentLocale]) this.currentLocale = 'en';
        },
      },
      localeConfig: {
        handler: function (val) {
          this.langs = Core.mergeObject(this.langs, val) as Langs;
        },
        deep: true,
      },
      styles: {
        handler: function (val) {
          Core.setStyles(val, this.$refs.root as HTMLElement);
        },
        deep: true,
      },
      color: {
        handler: function (val) {
          Core.setColor(val, this.$refs.root as HTMLElement);
        },
      },
    },
    beforeMount() {
      this.langs = Core.mergeObject(this.langs, this.localeConfig) as Langs;
    },
    mounted() {
      Core.setColor(this.color, this.$refs.root as HTMLElement);
      Core.setStyles(this.styles, this.$refs.root as HTMLElement);

      const calendar = this.activeCalendar;
      const internalCalendar: 'jalali' | 'gregorian' = this.calendarAdapter
        ? 'gregorian'
        : (calendar as 'jalali' | 'gregorian');
      this.fromDate = this.parseCalendarDate(this.defaultDate.from);
      this.toDate = this.normalizeEndDate(
        this.parseCalendarDate(this.defaultDate.to),
        Core.getLastUnit(this.to, this.type),
      ).calendar(internalCalendar);
      this.core.calendar(internalCalendar);

      const val = this.$attrs.modelValue as string | string[];
      if (val) {
        this.setDate(val);
      } else {
        const today = this.core.clone();
        if (this.type == 'date') today.startOf('date');
        if (this.checkDate(today, 'date')) {
          this.onDisplay = today;
        } else {
          this.onDisplay = this.nearestDate(today).startOf('date');
        }
      }
      this.resizeHandler = () => {
        this.documentWidth = window.innerWidth;
      };
      window.addEventListener('resize', this.resizeHandler);
      if (this.type != 'date') {
        this.onDisplay!.time(this.core as PersianDate);
      }
      this.showDatePicker = this.show;
    },
    beforeUnmount() {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
      document.removeEventListener('scroll', this.locate);
      if (this.$refs.pdpMain) {
        (this.$refs.pdpMain as HTMLElement).removeEventListener(
          'mouseover',
          this.selectInRangeDate,
        );
      }
      this.stopChangeTime();
    },
    methods: {
      defaultLocaleForCalendar(calendar?: Calendar): string {
        switch (calendar) {
          case 'jalali':
            return 'fa';
          case 'hijri':
            return 'ar';
          case 'hebrew':
            return 'he';
          case 'buddhist':
            return 'th';
          case 'chinese':
            return 'zh';
          case 'gregorian':
            return 'en';
          default:
            return 'fa';
        }
      },
      isHebrewLeapYear(year: number): boolean {
        return (7 * year + 1) % 19 < 7;
      },
      monthNamesForYear(year?: number): string[] {
        if (this.activeCalendar === 'jalali') {
          return this.lang.months as unknown as string[];
        }

        const fallback: Record<string, string[]> = {
          hijri:
            this.currentLocale === 'ar'
              ? [
                  'محرم',
                  'صفر',
                  'ربيع الأول',
                  'ربيع الثاني',
                  'جمادى الأولى',
                  'جمادى الثانية',
                  'رجب',
                  'شعبان',
                  'رمضان',
                  'شوال',
                  'ذو القعدة',
                  'ذو الحجة',
                ]
              : [
                  'Muharram',
                  'Safar',
                  'Rabi al-awwal',
                  'Rabi al-thani',
                  'Jumada al-awwal',
                  'Jumada al-thani',
                  'Rajab',
                  'Sha’ban',
                  'Ramadan',
                  'Shawwal',
                  'Dhu al-Qadah',
                  'Dhu al-Hijjah',
                ],
          hebrew: this.isHebrewLeapYear(year || 5785)
            ? this.currentLocale === 'he'
              ? [
                  'תשרי',
                  'חשוון',
                  'כסלו',
                  'טבת',
                  'שבט',
                  'אדר א׳',
                  'אדר',
                  'ניסן',
                  'אייר',
                  'סיוון',
                  'תמוז',
                  'אב',
                  'אלול',
                ]
              : [
                  'Tishri',
                  'Cheshvan',
                  'Kislev',
                  'Tevet',
                  'Shevat',
                  'Adar I',
                  'Adar II',
                  'Nisan',
                  'Iyar',
                  'Sivan',
                  'Tammuz',
                  'Av',
                  'Elul',
                ]
            : this.currentLocale === 'he'
              ? [
                  'תשרי',
                  'חשוון',
                  'כסלו',
                  'טבת',
                  'שבט',
                  'אדר',
                  'ניסן',
                  'אייר',
                  'סיוון',
                  'תמוז',
                  'אב',
                  'אלול',
                ]
              : [
                  'Tishri',
                  'Cheshvan',
                  'Kislev',
                  'Tevet',
                  'Shevat',
                  'Adar',
                  'Nisan',
                  'Iyar',
                  'Sivan',
                  'Tammuz',
                  'Av',
                  'Elul',
                ],
        };
        if (this.activeCalendar === 'hijri') return fallback.hijri;
        if (this.activeCalendar === 'chinese') {
          if (this.currentLocale === 'zh')
            return [
              '正月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '冬月',
              '腊月',
            ];
          const prefix =
            this.currentLocale === 'fa'
              ? 'ماه'
              : this.currentLocale === 'ar'
                ? 'الشهر'
                : 'Month';
          return Array.from(
            { length: 12 },
            (_, index) => `${prefix} ${index + 1}`,
          );
        }

        const count =
          this.activeCalendar === 'hebrew' ? fallback.hebrew.length : 12;
        const configuredMonths = (
          this.localeConfig as Record<string, { months?: unknown }> | undefined
        )?.[this.currentLocale]?.months;
        if (
          Array.isArray(configuredMonths) &&
          configuredMonths.length >= count
        ) {
          return configuredMonths as string[];
        }
        const names: string[] = [];
        const calendarName =
          this.activeCalendar === 'buddhist'
            ? 'buddhist'
            : this.activeCalendar === 'hebrew'
              ? 'hebrew'
              : 'gregory';
        const locale = `${this.currentLocale}-u-ca-${calendarName}-nu-latn`;
        const formatter = new Intl.DateTimeFormat(locale, {
          month: 'long',
          timeZone: 'UTC',
        });
        for (let index = 1; index <= count; index++) {
          try {
            const date = this.calendarAdapter
              ? this.calendarAdapter.fromParts({
                  year: year || 1,
                  month: index,
                  day: 1,
                })
              : new Date(
                  Date.UTC(
                    (year || 1970) -
                      (this.activeCalendar === 'buddhist' ? 543 : 0),
                    index - 1,
                    1,
                  ),
                );
            names.push(formatter.format(date));
          } catch {
            break;
          }
        }
        return names.length
          ? names
          : fallback.hebrew || (this.lang.months as unknown as string[]);
      },
      usesCalendarAdapter(): boolean {
        return this.activeCalendar !== 'jalali';
      },
      getCalendarParts(date: CalendarDateLike): CalendarParts {
        const value = date as PersianDate;
        if (this.calendarAdapter) {
          return this.calendarAdapter.getParts(
            new Date(this.getDateTimestamp(value)),
          );
        }
        const native = value
          .clone()
          .calendar(
            this.activeCalendar === 'gregorian' ? 'gregorian' : 'jalali',
          );
        return {
          year: native.year(),
          month: native.month(),
          day: native.date(),
          hour: native.hour(),
          minute: native.minute(),
          second: native.second(),
          millisecond: native.millisecond(),
        };
      },
      getDateTimestamp(date: CalendarDateLike): number {
        const value = date as PersianDate;
        const timestamp = Number(value.valueOf());
        if (Number.isFinite(timestamp)) return timestamp;
        const native = value.toDate();
        return Number.isFinite(Number(native))
          ? Number(native)
          : Date.parse(String(native));
      },
      getDayTimestamp(date: CalendarDateLike): number {
        return (
          Math.floor(this.getDateTimestamp(date) / 86_400_000) * 86_400_000
        );
      },
      normalizeEndDate(date: PersianDate, unit: Units): PersianDate {
        return markRaw(
          new PersianDate()
            .fromGregorian(this.getDateTimestamp(date))
            .endOf(unit),
        );
      },
      fromCalendarParts(parts: CalendarParts): PersianDate {
        if (this.calendarAdapter) {
          return markRaw(
            new PersianDate().fromGregorian(
              this.calendarAdapter.fromParts(parts).getTime(),
            ),
          );
        }
        const values: [number, number, number, number, number, number, number] =
          [
            parts.year,
            parts.month,
            parts.day,
            parts.hour || 0,
            parts.minute || 0,
            parts.second || 0,
            parts.millisecond || 0,
          ];
        return markRaw(
          this.activeCalendar === 'gregorian'
            ? this.core.clone().fromGregorian(values)
            : this.core.clone().fromJalali(values),
        );
      },
      displayYear(date: CalendarDateLike): number {
        return this.getCalendarParts(date).year;
      },
      displayMonth(date: CalendarDateLike): number {
        return this.getCalendarParts(date).month;
      },
      displayDay(date: CalendarDateLike): number {
        return this.getCalendarParts(date).day;
      },
      calendarMonthDate(date: CalendarDateLike, amount: number): PersianDate {
        const value = date as PersianDate;
        if (!this.calendarAdapter)
          return markRaw(value.clone().addMonth(amount));
        return markRaw(
          new PersianDate().fromGregorian(
            this.calendarAdapter
              .addMonths(new Date(this.getDateTimestamp(value)), amount)
              .getTime(),
          ),
        );
      },
      calendarDayDate(date: CalendarDateLike, day: number): PersianDate {
        const value = date as PersianDate;
        if (!this.calendarAdapter) return markRaw(value.clone().date(day));
        return this.fromCalendarParts({
          ...this.getCalendarParts(date),
          day,
        });
      },
      calendarAddDays(date: PersianDate, amount: number): PersianDate {
        if (!this.calendarAdapter) return markRaw(date.clone().addDay(amount));
        return markRaw(
          new PersianDate().fromGregorian(
            this.calendarAdapter
              .addDays(new Date(this.getDateTimestamp(date)), amount)
              .getTime(),
          ),
        );
      },
      calendarMonthKey(date: CalendarDateLike): string {
        const parts = this.getCalendarParts(date);
        return `${parts.year}-${parts.month}-${parts.leapMonth ? 'leap' : 'normal'}`;
      },
      calendarDaysInMonth(year: number, month: number): number {
        if (this.calendarAdapter) {
          return this.calendarAdapter.daysInMonth(year, month);
        }
        return this.core.getDaysInMonth(year, month);
      },
      calendarWeekdayOffset(date: CalendarDateLike): number {
        const weekday = new Date(this.getDateTimestamp(date)).getUTCDay();
        return (weekday - this.calendarWeekStart + 7) % 7;
      },
      isToday(date: CalendarDateLike): boolean {
        return this.getDayTimestamp(date) === this.getDayTimestamp(this.core);
      },
      isSameCalendarDate(
        first: CalendarDateLike,
        second: CalendarDateLike,
      ): boolean {
        const a = this.getCalendarParts(first);
        const b = this.getCalendarParts(second);
        return (
          a.year === b.year &&
          a.month === b.month &&
          a.day === b.day &&
          Boolean(a.leapMonth) === Boolean(b.leapMonth)
        );
      },
      isBetweenSelectedDates(date: CalendarDateLike): boolean {
        if (this.selectedDates.length !== 2) return false;
        const value = this.getDayTimestamp(date);
        const start = this.getDayTimestamp(this.selectedDates[0]);
        const end = this.getDayTimestamp(this.selectedDates[1]);
        return value > Math.min(start, end) && value < Math.max(start, end);
      },
      formatDateValue(date: CalendarDateLike, format: string): string {
        const value = date as PersianDate;
        if (!this.calendarAdapter) return value.toString(format);
        const parts = this.getCalendarParts(date);
        const pad = (value: number, size = 2) =>
          String(value).padStart(size, '0');
        const leapSuffix =
          this.activeCalendar === 'chinese' && parts.leapMonth ? 'bis' : '';
        const leapPlaceholder = leapSuffix ? '__LEAP__' : '';
        const monthName =
          this.monthNamesForYear(parts.year)[parts.month - 1] ||
          `Month ${parts.month}`;
        const paddedMonth = `${pad(parts.month)}${leapPlaceholder}`;
        const shortMonth = `${parts.month}${leapPlaceholder}`;
        return format
          .replace('?D', String(parts.day))
          .replace('?MMMM', monthName)
          .replace('MMMM', monthName)
          .replace('YYYY', String(parts.year))
          .replace('YY', String(parts.year).slice(-2))
          .replace('MM', paddedMonth)
          .replace('M', shortMonth)
          .replace('DD', pad(parts.day))
          .replace('D', String(parts.day))
          .replace('HH', pad(parts.hour || 0))
          .replace('H', String(parts.hour || 0))
          .replace('mm', pad(parts.minute || 0))
          .replace('m', String(parts.minute || 0))
          .replace('ss', pad(parts.second || 0))
          .replace('s', String(parts.second || 0))
          .replace(/__LEAP__/g, leapSuffix);
      },
      formatModelValue(date: CalendarDateLike): string {
        const target =
          this.modelCalendar === 'active'
            ? this.activeCalendar
            : this.modelCalendar;
        if (!target || target === this.activeCalendar) {
          return this.formatDateValue(date, this.formats.model);
        }
        const value = date as PersianDate;
        const timestamp = this.getDateTimestamp(value);
        if (target === 'jalali' || target === 'gregorian') {
          return new PersianDate()
            .fromGregorian(timestamp)
            .calendar(target)
            .toString(this.formats.model);
        }
        const adapter = createCalendarAdapter(target, {
          hijriProvider: this.hijriProvider,
        });
        const parts = adapter.getParts(new Date(timestamp));
        const pad = (part: number, size = 2) =>
          String(part).padStart(size, '0');
        const leapSuffix = target === 'chinese' && parts.leapMonth ? 'bis' : '';
        const leapPlaceholder = leapSuffix ? '__LEAP__' : '';
        return this.formats.model
          .replace('YYYY', String(parts.year))
          .replace('YY', String(parts.year).slice(-2))
          .replace('MM', `${pad(parts.month)}${leapPlaceholder}`)
          .replace('M', `${parts.month}${leapPlaceholder}`)
          .replace('DD', pad(parts.day))
          .replace('D', String(parts.day))
          .replace('HH', pad(parts.hour || 0))
          .replace('H', String(parts.hour || 0))
          .replace('mm', pad(parts.minute || 0))
          .replace('m', String(parts.minute || 0))
          .replace('ss', pad(parts.second || 0))
          .replace('s', String(parts.second || 0))
          .replace(/__LEAP__/g, leapSuffix);
      },
      parseCalendarParts(value: string): CalendarParts {
        const values = value.split(/[-/ .,\\:]/).filter(Boolean);
        const monthToken = values[1] || '1';
        const leapMonth =
          this.activeCalendar === 'chinese' && /bis$/i.test(monthToken);
        const month = Number.parseInt(monthToken.replace(/bis$/i, ''), 10);
        return {
          year: Number(values[0]),
          month: month || 1,
          day: Number(values[2]) || 1,
          hour: Number(values[3]) || 0,
          minute: Number(values[4]) || 0,
          second: Number(values[5]) || 0,
          ...(leapMonth ? { leapMonth: true } : {}),
        };
      },
      parseCalendarDate(value: string): PersianDate {
        if (this.calendarAdapter) {
          return this.fromCalendarParts(this.parseCalendarParts(value));
        }
        const date = this.core.clone();
        const sourceCalendar: 'jalali' | 'gregorian' =
          this.calendar === 'gregorian' ||
          (value.includes('-') && !value.includes('/'))
            ? 'gregorian'
            : 'jalali';
        if (!/[-/ ]/.test(value)) {
          return date
            .calendar(sourceCalendar)
            .parse(value)
            .calendar(this.activeCalendar as 'jalali' | 'gregorian');
        }
        const parsed =
          sourceCalendar === 'gregorian'
            ? date.fromGregorian(value)
            : date.fromJalali(value);
        return parsed.calendar(this.activeCalendar as 'jalali' | 'gregorian');
      },
      showPart(part: CalendarPart): void {
        if (part == 'year') {
          this.showMonthSelect = false;
          this.showYearSelect = !this.showYearSelect;
          if (this.showYearSelect) {
            this.$nextTick(() => {
              const selectedYearTop = (
                (this.$refs.pdpSelectYear as HTMLElement).querySelector(
                  'li.selected',
                ) as HTMLLIElement
              ).offsetTop;
              (this.$refs.pdpSelectYear as HTMLElement).scroll({
                top: selectedYearTop,
                behavior: 'smooth',
              });
            });
          }
        } else if (part == 'month') {
          this.showYearSelect = false;
          this.showMonthSelect = !this.showMonthSelect;
        }
      },
      changeSelectedMonth(month: 'add' | 'sub' | number): void {
        const clone = this.onDisplay!.clone();
        if (month == 'add') {
          this.onDisplay = this.calendarMonthDate(this.onDisplay!, 1);
        } else if (month == 'sub') {
          this.onDisplay = this.calendarMonthDate(this.onDisplay!, -1);
        } else {
          const parts = this.getCalendarParts(this.onDisplay!);
          this.onDisplay = this.fromCalendarParts({
            ...parts,
            month,
            day: Math.min(
              parts.day,
              this.calendarDaysInMonth(parts.year, month),
            ),
          });
        }
        if (this.checkDate(this.onDisplay, 'month'))
          this.showMonthSelect = false;
        else this.onDisplay = clone;
      },
      changeSelectedYear(year: number): void {
        const parts = this.getCalendarParts(this.onDisplay!);
        this.onDisplay = this.fromCalendarParts({
          ...parts,
          year,
          day: Math.min(parts.day, this.calendarDaysInMonth(year, parts.month)),
        });
        if (!this.checkDate(this.onDisplay, 'date'))
          this.onDisplay = this.nearestDate(this.onDisplay as PersianDate);
        this.showYearSelect = false;
      },
      validate(date: PersianDate, part: TypePart): boolean {
        if (!this.checkDate(date, part) || this.isInDisable(date)) return false;
        return true;
      },
      isDisableBetween(first: PersianDate, second: PersianDate): boolean {
        if (!this.disable) return false;
        if (this.calendarAdapter) {
          const firstTimestamp = this.getDateTimestamp(first);
          const secondTimestamp = this.getDateTimestamp(second);
          const lower = Math.min(firstTimestamp, secondTimestamp);
          const upper = Math.max(firstTimestamp, secondTimestamp);
          const timestampFor = (date: PersianDate): number =>
            this.type === 'date'
              ? this.getDayTimestamp(date)
              : this.getDateTimestamp(date);
          const disabledValues: string[] =
            typeof this.disable === 'string'
              ? [this.disable]
              : Array.isArray(this.disable)
                ? this.disable.filter(
                    (value): value is string => typeof value === 'string',
                  )
                : [];

          if (
            disabledValues.some((value) => {
              const disabled =
                this.type === 'time'
                  ? second.clone().time(value)
                  : this.parseCalendarDate(value);
              const timestamp = timestampFor(disabled);
              return timestamp > lower && timestamp < upper;
            })
          ) {
            return true;
          }

          if (this.type !== 'time') {
            let cursor = new Date(upper);
            while (true) {
              cursor = this.calendarAdapter.addDays(cursor, -1);
              if (cursor.getTime() <= lower) break;
              if (
                this.isInDisable(
                  this.fromCalendarParts(this.calendarAdapter.getParts(cursor)),
                )
              )
                return true;
            }
          }
          return false;
        }

        if (this.type != 'datetime' && Core.isString(this.disable)) {
          const date =
            this.type == 'time'
              ? second.clone().time(this.disable as string)
              : this.disable;
          return this.core
            .clone()
            .parse(date as PersianDate | string)
            .isBetween(first.toString(), second.toString());
        } else if (
          this.type != 'datetime' &&
          Array.isArray(this.disable) &&
          this.disable.some((date) => Core.isString(date))
        ) {
          return this.disable.some((date) => {
            if (this.type == 'time')
              date = second
                .clone()
                .time(date as string)
                .toString();
            return this.core
              .clone()
              .parse(date as string)
              .isBetween(first, second);
          });
        } else if (this.type != 'time') {
          const inRangeDate = second.clone().startOf('date').subDay();
          while (!inRangeDate.isSameOrBefore(first)) {
            if (this.isInDisable(inRangeDate)) return true;
            inRangeDate.subDay();
          }
        }
        return false;
      },
      selectDate(date: PersianDate, part: TypePart): number {
        let isValid = this.validate(date, part);
        if (!isValid) {
          return -1;
        } else if (this.mode == 'range' && this.selectedDates.length == 1) {
          isValid = !this.isDisableBetween(
            this.selectedDates[0] as PersianDate,
            date,
          );
          if (!isValid) {
            return -2;
          }
        }
        if (this.type == 'date' && !this.calendarAdapter) {
          date.startOf('date');
        }
        if (this.mode == 'single') {
          this.selectedDates = [date];
        } else if (this.mode == 'range') {
          (this.$refs.pdpMain as HTMLElement).addEventListener(
            'mouseover',
            this.selectInRangeDate,
          );
          if (this.selectedDates.length === 0) {
            this.selectedDates[0] = date;
            this.inputName = 'secondInput';
          } else if (this.inputName === 'secondInput') {
            this.inputName = 'firstInput';
            if (!date.isBefore(this.selectedDates[0] as PersianDate)) {
              this.selectedDates[1] = date;
            } else {
              if (this.selectedDates.length === 1)
                this.selectedDates.unshift(date);
              else {
                this.selectedDates = [date];
                this.inputName = 'secondInput';
              }
            }
          } else {
            this.selectedDates = [date];
            this.inputName = 'secondInput';
          }
          if (this.selectedDates.length == 2) {
            (this.$refs.pdpMain as HTMLElement).removeEventListener(
              'mouseover',
              this.selectInRangeDate,
            );
          }
        }

        if (this.type == 'datetime') {
          this.selectedDates = this.selectedDates.map((d, i) => {
            if (this.selectedTimes[i]) {
              d.time(this.selectedTimes[i] as PersianDate);
            }
            this.selectedTimes[i] = d;
            return d;
          });
        }

        this.$emit('select', date);
        if (
          this.autoSubmit &&
          (this.mode !== 'range' ||
            (this.mode === 'range' && this.selectedDates.length == 2))
        ) {
          this.submitDate();
          return 1;
        }
        return 0;
      },
      setModel(date?: PersianDate | PersianDate[] | string | string[]): void {
        if (date === undefined) {
          date = this.selectedDates.map((el) => this.formatModelValue(el));
          if (this.mode == 'single') date = date[0];
        }
        this.$emit('update:modelValue', date);
      },
      goToToday(): void {
        this.showMonthSelect = this.showYearSelect = false;
        this.onDisplay = this.core.now().clone();
        if (this.type.includes('time') && this.selectedDates.length) {
          const lastIndex = this.selectedDates.length - 1;
          const time = this.selectedDates[lastIndex];
          time.time(this.onDisplay as PersianDate);
          if (this.selectedTimes[lastIndex]) {
            this.selectedTimes[lastIndex] = time.clone();
          }
          if (
            this.autoSubmit &&
            this.checkDate(time, 'time') &&
            !this.isInDisable(time as PersianDate)
          )
            this.submitDate(false);
        }
        if (this.type.includes('date'))
          this.$nextTick(() => {
            const root = this.$refs.root as HTMLElement;
            const today = root?.querySelector('.pdp-day.today');
            if (!today) return;
            today.classList.add('tada');
            setTimeout(() => {
              today.classList.remove('tada');
            }, 1000);
          });
      },
      checkDate(date: unknown, part: CalendarPart | TypePart): boolean {
        if (this.calendarAdapter) {
          const current = Core.isPersianDate(date)
            ? (date as PersianDate)
            : this.parseCalendarDate(date as string);
          const currentTime = this.getDateTimestamp(current);
          const fromTime = this.getDateTimestamp(this.fromDate!);
          const toTime = this.getDateTimestamp(this.toDate!);
          if (part === 'year' || part === 'month' || part === 'date') {
            const currentDay = this.getDayTimestamp(current);
            return (
              currentDay <= this.getDayTimestamp(this.toDate!) &&
              currentDay >= this.getDayTimestamp(this.fromDate!)
            );
          }
          return currentTime >= fromTime && currentTime <= toTime;
        }
        let from, to;
        if (!Core.isPersianDate(date))
          date = this.core.clone().parse(date as PersianDate);
        switch (part) {
          case 'year':
            from = this.fromDate!.toString('?YYYY');
            to = this.toDate!.toString('?YYYY');
            break;
          case 'month':
            from = this.fromDate!.toString('?YYYY/?MM');
            to = this.toDate!.toString('?YYYY/?MM');
            break;
          case 'date':
            from = this.fromDate!.toString();
            to = this.toDate!.toString();
            break;
          case 'time':
            from = this.fromDate!.toString(
              this.type.includes('time') ? 'datetime' : 'date',
            );
            to = this.toDate!.toString(
              this.type.includes('time') ? 'datetime' : 'date',
            );
            break;
        }
        return (date as PersianDate).isBetween(from, to, '[]');
      },
      isInDisable(date: CalendarDateLike, disable?: Disable): boolean {
        if (!this.disable) return false;
        disable = disable || this.disable;
        const candidate = date as PersianDate;
        const normalizedDate = Core.isPersianDate(candidate)
          ? candidate.clone()
          : this.core.clone().parse(candidate);
        if (Core.isString(disable)) {
          return this.isSameDisabledValue(normalizedDate, disable as string);
        } else if (disable instanceof RegExp) {
          return this.testDisableRegex(
            disable,
            this.formatDisableValue(normalizedDate),
          );
        } else if (Core.isFunction(disable)) {
          return (disable as (date: PersianDate) => boolean)(normalizedDate);
        } else if (Array.isArray(disable)) {
          return disable.some((val) => {
            if (Core.isString(val)) {
              return this.isSameDisabledValue(normalizedDate, val as string);
            } else if (val instanceof RegExp) {
              return this.testDisableRegex(
                val,
                this.formatDisableValue(normalizedDate),
              );
            }
          });
        } else {
          return false;
        }
      },
      selectedTimeValue(index: number): PersianDate | undefined {
        const time = this.selectedTimes[index];
        if (!time) return undefined;
        const date = this.selectedDates[index];
        if (!date) return time as PersianDate;
        return date
          .clone()
          .hour(time.hour())
          .minute(time.minute())
          .second(time.second())
          .millisecond(time.millisecond());
      },
      isSelectedTimeDisabled(index: number): boolean {
        const time = this.selectedTimeValue(index);
        return (
          !!time && (!this.checkDate(time, 'time') || this.isInDisable(time))
        );
      },
      isSameDisabledValue(date: PersianDate, value: string): boolean {
        const disabled = this.parseDisabledValue(
          this.type === 'time' && !/[\s/-]/.test(value)
            ? `${date.toString('YYYY-MM-DD')} ${value}`
            : value,
        );
        if (!this.calendarAdapter && !this.calendar && value.includes('/')) {
          const candidate = date.clone().calendar('jalali');
          const target = disabled.clone().calendar('jalali');
          const sameDate =
            candidate.year() === target.year() &&
            candidate.month() === target.month() &&
            candidate.date() === target.date();
          if (this.type === 'date' || !/\s/.test(value)) return sameDate;
          if (this.type === 'datetime') {
            return (
              sameDate &&
              candidate.hour() === target.hour() &&
              candidate.minute() === target.minute()
            );
          }
        }
        if (this.type === 'time') {
          return (
            date.hour() === disabled.hour() &&
            date.minute() === disabled.minute()
          );
        }
        if (this.type === 'date' || !/[\s:]/.test(value)) {
          return date
            .clone()
            .startOf('date')
            .isSame(disabled.clone().startOf('date'));
        }
        return date.isSame(disabled);
      },
      parseDisabledValue(value: string): PersianDate {
        if (!this.calendarAdapter && !this.calendar && value.includes('/')) {
          return this.core.clone().calendar('jalali').parse(value);
        }
        return this.parseCalendarDate(value);
      },
      testDisableRegex(regex: RegExp, value: string): boolean {
        regex.lastIndex = 0;
        const result = regex.test(value);
        regex.lastIndex = 0;
        return result;
      },
      formatDisableValue(date: PersianDate): string {
        if (this.calendarAdapter)
          return this.formatDateValue(date, this.formats.input);
        return date.toString(
          jalaliDisableFormats[this.type as keyof typeof jalaliDisableFormats],
        );
      },
      inputSlotProps(index: number): {
        value: string;
        inputAttrs: Obj;
        open: () => void;
        clear: () => void;
        onInput: (event: Event) => void;
        onBlur: () => void;
        onKeydown: (event: KeyboardEvent) => void;
      } {
        const input = this.inputs[index];
        return {
          value: this.displayValue[index] || '',
          inputAttrs: {
            ...this.attrs[input],
            ref: 'inputs',
            type: 'text',
            autocomplete: 'off',
            placeholder:
              this.inputMaskConfig().placeholder ||
              this.attrs[input].placeholder,
          },
          open: () => this.showPicker('input', index),
          clear: () => this.clear(input),
          onInput: (event: Event) => {
            const target = event.target as HTMLInputElement;
            this.displayValue[index] = target.value;
            this.sanitizeInput(index, event);
          },
          onBlur: () => {
            this.sanitizeInput(index);
            this.commitInput(index);
          },
          onKeydown: (event: KeyboardEvent) => this.selectWithArrow(event),
        };
      },
      showPicker(el: 'icon' | 'input', index: number): void {
        if (this.clickOn == 'all' || this.clickOn == el) {
          const inputName = this.inputs[index as 0 | 1];
          if (this.dualInput) this.inputName = inputName;
          const inputs = this.$refs.inputs as HTMLElement[] | undefined;
          inputs?.[index]?.focus();
          this.showDatePicker = true;
          if (!this.modal) {
            this.$nextTick(() => {
              this.locate();
            });
            document.addEventListener('scroll', this.locate);
          }
        }
      },
      async selectWithArrow(e: KeyboardEvent): Promise<void> {
        //FIXME: refactor
        //FIXME: when up arraw press go to last date
        // [37, 38, 39, 40] are key codes of arrow keys
        if (
          ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)
        ) {
          const arrow = {
            ArrowLeft: 1, // for left arrow must one day add in rtl picker
            ArrowUp: -7, // for up arrow must seven day subtract in rtl picker
            ArrowRight: -1, // for right arrow must one day subtract in rtl picker
            ArrowDown: 7, // for down arrow must seven day add in rtl picker
          };
          let numberOfDay = arrow[e.key as keyof typeof arrow];
          if (
            this.lang.dir.picker == 'ltr' &&
            ['ArrowLeft', 'ArrowRight'].includes(e.key)
          )
            numberOfDay = -numberOfDay;

          const root = this.$refs.root as HTMLElement;
          let focusedDays = root.querySelectorAll('.pdp .pdp-day.hover');
          if (!focusedDays.length) {
            focusedDays = root.querySelectorAll(
              '.pdp .pdp-day.start-range,.pdp .pdp-day.end-range',
            );
          }
          let focusedDay = focusedDays[focusedDays.length - 1] as
            | HTMLElement
            | undefined;
          if (focusedDay) {
            let column = Number(this.getColumn(focusedDay));
            focusedDay.classList.remove('hover');
            const focusedMonth = this.calendarMonthDate(
              this.onDisplay!,
              column,
            );
            const focusedDate = this.calendarDayDate(
              focusedMonth,
              Number(focusedDay.innerText),
            );
            const nextDate = this.calendarAddDays(focusedDate, numberOfDay);
            if (!this.checkDate(nextDate, 'date'))
              return focusedDay.classList.add('hover');

            const nextMonthKey = this.calendarMonthKey(nextDate);
            column = -1;
            for (let i = 0; i < this.columnCount; i++) {
              if (
                this.calendarMonthKey(
                  this.calendarMonthDate(this.onDisplay!, i),
                ) === nextMonthKey
              ) {
                column = i;
                break;
              }
            }
            if (column < 0) {
              const firstMonth = this.calendarMonthDate(this.onDisplay!, 0);
              if (
                this.getDateTimestamp(nextDate) <
                this.getDateTimestamp(firstMonth)
              ) {
                this.onDisplay = this.calendarMonthDate(
                  this.onDisplay!,
                  -this.columnCount,
                );
                column = this.columnCount - 1;
              } else {
                this.onDisplay = this.calendarMonthDate(
                  this.onDisplay!,
                  this.columnCount,
                );
                column = 0;
              }
            }
            await this.$nextTick();
            focusedDay = root.querySelector(
              `.pdp .pdp-main .pdp-column[data-column='${column}'] .pdp-day[value='${this.displayDay(nextDate)}']`,
            ) as HTMLElement;
            if (focusedDay) focusedDay.classList.add('hover');
          } else {
            focusedDay = root.querySelector(
              '.pdp .pdp-day:not(.empty):not(.disabled)',
            ) as HTMLElement;
            if (focusedDay) focusedDay.classList.add('hover');
            else {
              focusedDay = root.querySelector(
                `.pdp .pdp-main .pdp-column[data-column="0"] .pdp-day[value="${this.fromDate!.date()}"]`,
              ) as HTMLElement;
              focusedDay.classList.add('hover');
            }
          }
          if (this.mode === 'range' && this.selectedDates.length == 1) {
            this.selectInRangeDate({ target: focusedDay });
          }
        } else if (e.key == 'Enter') {
          // 13 is key code of Enter key
          e.preventDefault();
          const focusedDay = (this.$refs.root as HTMLElement).querySelector(
            '.pdp .pdp-day.hover',
          ) as HTMLElement;
          if (focusedDay) {
            this.selectDate(
              this.calendarDayDate(
                this.calendarMonthDate(
                  this.onDisplay!,
                  Number(this.getColumn(focusedDay) || 0),
                ),
                Number(focusedDay.innerText),
              ),
              'date',
            );
          } else {
            this.displayValue.forEach((_, index) => {
              this.commitInput(index);
            });
          }
        }
      },
      commitInput(index: number): void {
        const inputs = this.$refs.inputs as HTMLInputElement[];
        const input = inputs?.[index];
        // `displayValue` is updated by v-model before Enter/blur handlers run.
        // Prefer it over the DOM value so a fast manual edit cannot be lost
        // while Vue is still synchronizing the native input element.
        const rawValue = this.displayValue[index] || input?.value || '';
        const submittedValue = this.dualInput
          ? this.selectedDates[index]
            ? this.formatDateValue(
                this.selectedDates[index],
                this.formats.input,
              )
            : ''
          : this.selectedDates
              .map((date) => this.formatDateValue(date, this.formats.input))
              .join(' - ');
        if (rawValue === submittedValue) return;
        const value = this.inputMask
          ? rawValue
          : this.sanitizeInputValue(rawValue);
        if (!value) return;
        if (value !== rawValue) {
          if (input) input.value = value;
          this.displayValue[index] = value;
        }
        const normalizedValue = this.normalizeInputDigits(value);

        let onDisplay: PersianDate;
        if (this.type === 'time') {
          const time = normalizedValue.split(/[/ -.,:\\]/);
          onDisplay = this.checkDate(this.core.clone(), 'time')
            ? this.core.clone()
            : this.fromDate!.clone();
          onDisplay.time(time as [string]);
        } else {
          onDisplay = this.calendarAdapter
            ? this.parseCalendarDate(normalizedValue)
            : this.core.clone().parse(normalizedValue);
        }

        // Datetime values must respect both date and time boundaries. Date-only
        // values use the calendar-day validation path; time and datetime use
        // the full timestamp path.
        const part = this.type === 'date' ? 'date' : 'time';
        const selectionResult = this.selectDate(onDisplay, part);
        if (!onDisplay.isValid() || selectionResult < 0) return;

        if (this.mode === 'single' && this.type.includes('date')) {
          this.onDisplay = onDisplay.clone();
        } else {
          const diff = onDisplay.diff(this.onDisplay as PersianDate, 'month');
          if (diff < 0 || diff >= this.columnCount)
            this.onDisplay = onDisplay.clone();
        }
        // `selectDate` returns 1 after autoSubmit has already formatted the
        // completed value into the input. Only clear a pending range input;
        // otherwise the committed manual value would be erased immediately.
        if (selectionResult === 0) this.displayValue[index] = '';
      },
      inputMaskPattern(): string {
        const config = this.inputMaskConfig();
        let value: string | undefined = config.pattern;
        if (!value || value === 'calendar-default')
          value = this.defaultInputMaskPattern();
        if (value === 'date' || value === 'datetime' || value === 'time') {
          if (!this.calendarAdapter) {
            return value === 'date'
              ? 'jYYYY/jMM/jDD'
              : value === 'datetime'
                ? 'jYYYY/jMM/jDD HH:mm'
                : 'HH:mm';
          }
          return value === 'date'
            ? 'YYYY-MM-DD'
            : value === 'datetime'
              ? 'YYYY-MM-DD HH:mm'
              : 'HH:mm';
        }
        return value;
      },
      defaultInputMaskPattern(): string {
        const datePattern =
          this.activeCalendar === 'jalali' ? 'jYYYY/jMM/jDD' : 'YYYY-MM-DD';
        return this.type === 'date'
          ? datePattern
          : this.type === 'datetime'
            ? `${datePattern} HH:mm`
            : 'HH:mm';
      },
      inputMaskConfig(): InputMaskConfig {
        const mask = this.inputMask;
        if (!mask) {
          return {
            pattern: this.defaultInputMaskPattern(),
            autoInsert: true,
            allowedDigits:
              this.activeCalendar === 'jalali' || this.lang.dir.input === 'rtl'
                ? 'both'
                : 'latin',
            strict: true,
          };
        }
        if (typeof mask === 'string')
          return { pattern: mask, autoInsert: true };
        if (
          'pattern' in mask ||
          'allowedDigits' in mask ||
          'strict' in mask ||
          'autoInsert' in mask ||
          'blocks' in mask
        )
          return mask as InputMaskConfig;
        const value = (
          mask as Partial<
            Record<'date' | 'time' | 'datetime', string | InputMaskConfig>
          >
        )[this.type];
        return typeof value === 'string' ? { pattern: value } : value || {};
      },
      normalizeInputDigits(value: string): string {
        return Array.from(value)
          .map((character) => {
            const code = character.codePointAt(0) || 0;
            if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
            if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
            return character;
          })
          .join('');
      },
      isInputDigit(character: string): boolean {
        return /[0-9۰-۹٠-٩]/.test(character);
      },
      maskTokens(pattern: string): Array<{ token?: string; literal?: string }> {
        const tokens: Array<{ token?: string; literal?: string }> = [];
        const matcher = /j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = matcher.exec(pattern))) {
          if (match.index > lastIndex)
            tokens.push({ literal: pattern.slice(lastIndex, match.index) });
          tokens.push({ token: match[0] });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < pattern.length)
          tokens.push({ literal: pattern.slice(lastIndex) });
        return tokens;
      },
      maskTokenMaximum(token: string): number | undefined {
        const normalized = token.replace(/^j/, '');
        const block =
          this.inputMaskConfig().blocks?.[token] ||
          this.inputMaskConfig().blocks?.[normalized] ||
          this.inputMaskConfig().blocks?.[`j${normalized}`];
        if (block?.to !== undefined) return block.to;
        if (['M', 'MM'].includes(normalized)) return 12;
        if (['D', 'DD'].includes(normalized)) return 31;
        if (['H', 'HH'].includes(normalized)) return 23;
        if (['m', 'mm', 's', 'ss'].includes(normalized)) return 59;
        return undefined;
      },
      maskTokenMinimum(token: string): number | undefined {
        const normalized = token.replace(/^j/, '');
        const block =
          this.inputMaskConfig().blocks?.[token] ||
          this.inputMaskConfig().blocks?.[normalized] ||
          this.inputMaskConfig().blocks?.[`j${normalized}`];
        return block?.from;
      },
      maskTokenSize(token: string): number {
        return token.replace(/^j/, '') === 'YYYY' ? 4 : 2;
      },
      sanitizeMaskToken(token: string, value: string): string {
        const maximum = this.maskTokenMaximum(token);
        const minimum = this.maskTokenMinimum(token);
        if (maximum === undefined && minimum === undefined) return value;
        if (value.length < 1) return value;
        // Keep a one-digit partial block editable. The next digit is checked
        // against the complete block, matching an IMask date block.
        const size = this.maskTokenSize(token);
        if (value.length < size) return value;
        const number = Number(value.slice(0, size));
        return (maximum !== undefined && number > maximum) ||
          (minimum !== undefined && number < minimum)
          ? value.slice(0, size - 1)
          : value.slice(0, size);
      },
      maskedInputValue(value: string): string {
        const config = this.inputMaskConfig();
        if (config.autoInsert === false) return value;
        const rangeParts = value.split(/\s+-\s+/);
        if (rangeParts.length > 1)
          return rangeParts
            .map((part) => this.maskedInputValue(part))
            .join(' - ');
        const pattern = this.inputMaskPattern();
        const parts = this.maskTokens(pattern);
        const hasTextToken = parts.some(
          (part) => part.token && /MMMM|MMM/.test(part.token),
        );
        if (hasTextToken) return value;
        const digits = Array.from(value).filter((character) =>
          this.isInputDigit(character),
        );
        const expectedDigits = parts.reduce(
          (total, part) =>
            total + (part.token ? this.maskTokenSize(part.token) : 0),
          0,
        );
        const maskedDigits = digits.slice(0, expectedDigits);
        let digitIndex = 0;
        let result = '';
        parts.forEach((part, index) => {
          if (part.literal) {
            return;
          }
          const token = part.token!.replace(/^j/, '');
          const size = this.maskTokenSize(token);
          const rawChunk = maskedDigits
            .slice(digitIndex, digitIndex + size)
            .join('');
          const chunk = this.sanitizeMaskToken(part.token!, rawChunk);
          result += chunk;
          digitIndex += rawChunk.length;
          if (rawChunk.length < size) return;
          const next = parts[index + 1];
          if (next?.literal) result += next.literal;
        });
        return result;
      },
      maskedCursorPosition(value: string, digitCount: number): number {
        if (!digitCount) return 0;
        let seen = 0;
        for (let index = 0; index < value.length; index++) {
          if (!this.isInputDigit(value[index])) continue;
          seen++;
          if (seen === digitCount) {
            let cursor = index + 1;
            while (cursor < value.length && !this.isInputDigit(value[cursor]))
              cursor++;
            return cursor;
          }
        }
        return value.length;
      },
      sanitizeInput(index: number, event?: Event): void {
        const input = event?.target as HTMLInputElement | undefined;
        const value = input?.value ?? this.displayValue[index];
        if (!value) {
          this.displayValue[index] = '';
          return;
        }
        const cursor = input?.selectionStart ?? value.length;
        const digitsBeforeCursor = Array.from(value.slice(0, cursor)).filter(
          (character) => this.isInputDigit(character),
        ).length;
        const sanitized = this.sanitizeInputValue(value);
        this.displayValue[index] = sanitized;
        if (sanitized !== value) {
          if (input) input.value = sanitized;
          if (input && input === document.activeElement) {
            const nextCursor = this.maskedCursorPosition(
              sanitized,
              digitsBeforeCursor,
            );
            input.setSelectionRange(nextCursor, nextCursor);
          }
        }
      },
      sanitizeInputValue(value: string): string {
        const pattern = this.inputMaskPattern();
        const allowedDigits = this.inputMaskConfig().allowedDigits || 'latin';
        const hasRangeSeparator = /\s-\s/.test(value);
        const literals = pattern
          .replace(/j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g, '')
          .split('');
        const allowsLetters = /MMMM|MMM/.test(pattern);
        const sanitized = Array.from(value)
          .filter((character) => {
            const isLatinDigit = /[0-9]/.test(character);
            const isLocaleDigit = /[۰-۹٠-٩]/.test(character);
            if (
              (allowedDigits === 'latin' && isLatinDigit) ||
              (allowedDigits === 'locale' && isLocaleDigit) ||
              (allowedDigits === 'both' && (isLatinDigit || isLocaleDigit))
            )
              return true;
            if (
              literals.includes(character) ||
              /\s/.test(character) ||
              (hasRangeSeparator && character === '-')
            )
              return true;
            return allowsLetters && /\p{L}/u.test(character);
          })
          .join('')
          .replace(/\s{2,}/g, ' ')
          .replace(/([/:.,-])\1+/g, '$1');
        if (this.inputMaskConfig().autoInsert === false) return sanitized;
        const masked = this.maskedInputValue(sanitized);
        const maskParts = this.maskTokens(pattern);
        const expectedDigits = maskParts.reduce(
          (total, part) =>
            total + (part.token ? this.maskTokenSize(part.token) : 0),
          0,
        );
        const hasCompleteMask =
          maskParts.some((part) => part.literal) &&
          Array.from(sanitized).filter((character) =>
            this.isInputDigit(character),
          ).length === expectedDigits;
        const hasOverflow =
          Array.from(sanitized).filter((character) =>
            this.isInputDigit(character),
          ).length > expectedDigits;
        // Keep explicitly typed separators and variable-width fields (for
        // example `1399/6/1`) intact. Compact digit input is reformatted only
        // when it is compatible with the mask's automatic prefix.
        return masked === sanitized ||
          masked.startsWith(sanitized) ||
          hasCompleteMask ||
          hasOverflow ||
          !/\D/.test(sanitized)
          ? masked
          : sanitized;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectInRangeDate(e: any): void {
        const target = e.target;
        if (!target.classList.contains('pdp-day')) return;
        const root = this.$refs.root as HTMLElement;
        root.querySelectorAll(`.pdp .pdp-day`).forEach((el) => {
          el.classList.remove('in-range');
        });

        let column = this.getColumn(target);
        const hoveredDate = this.onDisplay!.clone()
          .startOf('date')
          .addMonth(column)
          .date(target.innerText);
        const selectedDate = this.selectedDates[0].clone().startOf('date');
        const number = hoveredDate.isAfter(selectedDate) ? 1 : -1;
        const selectedDateDOM = root.querySelector(
          '.pdp-day.start-range,.pdp-day.end-range',
        ) as HTMLElement;
        if (selectedDateDOM) {
          column = +this.getColumn(selectedDateDOM);
          selectedDateDOM.classList.replace(
            ...((hoveredDate.isBefore(selectedDate)
              ? ['start-range', 'end-range']
              : ['end-range', 'start-range']) as [string, string]),
          );
        } else {
          selectedDate.parse(this.onDisplay as PersianDate);
          if (number === 1) {
            selectedDate.startOf('month').subDay();
            column = -1;
          } else {
            selectedDate
              .addMonth(this.columnCount - 1)
              .endOf('month')
              .addDay()
              .startOf('date');
            column = this.columnCount;
          }
        }
        while (!hoveredDate.isSame(selectedDate)) {
          const oldMonth = selectedDate.month();
          selectedDate.addDay(number);
          if (oldMonth != selectedDate.month()) {
            column += number;
          }
          if (
            this.checkDate(selectedDate, 'date') &&
            !this.isInDisable(selectedDate)
          ) {
            root
              .querySelector(
                `.pdp-column[data-column='${column}'] .pdp-day[value='${selectedDate.date()}']`,
              )!
              .classList.add('in-range');
          } else {
            break;
          }
        }
      },
      submitDate(close = true): void {
        const displayDate = this.selectedDates.map((el) => {
          return this.formatDateValue(el, this.formats.input);
        });
        if (this.dualInput) this.displayValue = displayDate;
        else this.displayValue[0] = displayDate.join(' - ');

        this.submitedValue = this.selectedDates.slice();
        this.setModel();
        this.$emit(
          'submit',
          this.mode === 'range' ? this.selectedDates : this.selectedDates[0],
        );
        if (close) {
          this.showDatePicker = false;
        }
      },
      getColumn({ parentNode }: HTMLElement): number | string {
        return (parentNode!.parentNode!.parentNode as HTMLElement).dataset
          .column!;
      },
      nearestDate(date: PersianDate): PersianDate {
        return Math.abs(date.diff(this.fromDate as PersianDate)) <=
          Math.abs(date.diff(this.toDate as PersianDate))
          ? this.fromDate!.clone()
          : this.toDate!.clone();
      },
      locate(): void {
        const inputs = this.$refs.inputs as HTMLElement[] | undefined;
        if (!inputs?.[0]) return;
        this.pickerPlace = {
          top: false,
          left: false,
          right: false,
        };
        this.$nextTick(() => {
          const input = inputs[0];
          const inputOffset =
            input.offsetHeight + input.getBoundingClientRect().top;
          const picker = this.$refs.pdpPicker as HTMLElement;
          const pickerHeight = picker.offsetHeight + 10;
          const pickerOffset = picker.getBoundingClientRect();
          this.pickerPlace = {
            top:
              inputOffset >= pickerHeight &&
              window.innerHeight - (inputOffset + pickerHeight) < 0,
            left: pickerOffset.left <= 0,
            right:
              window.innerWidth - (pickerOffset.left + pickerOffset.width) <= 0,
          };
        });
      },
      changeLocale(): void {
        const locales = this.effectiveLocale.split(',');
        const index = locales.indexOf(this.currentLocale);
        this.currentLocale = locales[index + 1] || locales[0];
        const calendar = this.activeCalendar;
        const internalCalendar: 'jalali' | 'gregorian' = this.calendarAdapter
          ? 'gregorian'
          : (calendar as 'jalali' | 'gregorian');
        this.core.calendar(internalCalendar);
        this.fromDate!.calendar(internalCalendar);
        this.toDate!.calendar(internalCalendar);
        this.onDisplay!.calendar(internalCalendar);
        for (const date of this.selectedDates) {
          date.calendar(internalCalendar);
        }
        for (const time of this.selectedTimes) {
          time.calendar(internalCalendar);
        }
        this.submitDate(false);
      },
      clear(inputName: Inputs): void {
        const inputIndex = inputName === 'firstInput' ? 0 : 1;

        this.displayValue[inputIndex] = '';
        this.$emit('clear');
        if (this.dualInput) {
          const values = this.$attrs.value;
          if (values && Array.isArray(values))
            return this.setModel(
              values.map((val, i) => (i == inputIndex ? null : val)),
            );
        }
        this.setModel('');
      },
      startChangeTime(
        timeIndex: number,
        unit: 'minute' | 'hour',
        operator: 'add' | 'sub',
      ) {
        let time = this.selectedTimes[timeIndex];
        if (!time) {
          time = this.core.clone();
          if (!this.checkDate(time, 'time')) {
            time = this.toDate!.clone()
              .subDay()
              .time(this.core as PersianDate);
          }
          if (timeIndex == 1 && !this.selectedTimes.length)
            this.selectedTimes.push(time.clone());
          this.selectedTimes.push(time);
        }
        this.stopChangeTime();
        const maxAmount = unit == 'hour' ? 23 : 59;
        let currentAmount = time[unit]();
        let step = unit == 'hour' ? this.hourStepCount : this.minuteStepCount;
        const changeTime = () => {
          if (operator == 'add') {
            currentAmount = currentAmount + step;
            if (currentAmount > maxAmount) currentAmount = 0;
          } else {
            currentAmount = currentAmount - step;
            if (currentAmount < 0) currentAmount = maxAmount;
          }
          if (!this.checkDate(time[unit](currentAmount), 'time')) {
            time.parse(
              time.isSameOrAfter(this.toDate!.clone())
                ? this.toDate!.clone()
                : this.fromDate!.clone(),
            );
          } else if (
            this.selectedTimes.length == 2 &&
            this.selectedTimes[0].isAfter(this.selectedTimes[1] as PersianDate)
          ) {
            time.parse(
              (timeIndex == 0
                ? this.selectedTimes[1]
                : this.selectedTimes[0]) as PersianDate,
            );
          }
          const selectedTime = this.selectedDates[timeIndex]
            ? (this.selectedDates[timeIndex] as PersianDate)
                .clone()
                .hour(time.hour())
                .minute(time.minute())
                .second(time.second())
                .millisecond(time.millisecond())
            : time;
          this.selectedTimes[timeIndex] = (time as PersianDate).clone();
          if (!this.isInDisable(selectedTime)) {
            if (this.type == 'time') {
              this.selectedDates[timeIndex] = time;
            } else if (this.selectedDates[timeIndex]) {
              this.selectedDates[timeIndex].time(time as PersianDate);
            }
            this.$emit('select', time);
            if (
              this.autoSubmit &&
              !this.selectedTimes.some((_, index) =>
                this.isSelectedTimeDisabled(index),
              )
            )
              this.submitDate(false);
          }
        };
        changeTime();
        this.interval = setInterval(changeTime, 300);
      },
      stopChangeTime() {
        clearInterval(this.interval!);
      },
      selectShorcut(dates: PersianDate[]) {
        this.selectedDates = dates.map((date, i) => {
          if (i == 0) this.onDisplay = date.clone();
          this.$emit('select', date);
          return date.clone();
        });
        if (this.autoSubmit) {
          this.submitDate();
        }
      },
      setDate(dates: string | string[]) {
        if (!dates) return;
        if (this.mode == 'single' && typeof dates === 'string') dates = [dates];
        this.selectedDates = [];
        (dates as string[]).some((d, index) => {
          const date = this.parseCalendarDate(
            (this.type == 'time'
              ? this.core.toString('YYYY-MM-DD') + ' '
              : '') + d,
          );
          if (date) {
            this.selectedDates.push(markRaw(date.clone()));
            this.selectedTimes.push(markRaw(date.clone()));
            if (index == 0) this.onDisplay = markRaw(date.clone());
          } else {
            this.selectedDates = this.selectedTimes = [];
            return true;
          }
        });
        if (this.selectedDates.length) this.submitDate();
      },
    },
  });
</script>

<style lang="scss">
  @use './assets/sass/app.scss';
</style>
