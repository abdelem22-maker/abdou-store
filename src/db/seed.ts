import "dotenv/config";
import { db } from "./index";
import { categories, products, plans } from "./schema";
import { sql } from "drizzle-orm";

type PlanSeed = { label: string; months: number; priceDzd: number; compareAtDzd?: number };
type ProductSeed = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  badge?: string;
  rating?: number;
  salesCount?: number;
  isFeatured?: boolean;
  plans: PlanSeed[];
};

const CATS = [
  { slug: "streaming", name: "المشاهدة والأفلام", sort: 1 },
  { slug: "ai", name: "الذكاء الاصطناعي", sort: 2 },
  { slug: "music", name: "الموسيقى", sort: 3 },
  { slug: "design", name: "التصميم والمونتاج", sort: 4 },
  { slug: "gaming", name: "الألعاب", sort: 5 },
  { slug: "tools", name: "أدوات وإنتاجية", sort: 6 },
  { slug: "learning", name: "التعلّم", sort: 7 },
];

const PRODUCTS: ProductSeed[] = [
  {
    slug: "netflix-4k",
    name: "Netflix بروفايل 4K",
    brand: "netflix",
    category: "streaming",
    tagline: "بروفايل خاص بك بدبوس PIN على حساب 4K Ultra HD",
    description:
      "اشتراك نتفليكس رسمي بجودة 4K Ultra HD. تحصل على بروفايل خاص بك محمي بدبوس PIN على حساب مشترك مضمون، يعمل على التلفاز والهاتف والحاسوب. الأكثر طلباً عندنا — تفعيل سريع وضمان استبدال طيلة مدة الاشتراك.",
    features: [
      "جودة 4K Ultra HD مع HDR",
      "بروفايل خاص بك محمي بدبوس PIN",
      "يعمل على التلفاز، الهاتف، الحاسوب",
      "ضمان استبدال كامل طيلة الاشتراك",
      "تفعيل خلال 5 إلى 30 دقيقة",
    ],
    badge: "الأكثر مبيعاً",
    rating: 4.9,
    salesCount: 3240,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 1250, compareAtDzd: 1800 },
      { label: "3 أشهر", months: 3, priceDzd: 3450 },
      { label: "6 أشهر", months: 6, priceDzd: 5900 },
      { label: "12 شهراً", months: 12, priceDzd: 10900 },
    ],
  },
  {
    slug: "gemini-pro",
    name: "Google Gemini Pro",
    brand: "gemini",
    category: "ai",
    tagline: "أقوى نماذج جوجل للذكاء الاصطناعي على حسابك الخاص",
    description:
      "اشتراك Gemini Pro (Google AI Pro) يُفعَّل على بريدك الخاص. استفد من أقوى نماذج جوجل، توليد الصور والفيديو، البحث العميق Deep Research، ومساحة تخزين سحابية مرفقة.",
    features: [
      "التفعيل على بريدك الإلكتروني الخاص",
      "أحدث نماذج Gemini المتقدمة",
      "توليد صور وفيديو وبحث عميق",
      "تكامل مع Gmail وDocs وDrive",
      "ضمان كامل طيلة مدة الاشتراك",
    ],
    badge: "جديد",
    rating: 4.8,
    salesCount: 760,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 1650 },
      { label: "6 أشهر", months: 6, priceDzd: 7900 },
      { label: "12 شهراً", months: 12, priceDzd: 13500 },
    ],
  },
  {
    slug: "canva-pro",
    name: "Canva Pro",
    brand: "canva",
    category: "design",
    tagline: "كل قوالب وأدوات Pro على إيميلك مباشرة",
    description:
      "اشتراك كانفا برو يُفعَّل مباشرة على بريدك عبر دعوة فريق رسمية. ملايين القوالب والصور المدفوعة، إزالة الخلفية بضغطة واحدة، وجدولة المنشورات — كل ميزات Pro كاملة.",
    features: [
      "تفعيل على بريدك مباشرة (دعوة فريق)",
      "ملايين القوالب والعناصر المدفوعة",
      "إزالة الخلفية وأدوات السحري Studio",
      "يحتفظ بكل تصاميمك السابقة",
      "تفعيل فوري خلال دقائق",
    ],
    badge: "أفضل سعر",
    rating: 4.9,
    salesCount: 5180,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 650, compareAtDzd: 1000 },
      { label: "6 أشهر", months: 6, priceDzd: 1900 },
      { label: "12 شهراً", months: 12, priceDzd: 2900 },
    ],
  },
  {
    slug: "chatgpt-plus",
    name: "ChatGPT Plus",
    brand: "openai",
    category: "ai",
    tagline: "أحدث نماذج GPT بأولوية كاملة وبدون انتظار",
    description:
      "اشتراك ChatGPT Plus رسمي بحساب مستقل. وصول لأحدث النماذج، رسائل موسّعة، توليد صور، تحليل ملفات، و GPTs مخصصة — كل ذلك بدون قيود وقت الذروة.",
    features: [
      "حساب مستقل ببيانات دخول خاصة",
      "أحدث نماذج GPT المتقدمة",
      "توليد الصور وتحليل الملفات",
      "ردود أسرع بدون انتظار",
      "ضمان استبدال طيلة الاشتراك",
    ],
    rating: 4.8,
    salesCount: 1930,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 2500, compareAtDzd: 3200 },
      { label: "3 أشهر", months: 3, priceDzd: 6900 },
    ],
  },
  {
    slug: "youtube-premium",
    name: "YouTube Premium",
    brand: "youtube",
    category: "music",
    tagline: "يوتيوب بدون إعلانات + يوتيوب ميوزك على حسابك",
    description:
      "اشتراك يوتيوب بريميوم يُفعَّل على حسابك الخاص عبر دعوة عائلية رسمية. مشاهدة بدون إعلانات، تشغيل في الخلفية، تحميل الفيديوهات، ويوتيوب ميوزك بريميوم مرفق مجاناً.",
    features: [
      "تفعيل على حسابك الخاص (دعوة فاميلي)",
      "مشاهدة بدون إعلانات نهائياً",
      "تشغيل في الخلفية وتحميل أوفلاين",
      "YouTube Music Premium مرفق",
      "ضمان كامل طيلة المدة",
    ],
    badge: "الأكثر طلباً",
    rating: 4.9,
    salesCount: 4110,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 1100 },
      { label: "3 أشهر", months: 3, priceDzd: 2900 },
      { label: "12 شهراً", months: 12, priceDzd: 9900 },
    ],
  },
  {
    slug: "spotify-premium",
    name: "Spotify Premium",
    brand: "spotify",
    category: "music",
    tagline: "موسيقى بلا حدود وبدون إعلانات على حسابك",
    description:
      "اشتراك سبوتيفاي بريميوم على حسابك الخاص مع الاحتفاظ بقوائم التشغيل. استماع بدون إعلانات، تحميل للاستماع دون اتصال، وجودة صوت عالية.",
    features: [
      "تفعيل على حسابك الخاص",
      "تحتفظ بقوائم التشغيل والمفضلة",
      "بدون إعلانات + تحميل أوفلاين",
      "جودة صوت عالية الدقة",
      "ضمان استبدال كامل",
    ],
    rating: 4.8,
    salesCount: 2760,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 900 },
      { label: "3 أشهر", months: 3, priceDzd: 2400 },
      { label: "12 شهراً", months: 12, priceDzd: 8400 },
    ],
  },
  {
    slug: "shahid-vip",
    name: "Shahid VIP",
    brand: "shahid",
    category: "streaming",
    tagline: "أضخم مكتبة عربية — مسلسلات وأفلام ودوريات",
    description:
      "اشتراك شاهد VIP لمتابعة أحدث المسلسلات العربية والتركية والأفلام الحصرية ودوري روشن وأكثر، بجودة عالية على كل الأجهزة.",
    features: [
      "كل المحتوى العربي الحصري",
      "مسلسلات قبل عرضها على التلفاز",
      "دوريات ومباريات مباشرة",
      "جودة Full HD",
      "ضمان كامل طيلة الاشتراك",
    ],
    rating: 4.7,
    salesCount: 1340,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 1200 },
      { label: "12 شهراً", months: 12, priceDzd: 9900 },
    ],
  },
  {
    slug: "disney-plus",
    name: "Disney+",
    brand: "disney",
    category: "streaming",
    tagline: "مارفل، ستار وورز، بيكسار — كلها في مكان واحد",
    description:
      "اشتراك ديزني بلس ببروفايل خاص. كل أفلام مارفل وستار وورز وبيكسار وناشيونال جيوغرافيك بجودة 4K، مثالي للعائلة.",
    features: [
      "بروفايل خاص محمي بدبوس PIN",
      "محتوى مارفل وستار وورز وبيكسار",
      "جودة 4K Ultra HD",
      "يصلح للعائلة والأطفال",
      "ضمان كامل طيلة الاشتراك",
    ],
    rating: 4.7,
    salesCount: 890,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 1400 },
      { label: "12 شهراً", months: 12, priceDzd: 11900 },
    ],
  },
  {
    slug: "prime-video",
    name: "Prime Video",
    brand: "prime",
    category: "streaming",
    tagline: "أفلام ومسلسلات أمازون الأصلية بجودة عالية",
    description:
      "اشتراك برايم فيديو لمشاهدة مسلسلات أمازون الأصلية وأحدث الأفلام، يعمل على كل الأجهزة بجودة عالية.",
    features: [
      "حصريات أمازون الأصلية",
      "جودة Full HD و 4K",
      "يعمل على كل الأجهزة",
      "تفعيل سريع خلال دقائق",
      "ضمان كامل طيلة الاشتراك",
    ],
    rating: 4.6,
    salesCount: 640,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 800 },
      { label: "12 شهراً", months: 12, priceDzd: 6500 },
    ],
  },
  {
    slug: "capcut-pro",
    name: "CapCut Pro",
    brand: "capcut",
    category: "design",
    tagline: "مونتاج احترافي — كل القوالب والتأثيرات المدفوعة",
    description:
      "اشتراك كاب كات برو لصنّاع المحتوى: قوالب جاهزة، تأثيرات وانتقالات مدفوعة، إزالة خلفية الفيديو، وتصدير بدون علامة مائية وبأعلى جودة.",
    features: [
      "كل التأثيرات والقوالب المدفوعة",
      "تصدير بدون علامة مائية",
      "إزالة خلفية الفيديو بالذكاء الاصطناعي",
      "يعمل على الهاتف والحاسوب",
      "ضمان كامل طيلة الاشتراك",
    ],
    badge: "لصنّاع المحتوى",
    rating: 4.8,
    salesCount: 1520,
    isFeatured: true,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 950 },
      { label: "12 شهراً", months: 12, priceDzd: 8400 },
    ],
  },
  {
    slug: "perplexity-pro",
    name: "Perplexity Pro",
    brand: "perplexity",
    category: "ai",
    tagline: "محرك البحث الذكي بأقوى النماذج في اشتراك واحد",
    description:
      "اشتراك بربلكسيتي برو يمنحك بحثاً عميقاً بالمصادر، والوصول إلى عدة نماذج ذكاء اصطناعي رائدة (GPT, Claude, Gemini...) في مكان واحد.",
    features: [
      "بحث عميق Pro Search غير محدود",
      "الوصول لعدة نماذج رائدة",
      "رفع وتحليل الملفات",
      "إجابات موثقة بالمصادر",
      "ضمان كامل طيلة الاشتراك",
    ],
    rating: 4.7,
    salesCount: 410,
    plans: [
      { label: "شهر واحد", months: 1, priceDzd: 2400 },
      { label: "12 شهراً", months: 12, priceDzd: 9900 },
    ],
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    brand: "microsoft",
    category: "tools",
    tagline: "Word وExcel وPowerPoint مع 1TB OneDrive",
    description:
      "اشتراك مايكروسوفت 365 رسمي: حزمة أوفيس كاملة محدّثة دائماً مع مساحة 1TB على OneDrive، يعمل على الحاسوب والهاتف.",
    features: [
      "Word, Excel, PowerPoint محدّثة",
      "مساحة OneDrive سعة 1TB",
      "تثبيت على عدة أجهزة",
      "مفاتيح رسمية مرخصة",
      "ضمان كامل طيلة الاشتراك",
    ],
    rating: 4.8,
    salesCount: 720,
    plans: [
      { label: "3 أشهر", months: 3, priceDzd: 1900 },
      { label: "12 شهراً", months: 12, priceDzd: 6200 },
    ],
  },
  {
    slug: "ps-plus-essential",
    name: "PlayStation Plus Essential",
    brand: "playstation",
    category: "gaming",
    tagline: "اللعب أونلاين + ألعاب مجانية كل شهر",
    description:
      "اشتراك بلايستيشن بلس إيسنشال للعب الجماعي أونلاين، ألعاب مجانية شهرية، وتخزين سحابي لتقدّمك في الألعاب.",
    features: [
      "لعب أونلاين جماعي",
      "ألعاب مجانية كل شهر",
      "تخزين سحابي للحفظ",
      "تخفيضات حصرية",
      "تفعيل خلال دقائق",
    ],
    rating: 4.7,
    salesCount: 560,
    plans: [
      { label: "3 أشهر", months: 3, priceDzd: 4900 },
      { label: "12 شهراً", months: 12, priceDzd: 12900 },
    ],
  },
  {
    slug: "iptv-gold",
    name: "اشتراك IPTV ذهبي",
    brand: "iptv",
    category: "streaming",
    tagline: "آلاف القنوات العالمية والرياضية بجودة 4K",
    description:
      "اشتراك IPTV احترافي مستقر: أكثر من 10,000 قناة عالمية ورياضية وعربية، مكتبة أفلام ومسلسلات محدّثة، يعمل على Smart TV والهاتف وجميع الأجهزة.",
    features: [
      "+10,000 قناة عالمية ورياضية",
      "مكتبة أفلام ومسلسلات محدّثة",
      "جودة 4K / FHD واستقرار عالٍ",
      "يدعم Smart TV والهاتف",
      "دعم فني وضمان طيلة الاشتراك",
    ],
    badge: "سيرفر مستقر",
    rating: 4.6,
    salesCount: 980,
    plans: [
      { label: "3 أشهر", months: 3, priceDzd: 2600 },
      { label: "6 أشهر", months: 6, priceDzd: 4600 },
      { label: "12 شهراً", months: 12, priceDzd: 8100 },
    ],
  },
  {
    slug: "duolingo-super",
    name: "Duolingo Super",
    brand: "duolingo",
    category: "learning",
    tagline: "تعلّم اللغات بدون إعلانات وبدون حدود",
    description:
      "اشتراك دوولينغو سوبر على حسابك: تعلّم اللغات بدون إعلانات، قلوب غير محدودة، ومراجعة أخطائك — مثالي لمسار تعلّم جاد.",
    features: [
      "بدون إعلانات نهائياً",
      "قلوب غير محدودة",
      "مراجعة ذكية للأخطاء",
      "تفعيل على حسابك الخاص",
      "ضمان كامل طيلة الاشتراك",
    ],
    rating: 4.6,
    salesCount: 380,
    plans: [
      { label: "6 أشهر", months: 6, priceDzd: 2400 },
      { label: "12 شهراً", months: 12, priceDzd: 4200 },
    ],
  },
];

async function main() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  if (count > 0) {
    console.log(`Database already seeded (${count} products). Skipping.`);
    return;
  }

  const catIds = new Map<string, number>();
  for (const c of CATS) {
    const [row] = await db.insert(categories).values(c).returning();
    catIds.set(c.slug, row.id);
    console.log(`category: ${c.name}`);
  }

  for (const p of PRODUCTS) {
    const { plans: planSeeds, category, ...rest } = p;
    const [row] = await db
      .insert(products)
      .values({
        ...rest,
        categoryId: catIds.get(category)!,
        rating: p.rating ?? 4.7,
        salesCount: p.salesCount ?? 0,
        isFeatured: p.isFeatured ?? false,
      })
      .returning();
    await db.insert(plans).values(
      planSeeds.map((pl, i) => ({
        productId: row.id,
        label: pl.label,
        months: pl.months,
        priceDzd: pl.priceDzd,
        compareAtDzd: pl.compareAtDzd ?? null,
        sort: i,
      }))
    );
    console.log(`product: ${p.name} (${planSeeds.length} plans)`);
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
