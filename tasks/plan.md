# Implementation Plan: اصلاح امنیتی و آماده‌سازی انتشار Datepicker

## Release-hardening objective

گزارش فنی نشان می‌دهد آسیب‌پذیری بحرانی اثبات نشده، اما صحت تقویم‌های Chinese/Hebrew، فرض‌های timezone و PersianDate در navigation، ورودی‌های `mergeObject`/RegExp، ایزوله‌سازی DOM، lifecycle listenerها و زنجیره‌ی dependency هنوز برای انتشار جدی کافی نیستند. مسیر اجرایی باید ابتدا قرارداد خروجی و تست‌های بازتولید را تثبیت کند، سپس اصلاحات P0، سخت‌سازی P1، و در پایان refactor و دروازه‌ی انتشار را انجام دهد.

## Immediate implementation order

1. خط مبنا و threat model: audit، outdated، lint، typecheck، build و ثبت blockerهای محیطی.
2. تثبیت قرارداد `modelValue` و `modelCalendar`.
3. اصلاح Chinese leap month، Hebrew variable months، UTC weekday و keyboard navigation.
4. اصلاح `mergeObject`، RegExp disable، disable/range adapter-aware، selectorهای scoped و cleanup lifecycle.
5. مهاجرت Rollup pluginها و یکسان‌سازی package manager/lockfile.
6. benchmark تبدیل تاریخ، refactor تدریجی، تست E2E/browser و release gate.

جزئیات taskهای قابل اجرا، معیار پذیرش و وابستگی‌ها در [tasks/todo.md](todo.md) با شناسه‌های `SEC-*`، `CAL-*`، `DEP-*`، `UI-*`، `PERF-*`، `QA-*` و `REL-*` ثبت شده‌اند.

## Definition of done for this remediation

- هیچ P0 باز نمانده و هر اصلاح تقویمی تست regression مستقل دارد.
- ورودی‌های کنترل‌شده‌ی کاربر نمی‌توانند prototype objectهای داخلی را تغییر دهند و RegExpهای stateful رفتار ناپایدار ندارند.
- چند Datepicker هم‌زمان scoped است و listener/timer پس از unmount باقی نمی‌ماند.
- lockfile، pluginهای build، dependencyهای runtime/dev و advisoryهای audit تصمیم روشن و قابل بازبینی دارند.
- lint، typecheck، build library/Nuxt و تست‌های قابل اجرای CI در release candidate ثبت شده‌اند.

---

# برنامه‌ی توسعه‌ی محصول: عمومی‌سازی Datepicker و افزودن تقویم‌ها

## Overview

این پروژه از یک datepicker با محوریت تقویم شمسی به یک datepicker عمومی تبدیل می‌شود که بتواند تقویم‌های شمسی، میلادی، قمری/هجری، عبری، بودایی تایلندی، چینی و تقویم‌های تخصصی‌تر را نمایش دهد، parse کند، تبدیل کند، مقایسه کند و برای انتخاب تک‌تاریخ و بازه استفاده کند.

این مرحله روی دمو و رفع اشکالات مشاهده‌شده در QA تمرکز دارد: سه‌زبانه‌کردن صفحه، نمونه‌های کامل date/time/datetime/range، نمایش کد قابل کپی برای هر نمونه، اصلاح adapterهای تقویم‌ها و تضمین لایه‌بندی popup.

## Architecture Decisions

