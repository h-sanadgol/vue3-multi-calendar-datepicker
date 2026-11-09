# کارهای باقی‌مانده پس از hardening و QA

موارد انجام‌شده‌ی امنیتی، تقویمی، build، dependency و QA از این فهرست حذف شده‌اند. وضعیت فعلی بر اساس اجرای کامل `pnpm test` در ۵ نوامبر ۲۰۲۶ ثبت شده است: ۱۳ spec و ۲۲۵ تست، همگی موفق.

## کارهای توسعه‌ای باقی‌مانده

- [ ] **REF-01 — کوچک‌سازی تدریجی `DatePicker.vue`**
  - استخراج مرحله‌ای adapter bridge، parsing/constraints، keyboard، calendar grid و time picker به composable/componentهای مستقل.
  - هر مرحله باید تست‌های فعلی را سبز نگه دارد و بدون تغییر API عمومی انجام شود.

- [ ] **MC-04 — تست بصری responsive و runtime تقویم‌ها**
  - بررسی Hebrew، Chinese و Buddhist در viewportهای ۳۲۰، ۷۶۸، ۱۰۲۴ و ۱۴۴۰.
  - بررسی popup، ماه/سال جاری، انتخاب روز، range، تغییر ماه و جلوگیری از clipping یا overlap.

- [ ] **MC-05 — تکمیل تست E2E دمو**
  - تغییر چندباره‌ی زبان بین فارسی، انگلیسی و عربی.
  - بررسی Advanced Props، modal کد، time/datetime/range و provider قمری.

- [ ] **MC-07 — fallback کنترل‌شده برای `Intl`**
  - اگر runtime از Hebrew یا Chinese پشتیبانی نکرد، پیام خطای قابل‌فهم یا adapter جایگزین تزریق‌پذیر ارائه شود.

- [ ] **MC-08 — تفکیک منطق `DatePicker.vue`**
  - جداسازی adapter، locale، parsing، calendar view، keyboard و time picker بدون تغییر رفتار.

- [ ] **MC-09 — تفکیک `App.vue`**
  - جداکردن playground، gallery، code modal و i18n به اجزای کوچک‌تر.
  - بررسی focus، keyboard navigation و aria در modalها.

- [ ] **MC-10 — unit test مستقل برای adapterها**
  - پوشش leap year/month، مرزهای `from` و `to`، add/subtract، invalid input، timezone و round-trip برای هر adapter.

- [ ] **MC-11 — هماهنگ‌سازی مستندات انتشار**
  - تکمیل migration guide، release notes و مستندات کامل API برای `calendar`، `modelCalendar`، فرمت‌ها و محدودیت‌های تقویم‌ها.

- [ ] **MC-12 — بررسی bundle size و tree-shaking**
  - اندازه‌گیری خروجی ESM/UMD و بررسی اختیاری‌سازی adapterهای تخصصی.

- [ ] **MC-13 — extension API تقویم‌های تخصصی**
  - مستندسازی registry عمومی، typeهای adapter و نمونه‌ی adapter سفارشی.

## قابلیت‌های جدید مورد توافق

- [x] **INPUT-01 — تثبیت قرارداد فرمت‌های model و input**
  - `format` به‌عنوان فرمت `v-model` باقی بماند.
  - `inputFormat` به‌عنوان فرمت نمایش/parse فیلد ورودی مستقل بماند.
  - قرارداد `displayFormat` برای متن نمایشی picker مستند و regression شود؛ prop جدید فقط در صورت اثبات نیاز اضافه شود.

- [x] **INPUT-02 — همگام‌سازی ورودی دستی با picker**
  - ورود دستی به‌صورت پیش‌فرض فعال باشد.
  - مقدار معتبر، `selectedDates` و `onDisplay` را همزمان به‌روزرسانی کند.
  - ورودی ناقص قابل ادامه‌دادن باشد و مقدار نامعتبر state داخلی را تغییر ندهد.
  - commit نهایی با `blur`، `Enter` و مسیر submit پوشش داده شود.

- [x] **INPUT-03 — اعتبارسنجی کاراکتر و تاریخ**
  - کاراکترهای مجاز بر اساس format، locale و تقویم فعال کنترل شوند.
  - ارقام فارسی/عربی و لاتین طبق تنظیمات پشتیبانی شوند.
  - محدودیت واقعی سال/ماه/روز و leap month از adapter فعال گرفته شود؛ نمونه‌هایی مانند روز ۸۸ رد شوند.

- [x] **INPUT-04 — موتور mask و preset تقویمی**
  - `inputMask` با ورودی String برای shorthand و Object/TypeScript برای تنظیمات کامل ارائه شود.
  - preset پیش‌فرض برای هر تقویم و type وجود داشته باشد.
  - placeholder، جداکننده، digit policy، strict mode و امکان override مستند و تست شوند.

- [x] **INPUT-05 — scoped slot برای فیلد ورودی سفارشی**
  - slot استاندارد `#input` با props لازم مانند `value`، `inputAttrs`، `open`، `clear` و handler همگام‌سازی ارائه شود.
  - فیلد سفارشی و input داخلی از یک `v-model` canonical استفاده کنند.
  - single/range، dual input، clear، keyboard و validation تست شوند.

- [ ] **CAL-06 — استقلال کامل adapterهای غیر PersianDate**
  - برای Gregorian، Hijri، Hebrew، Buddhist و Chinese، `PersianDate` از منبع منطق parse/format/compare/add/subtract خارج شود.
  - adapter فعال مالک parts، validation، month names، leap state، day arithmetic و formatting باشد.
  - timestamp فقط transport boundary باشد و تبدیل آن به `PersianDate` منطق تقویم را تعیین نکند.
  - migration مرحله‌ای بدون شکستن Jalali compatibility و با typeهای مستقل انجام شود.

- [ ] **CAL-07 — حذف syntax وابسته به PersianDate از formatter adapterها**
  - `?D`، `?MMMM` و tokenهای مشابه در تقویم‌های غیرشمسی به علامت سؤال یا خروجی ناقص تبدیل نشوند.
  - formatter عمومی adapter جایگزین tokenهای وابسته به PersianDate شود.
  - Hebrew، Chinese و Buddhist برای نام ماه، روز و خروجی model regression داشته باشند.

- [ ] **QA-02 — تست کامل قابلیت‌های ورودی و adapter مستقل**
  - تست unit parser/mask/validation و تست component برای manual sync و scoped input slot اضافه شود.
  - تست cross-calendar برای date، datetime، range، locale و leap month اجرا شود.
  - تست دستی responsive و مرورگر واقعی پس از تکمیل قابلیت‌ها تکرار شود.

### Checkpoint قابلیت‌های جدید

- [ ] قرارداد API و نام propها پیش از implementation تأیید شود.
- [ ] parser/mask بدون UI مستقل تست شود.
- [ ] حداقل یک مسیر کامل از ورود دستی تا نمایش picker و `v-model` برای Jalali و یک adapter مستقل سبز شود.
- [ ] پس از CAL-06 هیچ منطق تقویم غیرشمسی در `PersianDate` پنهان نباشد.
