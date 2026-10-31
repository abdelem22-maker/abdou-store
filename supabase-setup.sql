-- ============================================================
-- عبدو ستور — متجر اشتراكات رقمية
-- انسخ هذا الملف كاملاً والصقه في Supabase → SQL Editor → Run
-- تنبيه: يحذف جداول المتجر القديمة (categories/products/plans/orders)
-- إذا كنت تريد الاحتفاظ ببيانات متجر الملابس، أنشئ مشروع Supabase جديداً.
-- ============================================================

drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists plans cascade;
drop table if exists products cascade;
drop table if exists categories cascade;

create table categories (
  id serial primary key,
  slug text not null unique,
  name text not null,
  sort integer not null default 0
);

create table products (
  id serial primary key,
  category_id integer not null references categories(id),
  slug text not null unique,
  name text not null,
  brand text not null default 'generic',
  tagline text not null default '',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  badge text,
  rating real not null default 4.8,
  sales_count integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index products_category_idx on products(category_id);

create table plans (
  id serial primary key,
  product_id integer not null references products(id) on delete cascade,
  label text not null,
  months integer not null default 1,
  price_dzd integer not null,
  compare_at_dzd integer,
  sort integer not null default 0,
  is_active boolean not null default true
);
create index plans_product_idx on plans(product_id);

create table orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null,
  phone text not null,
  wilaya text not null,
  payment_method text not null default 'ccp',
  notes text not null default '',
  status text not null default 'pending',
  total_dzd integer not null,
  created_at timestamptz not null default now()
);
create index orders_code_idx on orders(code);
create index orders_phone_idx on orders(phone);

create table order_items (
  id serial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_name text not null,
  plan_label text not null,
  months integer not null default 1,
  unit_price_dzd integer not null,
  quantity integer not null default 1
);
create index order_items_order_idx on order_items(order_id);

-- ============ البيانات الجاهزة (الكتالوج) ============

insert into categories (id, slug, name, sort) values
(1, 'streaming', 'المشاهدة والأفلام', 1),
(2, 'ai', 'الذكاء الاصطناعي', 2),
(3, 'music', 'الموسيقى', 3),
(4, 'design', 'التصميم والمونتاج', 4),
(5, 'gaming', 'الألعاب', 5),
(6, 'tools', 'أدوات وإنتاجية', 6),
(7, 'learning', 'التعلّم', 7);