- locale فقط مسئول زبان، نام ماه‌ها، نام روزها و جهت متن باشد؛ نوع تقویم از locale مستقل شود.
- یک مدل داخلی استاندارد برای لحظه/تاریخ استفاده شود و هر تقویم فقط در مرز ورودی، خروجی و نمایش تبدیل شود.
- برای هر تقویم یک `CalendarAdapter` با قرارداد مشترک تعریف شود: parse، format، add/subtract، start/end of unit، days in month، compare و validation.
- مدل پیش‌فرض خروجی برای حفظ سازگاری فعلی، تقویم فعال است؛ برای خروجی در تقویم دیگر از `modelCalendar` استفاده می‌شود.
- تقویم قمری باید از ابتدا با الگوریتم مشخص پیاده‌سازی شود: محاسباتی یا ام‌القری/رؤیتی. این انتخاب در مستندات و تست‌ها ثبت شود.
- تقویم‌های تخصصی که فقط offset سال دارند، مانند بودایی تایلندی، از تقویم پایه جدا و به‌صورت adapter/era تعریف شوند.
- تقویم چینی به‌عنوان تقویم قمری-شمسی با ماه‌های کبیسه مدل شود؛ این بخش باید مستقل از تقویم قمری ساده باشد.

## Task List

### Phase 0: Demo and QA fixes

- [ ] Task 0.1: افزودن i18n داخلی فارسی/انگلیسی/عربی برای صفحه‌ی demo.
- [ ] Task 0.2: ساخت playground کامل برای date، time، datetime و range با کنترل propهای اصلی.
- [ ] Task 0.3: افزودن modal کد قابل کپی برای هر نمونه و نمونه‌ی provider قمری.
- [ ] Task 0.4: اصلاح نام/محاسبه‌ی ماه‌های تقویم‌های عبری، بودایی و چینی و تست UI آن‌ها.
- [ ] Task 0.5: اصلاح z-index و stacking context popup و تست بصری/DOM آن.

### Checkpoint: Demo QA

- [ ] هر سه زبان متن‌ها، جهت صفحه و نام تقویم‌ها را تغییر دهند.
- [ ] نمونه‌های date، time، datetime و range قابل اجرا باشند.
- [ ] popup روی کارت‌ها و modal کد روی همه‌ی عناصر دیده شود.
- [ ] هر تقویم ماه/سال/روز و خروجی قابل مشاهده و قابل انتخاب داشته باشد.

### Phase 1: قرارداد و زیرساخت

- [ ] Task 1: تعریف API تقویم و قرارداد `CalendarAdapter`.
- [ ] Task 2: انتقال منطق فعلی شمسی/میلادی به adapterهای مستقل بدون تغییر رفتار موجود.
- [ ] Task 3: جداکردن locale از calendar و اصلاح typeهای عمومی.
- [ ] Task 4: تعیین قرارداد `modelValue`، `inputFormat`، `displayFormat`، `from`، `to` و `disable` برای هر تقویم.

### Checkpoint: Foundation

- [ ] تست‌های فعلی شمسی و میلادی بدون تغییر معنی پاس شوند.
- [ ] build کتابخانه و build Nuxt موفق باشند.
- [ ] تست تبدیل رفت‌وبرگشتی شمسی/میلادی برای تاریخ‌های مرزی اضافه شود.

### Phase 2: تقویم‌های پایه

- [ ] Task 5: اصلاح و تکمیل پشتیبانی مستقل میلادی؛ از جمله محدوده، disable، ورودی کاربر و سال‌های کبیسه.
- [ ] Task 6: افزودن adapter قمری/هجری با قرارداد و مدل کبیسه مشخص.
- [ ] Task 7: اتصال قمری به UI، انتخاب ماه/سال، بازه، shortcut، disable و فرمت‌دهی.
- [ ] Task 8: اضافه‌کردن تست‌های کامل قمری و تست اختلاف احتمالی با منابع معتبر.

### Checkpoint: Core Calendars

- [ ] شمسی، میلادی و قمری بتوانند تاریخ را parse، display، select، compare و format کنند.
- [ ] تغییر تقویم در زمان باز بودن picker بدون خراب‌شدن مقدار داخلی انجام شود.
- [ ] محدوده و disable در همه تقویم‌ها با همان تقویم ورودی کار کنند.

### Phase 3: تقویم‌های منطقه‌ای و تخصصی

