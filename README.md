# عبدو ستور — متجر اشتراكات رقمية للجزائر

متجر إلكتروني جزائري لبيع الاشتراكات الرقمية (Netflix، Gemini Pro، Canva Pro، ChatGPT Plus...)
بالدينار الجزائري، مع الدفع عبر CCP / BaridiMob / فليكسي والتوصيل عبر واتساب.

**التقنيات:** Next.js 16 (App Router) · Drizzle ORM + PostgreSQL (Supabase) · Tailwind CSS v4 · Framer Motion · عربي RTL بالكامل

## تشغيل محلي

```bash
npm install
cp .env.example .env   # املأ DATABASE_URL ومتغيرات المتجر
npx drizzle-kit push   # إنشاء الجداول (أو الصق supabase-setup.sql في Supabase)
npx tsx src/db/seed.ts # زرع الكتالوج (15 اشتراكاً و37 خطة)
npm run dev
```

## النشر

اقرأ [DEPLOY.md](./DEPLOY.md) — خطوات Supabase + Vercel بالعربية.

## الصفحات

| المسار | الوظيفة |
|---|---|
| `/` | الرئيسية |
| `/shop` | المتجر مع فلترة بالتصنيفات |
| `/product/[slug]` | صفحة المنتج + استمارة الطلب |
| `/success/[code]` | تأكيد الطلب + تعليمات الدفع (CCP/RIP) |
| `/track` | تتبّع الطلب برقم الطلب والهاتف |
| `/admin?key=...` | لوحة التحكم (محمية بـ ADMIN_KEY) |
