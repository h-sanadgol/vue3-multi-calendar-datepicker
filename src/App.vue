<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue';
  import DatePicker from './components/DatePicker.vue';
  import type { CalendarId, HijriProvider } from './calendars';

  type Language = 'fa' | 'en' | 'ar';
  type PickerType = 'date' | 'time' | 'datetime';
  type PickerColor =
    | 'blue'
    | 'red'
    | 'pink'
    | 'orange'
    | 'green'
    | 'purple'
    | 'gray';
  type DemoCalendar = {
    id: CalendarId;
    title: Record<Language, string>;
    subtitle: string;
    icon: string;
    direction: 'ltr' | 'rtl';
    sample: string;
    from: string;
    to: string;
  };
  type CodeSample = { title: string; html: string };
  const calendars: DemoCalendar[] = [
    {
      id: 'jalali',
      title: { fa: 'شمسی', en: 'Jalali', ar: 'شمسي' },
      subtitle: 'Jalali / Persian',
      icon: '☼',
      direction: 'rtl',
      sample: '1404/01/15',
      from: '1300/01/01',
      to: '1499/01/01',
    },
    {
      id: 'gregorian',
      title: { fa: 'میلادی', en: 'Gregorian', ar: 'ميلادي' },
      subtitle: 'Gregorian',
      icon: '◷',
      direction: 'ltr',
      sample: '2025-04-04',
      from: '1900-01-01',
      to: '2100-01-01',
    },
    {
      id: 'hijri',
      title: { fa: 'قمری / هجری', en: 'Hijri', ar: 'هجري' },
      subtitle: 'Umm al-Qura / Tabular',
      icon: '☾',
      direction: 'rtl',
      sample: '1446-10-06',
      from: '1400-01-01',
      to: '1500-01-01',
    },
    {
      id: 'hebrew',
      title: { fa: 'عبری', en: 'Hebrew', ar: 'عبري' },
      subtitle: 'Hebrew calendar',
      icon: '✡',
      direction: 'ltr',
      sample: '5785-07-06',
      from: '5780-01-01',
      to: '5790-01-01',
    },
    {
      id: 'buddhist',
      title: {
        fa: 'بودایی تایلندی',
        en: 'Thai Buddhist',
        ar: 'البوذي التايلندي',
      },
      subtitle: 'Buddhist Era',
      icon: '◉',
      direction: 'ltr',
      sample: '2568-04-04',
      from: '2500-01-01',
      to: '2600-01-01',
    },
    {
      id: 'chinese',
      title: { fa: 'چینی', en: 'Chinese', ar: 'الصيني' },
      subtitle: 'Chinese calendar',
      icon: '中',
      direction: 'ltr',
      sample: '2025-03-07',
      from: '1900-01-01',
      to: '2100-01-01',
    },
  ];
  const ui = {
    fa: {
      eyebrow: 'Vue 3 · انتخاب‌گر تاریخ عمومی',
      title: 'یک datepicker، برای همه‌ی تقویم‌ها',
      intro:
        'نمونه‌ی تعاملی کتابخانه را ببینید، تنظیمات را تغییر دهید و کد هر نمونه را کپی کنید.',
      playground: 'آزمایش تعاملی',
      reset: 'بازنشانی',
      active: 'تقویم فعال',
      provider: 'روش محاسبه قمری',
      single: 'یک مقدار',
      range: 'بازه',
      type: 'نوع ورودی',
      date: 'تاریخ',
      time: 'زمان',
      datetime: 'تاریخ و زمان',
      gallery: 'نمونه‌های تقویم',
      galleryHint: 'هر کارت یک نمونه‌ی مستقل و قابل کپی است.',
      output: 'خروجی',
      value: 'مقدار v-model',
      ready: 'آماده‌ی تست',
      code: 'نمایش کد',
      close: 'بستن',
      copy: 'کپی کد',
      copied: 'کپی شد',
      timeSamples: 'نمونه‌های زمان و بازه',
      api: 'با propهای calendar، mode و hijri-provider رفتار کامپوننت را کنترل کنید.',
    },
    en: {
      eyebrow: 'Vue 3 · Universal datepicker',
      title: 'One datepicker for every calendar',
      intro:
        'Try the library interactively, change its settings, and copy the code for each example.',
      playground: 'Interactive playground',
      reset: 'Reset',
      active: 'Active calendar',
      provider: 'Hijri calculation',
      single: 'Single',
      range: 'Range',
      type: 'Input type',
      date: 'Date',
      time: 'Time',
      datetime: 'Date & time',
      gallery: 'Calendar gallery',
      galleryHint: 'Each card is an independent, copyable example.',
      output: 'Output',
      value: 'v-model value',
      ready: 'Ready to test',
      code: 'View code',
      close: 'Close',
      copy: 'Copy code',
      copied: 'Copied',
      timeSamples: 'Time and range examples',
      api: 'Control the component with calendar, mode, and hijri-provider props.',
    },
    ar: {
      eyebrow: 'Vue 3 · منتقي تواريخ شامل',
      title: 'منتقي واحد لكل التقاويم',
      intro: 'جرّب المكتبة تفاعلياً، غيّر الإعدادات وانسخ كود كل مثال.',
      playground: 'التجربة التفاعلية',
      reset: 'إعادة الضبط',
      active: 'التقويم النشط',
      provider: 'حساب هجري',
      single: 'قيمة واحدة',
      range: 'نطاق',
      type: 'نوع الإدخال',
      date: 'تاريخ',
      time: 'وقت',
      datetime: 'تاريخ ووقت',
      gallery: 'معرض التقاويم',
      galleryHint: 'كل بطاقة مثال مستقل وقابل للنسخ.',
      output: 'الناتج',
      value: 'قيمة v-model',
      ready: 'جاهز للاختبار',
      code: 'عرض الكود',
      close: 'إغلاق',
      copy: 'نسخ الكود',
      copied: 'تم النسخ',
      timeSamples: 'أمثلة الوقت والنطاق',
      api: 'تحكم في المكوّن عبر calendar و mode و hijri-provider.',
    },
  } as const;
  const language = ref<Language>('en');
  const activeCalendar = ref<CalendarId>('jalali');
  const hijriProvider = ref<HijriProvider>('ummalqura');
  const mode = ref<'single' | 'range'>('single');
  const pickerType = ref<PickerType>('date');
  const mainValue = ref<string | string[] | undefined>('1404/01/15');
  const mainSeed = ref('1404/01/15');
  const sampleValues = reactive<Record<string, string>>(
    Object.fromEntries(
      calendars.map((calendar) => [calendar.id, calendar.sample]),
    ),
  );
  const modalSample = ref<CodeSample | null>(null);
  const copied = ref(false);
  const advancedColor = ref<PickerColor>('blue');
  const advancedFrom = ref('');
  const advancedTo = ref('');
  const advancedWeekStart = ref<'auto' | number>('auto');
  const advancedWeekendDays = ref<number[]>([]);
  const advancedLocale = ref('');
  const advancedValue = ref('2025-04-04');
  const advancedColumns = ref(1);
  const advancedClearable = ref(true);
  const advancedAutoSubmit = ref(true);
  const advancedIconInside = ref(false);
  const advancedDualInput = ref(false);
  const advancedMinuteStep = ref(1);
  const advancedHourStep = ref(1);
  const advancedClickOn = ref<'all' | 'input' | 'icon' | 'none'>('all');
  const t = computed(() => ui[language.value]);
  const selectedCalendar = computed<DemoCalendar>(
    () =>
      calendars.find((calendar) => calendar.id === activeCalendar.value) ||
      calendars[0],
  );
  const pageDirection = computed(() =>
    language.value === 'en' ? 'ltr' : 'rtl',
  );
  const calendarDefaultLocales: Record<CalendarId, string> = {
    jalali: 'fa',
    gregorian: 'en',
    hijri: 'ar',
    hebrew: 'he',
    buddhist: 'th',
    chinese: 'zh',
  };
  function calendarLocale(calendar: CalendarId): string {
    return language.value === 'en'
      ? calendarDefaultLocales[calendar]
      : language.value;
  }
  const timeSamples = computed(() => [
    {
      title: t.value.time,
      type: 'time' as PickerType,
      mode: 'single' as const,
      value: '14:30',
      icon: '◷',
    },
    {
      title: t.value.range,
      type: 'time' as PickerType,
      mode: 'range' as const,
      value: '09:00 - 17:30',
      icon: '↔',
    },
    {
      title: t.value.datetime,
      type: 'datetime' as PickerType,
      mode: 'single' as const,
      value: '2025-04-04 14:30',
      icon: '◫',
    },
  ]);
  const codeFor = (
    calendar: DemoCalendar,
    type: PickerType = 'date',
    sampleMode: 'single' | 'range' = 'single',
  ): CodeSample => ({
    title: `${calendar.title[language.value]} · ${type}`,
    html: `<DatePicker\n  v-model="value"\n  calendar="${calendar.id}"\n  type="${type}"\n  mode="${sampleMode}"\n  ${calendar.id === 'hijri' ? 'hijri-provider="ummalqura"\n  ' : ''}/>`,
  });
  const mainCodeHtml = computed(() => {
    const calendar = selectedCalendar.value;
    const lines = [
      '<DatePicker',
      '  v-model="value"',
      `  calendar="${calendar.id}"`,
      `  type="${pickerType.value}"`,
      `  mode="${mode.value}"`,
      `  locale="${advancedLocale.value || calendarLocale(calendar.id)}"`,
      `  :column="${advancedColumns.value}"`,
      `  color="${advancedColor.value}"`,
      `  week-starts-on="${advancedWeekStart.value}"`,
      `  click-on="${advancedClickOn.value}"`,
      `  :minute-step="${advancedMinuteStep.value}"`,
      `  :hour-step="${advancedHourStep.value}"`,
      advancedClearable.value ? '  clearable' : '  :clearable="false"',
      advancedAutoSubmit.value ? '  auto-submit' : '  :auto-submit="false"',
      advancedIconInside.value ? '  icon-inside' : '',
      advancedDualInput.value ? '  dual-input' : '',
      advancedFrom.value ? `  from="${advancedFrom.value}"` : '',
      advancedTo.value ? `  to="${advancedTo.value}"` : '',
      advancedWeekendDays.value.length
        ? `  :weekend-days="[${advancedWeekendDays.value.join(', ')}]"`
        : '',
      calendar.id === 'hijri' ? '  hijri-provider="ummalqura"' : '',
      '/>',
    ];
    return lines.filter(Boolean).join('\n');
  });
  function setMainValue(value: string) {
    mainValue.value = mode.value === 'range' ? [value, value] : value;
  }
  function pickerSeedValue() {
    if (pickerType.value === 'time') return '14:30';
    if (pickerType.value === 'datetime') return `${mainSeed.value} 14:30`;
    return mainSeed.value;
  }
  watch(activeCalendar, (id) => {
    const sample = calendars.find((calendar) => calendar.id === id)!.sample;
    mainSeed.value = sample;
    setMainValue(sample);
    pickerType.value = 'date';
    advancedFrom.value = '';
    advancedTo.value = '';
    advancedWeekStart.value = 'auto';
    advancedWeekendDays.value = [];
  });
  watch(hijriProvider, () => {
    if (activeCalendar.value === 'hijri') {
      mainSeed.value = '1446-10-06';
      setMainValue('1446-10-06');
    }
  });
  watch(pickerType, (type) => {
    let value = mainSeed.value;
    if (type === 'time') {
      value = '14:30';
    } else if (type === 'datetime') {
      value = `${mainSeed.value} 14:30`;
    }
    if (type === 'time' && mode.value === 'range') {
      mainValue.value = undefined;
    } else {
      setMainValue(value);
    }
  });
  watch(mode, (nextMode) => {
    if (nextMode === 'range') {
      if (pickerType.value === 'time') {
        mainValue.value = undefined;
      } else if (!Array.isArray(mainValue.value)) {
        const value = mainValue.value ?? pickerSeedValue();
        mainValue.value = [value, value];
      }
    } else if (Array.isArray(mainValue.value)) {
      mainValue.value = mainValue.value[0] ?? pickerSeedValue();
    }
  });
  function openCode(sample: CodeSample) {
    modalSample.value = sample;
    copied.value = false;
  }
  async function copyCode() {
    if (!modalSample.value) return;
    await navigator.clipboard?.writeText(modalSample.value.html);
    copied.value = true;
  }
  function resetDemo() {
    language.value = 'en';
    activeCalendar.value = 'jalali';
    hijriProvider.value = 'ummalqura';
    mode.value = 'single';
    pickerType.value = 'date';
    mainSeed.value = '1404/01/15';
    mainValue.value = '1404/01/15';
    advancedColor.value = 'blue';
    advancedFrom.value = '';
    advancedTo.value = '';
    advancedWeekStart.value = 'auto';
    advancedWeekendDays.value = [];
    advancedLocale.value = '';
    advancedValue.value = '2025-04-04';
    advancedColumns.value = 1;
    advancedClearable.value = true;
    advancedAutoSubmit.value = true;
    advancedIconInside.value = false;
    advancedDualInput.value = false;
    advancedMinuteStep.value = 1;
    advancedHourStep.value = 1;
    advancedClickOn.value = 'all';
  }