- [ ] Task 9: افزودن تقویم عبری، شامل تبدیل، ماه‌های متغیر و سال کبیسه.
- [ ] Task 10: افزودن تقویم بودایی تایلندی به‌صورت era/offset روی میلادی.
- [ ] Task 11: افزودن تقویم چینی قمری-شمسی، شامل ماه کبیسه و مناسبت‌های لازم.
- [ ] Task 12: تعریف extension API برای تقویم‌های تخصصی آینده بدون تغییر هسته datepicker.

### Checkpoint: Extended Calendars

- [ ] هر تقویم adapter مستقل و تست‌های مرزی خودش را داشته باشد.
- [ ] locale سفارشی دیگر نتواند با تغییر صرفاً نام ماه‌ها، وانمود کند که تقویم جدید اضافه شده است.
- [ ] bundle size و زمان render برای تقویم‌های اختیاری بررسی شود.

### Phase 4: تجربه کاربری و انتشار

- [ ] Task 13: بازطراحی نام‌گذاری props و مستندات با تمرکز بر `calendar` و `locale`.
- [ ] Task 14: افزودن نمونه برای هر تقویم و مستندکردن فرمت‌ها و رفتار model.
- [ ] Task 15: افزودن تست‌های E2E برای single، range، datetime، keyboard، disable و تغییر تقویم.
- [ ] Task 16: بررسی سازگاری نسخه‌ای، migration guide و انتشار نسخه major در صورت تغییر قرارداد model.

### Checkpoint: Complete

- [ ] همه adapterها unit test داشته باشند.
- [ ] تست‌های E2E و buildها موفق باشند.
- [ ] قرارداد قمری، چینی و خروجی model به‌صورت صریح در README ثبت شده باشد.

## Risks and Mitigations

| Risk                             | Impact | Mitigation                                                        |
| -------------------------------- | ------ | ----------------------------------------------------------------- |
| اختلاف محاسبات قمری با رؤیت محلی | High   | انتخاب الگوریتم رسمی و امکان تزریق adapter/adjustment             |
| پیچیدگی تقویم چینی               | High   | پیاده‌سازی در فاز جدا و عدم مخلوط‌کردن با هجری ساده               |
| شکستن سازگاری model فعلی         | High   | حفظ حالت پیش‌فرض فعلی و افزودن `modelCalendar` با migration guide |
| فرض‌های ثابت شمسی در کد فعلی     | High   | حذف parse و compareهای hard-coded و عبور همه مسیرها از adapter    |
| افزایش حجم bundle                | Medium | adapterهای اختیاری و بررسی tree-shaking                           |
| تفاوت timezone و تاریخ محلی      | Medium | نگهداری تاریخ داخلی با timezone صریح و تست مرز نیمه‌شب            |

## Open Questions

- قرارداد خروجی `modelValue` نهایی شد: پیش‌فرض تقویم فعال است و `modelCalendar` تقویم خروجی را تعیین می‌کند.
- برای قمری، الگوریتم محاسباتی کافی است یا باید ام‌القری/قابل تنظیم باشد؟
- آیا تقویم چینی فقط برای انتخاب تاریخ لازم است یا مناسبت‌ها و نام سال حیوانی هم باید پشتیبانی شود؟

---

# برنامه‌ی قابلیت‌های ورودی، mask و استقلال adapterها

## تصمیم‌های محصول

- ورود دستی به‌صورت پیش‌فرض فعال است.
- تاریخ معتبر باید picker و مقدار انتخاب‌شده را همزمان به‌روزرسانی کند.
- mask برای هر تقویم preset دارد و کاربر می‌تواند آن را override کند.
- فیلد سفارشی از طریق scoped slot ارائه می‌شود.
- `format` فرمت `v-model`، `inputFormat` فرمت نمایش/parse input و `displayFormat` فرمت متن نمایشی picker است.
- adapterهای غیر PersianDate باید منطق مستقل داشته باشند؛ timestamp فقط مرز انتقال است.

## معماری پیشنهادی