insert into products (id, category_id, slug, name, brand, tagline, description, features, badge, rating, sales_count, is_featured, is_active) values
(1, 1, 'netflix-4k', 'Netflix بروفايل 4K', 'netflix', 'بروفايل خاص بك بدبوس PIN على حساب 4K Ultra HD', 'اشتراك نتفليكس رسمي بجودة 4K Ultra HD. تحصل على بروفايل خاص بك محمي بدبوس PIN على حساب مشترك مضمون، يعمل على التلفاز والهاتف والحاسوب. الأكثر طلباً عندنا — تفعيل سريع وضمان استبدال طيلة مدة الاشتراك.', '["جودة 4K Ultra HD مع HDR","بروفايل خاص بك محمي بدبوس PIN","يعمل على التلفاز، الهاتف، الحاسوب","ضمان استبدال كامل طيلة الاشتراك","تفعيل خلال 5 إلى 30 دقيقة"]'::jsonb, 'الأكثر مبيعاً', 4.9, 3240, true, true),
(2, 2, 'gemini-pro', 'Google Gemini Pro', 'gemini', 'أقوى نماذج جوجل للذكاء الاصطناعي على حسابك الخاص', 'اشتراك Gemini Pro (Google AI Pro) يُفعَّل على بريدك الخاص. استفد من أقوى نماذج جوجل، توليد الصور والفيديو، البحث العميق Deep Research، ومساحة تخزين سحابية مرفقة.', '["التفعيل على بريدك الإلكتروني الخاص","أحدث نماذج Gemini المتقدمة","توليد صور وفيديو وبحث عميق","تكامل مع Gmail وDocs وDrive","ضمان كامل طيلة مدة الاشتراك"]'::jsonb, 'جديد', 4.8, 760, true, true),
(3, 4, 'canva-pro', 'Canva Pro', 'canva', 'كل قوالب وأدوات Pro على إيميلك مباشرة', 'اشتراك كانفا برو يُفعَّل مباشرة على بريدك عبر دعوة فريق رسمية. ملايين القوالب والصور المدفوعة، إزالة الخلفية بضغطة واحدة، وجدولة المنشورات — كل ميزات Pro كاملة.', '["تفعيل على بريدك مباشرة (دعوة فريق)","ملايين القوالب والعناصر المدفوعة","إزالة الخلفية وأدوات السحري Studio","يحتفظ بكل تصاميمك السابقة","تفعيل فوري خلال دقائق"]'::jsonb, 'أفضل سعر', 4.9, 5180, true, true),
(4, 2, 'chatgpt-plus', 'ChatGPT Plus', 'openai', 'أحدث نماذج GPT بأولوية كاملة وبدون انتظار', 'اشتراك ChatGPT Plus رسمي بحساب مستقل. وصول لأحدث النماذج، رسائل موسّعة، توليد صور، تحليل ملفات، و GPTs مخصصة — كل ذلك بدون قيود وقت الذروة.', '["حساب مستقل ببيانات دخول خاصة","أحدث نماذج GPT المتقدمة","توليد الصور وتحليل الملفات","ردود أسرع بدون انتظار","ضمان استبدال طيلة الاشتراك"]'::jsonb, NULL, 4.8, 1930, true, true),
(5, 3, 'youtube-premium', 'YouTube Premium', 'youtube', 'يوتيوب بدون إعلانات + يوتيوب ميوزك على حسابك', 'اشتراك يوتيوب بريميوم يُفعَّل على حسابك الخاص عبر دعوة عائلية رسمية. مشاهدة بدون إعلانات، تشغيل في الخلفية، تحميل الفيديوهات، ويوتيوب ميوزك بريميوم مرفق مجاناً.', '["تفعيل على حسابك الخاص (دعوة فاميلي)","مشاهدة بدون إعلانات نهائياً","تشغيل في الخلفية وتحميل أوفلاين","YouTube Music Premium مرفق","ضمان كامل طيلة المدة"]'::jsonb, 'الأكثر طلباً', 4.9, 4110, true, true),
(6, 3, 'spotify-premium', 'Spotify Premium', 'spotify', 'موسيقى بلا حدود وبدون إعلانات على حسابك', 'اشتراك سبوتيفاي بريميوم على حسابك الخاص مع الاحتفاظ بقوائم التشغيل. استماع بدون إعلانات، تحميل للاستماع دون اتصال، وجودة صوت عالية.', '["تفعيل على حسابك الخاص","تحتفظ بقوائم التشغيل والمفضلة","بدون إعلانات + تحميل أوفلاين","جودة صوت عالية الدقة","ضمان استبدال كامل"]'::jsonb, NULL, 4.8, 2760, true, true),
(7, 1, 'shahid-vip', 'Shahid VIP', 'shahid', 'أضخم مكتبة عربية — مسلسلات وأفلام ودوريات', 'اشتراك شاهد VIP لمتابعة أحدث المسلسلات العربية والتركية والأفلام الحصرية ودوري روشن وأكثر، بجودة عالية على كل الأجهزة.', '["كل المحتوى العربي الحصري","مسلسلات قبل عرضها على التلفاز","دوريات ومباريات مباشرة","جودة Full HD","ضمان كامل طيلة الاشتراك"]'::jsonb, NULL, 4.7, 1340, false, true),
(8, 1, 'disney-plus', 'Disney+', 'disney', 'مارفل، ستار وورز، بيكسار — كلها في مكان واحد', 'اشتراك ديزني بلس ببروفايل خاص. كل أفلام مارفل وستار وورز وبيكسار وناشيونال جيوغرافيك بجودة 4K، مثالي للعائلة.', '["بروفايل خاص محمي بدبوس PIN","محتوى مارفل وستار وورز وبيكسار","جودة 4K Ultra HD","يصلح للعائلة والأطفال","ضمان كامل طيلة الاشتراك"]'::jsonb, NULL, 4.7, 890, false, true),
(9, 1, 'prime-video', 'Prime Video', 'prime', 'أفلام ومسلسلات أمازون الأصلية بجودة عالية', 'اشتراك برايم فيديو لمشاهدة مسلسلات أمازون الأصلية وأحدث الأفلام، يعمل على كل الأجهزة بجودة عالية.', '["حصريات أمازون الأصلية","جودة Full HD و 4K","يعمل على كل الأجهزة","تفعيل سريع خلال دقائق","ضمان كامل طيلة الاشتراك"]'::jsonb, NULL, 4.6, 640, false, true),
(10, 4, 'capcut-pro', 'CapCut Pro', 'capcut', 'مونتاج احترافي — كل القوالب والتأثيرات المدفوعة', 'اشتراك كاب كات برو لصنّاع المحتوى: قوالب جاهزة، تأثيرات وانتقالات مدفوعة، إزالة خلفية الفيديو، وتصدير بدون علامة مائية وبأعلى جودة.', '["كل التأثيرات والقوالب المدفوعة","تصدير بدون علامة مائية","إزالة خلفية الفيديو بالذكاء الاصطناعي","يعمل على الهاتف والحاسوب","ضمان كامل طيلة الاشتراك"]'::jsonb, 'لصنّاع المحتوى', 4.8, 1520, true, true),
(11, 2, 'perplexity-pro', 'Perplexity Pro', 'perplexity', 'محرك البحث الذكي بأقوى النماذج في اشتراك واحد', 'اشتراك بربلكسيتي برو يمنحك بحثاً عميقاً بالمصادر، والوصول إلى عدة نماذج ذكاء اصطناعي رائدة (GPT, Claude, Gemini...) في مكان واحد.', '["بحث عميق Pro Search غير محدود","الوصول لعدة نماذج رائدة","رفع وتحليل الملفات","إجابات موثقة بالمصادر","ضمان كامل طيلة الاشتراك"]'::jsonb, NULL, 4.7, 410, false, true),
(12, 6, 'microsoft-365', 'Microsoft 365', 'microsoft', 'Word وExcel وPowerPoint مع 1TB OneDrive', 'اشتراك مايكروسوفت 365 رسمي: حزمة أوفيس كاملة محدّثة دائماً مع مساحة 1TB على OneDrive، يعمل على الحاسوب والهاتف.', '["Word, Excel, PowerPoint محدّثة","مساحة OneDrive سعة 1TB","تثبيت على عدة أجهزة","مفاتيح رسمية مرخصة","ضمان كامل طيلة الاشتراك"]'::jsonb, NULL, 4.8, 720, false, true),
(13, 5, 'ps-plus-essential', 'PlayStation Plus Essential', 'playstation', 'اللعب أونلاين + ألعاب مجانية كل شهر', 'اشتراك بلايستيشن بلس إيسنشال للعب الجماعي أونلاين، ألعاب مجانية شهرية، وتخزين سحابي لتقدّمك في الألعاب.', '["لعب أونلاين جماعي","ألعاب مجانية كل شهر","تخزين سحابي للحفظ","تخفيضات حصرية","تفعيل خلال دقائق"]'::jsonb, NULL, 4.7, 560, false, true),
(14, 1, 'iptv-gold', 'اشتراك IPTV ذهبي', 'iptv', 'آلاف القنوات العالمية والرياضية بجودة 4K', 'اشتراك IPTV احترافي مستقر: أكثر من 10,000 قناة عالمية ورياضية وعربية، مكتبة أفلام ومسلسلات محدّثة، يعمل على Smart TV والهاتف وجميع الأجهزة.', '["+10,000 قناة عالمية ورياضية","مكتبة أفلام ومسلسلات محدّثة","جودة 4K / FHD واستقرار عالٍ","يدعم Smart TV والهاتف","دعم فني وضمان طيلة الاشتراك"]'::jsonb, 'سيرفر مستقر', 4.6, 980, false, true),
(15, 7, 'duolingo-super', 'Duolingo Super', 'duolingo', 'تعلّم اللغات بدون إعلانات وبدون حدود', 'اشتراك دوولينغو سوبر على حسابك: تعلّم اللغات بدون إعلانات، قلوب غير محدودة، ومراجعة أخطائك — مثالي لمسار تعلّم جاد.', '["بدون إعلانات نهائياً","قلوب غير محدودة","مراجعة ذكية للأخطاء","تفعيل على حسابك الخاص","ضمان كامل طيلة الاشتراك"]'::jsonb, NULL, 4.6, 380, false, true);

