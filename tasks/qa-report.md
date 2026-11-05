# گزارش QA خط مبنای انتشار

تاریخ اجرا: ۱۴۰۵/۰۸/۱۳ — ۴ نوامبر ۲۰۲۶

## نتایج قابل تکرار

| بررسی | نتیجه |
| --- | --- |
| `pnpm lint` | موفق |
| `pnpm exec vue-tsc --noEmit --skipLibCheck` | موفق |
| `pnpm build:lib` | موفق؛ فقط warning مربوط به `eval` داخل `@alireza-ab/persian-date` باقی است |
| `pnpm build` | موفق؛ خروجی Nuxt و ESM/UMD ساخته شد |
| `pnpm audit` | ۰ critical، ۶۲ high، ۳۱ moderate، ۸ low؛ هیچ finding production-facing نیست و موارد باقی‌مانده در زنجیره dev/test هستند |
| Cypress component test | `calendar-adapters.cy.ts`: موفق؛ ۱۳ تست پاس، ۰ شکست |
| Full Cypress component suite (آخرین اجرا) | موفق؛ ۱۳ spec، ۲۲۵ تست، ۲۲۵ موفق، ۰ شکست |
| Manual local demo | موفق؛ Jalali/Gregorian/Chinese، حالت datetime/range و تغییر خروجی `v-model` بررسی شد |
| Package dry-run | موفق؛ package `@h-sanadgol/vue3-multi-calendar-datepicker@2.0.2` با `pnpm pack --dry-run` بررسی شد؛ publish انجام نشد |

## مرز اعتماد

این پکیج client-side است و backend، authentication یا ذخیره‌سازی حساس ندارد. ورودی‌های اصلی شامل props، متن تاریخ، RegExp مربوط به `disable`، attributeهای DOM و adapterهای تقویمی هستند. hardening فعلی روی prototype pollution، state مربوط به RegExp، ایزوله‌سازی DOM و cleanup منابع متمرکز است.

## موارد باز

- اجرای کامل Cypress suite در PowerShell کاربر انجام شد و با ۲۲۵ تست موفق به پایان رسید.
- browser viewport QA تعاملی مستقل هنوز در این نشست اجرا نشده است؛ با این حال suite component کامل، build و typecheck سبز هستند.
- بررسی بسته‌ی انتشار با `pnpm pack --dry-run --json` موفق شد؛ فقط فایل‌های build، source، README، LICENSE و manifest در بسته قرار می‌گیرند.
- advisoryهای dev/test باید در DEP-03 بر اساس مسیر dependency، نسخه‌ی اصلاح‌شده و امکان exploit در release triage شوند.
- قرارداد کامل `modelValue` و پوشش runtime همه‌ی adapterها هنوز نیازمند تکمیل تست است.
- regressionهای range و datetime برای Hijri نیز در suite هستند؛ اجرای focused آن‌ها در تست adapter با موفقیت انجام شد.
- وضعیت blocker: پس از اصلاح دسترسی و Restart، Cypress با Electron 136 اجرا شد؛ خطای `DevToolsActivePort/GPU` دیگر مانع Cypress نیست.
- اجرای مستقیم Chrome با `about:blank` تا زمان توقف دستی باز می‌ماند که رفتار عادی headless Chrome است.