1. یک لایه‌ی `InputFormatContract` برای تفکیک model، input و footer format.
2. یک parser/validator مستقل از Vue که ورودی ناقص، ورودی معتبر و ورودی نامعتبر را به‌صورت سه state جدا برگرداند.
3. یک `InputMaskConfig` typed با shorthand رشته‌ای و presetهای تقویمی.
4. یک scoped slot به نام `input` که همان canonical value و commandهای داخلی را دریافت کند.
5. یک `CalendarAdapter` کامل که برای تقویم‌های غیرشمسی مالک parts، validation، arithmetic و formatting باشد.
6. مسیر سازگاری فعلی Jalali/PersianDate تا پایان migration حفظ شود.

## ترتیب اجرا

### Phase A — قرارداد و parser

- INPUT-01: نهایی‌سازی semantics فرمت‌ها و typeهای عمومی.
- INPUT-02: parser/validator مستقل با پشتیبانی از ورودی ناقص.
- INPUT-03: mask و presetهای هر تقویم.

### Checkpoint A

- parser و mask بدون Vue unit test داشته باشند.
- روز نامعتبر، رقم locale و ورودی ناقص رفتار مشخص داشته باشند.

### Phase B — اتصال به DatePicker

- INPUT-04: sync پیش‌فرض ورودی معتبر با `selectedDates` و `onDisplay`.
- INPUT-05: scoped `#input` slot و commandهای open/clear/commit.
- INPUT-06: regression برای single/range/datetime/dual input و keyboard.

### Checkpoint B

- ورود دستی در Jalali و Gregorian کامل و پایدار باشد.
- تغییر input، picker و `v-model` را همزمان و بدون loop به‌روزرسانی کند.

### Phase C — استقلال adapterها

- CAL-06.1: تعریف مدل parts/date مستقل و مرز timestamp.
- CAL-06.2: انتقال parse/format/validation برای Gregorian و یک adapter مرجع.
- CAL-06.3: انتقال arithmetic و range/disable به قرارداد adapter.
- CAL-06.4: تکمیل migration برای Hijri، Hebrew، Buddhist و Chinese.
- CAL-07: حذف tokenهای `PersianDate` و رفع علامت سؤال.

### Checkpoint C

- adapterهای غیرشمسی بدون وابستگی منطقی به `PersianDate` کار کنند.
- model، input، display، range، disable و leap month برای همه‌ی adapterها regression داشته باشند.

### Phase D — QA و انتشار داخلی

- QA-02: unit/component/E2E و manual responsive QA.
- بررسی bundle size و backward compatibility.
- ثبت migration guide و release notes؛ انتشار فقط پس از تأیید صریح کاربر.

## ریسک‌ها و راهکارها

| ریسک                                      | اثر   | راهکار                                                          |
| ----------------------------------------- | ----- | --------------------------------------------------------------- |
| تغییر همزمان input و model باعث loop شود  | بالا  | source-of-truth مشخص، guard بر اساس مقدار normalized و تست loop |
| mask ورودی ناقص را زود invalid کند        | متوسط | state سه‌گانه‌ی incomplete/valid/invalid و commit نهایی         |
| استقلال adapterها باعث شکستن API فعلی شود | بالا  | migration مرحله‌ای و حفظ facade سازگار برای Jalali              |
| اختلاف فرمت تقویم‌ها و نام ماه‌ها         | بالا  | formatter متعلق به adapter و تست snapshot/round-trip            |
| پیچیدگی scoped slot در range/dual input   | متوسط | قرارداد slot واحد با index/inputName و تست هر دو مسیر           |

## معیار پایان

- ورود دستی معتبر به‌صورت پیش‌فرض picker و `v-model` را همزمان به‌روزرسانی کند.
- mask و validation برای تمام تقویم‌های فعال preset و override داشته باشند.
- فیلد سفارشی از طریق scoped slot بدون از دست‌دادن keyboard/clear/validation کار کند.
- هیچ علامت `?` یا token مخصوص PersianDate در خروجی adapterهای دیگر باقی نماند.
- تست کامل فعلی و تست‌های جدید سبز باشند.