insert into plans (id, product_id, label, months, price_dzd, compare_at_dzd, sort, is_active) values
(1, 1, 'شهر واحد', 1, 1250, 1800, 0, true),
(2, 1, '3 أشهر', 3, 3450, NULL, 1, true),
(3, 1, '6 أشهر', 6, 5900, NULL, 2, true),
(4, 1, '12 شهراً', 12, 10900, NULL, 3, true),
(5, 2, 'شهر واحد', 1, 1650, NULL, 0, true),
(6, 2, '6 أشهر', 6, 7900, NULL, 1, true),
(7, 2, '12 شهراً', 12, 13500, NULL, 2, true),
(8, 3, 'شهر واحد', 1, 650, 1000, 0, true),
(9, 3, '6 أشهر', 6, 1900, NULL, 1, true),
(10, 3, '12 شهراً', 12, 2900, NULL, 2, true),
(11, 4, 'شهر واحد', 1, 2500, 3200, 0, true),
(12, 4, '3 أشهر', 3, 6900, NULL, 1, true),
(13, 5, 'شهر واحد', 1, 1100, NULL, 0, true),
(14, 5, '3 أشهر', 3, 2900, NULL, 1, true),
(15, 5, '12 شهراً', 12, 9900, NULL, 2, true),
(16, 6, 'شهر واحد', 1, 900, NULL, 0, true),
(17, 6, '3 أشهر', 3, 2400, NULL, 1, true),
(18, 6, '12 شهراً', 12, 8400, NULL, 2, true),
(19, 7, 'شهر واحد', 1, 1200, NULL, 0, true),
(20, 7, '12 شهراً', 12, 9900, NULL, 1, true),
(21, 8, 'شهر واحد', 1, 1400, NULL, 0, true),
(22, 8, '12 شهراً', 12, 11900, NULL, 1, true),
(23, 9, 'شهر واحد', 1, 800, NULL, 0, true),
(24, 9, '12 شهراً', 12, 6500, NULL, 1, true),
(25, 10, 'شهر واحد', 1, 950, NULL, 0, true),
(26, 10, '12 شهراً', 12, 8400, NULL, 1, true),
(27, 11, 'شهر واحد', 1, 2400, NULL, 0, true),
(28, 11, '12 شهراً', 12, 9900, NULL, 1, true),
(29, 12, '3 أشهر', 3, 1900, NULL, 0, true),
(30, 12, '12 شهراً', 12, 6200, NULL, 1, true),
(31, 13, '3 أشهر', 3, 4900, NULL, 0, true),
(32, 13, '12 شهراً', 12, 12900, NULL, 1, true),
(33, 14, '3 أشهر', 3, 2600, NULL, 0, true),
(34, 14, '6 أشهر', 6, 4600, NULL, 1, true),
(35, 14, '12 شهراً', 12, 8100, NULL, 2, true),
(36, 15, '6 أشهر', 6, 2400, NULL, 0, true),
(37, 15, '12 شهراً', 12, 4200, NULL, 1, true);

select setval(pg_get_serial_sequence('categories','id'), (select max(id) from categories));
select setval(pg_get_serial_sequence('products','id'), (select max(id) from products));
select setval(pg_get_serial_sequence('plans','id'), (select max(id) from plans));
