# کارهای باقی‌مانده: vue3-multi-calendar-datepicker

این فهرست بر اساس بازبینی کد، تست‌های اجرایی و QA بصری در ۲ نوامبر ۲۰۲۶ تهیه شده است.

## اولویت بحرانی

- [ ] **MC-01 — یکسان‌سازی قرارداد `modelValue` و مستندات**
  - رفتار فعلی در صورت فعال‌بودن adapter، مقدار مدل را با تقویم فعال قالب‌بندی می‌کند؛ اما specification و بخشی از README هنوز خروجی میلادی را قرارداد پیش‌فرض معرفی می‌کنند.
  - تصمیم نهایی (`modelCalendar` یا خروجی تقویم فعال) باید گرفته، API و migration guide اصلاح و برای همه‌ی تقویم‌ها تست شود.

- [ ] **MC-02 — حذف فرض‌های باقی‌مانده‌ی شمسی از `disable`**
  - مسیرهای `RegExp` و آرایه‌ی تاریخ‌های غیرفعال هنوز از فرمت `jYYYY/jM/jD` و `date.calendar('jalali')` استفاده می‌کنند.
  - برای Gregorian، Hijri، Hebrew، Buddhist و Chinese باید از adapter فعال و format همان تقویم استفاده شود.

- [x] **MC-03 — سلامت بسته‌ی منتشرشدنی و Nuxt**
  - `pnpm build:nuxt` و `pnpm build:lib` موفق شدند و importهای ESM/CJS بررسی شدند.
  - خروجی‌های `dist/nuxt/index.mjs` و `dist/nuxt/index.cjs` اکنون وجود دارند.

## اولویت بالا

- [ ] **MC-04 — تست بصری و رفع مشکلات runtime تقویم‌ها**
  - Hebrew، Chinese و Buddhist در مرورگر واقعی بررسی شوند؛ مخصوصاً بازشدن popup، ماه/سال جاری، انتخاب روز، تغییر ماه و range.
  - تست بصری فعلی به علت خطای Cypress GPU/DevTools در ویندوز قابل اجرا نبود و مرورگر داخلی نیز در این نشست غیرفعال بود.
  - پس از رفع محیط تست، viewportهای 320، 768، 1024 و 1440 پوشش داده شوند.

- [ ] **MC-05 — تکمیل تست E2E دمو**
  - زبان صفحه چند بار بین English/Farsi/Arabic تغییر کند و متن‌ها و جهت صفحه درست به‌روزرسانی شوند.
  - Advanced Props، کد HTML اصلی، modal کپی، time/datetime/range و provider قمری تست شوند.
  - کارت‌های gallery passive بمانند و حالت active یا انتخاب ناخواسته نداشته باشند.

- [ ] **MC-06 — قرارداد و پشتیبانی واقعی Chinese calendar**
  - ماه کبیسه، نام ماه‌ها، سال مرتبط Gregorian و parse/format باید مدل صریح داشته باشند؛ شماره‌ی ترتیبی ماه به‌تنهایی کافی نیست.
  - تست سال‌های مرزی و حداقل یک ماه کبیسه اضافه شود.

- [ ] **MC-07 — robust کردن fallback برای `Intl`**
  - اگر runtime تقویم `hebrew` یا `chinese` را پشتیبانی نکرد، خطای کنترل‌شده و پیام قابل فهم ارائه شود یا adapter جایگزین تزریق‌پذیر باشد.
  - قابلیت پشتیبانی مرورگرها و اثر آن بر bundle مستند شود.

## اولویت متوسط

- [ ] **MC-08 — جداکردن منطق DatePicker از فایل بزرگ فعلی**
  - `src/components/DatePicker.vue` حدود ۲۰۰۰ خط است و منطق adapter، locale، parsing، UI و keyboard را هم‌زمان نگه می‌دارد.
  - adapter bridge، locale policy، date parsing و calendar view به ماژول‌های مستقل منتقل شوند؛ رفتار فعلی نباید تغییر کند.

- [ ] **MC-09 — خواناسازی و تفکیک `src/App.vue`**
  - template و CSS فعلی بسیار فشرده‌اند؛ playground، gallery، code modal و i18n به اجزای کوچک‌تر منتقل شوند.
  - label/aria مناسب، focus modal و keyboard navigation بررسی شود.

- [ ] **MC-10 — کامل‌کردن پوشش تست adapterها**
  - برای هر adapter: leap year/month، مرزهای `from` و `to`، add/subtract، timezone/UTC، invalid input و round-trip.
  - تست‌های unit مستقل از Vue ایجاد شود؛ تست‌های فعلی Cypress جای unit test را نگیرند.

- [ ] **MC-11 — هماهنگ‌سازی README، specification و release notes**
  - وضعیت adapterهای متصل‌شده، localeهای پیش‌فرض، weekend/week start، محدودیت Chinese و قرارداد model هماهنگ شدند.
  - migration guide کامل package/API هنوز بخشی از MC-11 توسعه‌ای باقی‌مانده است و در MC-01/MC-06 تکمیل می‌شود.

## اولویت پایین‌تر / پس از تثبیت

- [ ] **MC-12 — بررسی bundle size و tree-shaking**
  - اندازه‌ی ESM/UMD و اثر adapterها اندازه‌گیری شود؛ در صورت نیاز adapterهای تخصصی optional شوند.

- [ ] **MC-13 — extension API برای تقویم‌های تخصصی**
  - registry عمومی، typeهای adapter و نمونه‌ی adapter سفارشی مستند و تست شوند.

## وضعیت آخرین بررسی

- ✅ `pnpm lint`
- ✅ `pnpm build:lib` (با دسترسی لازم به cache محلی؛ فقط warning موجود `eval` در dependency)
- ⚠️ `pnpm exec vue-tsc --noEmit` — به علت `EPERM` هنگام نوشتن در `node_modules/.vue-global-types` اجرا نشد.
- ⚠️ Cypress component/E2E — به علت `GPU process isn't usable` و `DevToolsActivePort: Access is denied` اجرا نشد.
- ⚠️ تست بصری مرورگر — مرورگر داخلی در Work settings غیرفعال است؛ نیازمند اجرای دستی یا فعال‌سازی browser automation.
- ⚠️ تست بصری Chrome — بارگذاری اولیه موفق بود و همه‌ی کارت‌ها دیده شدند؛ تعامل select به علت timeout کنترل پنجره کامل نشد و خطای 404 برای `favicon.ico` ثبت شد.
- ⚠️ تلاش مجدد تست بصری — Chrome در وضعیت minimized/unusable و Firefox با خطای دسترسی ویندوز متوقف شد؛ تست تعاملی معتبر حاصل نشد.
- ⚠️ اجرای مجدد تست بصری — Chrome به profile picker رفت و با خطای `foreground window did not report a process id` قابل تعامل نبود؛ نتیجه‌ی جدیدی ثبت نشد.
