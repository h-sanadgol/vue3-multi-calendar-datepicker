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
  type PropGuide = {
    name: string;
    type: string;
    defaultValue: string;
    description: Record<Language, string>;
    examples: string[];
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
  const propGuide: PropGuide[] = [
    {
      name: 'calendar',
      type: 'Calendar',
      defaultValue: 'locale-based',
      description: {
        fa: 'تقویم فعال برای تبدیل، نمایش و حرکت بین تاریخ‌ها.',
        en: 'Calendar used to parse, display, and navigate dates.',
        ar: 'التقويم المستخدم لتحليل التواريخ وعرضها والتنقل بينها.',
      },
      examples: ['calendar="jalali"', 'calendar="gregorian"'],
    },
    {
      name: 'modelCalendar',
      type: 'Calendar | active',
      defaultValue: 'active',
      description: {
        fa: 'تقویم مستقل برای سریال‌سازی مقدار v-model، بدون تغییر تقویم نمایشی.',
        en: 'Calendar used to serialize v-model without changing the visible calendar.',
        ar: 'تقويم مستقل لتسلسل قيمة v-model دون تغيير التقويم المعروض.',
      },
      examples: ['model-calendar="gregorian"', 'model-calendar="active"'],
    },
    {
      name: 'type',
      type: 'date | time | datetime',
      defaultValue: 'date',
      description: {
        fa: 'نوع مقداری که کاربر انتخاب می‌کند: تاریخ، زمان یا هر دو.',
        en: 'Value selected by the user: date, time, or both.',
        ar: 'نوع القيمة التي يحددها المستخدم: تاريخ أو وقت أو كلاهما.',
      },
      examples: ['type="date"', 'type="datetime"'],
    },
    {
      name: 'mode',
      type: 'single | range',
      defaultValue: 'range',
      description: {
        fa: 'انتخاب یک مقدار یا یک بازه‌ی شروع و پایان.',
        en: 'Select one value or a start/end range.',
        ar: 'اختيار قيمة واحدة أو نطاق ببداية ونهاية.',
      },
      examples: ['mode="single"', 'mode="range"'],
    },
    {
      name: 'locale',
      type: 'String',
      defaultValue: 'calendar-aware',
      description: {
        fa: 'زبان متن‌ها و برچسب‌های تقویم؛ می‌تواند فهرستی با fallback کاما جدا باشد.',
        en: 'UI language and labels; comma-separated fallback locales are supported.',
        ar: 'لغة الواجهة والتسميات، مع دعم قائمة لغات بديلة مفصولة بفواصل.',
      },
      examples: ['locale="fa"', 'locale="en,fa"'],
    },
    {
      name: 'hijriProvider',
      type: 'ummalqura | tabular',
      defaultValue: 'ummalqura',
      description: {
        fa: 'روش محاسبه‌ی تاریخ هجری را انتخاب می‌کند.',
        en: 'Chooses the Hijri calculation method.',
        ar: 'يحدد طريقة حساب التاريخ الهجري.',
      },
      examples: ['hijri-provider="ummalqura"', 'hijri-provider="tabular"'],
    },
    {
      name: 'format',
      type: 'String',
      defaultValue: 'type-based',
      description: {
        fa: 'فقط شکل رشته‌ی v-model را تعیین می‌کند؛ متن input و footer را تغییر نمی‌دهد.',
        en: 'Controls only the serialized v-model string; it does not format the input text or footer.',
        ar: 'يحدد شكل سلسلة v-model فقط، ولا يغير نص الإدخال أو التسمية السفلية.',
      },
      examples: ['format="YYYY-MM-DD"', 'format="jYYYY/jMM/jDD"'],
    },
    {
      name: 'inputFormat',
      type: 'String',
      defaultValue: 'type-based',
      description: {
        fa: 'قالب نمایش و parse شدن متن داخل فیلد ورودی؛ روی رشته‌ی v-model اثر ندارد.',
        en: 'Displays and parses the input text; it does not change the serialized v-model string.',
        ar: 'يعرض نص الإدخال ويحلله، ولا يغير سلسلة v-model الناتجة.',
      },
      examples: ['input-format="DD.MM.YYYY"', 'input-format="jYY/jMM/jDD"'],
    },
    {
      name: 'displayFormat',
      type: 'String',
      defaultValue: 'type-based',
      description: {
        fa: 'فقط برچسب خوانای پایین تقویم باز را تغییر می‌دهد؛ روی input و v-model اثر ندارد.',
        en: 'Changes only the readable footer label; it does not change the input or v-model.',
        ar: 'يغير التسمية أسفل التقويم المفتوح فقط، ولا يغير الإدخال أو v-model.',
      },
      examples: [
        'display-format="D MMMM YYYY"',
        'display-format="jYY/jMM/jDD"',
      ],
    },
    {
      name: 'inputMask',
      type: 'String | Object',
      defaultValue: 'calendar-based',
      description: {
        fa: 'کاراکترها، ترتیب و جداکننده‌های تایپ را کنترل می‌کند؛ blocks بازه‌ی هر token را تعیین می‌کند و مقدار v-model را قالب‌بندی نمی‌کند.',
        en: 'Restricts typed characters, order, and separators; blocks define per-token ranges and it does not serialize v-model.',
        ar: 'يقيد أحرف وترتيب وفواصل الإدخال؛ تحدد blocks نطاق كل token ولا تقوم بتسلسل v-model.',
      },
      examples: [
        'input-mask="YYYY/MM/DD"',
        ':input-mask="{ pattern: \'jYY/jMM-jDD\', autoInsert: true }"',
        ':input-mask="{ pattern: \'YYYY/MM/DD HH:mm\', blocks: { YYYY: { from: 1970, to: 2030 }, MM: { from: 1, to: 12 }, DD: { from: 1, to: 31 }, HH: { from: 0, to: 23 }, mm: { from: 0, to: 59 } } }"',
      ],
    },
    {
      name: 'from / to',
      type: 'String',
      defaultValue: '1300 / 1499',
      description: {
        fa: 'حداقل و حداکثر تاریخ یا زمان قابل انتخاب را مشخص می‌کنند.',
        en: 'Set the minimum and maximum selectable date or time.',
        ar: 'يحددان أدنى وأقصى تاريخ أو وقت يمكن اختياره.',
      },
      examples: [
        'from="1400/01/01" to="1410/12/29"',
        'from="09:00" to="18:00"',
      ],
    },
    {
      name: 'column',
      type: 'Number | Record',
      defaultValue: '{ 576: 1 }',
      description: {
        fa: 'تعداد ستون‌های تقویم را ثابت یا بر اساس breakpoint تنظیم می‌کند.',
        en: 'Sets visible calendar columns directly or by responsive breakpoint.',
        ar: 'يضبط عدد أعمدة التقويم مباشرة أو حسب نقاط التوقف responsive.',
      },
      examples: [':column="2"', ':column="{ 576: 2, 900: 3 }"'],
    },
    {
      name: 'weekStartsOn',
      type: 'Number | auto',
      defaultValue: 'auto',
      description: {
        fa: 'روز شروع هفته را از ۰ تا ۶ یا به‌صورت پیش‌فرض تقویم تعیین می‌کند.',
        en: 'Sets the first weekday from 0 to 6 or uses the calendar default.',
        ar: 'يحدد أول يوم في الأسبوع من 0 إلى 6 أو يستخدم إعداد التقويم.',
      },
      examples: [':week-starts-on="1"', 'week-starts-on="auto"'],
    },
    {
      name: 'weekendDays',
      type: 'Number[]',
      defaultValue: 'calendar-aware',
      description: {
        fa: 'روزهای تعطیل هفتگی را برای رنگ‌بندی و رفتار تقویم مشخص می‌کند.',
        en: 'Defines weekly holidays used for calendar styling and behavior.',
        ar: 'يحدد العطلات الأسبوعية المستخدمة في تنسيق التقويم وسلوكه.',
      },
      examples: [':weekend-days="[5, 6]"', ':weekend-days="[0]"'],
    },
    {
      name: 'minuteStep / hourStep',
      type: 'Number',
      defaultValue: '1 / 1',
      description: {
        fa: 'گام افزایش دقیقه و ساعت در انتخاب‌گر زمان.',
        en: 'Minute and hour increments in the time picker.',
        ar: 'مقدار زيادة الدقائق والساعات في منتقي الوقت.',
      },
      examples: [':minute-step="5"', ':hour-step="2"'],
    },
    {
      name: 'autoSubmit',
      type: 'Boolean',
      defaultValue: 'true',
      description: {
        fa: 'پس از کامل شدن انتخاب، مقدار را خودکار ثبت می‌کند یا منتظر دکمه submit می‌ماند.',
        en: 'Submits after a complete selection or waits for the submit action.',
        ar: 'يرسل القيمة بعد اكتمال الاختيار أو ينتظر إجراء الإرسال.',
      },
      examples: ['auto-submit', ':auto-submit="false"'],
    },
    {
      name: 'clearable',
      type: 'Boolean',
      defaultValue: 'false',
      description: {
        fa: 'دکمه‌ی پاک‌کردن مقدار را نمایش می‌دهد.',
        en: 'Shows a control for clearing the selected value.',
        ar: 'يعرض زرًا لمسح القيمة المحددة.',
      },
      examples: ['clearable', ':clearable="false"'],
    },
    {
      name: 'clickOn',
      type: 'all | input | icon | none',
      defaultValue: 'all',
      description: {
        fa: 'مشخص می‌کند کلیک روی کدام بخش picker را باز کند.',
        en: 'Chooses which area opens the picker.',
        ar: 'يحدد الجزء الذي يفتح منتقي التاريخ عند النقر.',
      },
      examples: ['click-on="input"', 'click-on="icon"'],
    },
    {
      name: 'modal / show',
      type: 'Boolean',
      defaultValue: 'false',
      description: {
        fa: 'modal نحوه‌ی نمایش را modal می‌کند؛ show باز یا بسته بودن را کنترل می‌کند.',
        en: 'modal changes presentation; show controls whether the picker is open.',
        ar: 'modal يغير طريقة العرض، و show يتحكم في فتح المنتقي.',
      },
      examples: ['modal', ':show="isOpen"'],
    },
    {
      name: 'label',
      type: 'String',
      defaultValue: '—',
      description: {
        fa: 'برچسب دسترس‌پذیر و قابل نمایش برای فیلد ورودی.',
        en: 'Visible and accessible label for the input field.',
        ar: 'تسمية مرئية وميسرة لحقل الإدخال.',
      },
      examples: ['label="Start date"', 'label="تاریخ شروع"'],
    },
    {
      name: 'dualInput',
      type: 'Boolean',
      defaultValue: 'false',
      description: {
        fa: 'در حالت range دو فیلد جدا برای شروع و پایان نمایش می‌دهد.',
        en: 'Renders separate start and end inputs in range mode.',
        ar: 'يعرض حقلي بداية ونهاية منفصلين في وضع النطاق.',
      },
      examples: ['dual-input', ':dual-input="false"'],
    },
    {
      name: 'iconInside',
      type: 'Boolean',
      defaultValue: 'false',
      description: {
        fa: 'آیکن تقویم را داخل کادر input قرار می‌دهد.',
        en: 'Places the calendar icon inside the input box.',
        ar: 'يضع أيقونة التقويم داخل حقل الإدخال.',
      },
      examples: ['icon-inside', ':icon-inside="false"'],
    },
    {
      name: 'shortcut',
      type: 'Boolean | Object',
      defaultValue: 'false',
      description: {
        fa: 'با مقدار true میانبرهای داخلی را فعال می‌کند. در حالت object می‌توانید میانبرهای تک‌تاریخ، بازه، زمان و datetime را با برچسب دلخواه تعریف کنید.',
        en: 'true enables built-in date/time shortcuts. An object lets you define labeled single dates, ranges, times, and datetimes.',
        ar: 'تفعّل true الاختصارات المضمنة للتاريخ والوقت. ويسمح object بتعريف تواريخ أو نطاقات أو أوقات أو datetime بعناوين مخصصة.',
      },
      examples: [
        'shortcut',
        'date-single: now · yesterday · tomorrow · first/last of week',
        'date-range: this/previous/next week · this/previous/next month',
        'time-single: now · one hour ago/later · midnight · midday',
        'time-range: this/previous/next hour · all day',
        ':shortcut="{ \'Release\': [releaseDate] }"',
        ':shortcut="{ \'Sprint\': [sprintStart, sprintEnd] }"',
        ':shortcut="{ \'Office hours\': [startTime, endTime] }"',
      ],
    },
    {
      name: 'disable',
      type: 'Array | String | Function | RegExp',
      defaultValue: '—',
      description: {
        fa: 'روزها یا زمان‌های غیرقابل انتخاب را با چند نوع قانون مشخص می‌کند.',
        en: 'Disables dates or times using a list, string, function, or regular expression.',
        ar: 'يعطل تواريخ أو أوقاتًا باستخدام قائمة أو نص أو دالة أو تعبير منتظم.',
      },
      examples: ['disable="1404/01/01"', ':disable="date => date.day() === 5"'],
    },
    {
      name: 'localeConfig',
      type: 'Object',
      defaultValue: '—',
      description: {
        fa: 'رشته‌های ترجمه و تنظیمات زبان را اضافه یا override می‌کند.',
        en: 'Adds or overrides localized strings and locale settings.',
        ar: 'يضيف أو يستبدل النصوص وإعدادات اللغة.',
      },
      examples: [
        ':locale-config="{ today: \'Now\' }"',
        ':locale-config="customLocale"',
      ],
    },
    {
      name: 'styles',
      type: 'Object',
      defaultValue: '—',
      description: {
        fa: 'استایل‌های داخلی کامپوننت را برای ظاهر سفارشی override می‌کند.',
        en: 'Overrides internal component styles for visual customization.',
        ar: 'يستبدل أنماط المكوّن الداخلية للتخصيص البصري.',
      },
      examples: [
        ':styles="{ primaryColor: \'#7c3aed\' }"',
        ':styles="themeStyles"',
      ],
    },
    {
      name: 'color',
      type: 'String',
      defaultValue: 'theme default',
      description: {
        fa: 'رنگ آماده‌ی رابط را از بین blue، red، pink، orange، green، purple و gray انتخاب می‌کند.',
        en: 'Selects a preset UI color: blue, red, pink, orange, green, purple, or gray.',
        ar: 'يختار لون الواجهة من blue أو red أو pink أو orange أو green أو purple أو gray.',
      },
      examples: ['color="blue"', 'color="purple"'],
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
      formatGuide: 'راهنمای فرمت‌ها',
      formatInput: 'فرمت ورودی',
      formatMask: 'ماسک ورودی',
      formatDisplay: 'فرمت نمایش',
      formatGuideIntro:
        'این سه تنظیم جدا از هم کار می‌کنند: مقدار v-model، متن ورودی و برچسب پایین تقویم.',
      inputFormatGuide:
        'قالبی است که کاربر در فیلد متنی وارد می‌کند. مثال: jYY/jMM/jDD برای تاریخ جلالی.',
      inputMaskGuide:
        'ورودی را به کاراکترها و ترتیب مجاز محدود می‌کند؛ blocks برای بازه‌ی هر token، روز ۰۱ تا ۳۱، ماه ۰۱ تا ۱۲ و strict برای بررسی تاریخ کامل است.',
      displayFormatGuide:
        'فقط برچسب خوانای پایین تقویم باز را تغییر می‌دهد و مقدار input یا v-model را تغییر نمی‌دهد.',
      formatExample: 'مثال',
      propsGuide: 'راهنمای کامل پراپ‌ها',
      propsGuideKicker: 'راهنمای پراپ‌ها',
      propsGuideIntro:
        'همه‌ی پراپ‌های ورودی کامپوننت را با کاربرد، مقدار پیش‌فرض و چند مثال ببینید.',
      defaultValue: 'پیش‌فرض',
      examples: 'مثال‌ها',
      modelCalendar: 'تقویم v-model',
      modelCalendarActive: 'تقویم فعال',
      format: 'فرمت v-model',
      modelFormatGuide:
        'فقط شکل رشته‌ی v-model را تعیین می‌کند؛ متن input و برچسب پایین تقویم را تغییر نمی‌دهد.',
      modal: 'نمایش modal',
      show: 'باز بودن اجباری',
      label: 'برچسب ورودی',
      shortcut: 'میانبرها',
      localeConfig: 'سفارشی‌سازی ترجمه',
      styles: 'استایل سفارشی',
      stylesDefault: 'پیش‌فرض',
      stylesPurple: 'تم بنفش',
      liveHint:
        'تاریخ را دستی وارد کنید؛ پس از blur، مقدار تقویم و ماه نمایشی همگام می‌شوند.',
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
      formatGuide: 'Format guide',
      formatInput: 'Input format',
      formatMask: 'Input mask',
      formatDisplay: 'Display format',
      formatGuideIntro:
        'These three settings have separate jobs: the v-model value, the text input, and the label at the bottom of the open calendar.',
      inputFormatGuide:
        'Controls the text the user enters. Example: jYY/jMM/jDD for a Jalali date.',
      inputMaskGuide:
        'Restricts characters and order; blocks define token ranges, day is 01–31, month 01–12, and strict validates the complete date.',
      displayFormatGuide:
        'Changes only the readable label at the bottom of the open calendar; it does not change the input or v-model.',
      formatExample: 'Example',
      propsGuide: 'Complete props guide',
      propsGuideKicker: 'PROPS GUIDE',
      propsGuideIntro:
        'Review every component input prop with its purpose, default value, and multiple examples.',
      defaultValue: 'Default',
      examples: 'Examples',
      modelCalendar: 'v-model calendar',
      modelCalendarActive: 'Active calendar',
      format: 'v-model format',
      modelFormatGuide:
        'Controls only the serialized v-model string; it does not format the input text or the calendar footer.',
      modal: 'Modal presentation',
      show: 'Force open',
      label: 'Input label',
      shortcut: 'Shortcuts',
      localeConfig: 'Custom translations',
      styles: 'Custom styles',
      stylesDefault: 'Default',
      stylesPurple: 'Purple theme',
      liveHint:
        'Type a date manually; on blur, the model and visible calendar stay in sync.',
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
      formatGuide: 'دليل التنسيقات',
      formatInput: 'تنسيق الإدخال',
      formatMask: 'قناع الإدخال',
      formatDisplay: 'تنسيق العرض',
      formatGuideIntro:
        'تعمل هذه الإعدادات الثلاثة بشكل مستقل: قيمة v-model، وحقل الإدخال، والتسمية أسفل التقويم المفتوح.',
      inputFormatGuide:
        'يحدد النص الذي يدخله المستخدم. مثال: jYY/jMM/jDD للتاريخ الجلالي.',
      inputMaskGuide:
        'يقيد الأحرف والترتيب؛ blocks تحدد نطاق كل token، واليوم 01–31 والشهر 01–12، وstrict يحقق التاريخ الكامل.',
      displayFormatGuide:
        'يغير التسمية المقروءة أسفل التقويم المفتوح فقط، ولا يغير حقل الإدخال أو v-model.',
      formatExample: 'مثال',
      propsGuide: 'الدليل الكامل للخصائص',
      propsGuideKicker: 'دليل الخصائص',
      propsGuideIntro:
        'راجع كل خاصية إدخال مع وظيفتها وقيمتها الافتراضية وأمثلة متعددة.',
      defaultValue: 'الافتراضي',
      examples: 'أمثلة',
      modelCalendar: 'تقويم v-model',
      modelCalendarActive: 'التقويم النشط',
      format: 'تنسيق v-model',
      modelFormatGuide:
        'يحدد شكل سلسلة v-model فقط، ولا يغير نص الإدخال أو تسمية أسفل التقويم.',
      modal: 'عرض مشروط',
      show: 'فتح إجباري',
      label: 'تسمية الإدخال',
      shortcut: 'الاختصارات',
      localeConfig: 'ترجمات مخصصة',
      styles: 'أنماط مخصصة',
      stylesDefault: 'الافتراضي',
      stylesPurple: 'سمة بنفسجية',
      liveHint:
        'أدخل التاريخ يدوياً؛ بعد مغادرة الحقل يتزامن النموذج والشهر المعروض.',
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
  const advancedModelCalendar = ref<CalendarId | 'active'>('active');
  const advancedValue = ref('2025-04-04');
  const advancedFormat = ref('');
  const advancedInputFormat = ref('');
  const advancedInputMask = ref('');
  const advancedDisplayFormat = ref('');
  const advancedColumns = ref(1);
  const advancedClearable = ref(true);
  const advancedAutoSubmit = ref(true);
  const advancedMaskAutoInsert = ref(true);
  const advancedMaskStrict = ref(true);
  const advancedMaskBlocks = ref(false);
  const advancedIconInside = ref(false);
  const advancedDualInput = ref(false);
  const advancedModal = ref(false);
  const advancedShow = ref(false);
  const advancedLabel = ref('');
  const advancedShortcut = ref(false);
  const advancedLocaleConfig = ref(false);
  const advancedStyles = ref<'default' | 'purple'>('default');
  const advancedMinuteStep = ref(1);
  const advancedHourStep = ref(1);
  const advancedClickOn = ref<'all' | 'input' | 'icon' | 'none'>('all');
  const t = computed(() => ui[language.value]);
  const liveStyles = computed(() =>
    advancedStyles.value === 'purple'
      ? {
          'primary-color': '#7c3aed',
          'secondary-color': '#ddd6fe',
          'in-range-background': '#ede9fe',
        }
      : undefined,
  );
  const liveLocaleConfig = computed(() =>
    advancedLocaleConfig.value
      ? {
          en: { translations: { today: 'Now' } },
          fa: { translations: { today: 'اکنون' } },
          ar: { translations: { today: 'الآن' } },
        }
      : undefined,
  );
  const liveMaskBlocks = {
    YYYY: { from: 1970, to: 2030 },
    MM: { from: 1, to: 12 },
    DD: { from: 1, to: 31 },
    HH: { from: 0, to: 23 },
    mm: { from: 0, to: 59 },
  };
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
      advancedModelCalendar.value !== 'active'
        ? `  model-calendar="${advancedModelCalendar.value}"`
        : '',
      `  :column="${advancedColumns.value}"`,
      `  color="${advancedColor.value}"`,
      `  week-starts-on="${advancedWeekStart.value}"`,
      `  click-on="${advancedClickOn.value}"`,
      `  :minute-step="${advancedMinuteStep.value}"`,
      `  :hour-step="${advancedHourStep.value}"`,
      advancedClearable.value ? '  clearable' : '  :clearable="false"',
      advancedAutoSubmit.value ? '  auto-submit' : '  :auto-submit="false"',
      advancedFormat.value ? `  format="${advancedFormat.value}"` : '',
      advancedInputFormat.value
        ? `  input-format="${advancedInputFormat.value}"`
        : '',
      advancedInputMask.value
        ? `  :input-mask="{ pattern: '${advancedInputMask.value}', autoInsert: ${advancedMaskAutoInsert.value}, strict: ${advancedMaskStrict.value}${advancedMaskBlocks.value ? ', blocks: { YYYY: { from: 1970, to: 2030 }, MM: { from: 1, to: 12 }, DD: { from: 1, to: 31 }, HH: { from: 0, to: 23 }, mm: { from: 0, to: 59 } }' : ''} }"`
        : '',
      advancedDisplayFormat.value
        ? `  display-format="${advancedDisplayFormat.value}"`
        : '',
      advancedIconInside.value ? '  icon-inside' : '',
      advancedDualInput.value ? '  dual-input' : '',
      advancedModal.value ? '  modal' : '',
      advancedShow.value ? '  show' : '',
      advancedLabel.value ? `  label="${advancedLabel.value}"` : '',
      advancedShortcut.value ? '  shortcut' : '',
      advancedLocaleConfig.value
        ? `  :locale-config="{ en: { translations: { today: 'Now' } } }"`
        : '',
      advancedStyles.value === 'purple'
        ? `  :styles="{ 'primary-color': '#7c3aed' }"`
        : '',
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
    advancedModelCalendar.value = 'active';
    advancedValue.value = '2025-04-04';
    advancedFormat.value = '';
    advancedInputFormat.value = '';
    advancedInputMask.value = '';
    advancedDisplayFormat.value = '';
    advancedColumns.value = 1;
    advancedClearable.value = true;
    advancedAutoSubmit.value = true;
    advancedMaskAutoInsert.value = true;
    advancedMaskStrict.value = true;
    advancedMaskBlocks.value = false;
    advancedIconInside.value = false;
    advancedDualInput.value = false;
    advancedModal.value = false;
    advancedShow.value = false;
    advancedLabel.value = '';
    advancedShortcut.value = false;
    advancedLocaleConfig.value = false;
    advancedStyles.value = 'default';
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
                >{{ t.modelCalendar
                }}<select v-model="advancedModelCalendar">
                  <option value="active">{{ t.modelCalendarActive }}</option>
                  <option
                    v-for="calendar in calendars"
                    :key="calendar.id"
                    :value="calendar.id"
                  >
                    {{ calendar.title[language] }}
                  </option>
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
                ><span class="format-label"
                  >{{ t.format
                  }}<button
                    type="button"
                    class="format-info"
                    :aria-label="`${t.format} ${t.formatExample}`"
                  >
                    ?</button
                  ><span class="field-tooltip" role="tooltip">{{
                    t.modelFormatGuide
                  }}</span></span
                ><input
                  v-model="advancedFormat"
                  placeholder="YYYY-MM-DD" /></label
              ><label
                ><span class="format-label"
                  >{{ t.formatInput
                  }}<button
                    type="button"
                    class="format-info"
                    :aria-label="`${t.formatInput} ${t.formatExample}`"
                  >
                    ?</button
                  ><span class="field-tooltip" role="tooltip">{{
                    t.inputFormatGuide
                  }}</span></span
                ><input
                  v-model="advancedInputFormat"
                  placeholder="YYYY-MM-DD" /></label
              ><label
                ><span class="format-label"
                  >{{ t.formatMask
                  }}<button
                    type="button"
                    class="format-info"
                    :aria-label="`${t.formatMask} ${t.formatExample}`"
                  >
                    ?</button
                  ><span class="field-tooltip" role="tooltip">{{
                    t.inputMaskGuide
                  }}</span></span
                ><input
                  v-model="advancedInputMask"
                  placeholder="calendar-default" /></label
              ><label
                ><span class="format-label"
                  >{{ t.formatDisplay
                  }}<button
                    type="button"
                    class="format-info"
                    :aria-label="`${t.formatDisplay} ${t.formatExample}`"
                  >
                    ?</button
                  ><span class="field-tooltip" role="tooltip">{{
                    t.displayFormatGuide
                  }}</span></span
                ><input
                  v-model="advancedDisplayFormat"
                  placeholder="YY-MM-DD" /></label
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
                  max="24"
              /></label>
              <fieldset class="advanced-group">
                <legend>Weekly holidays</legend>
                <label class="check-option"
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
                >
              </fieldset>
              <fieldset class="advanced-group behavior-group">
                <legend>Behavior</legend>
                <label class="check-option"
                  ><input
                    v-model="advancedClearable"
                    type="checkbox"
                  />Clearable</label
                ><label class="check-option"
                  ><input v-model="advancedAutoSubmit" type="checkbox" />Auto
                  submit</label
                ><label class="check-option"
                  ><input
                    v-model="advancedMaskAutoInsert"
                    type="checkbox"
                  />Auto mask separators</label
                ><label class="check-option"
                  ><input v-model="advancedMaskStrict" type="checkbox" />Strict
                  mask dates</label
                ><label class="check-option"
                  ><input v-model="advancedMaskBlocks" type="checkbox" />Custom
                  mask blocks</label
                ><label class="check-option"
                  ><input v-model="advancedIconInside" type="checkbox" />Icon
                  inside</label
                ><label class="check-option"
                  ><input v-model="advancedDualInput" type="checkbox" />Dual
                  input</label
                ><label class="check-option"
                  ><input v-model="advancedModal" type="checkbox" />{{
                    t.modal
                  }}</label
                ><label class="check-option"
                  ><input v-model="advancedShow" type="checkbox" />{{
                    t.show
                  }}</label
                ><label class="check-option"
                  ><input v-model="advancedShortcut" type="checkbox" />{{
                    t.shortcut
                  }}</label
                >
              </fieldset>
              <label
                >{{ t.label
                }}<input
                  v-model="advancedLabel"
                  :placeholder="t.active" /></label
              ><label
                >{{ t.styles
                }}<select v-model="advancedStyles">
                  <option value="default">{{ t.stylesDefault }}</option>
                  <option value="purple">{{ t.stylesPurple }}</option>
                </select></label
              ><label class="check-option advanced-toggle"
                ><input v-model="advancedLocaleConfig" type="checkbox" />{{
                  t.localeConfig
                }}</label
              >
            </div>
          </details>
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
              :model-calendar="advancedModelCalendar"
              :format="
                advancedFormat ||
                (activeCalendar === 'jalali' ? 'jYYYY/jMM/jDD' : undefined)
              "
              :input-format="advancedInputFormat || undefined"
              :input-mask="
                advancedInputMask
                  ? {
                      pattern: advancedInputMask,
                      autoInsert: advancedMaskAutoInsert,
                      strict: advancedMaskStrict,
                      blocks: advancedMaskBlocks ? liveMaskBlocks : undefined,
                    }
                  : undefined
              "
              :display-format="advancedDisplayFormat || undefined"
              :hijri-provider="hijriProvider"
              :mode="mode"
              :type="pickerType"
              :locale="advancedLocale || calendarLocale(activeCalendar)"
              :column="advancedColumns"
              :from="
                advancedFrom ||
                (pickerType === 'time' ? '00:00' : selectedCalendar.from)
              "
              :to="
                advancedTo ||
                (pickerType === 'time' ? '23:59' : selectedCalendar.to)
              "
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
              :modal="advancedModal"
              :show="advancedShow"
              :label="
                advancedLabel ||
                `${t.active} ${selectedCalendar.title[language]}`
              "
              :shortcut="advancedShortcut"
              :locale-config="liveLocaleConfig"
              :styles="liveStyles"
            />
          </div>
          <div class="value-panel">
            <span>{{ t.value }}</span
            ><code>{{ mainValue || '—' }}</code>
          </div>
          <p class="playground-hint">{{ t.liveHint }}</p>
          <div class="generated-code">
            <h4>HTML</h4>
            <pre><code>{{ mainCodeHtml }}</code></pre>
          </div>
        </div>
      </div>
    </section>
    <section class="prop-guide" aria-labelledby="props-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">{{ t.propsGuideKicker }}</span>
          <h2 id="props-title">{{ t.propsGuide }}</h2>
        </div>
        <p>{{ t.propsGuideIntro }}</p>
      </div>
      <div class="prop-guide-grid">
        <article v-for="prop in propGuide" :key="prop.name" class="prop-card">
          <div class="prop-card-heading">
            <code>{{ prop.name }}</code>
            <span>{{ prop.type }}</span>
          </div>
          <p>{{ prop.description[language] }}</p>
          <small>{{ t.defaultValue }}: {{ prop.defaultValue }}</small>
          <div class="prop-examples">
            <strong>{{ t.examples }}</strong>
            <code v-for="example in prop.examples" :key="example">{{
              example
            }}</code>
          </div>
        </article>
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
  .playground-hint {
    margin: 10px 0 0;
    color: var(--muted);
    font-size: 0.78rem;
    line-height: 1.6;
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
  .format-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .format-info {
    width: 15px;
    height: 15px;
    padding: 0;
    border: 1px solid var(--accent);
    border-radius: 50%;
    background: transparent;
    color: var(--accent);
    cursor: help;
    font-size: 0.58rem;
    font-weight: 800;
  }
  .field-tooltip {
    position: absolute;
    z-index: 5;
    left: 20px;
    bottom: 20px;
    display: none;
    width: min(290px, calc(100vw - 70px));
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: #263236;
    color: #fffdf9;
    box-shadow: 0 8px 20px #2632362b;
    font-size: 0.68rem;
    line-height: 1.45;
  }
  .field-tooltip code {
    color: #f4c0a4;
  }
  .format-label:hover .field-tooltip,
  .format-label:focus-within .field-tooltip {
    display: block;
  }
  .prop-guide {
    padding: 34px 0 10px;
  }
  .prop-guide-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .prop-card {
    min-height: 190px;
    padding: 15px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
  }
  .prop-card-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 9px;
  }
  .prop-card-heading code {
    color: var(--accent-dark);
    font-weight: 800;
  }
  .prop-card-heading span,
  .prop-card small {
    color: var(--muted);
    font-size: 0.66rem;
  }
  .prop-card p {
    min-height: 46px;
    margin: 0 0 8px;
    color: var(--muted);
    font-size: 0.72rem;
    line-height: 1.5;
  }
  .prop-examples {
    display: grid;
    gap: 5px;
    margin-top: 10px;
  }
  .prop-examples strong {
    color: var(--accent);
    font-size: 0.66rem;
  }
  .prop-examples code {
    display: block;
    overflow-wrap: anywhere;
    padding: 4px 6px;
    border-radius: 5px;
    background: #f2ece5;
    color: #263236;
    font-size: 0.64rem;
  }
  .advanced-group {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-column: 1 / -1;
    gap: 7px;
    margin: 0;
    padding: 8px;
    border: 1px solid #e4ded5;
    border-radius: 7px;
  }
  .advanced-group legend {
    padding: 0 4px;
    color: var(--muted);
    font-size: 0.68rem;
    font-weight: 700;
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
    min-height: 28px;
    line-height: 1.25;
  }
  .check-option input {
    width: auto;
  }
  .behavior-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 8px;
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
  @media (max-width: 1000px) {
    .prop-guide-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 650px) {
    .advanced-fields {
      grid-template-columns: 1fr;
    }
    .behavior-group {
      grid-template-columns: 1fr;
    }
    .prop-guide-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