</script>

<template>
  <main class="demo-shell" :dir="pageDirection">
    <nav class="language-switcher" aria-label="Language">
      <button
        v-for="item in ['fa', 'en', 'ar'] as Language[]"
        :key="item"
        type="button"
        :class="{ selected: language === item }"
        @click="language = item"
      >
        {{ item === 'fa' ? 'فارسی' : item === 'en' ? 'English' : 'العربية' }}
      </button>
    </nav>
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">
          <span class="eyebrow-dot"></span>{{ t.eyebrow }}
        </div>
        <h1>{{ t.title }}</h1>
        <p>
          {{ t.intro }} <code>@h-sanadgol/vue3-multi-calendar-datepicker</code>
        </p>
        <div class="hero-tags">
          <span v-for="calendar in calendars" :key="calendar.id">{{
            calendar.title[language]
          }}</span>
        </div>
      </div>
      <div class="hero-mark" aria-hidden="true">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="sun">◐</div>
      </div>
    </section>
    <section class="workspace" aria-labelledby="playground-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">PLAYGROUND</span>
          <h2 id="playground-title">{{ t.playground }}</h2>
        </div>
        <button class="reset-button" type="button" @click="resetDemo">
          {{ t.reset }}
        </button>
      </div>
      <div class="playground-grid">
        <aside class="control-panel">
          <div class="control-block">
            <label for="calendar-select">{{ t.active }}</label
            ><select id="calendar-select" v-model="activeCalendar">
              <option
                v-for="calendar in calendars"
                :key="calendar.id"
                :value="calendar.id"
              >
                {{ calendar.title[language] }} — {{ calendar.subtitle }}
              </option>
            </select>
          </div>
          <div v-if="activeCalendar === 'hijri'" class="control-block">
            <label for="hijri-provider">{{ t.provider }}</label
            ><select id="hijri-provider" v-model="hijriProvider">
              <option value="ummalqura">Umm al-Qura</option>
              <option value="tabular">Tabular</option>
            </select>
          </div>
          <fieldset class="control-block mode-fieldset">
            <legend>{{ t.type }}</legend>
            <label class="radio-option"
              ><input
                v-model="pickerType"
                name="picker-type"
                type="radio"
                value="date"
              />{{ t.date }}</label
            ><label class="radio-option"
              ><input
                v-model="pickerType"
                name="picker-type"
                type="radio"
                value="time"
              />{{ t.time }}</label
            ><label class="radio-option"
              ><input
                v-model="pickerType"
                name="picker-type"
                type="radio"
                value="datetime"
              />{{ t.datetime }}</label
            >
          </fieldset>
          <fieldset class="control-block mode-fieldset">
            <legend>{{ t.playground }}</legend>
            <label class="radio-option"
              ><input
                v-model="mode"
                name="playground-mode"
                type="radio"
                value="single"
                @change="mode = 'single'"
              />{{ t.single }}</label
            ><label class="radio-option"
              ><input
                v-model="mode"
                name="playground-mode"
                type="radio"
                value="range"
                @change="mode = 'range'"
              />{{ t.range }}</label
            >
          </fieldset>
          <details class="advanced-options">
            <summary>ADVANCED PROPS</summary>
            <div class="advanced-fields">
              <label
                >Color<select v-model="advancedColor">
                  <option>blue</option>
                  <option>red</option>
                  <option>green</option>
                  <option>purple</option>
                  <option>gray</option>
                </select></label
              ><label
                >Locale<select v-model="advancedLocale">
                  <option value="">Calendar default</option>
                  <option value="en">English</option>
                  <option value="fa">فارسی</option>
                  <option value="ar">العربية</option>
                  <option value="he">עברית</option>
                  <option value="th">ไทย</option>
                  <option value="zh">中文</option>
                </select></label
              ><label
                >From<input
                  v-model="advancedFrom"
                  :placeholder="selectedCalendar.from" /></label
              ><label
                >To<input
                  v-model="advancedTo"
                  :placeholder="selectedCalendar.to" /></label
              ><label
                >Months shown<select v-model.number="advancedColumns">
                  <option :value="1">1 month</option>
                  <option :value="2">2 months</option>
                  <option :value="3">3 months</option>
                </select></label
              ><label
                >Week starts<select v-model="advancedWeekStart">
                  <option value="auto">Calendar default</option>
                  <option :value="0">Sunday</option>
                  <option :value="1">Monday</option>
                  <option :value="6">Saturday</option>
                </select></label
              ><label
                >Click on<select v-model="advancedClickOn">
                  <option value="all">Input and icon</option>
                  <option value="input">Input only</option>
                  <option value="icon">Icon only</option>
                  <option value="none">Disabled</option>
                </select></label
              ><label
                >Minute step<input
                  v-model.number="advancedMinuteStep"
                  type="number"
                  min="1"
                  max="60" /></label
              ><label
                >Hour step<input
                  v-model.number="advancedHourStep"
                  type="number"
                  min="1"
                  max="24" /></label
              ><span class="advanced-label weekly-label">Weekly holidays</span
              ><label class="check-option"
                ><input
                  v-model="advancedWeekendDays"
                  type="checkbox"
                  :value="0"
                />Sunday</label
              ><label class="check-option"
                ><input
                  v-model="advancedWeekendDays"
                  type="checkbox"
                  :value="5"
                />Friday</label
              ><label class="check-option"
                ><input
                  v-model="advancedWeekendDays"
                  type="checkbox"
                  :value="6"
                />Saturday</label
              ><label class="check-option"
                ><input
                  v-model="advancedClearable"
                  type="checkbox"
                />Clearable</label
              ><label class="check-option"
                ><input v-model="advancedAutoSubmit" type="checkbox" />Auto
                submit</label
              ><label class="check-option"
                ><input v-model="advancedIconInside" type="checkbox" />Icon
                inside</label
              ><label class="check-option"
                ><input v-model="advancedDualInput" type="checkbox" />Dual
                input</label
              >
            </div>
          </details>
          <div class="api-note">
            <strong>API</strong>
            <p>{{ t.api }}</p>
          </div>
        </aside>
        <div class="main-preview">
          <div class="preview-topline">
            <div>
              <span class="preview-icon">{{ selectedCalendar.icon }}</span>
              <div>
                <span class="preview-label">{{ t.active }}</span>
                <h3>{{ selectedCalendar.title[language] }}</h3>
              </div>
            </div>
            <span class="status-pill"><i></i>{{ t.ready }}</span>
          </div>
          <div class="picker-wrap" :dir="selectedCalendar.direction">
            <DatePicker
              :key="`${activeCalendar}-${hijriProvider}-${mode}-${pickerType}-${language}`"
              v-model="mainValue"
              :calendar="activeCalendar"
              :format="
                activeCalendar === 'jalali' ? 'jYYYY/jMM/jDD' : undefined
              "
              :hijri-provider="hijriProvider"
              :mode="mode"
              :type="pickerType"
              :locale="advancedLocale || calendarLocale(activeCalendar)"
              :column="advancedColumns"
              :from="advancedFrom || selectedCalendar.from"
              :to="advancedTo || selectedCalendar.to"
              :week-starts-on="advancedWeekStart"
              :weekend-days="
                advancedWeekendDays.length ? advancedWeekendDays : undefined
              "
              :color="advancedColor"
              :click-on="advancedClickOn"
              :minute-step="advancedMinuteStep"
              :hour-step="advancedHourStep"
              :icon-inside="advancedIconInside"
              :dual-input="advancedDualInput"
              :auto-submit="advancedAutoSubmit"
              :clearable="advancedClearable"
              :label="`${t.active} ${selectedCalendar.title[language]}`"
            />
          </div>
          <div class="value-panel">
            <span>{{ t.value }}</span
            ><code>{{ mainValue || '—' }}</code>
          </div>
          <div class="generated-code">
            <h4>HTML</h4>
            <pre><code>{{ mainCodeHtml }}</code></pre>
          </div>
        </div>
      </div>
    </section>
    <section class="gallery" aria-labelledby="gallery-title">
      <div class="section-heading gallery-heading">
        <div>
          <span class="section-kicker">CALENDAR GALLERY</span>
          <h2 id="gallery-title">{{ t.gallery }}</h2>
        </div>
        <p>{{ t.galleryHint }}</p>
      </div>
      <div class="calendar-grid">
        <article
          v-for="calendar in calendars"
          :key="calendar.id"
          class="calendar-card"
          :dir="calendar.direction"
        >
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">{{ calendar.icon }}</span>
              <div>
                <h3>{{ calendar.title[language] }}</h3>
                <p>{{ calendar.subtitle }}</p>
              </div>
            </div>
          </div>
          <div class="card-picker">
            <DatePicker
              :key="`${calendar.id}-${language}`"
              v-model="sampleValues[calendar.id]"
              :calendar="calendar.id"
              :from="calendar.from"
              :to="calendar.to"
              :hijri-provider="hijriProvider"
              :locale="calendarLocale(calendar.id)"
              :column="1"
              mode="single"
              label=""
            />
          </div>
          <div class="card-actions">
            <div class="card-value">
              <span>{{ t.output }}</span
              ><code>{{ calendar.sample }}</code>
            </div>
            <button
              class="code-button"
              type="button"
              @click="openCode(codeFor(calendar))"
            >
              {{ t.code }} · HTML
            </button>
          </div>
        </article>
      </div>
    </section>
    <section class="gallery">
      <div class="section-heading gallery-heading">
        <div>
          <span class="section-kicker">TIME & RANGE</span>
          <h2>{{ t.timeSamples }}</h2>
        </div>
      </div>
      <div class="calendar-grid">
        <article
          v-for="sample in timeSamples"
          :key="sample.title"
          class="calendar-card"
        >
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">{{ sample.icon }}</span>
              <div>
                <h3>{{ sample.title }}</h3>
                <p>{{ sample.mode === 'range' ? t.range : t.single }}</p>
              </div>
            </div>
          </div>
          <div class="card-picker">
            <DatePicker
              :type="sample.type"
              :mode="sample.mode"
              :model-value="sample.value"
              locale="en"
              :minute-step="5"
              :hour-step="1"
              :column="1"
              clearable
            />
          </div>
          <button
            class="code-button"
            type="button"
            @click="
              openCode(codeFor(selectedCalendar, sample.type, sample.mode))
            "
          >
            {{ t.code }}
          </button>
        </article>
      </div>
    </section>
    <footer class="demo-footer">
      <span>{{ t.title }}</span
      ><code>@h-sanadgol/vue3-multi-calendar-datepicker</code>
    </footer>
    <div
      v-if="modalSample"
      class="code-modal-backdrop"
      role="presentation"
      @click.self="modalSample = null"
    >
      <section
        class="code-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="modalSample.title"
      >
        <div class="modal-header">
          <div>
            <span class="section-kicker">CODE SAMPLE</span>
            <h2>{{ modalSample.title }}</h2>
          </div>
          <button
            class="modal-close"
            type="button"
            :aria-label="t.close"
            @click="modalSample = null"
          >
            ×
          </button>
        </div>
        <div class="code-tabs single-code">
          <div>
            <h3>HTML</h3>
            <pre><code>{{ modalSample.html }}</code></pre>
          </div>
        </div>
        <div class="modal-actions">
          <button class="code-button" type="button" @click="copyCode">
            {{ copied ? t.copied : t.copy }}</button
          ><button
            class="reset-button"
            type="button"
            @click="modalSample = null"
          >
            {{ t.close }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style>
  :root {
    color-scheme: light;
    font-family: Tahoma, 'Segoe UI', sans-serif;
    color: #263236;
    background: #f4f0e9;
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    min-width: 320px;
    background: #f4f0e9;
  }
  button,
  select,
  input {
    font: inherit;
  }
  .demo-shell {
    --muted: #758083;
    --line: #ddd8cf;
    --paper: #fffdf9;
    --accent: #c65d3d;
    --accent-dark: #8d3e2a;
    max-width: 1240px;
    margin: 0 auto;
    padding: 22px 28px 26px;
  }
  .language-switcher {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-bottom: 12px;
  }
  .language-switcher button,
  .reset-button,
  .code-button,
  .modal-close {
    border: 1px solid var(--line);
    border-radius: 7px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 7px 11px;
    font-size: 0.75rem;
  }
  .language-switcher button.selected,
  .code-button {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }
  .hero {
    min-height: 275px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 34px 42px;
    overflow: hidden;
    border-radius: 18px;
    background: #263236;
    color: #fffdf9;
    box-shadow: 0 16px 40px #2632361f;
  }
  .hero-copy {
    max-width: 710px;
  }
  .eyebrow,
  .section-kicker {
    letter-spacing: 0.12em;
    font-size: 0.68rem;
    font-weight: 800;
  }
  .eyebrow {
    display: flex;
    gap: 8px;
    color: #efb08e;
  }
  .eyebrow-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e88961;
  }
  .hero h1 {
    margin: 18px 0 12px;
    font-size: clamp(2rem, 4vw, 3.35rem);
    line-height: 1.18;
  }
  .hero p {
    max-width: 650px;
    margin: 0;
    color: #c6d0ce;
    line-height: 1.9;
  }
  .hero code {
    color: #f4c0a4;
  }
  .hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 22px;
  }
  .hero-tags span {
    padding: 6px 10px;
    border: 1px solid #506064;
    border-radius: 100px;
    color: #dce4e1;
    font-size: 0.73rem;
  }
  .hero-mark {
    position: relative;
    flex: 0 0 200px;
    height: 200px;
  }
  .sun {
    position: absolute;
    inset: 56px;
    display: grid;
    place-items: center;
    border: 1px solid #e88961;
    border-radius: 50%;
    color: #efb08e;
    font-size: 3.3rem;
  }
  .orbit {
    position: absolute;
    inset: 12px;
    border: 1px solid #536568;
    border-radius: 50%;
  }
  .orbit-two {
    inset: 30px -4px;
    border-color: #7a6256;
  }
  .workspace,
  .gallery {
    margin-top: 52px;
  }
  .section-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 18px;
  }
  .section-kicker {
    display: block;
    margin-bottom: 7px;
    color: var(--accent);
  }
  h2 {
    margin: 0;
    font-size: 1.65rem;
  }
  .section-heading p {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
  }
  .playground-grid {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 18px;
  }
  .control-panel,
  .main-preview,
  .calendar-card {
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--paper);
  }
  .control-panel {
    padding: 22px;
  }
  .control-block + .control-block {
    margin-top: 18px;
  }
  .control-block label,
  .mode-fieldset legend {
    display: block;
    margin-bottom: 8px;
    font-size: 0.78rem;
    font-weight: 700;
  }
  .control-block select {
    width: 100%;
    padding: 10px;
    border: 1px solid #d3cec4;
    border-radius: 7px;
    background: white;
  }
  .mode-fieldset {
    padding: 0;
    border: 0;
  }
  .radio-option {
    display: flex !important;
    gap: 8px;
    margin-top: 9px;
    color: var(--muted) !important;
    cursor: pointer;
  }
  .radio-option input {
    accent-color: var(--accent);
  }
  .api-note {
    margin-top: 20px;
    padding: 13px;
    border-radius: 8px;
    background: #f6eee8;
  }
  .api-note strong {
    color: var(--accent);
  }
  .api-note p {
    margin: 5px 0 0;
    color: var(--muted);
    font-size: 0.7rem;
    line-height: 1.7;
  }
  .main-preview {
    min-height: 370px;
    padding: 25px 30px;
  }
  .preview-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee8df;
  }
  .preview-topline > div,
  .card-title {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .preview-icon,
  .card-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #f6eee8;
    color: var(--accent);
    font-size: 1.2rem;
  }
  .preview-label {
    display: block;
    color: var(--muted);
    font-size: 0.69rem;
  }
  .preview-topline h3 {
    margin: 3px 0 0;
    font-size: 1.06rem;
  }
  .status-pill {
    color: #62816c;
    font-size: 0.7rem;
  }
  .picker-wrap {
    width: min(100%, 400px);
    margin: 30px auto 18px;
  }
  .picker-wrap .pdp {
    width: 100%;
  }
  .value-panel,
  .card-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 11px 13px;
    border: 1px dashed #d8d0c4;
    border-radius: 7px;
    background: #fbf8f3;
  }
  .value-panel span,
  .card-value span {
    color: var(--muted);
    font-size: 0.7rem;
  }
  .value-panel code,
  .card-value code {
    color: var(--accent-dark);
    font-size: 0.78rem;
    direction: ltr;
  }
  .generated-code {
    margin-top: 16px;
  }
  .generated-code h4 {
    margin: 0 0 7px;
    color: var(--muted);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .generated-code pre {
    margin: 0;
    max-height: 230px;
    overflow: auto;
    padding: 14px;
    border-radius: 8px;
    background: #263236;
    color: #f7e7dc;
    direction: ltr;
    text-align: left;
    font-size: 0.75rem;
    line-height: 1.7;
  }
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .calendar-card {
    position: relative;
    padding: 18px;
    cursor: pointer;
    transition: 0.2s;
  }
  .calendar-card:hover {
    border-color: #d7a28c;
    transform: translateY(-2px);
  }
  .calendar-card.active {
    border-color: var(--accent);
    box-shadow: 0 7px 20px #c65d3d1a;
  }
  .card-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    min-height: 45px;
  }
  .card-icon {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
  .card-title h3 {
    margin: 0;
    font-size: 0.9rem;
  }
  .card-title p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 0.67rem;
  }
  .active-badge {
    padding: 4px 7px;
    border-radius: 5px;
    background: #f6eee8;
    color: var(--accent);
    font-size: 0.62rem;
  }
  .card-picker {
    min-height: 78px;
    margin: 18px 0 13px;
  }
  .card-picker .pdp-input {
    font-size: 0.78rem !important;
  }
  .card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .card-value {
    flex: 1;
    padding: 8px 10px;
  }
  .card-value code {
    font-size: 0.68rem;
  }
  .demo-footer {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    margin-top: 54px;
    padding-top: 17px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 0.7rem;
  }
  .demo-footer code {
    color: var(--accent-dark);
  }
  .code-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20000;
    display: grid;
    place-items: center;
    padding: 20px;
    background: #263236aa;
  }
  .code-modal {
    width: min(760px, 100%);
    max-height: 90vh;
    overflow: auto;
    padding: 24px;
    border-radius: 14px;
    background: var(--paper);
    box-shadow: 0 20px 70px #0004;
  }
  .modal-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }
  .modal-close {
    font-size: 1.3rem;
  }
  .code-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 20px;
  }
  .code-tabs.single-code {
    display: block;
  }
  .code-tabs h3 {
    margin: 0 0 7px;
    font-size: 0.8rem;
  }
  .code-tabs pre {
    min-height: 150px;
    overflow: auto;
    margin: 0;
    padding: 14px;
    border-radius: 8px;
    background: #263236;
    color: #f7e7dc;
    direction: ltr;
    text-align: left;
    font-size: 0.75rem;
    line-height: 1.7;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 18px;
  }
  @media (max-width: 900px) {
    .hero-mark {
      display: none;
    }
    .calendar-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 650px) {
    .demo-shell {
      padding: 14px 12px 22px;
    }
    .hero {
      min-height: auto;
      padding: 26px 22px;
    }
    .hero h1 {
      font-size: 2rem;
    }
    .playground-grid,
    .code-tabs {
      grid-template-columns: 1fr;
    }
    .main-preview {
      padding: 20px 16px;
    }
    .calendar-grid {
      grid-template-columns: 1fr;
    }
    .section-heading {
      align-items: start;
      flex-direction: column;
    }
    .demo-footer {
      flex-direction: column;
    }
  }
  .advanced-demo {
    margin-top: 24px;
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--paper);
  }
  .advanced-demo-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 16px;
  }
  .advanced-demo-header > span {
    color: var(--muted);
    font-size: 0.75rem;
  }
  .advanced-demo-grid {
    display: grid;
    grid-template-columns: minmax(260px, 1fr) minmax(280px, 400px);
    gap: 22px;
    align-items: start;
  }
  .advanced-controls {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .advanced-controls label,
  .advanced-label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--muted);
    font-size: 0.7rem;
  }
  .advanced-controls select,
  .advanced-controls input {
    width: 100%;
    padding: 8px;
    border: 1px solid #d3cec4;
    border-radius: 7px;
    background: white;
    color: #263236;
  }
  .advanced-label {
    padding-top: 9px;
  }
  .check-option {
    flex-direction: row !important;
    align-items: center;
  }
  .advanced-preview {
    padding: 16px;
    border: 1px dashed #d8d0c4;
    border-radius: 9px;
  }
  .card-title {
    min-width: 0;
  }
  .card-title > div {
    min-width: 0;
  }
  .card-title h3,
  .card-title p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-icon {
    flex: 0 0 30px;
  }
  .calendar-card .pdp {
    width: 100%;
  }
  @media (max-width: 900px) {
    .advanced-demo-grid {
      grid-template-columns: 1fr;
    }
    .advanced-controls {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 650px) {
    .advanced-demo-header {
      align-items: start;
      flex-direction: column;
    }
    .advanced-controls {
      grid-template-columns: 1fr;
    }
  }
  .calendar-card {
    direction: ltr !important;
    cursor: default;
  }
  .calendar-card:hover {
    transform: none;
  }
  .calendar-card .card-header {
    direction: ltr;
  }
  .calendar-card .card-picker {
    direction: initial;
  }
  .card-icon {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    line-height: 1;
  }
  .card-actions {
    min-height: 38px;
  }
  .main-code-button {
    display: block;
    margin: 16px 0 0 auto;
  }
  .advanced-options {
    margin-top: 18px;
    border-top: 1px solid #eee8df;
    padding-top: 14px;
  }
  .advanced-options summary {
    cursor: pointer;
    color: var(--accent);
    font-size: 0.76rem;
    font-weight: 800;
  }
  .advanced-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    margin-top: 12px;
  }
  .advanced-fields label,
  .advanced-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--muted);
    font-size: 0.68rem;
  }
  .advanced-fields select,
  .advanced-fields input {
    width: 100%;
    padding: 7px;
    border: 1px solid #d3cec4;
    border-radius: 6px;
    background: white;
    color: #263236;
    font-size: 0.72rem;
  }
  .advanced-label {
    padding-top: 8px;
  }
  .weekly-label {
    grid-column: 1 / -1;
    padding-top: 6px;
    border-top: 1px solid #eee8df;
    font-weight: 700;
  }
  .check-option {
    flex-direction: row !important;
    align-items: center;
    gap: 5px;
  }
  .check-option input {
    width: auto;
  }
  .card-picker .pdp-group,
  .card-picker .pdp-input,
  .card-picker .pdp-icon {
    min-height: 40px;
    height: 40px;
  }
  .control-panel {
    min-width: 0;
  }
  @media (max-width: 650px) {
    .advanced-fields {
      grid-template-columns: 1fr;
    }
  }
</style>
