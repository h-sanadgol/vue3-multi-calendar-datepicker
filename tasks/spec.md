# Specification: vue3-multi-calendar-datepicker

## Objective

تبدیل datepicker فعلی به یک datepicker عمومی و ساده برای Vue 3 و Nuxt 3 با پشتیبانی از تقویم‌های شمسی، میلادی، قمری/هجری، عبری، بودایی تایلندی، چینی و امکان افزودن تقویم‌های تخصصی آینده.

کاربر باید بتواند تقویم نمایشی را مستقل از زبان رابط انتخاب کند و برای تاریخ‌های تک‌مقداری، بازه‌ای و datetime از همان رفتارهای فعلی استفاده کند.

## Agreed Decisions

- نام package: `@h-sanadgol/vue3-multi-calendar-datepicker`
- روش قمری قابل تنظیم است و مقدار پیش‌فرض `ummalqura` خواهد بود.
- locale فقط زبان، نام ماه‌ها، نام روزها و جهت نمایش را تعیین می‌کند.
- calendar نوع محاسبه و نمایش تاریخ را تعیین می‌کند.
- برای حفظ سازگاری، `modelValue` به‌صورت پیش‌فرض در تقویم فعال serialize می‌شود؛ انتخاب تقویم خروجی با prop صریح `modelCalendar` قابل کنترل است.
- در فاز اول، مناسبت‌ها، نام حیوان سال چینی و محاسبه رؤیت محلی ماه خارج از محدوده هستند؛ زیرساخت باید امکان افزودن آن‌ها را داشته باشد.

## Supported Calendars

- `jalali`
- `gregorian`
- `hijri` با provider قابل تنظیم و provider پیش‌فرض `ummalqura`
- `hebrew`
- `buddhist` به‌عنوان نمایش بودایی تایلندی بر پایه میلادی
- `chinese` به‌عنوان تقویم قمری-شمسی با ماه کبیسه
- adapter سفارشی برای تقویم‌های تخصصی آینده

## Commands

- Build: `pnpm build`
- Component tests: `pnpm test`
- Lint: `pnpm lint`
- Development: `pnpm dev`

## Project Structure

```text
src/
  calendars/       adapterها و قرارداد تقویم‌ها
  locales/         زبان‌ها و تنظیمات نمایشی
  components/      کامپوننت Vue و اجزای رابط
  nuxt/            ماژول و composable مربوط به Nuxt
test/
  unit/            تست تبدیل و منطق تقویم
  e2e/             تست تعامل datepicker
tasks/             مشخصات و برنامه توسعه
```

## API Direction

```vue
<DatePicker
  v-model="value"
  calendar="hijri"
  hijri-provider="ummalqura"
  locale="fa"
  type="date"
  mode="single"
/>
```

نام دقیق propها در مرحله طراحی adapter نهایی می‌شود، اما `calendar` نباید از `locale` استخراج شود.

## Code Style

- TypeScript strict و typeهای مشخص برای calendar و provider
- adapterها بدون وابستگی به Vue و قابل تست به‌صورت unit
- منطق نمایش در کامپوننت و منطق تبدیل در adapter باقی بماند
- از تبدیل implicit و fallback بی‌صدا برای تاریخ نامعتبر اجتناب شود

## Testing Strategy

- Unit test برای هر adapter: parse/format، تبدیل رفت‌وبرگشتی، روزهای مرزی، سال کبیسه و تعداد روزهای ماه
- Integration test برای اتصال adapter به `from`، `to`، `disable` و `modelValue`
- E2E برای single، range، datetime، keyboard و تغییر calendar
- تست‌های موجود شمسی و میلادی باید بدون کاهش پوشش حفظ شوند

## Boundaries

- Always: تست قبل از تغییر رفتار، اعتبارسنجی ورودی، مستندسازی قراردادهای عمومی، حفظ سازگاری Nuxt
- Ask first: افزودن dependency خارجی جدید، تغییر قرارداد پیش‌فرض `modelValue`، انتشار نسخه major، تغییر CI یا انتشار npm
- Never: ویرایش `node_modules`، حذف تست برای سبزکردن suite، ذخیره token یا secret در repository

## Success Criteria

- یک API مستقل برای `calendar` و `locale` وجود داشته باشد.
- میلادی بدون فرض‌های شمسی در parse، range و disable کار کند.
- قمری با provider پیش‌فرض Umm al-Qura و provider قابل تعویض کار کند.
- adapterهای عبری، بودایی و چینی از همان قرارداد مشترک استفاده کنند.
- build، lint و تست‌های موجود موفق باشند.
- README، migration guide و مثال‌های هر calendar به‌روز شوند.

## Open Questions

- آیا providerهای قمری اضافی مانند `tabular` و `observational` در نسخه اول منتشر شوند یا فقط API آن‌ها آماده باشد؟
- خروجی چینی در این نسخه فقط تاریخ تقویمی است؛ مناسبت‌ها و نام حیوان سال خارج از محدوده‌ی این نسخه هستند.
