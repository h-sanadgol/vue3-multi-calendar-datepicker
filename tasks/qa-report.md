# گزارش بازبینی و QA

## دامنه‌ی بررسی

- ساختار package و exportها
- adapterهای Gregorian، Hijri، Hebrew، Buddhist و Chinese
- منطق locale، week start و weekend
- مسیرهای parse/format، `from`، `to` و `disable`
- دمو، gallery، code modal و Advanced Props
- lint، build، typecheck و Cypress

## یافته‌های قطعی

1. قرارداد خروجی مدل با README/specification هم‌خوان نیست و باید قبل از انتشار تثبیت شود.
2. در `DatePicker.vue` هنوز مسیرهای `disable` برای regex و آرایه به Jalali hard-code هستند.
3. exportهای Nuxt در ابتدا به فایل‌های حذف‌شده اشاره می‌کردند؛ با اجرای build Nuxt و library خروجی‌ها بازسازی و importهای ESM/CJS تأیید شد.
4. Chinese adapter فعلی مدل صریحی برای ماه کبیسه ندارد و فقط به شماره‌ی ماه تکیه می‌کند.
5. فایل‌های `DatePicker.vue` و `App.vue` بیش از حد بزرگ/فشرده شده‌اند و نگهداری و QA آن‌ها پرریسک است.
6. تست‌های اختصاصی برای دمو، زبان چندباره، modal کد، passive بودن کارت‌ها و popup stacking وجود ندارد.

## وضعیت تست

| بررسی             | نتیجه                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| ESLint            | موفق                                                                         |
| Library build     | موفق با warning dependency                                                   |
| Vue typecheck     | ناموفق؛ خطاهای ناسازگاری dependencyهای Nuxt/Vue و خطاهای type قدیمی در پروژه |
| Cypress           | مسدود به علت GPU و DevToolsActivePort ویندوز                                 |
| Browser visual QA | مسدود؛ browser automation در این نشست غیرفعال بود                            |

## تست بصری Chrome — ۲ نوامبر ۲۰۲۶

### موفق

- صفحه‌ی دمو در `http://127.0.0.1:5173/` با عنوان `Multi Calendar Datepicker Demo` بارگذاری شد.
- Hero، زبان‌های English/Farsi/Arabic و بخش Interactive Playground دیده شدند.
- هر شش کارت Jalali، Gregorian، Hijri، Hebrew، Thai Buddhist و Chinese در صفحه نمایش داده شدند.
- Advanced Props داخل کنترل playground دیده شد.
- نمونه‌های Time، Range و Date & time در پایین صفحه وجود داشتند.
- دکمه‌ی `View code · HTML` برای preview اصلی و کارت‌ها نمایش داده شد.
- در Console خطای runtime مربوط به Vue یا کامپوننت دیده نشد.

### خطاها و محدودیت‌ها

- درخواست `favicon.ico` با وضعیت 404 ثبت شد؛ باید favicon اضافه شود یا درخواست حذف شود.
- هنگام تعامل با select تقویم، لایه‌ی کنترل پنجره‌ی Chrome timeout شد و امکان تأیید انتخاب Hebrew/Chinese و تغییر زبان چندباره در همان نشست فراهم نشد.
- اجرای مجدد تست در نشست بعدی نیز به نتیجه‌ی تعاملی نرسید: پنجره‌ی Chrome قبلی minimized/unusable بود، پنجره‌ی جدید روی profile picker متوقف شد و اجرای Firefox با `GetCursorPos: Access is denied` شکست خورد.
- بنابراین MC-04 و MC-05 هنوز قابل حذف نیستند و نیاز به یک اجرای تعاملی پایدار دارند.

## اجرای مجدد تست بصری

- سرور دمو فعال بود و پنجره‌ی قبلی Chrome در حالت minimized قرار داشت.
- پنجره‌ی تازه‌ی Chrome به profile picker رفت؛ کنترل UI نتوانست profile را فعال کند و با خطای `foreground window did not report a process id` متوقف شد.
- در این اجرای مجدد، هیچ نتیجه‌ی جدیدی برای رفتار تقویم‌ها ثبت نشد و MC-04/MC-05 همچنان باز هستند.

## نتیجه

پروژه از نظر lint، build کتابخانه و build Nuxt در وضعیت قابل ادامه است، اما برای اعلام آمادگی انتشار هنوز MC-01، MC-02 و MC-04 تا MC-05 باید انجام و با تست معتبر تأیید شوند. مهم‌ترین ریسک فعلی، قرارداد نامشخص `modelValue`، باقی‌ماندن منطق hard-coded شمسی در `disable` و ناسازگاری typeهای dependencyهای Nuxt است.
