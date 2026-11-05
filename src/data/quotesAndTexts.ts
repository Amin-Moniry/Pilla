export interface PracticeText {
  id: string;
  category: 'quote' | 'poetry' | 'code' | 'numbers' | 'words' | 'endurance';
  language: 'fa' | 'en';
  title: string;
  author?: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const PRACTICE_TEXTS: PracticeText[] = [
  // Persian 1200s (قرن هفتم هجری) Classical Poetry & Literature
  {
    id: 'fa-saadi-golestan',
    category: 'poetry',
    language: 'fa',
    title: 'دیباچه گلستان سعدی (قرن هفتم)',
    author: 'سعدی شیرازی',
    difficulty: 'medium',
    text: 'منت خدای را عز و جل که طاعتش موجب قربت است و به شکر اندرش مزید نعمت. هر نفسی که فرو می‌رود ممد حیات است و چون برمی‌آید مفرح ذات؛ پس در هر نفسی دو نعمت موجود است و بر هر نعمتی شکری واجب.',
  },
  {
    id: 'fa-nizami-makhzan',
    category: 'poetry',
    language: 'fa',
    title: 'مخزن‌الاسرار نظامی گنجوی',
    author: 'نظامی گنجوی',
    difficulty: 'easy',
    text: 'ای نام تو بهترین سرآغاز، بی‌نام تو نامه کی کنم باز. ای یاد تو مونس روانم، جز نام تو نیست بر زبانم. هم قصه نانموده دانی، هم نامه نانوشته خوانی.',
  },
  {
    id: 'fa-rumi-masnavi',
    category: 'poetry',
    language: 'fa',
    title: 'نی‌نامه مثنوی معنوی',
    author: 'مولانا جلال‌الدین بلخی',
    difficulty: 'medium',
    text: 'بشنو این نی چون شکایت می‌کند، از جدایی‌ها حکایت می‌کند. کز نیستان تا مرا ببریده‌اند، در نفیرم مرد و زن نالیده‌اند. سینه خواهم شرحه شرحه از فراق، تا بگویم شرح درد اشتیاق. هر کسی کو دور ماند از اصل خویش، باز جوید روزگار وصل خویش.',
  },
  {
    id: 'fa-attar-mantegh',
    category: 'poetry',
    language: 'fa',
    title: 'تمثیل شمع و پروانه در منطق‌الطیر',
    author: 'عطار نیشابوری',
    difficulty: 'hard',
    text: 'شبی پروانگان جمع آمدند، در مضیفی طالب شمع آمدند. جمله گفتند: یکی باید شدن، تا خبر آرد ز مطلوب کهن. رفت پروانه‌ای به قصری دوردست، دید نوری شمع را در صدر نشست. بازگشت و آن قدر اسرار گفت، کان قدر در پرده پندار گفت.',
  },
  {
    id: 'fa-hafez-ghazal',
    category: 'poetry',
    language: 'fa',
    title: 'غزل شاهانه حافظ',
    author: 'حافظ شیرازی',
    difficulty: 'medium',
    text: 'در ازل پرتو حسنت ز تجلی دم زد، عشق پیدا شد و آتش به همه عالم زد. جلوه‌ای کرد رخت دید ملک عشق نداشت، عین آتش شد از این غیرت و بر آدم زد. عقل می‌خواست کز آن شعله چراغ افروزد، برق غیرت بدرخشید و جهان برهم زد.',
  },
  {
    id: 'fa-saadi-bani-adam',
    category: 'poetry',
    language: 'fa',
    title: 'بنی‌آدم اعضای یکدیگرند',
    author: 'سعدی شیرازی',
    difficulty: 'easy',
    text: 'بنی‌آدم اعضای یکدیگرند، که در آفرینش ز یک گوهرند. چو عضوی به درد آورد روزگار، دگر عضوها را نماند قرار. تو کز محنت دیگران بی‌غمی، نشاید که نامت نهند آدمی.',
  },
  {
    id: 'fa-ferdowsi-kherad',
    category: 'poetry',
    language: 'fa',
    title: 'ستایش خرد و جان در شاهنامه',
    author: 'ابوالقاسم فردوسی',
    difficulty: 'hard',
    text: 'به نام خداوند جان و خرد، کزین برتر اندیشه برنگذرد. خداوند نام و خداوند جای، خداوند روزی ده رهنمای. خرد بهتر از هر چه ایزد بداد، ستایش خرد را به از راه داد. خرد رهنمای و خرد دلگشای، خرد دست گیرد به هر دو سرای.',
  },

  // Persian Philosophical Prose on Typing Mastery
  {
    id: 'fa-pilla-philosophy',
    category: 'quote',
    language: 'fa',
    title: 'حکمت پروانه و رهایی سرانگشتان',
    author: 'دیوان خسروانی پیلا',
    difficulty: 'medium',
    text: 'آنچه کرم ابریشم پایان جهان می‌خواندش، پروانه سرآغاز پرواز می‌داند. در تاریکی سکوت‌آمیز پیله، سرانگشتان با صبر تارهای زرین مهارت را می‌تنند. هنگامی که بال‌های پروانه بر صفحه‌کلید گشوده شود، دیگر هیچ نگاهی به پایین نخواهد افتاد و اندیشه با سرعتی همایونی بر صفحه نقش خواهد بست.',
  },

  // English Classical Literature & Philosophy
  {
    id: 'en-quote-1',
    category: 'quote',
    language: 'en',
    title: 'The Unbearable Lightness of Flow',
    author: 'Typing Pedagogy',
    difficulty: 'medium',
    text: 'Touch typing transforms the physical keyboard into an invisible neural extension. When your fingers glide across the keys without conscious effort, thought and expression merge into effortless velocity.',
  },
  {
    id: 'en-quote-2',
    category: 'quote',
    language: 'en',
    title: 'Nature of Metamorphosis',
    author: 'Biological Allegory',
    difficulty: 'easy',
    text: 'What the caterpillar calls the end of the world, the master calls a butterfly. Inside the quiet darkness of the cocoon, patient practice weaves the delicate wings of tomorrow.',
  },
  {
    id: 'en-quote-3',
    category: 'quote',
    language: 'en',
    title: 'The Great Gatsby Opening',
    author: 'F. Scott Fitzgerald',
    difficulty: 'hard',
    text: 'In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world have not had the advantages that you have had.',
  },

  // Code Snippets
  {
    id: 'code-ts-1',
    category: 'code',
    language: 'en',
    title: 'TypeScript Generic Queue',
    author: 'Code Library',
    difficulty: 'medium',
    text: 'class AsyncQueue<T> { private items: T[] = []; push(item: T): void { this.items.push(item); } pop(): T | undefined { return this.items.shift(); } get size(): number { return this.items.length; } }',
  },
  {
    id: 'code-py-1',
    category: 'code',
    language: 'en',
    title: 'Python Data Pipeline',
    author: 'Code Library',
    difficulty: 'medium',
    text: 'def normalize_metrics(records: list[dict]) -> dict: return {r["id"]: round(r["wpm"] * 0.95, 2) for r in records if r.get("valid") is True}',
  },
  {
    id: 'code-sql-1',
    category: 'code',
    language: 'en',
    title: 'SQL Leaderboard Query',
    author: 'Code Library',
    difficulty: 'easy',
    text: 'SELECT user_id, MAX(wpm) AS top_speed, AVG(accuracy) AS avg_acc FROM typing_sessions WHERE created_at >= NOW() - INTERVAL 7 DAY GROUP BY user_id ORDER BY top_speed DESC LIMIT 10;',
  },

  // Numbers & Persian Digits
  {
    id: 'fa-num-1',
    category: 'numbers',
    language: 'fa',
    title: 'ارقام خسروانی و تاریخ‌های کهن',
    difficulty: 'medium',
    text: 'نگارش شاهنامه در سال ۴۰۰ هجری، گلستان سعدی در سال ۶۵۶ هجری و مثنوی معنوی در سال ۶۷۲ هجری قمری سروده شدند. شماره ثبت دیوان: ۱۰۴۸۳۹۲، کد رهگیری: ۱۴۰۳/۰۸/۱۵.',
  },
  {
    id: 'en-num-1',
    category: 'numbers',
    language: 'en',
    title: 'Numeric Codes and Dates',
    difficulty: 'easy',
    text: 'Order #4092-8819 created on 2026-11-04 with subtotal $1,429.50 and discount rate 15.5%. Contact phone: (555) 392-8810.',
  },
];

export const PERSIAN_COMMON_WORDS = [
  'این', 'آن', 'است', 'شد', 'می‌شود', 'که', 'برای', 'با', 'در', 'از', 'به',
  'یک', 'همه', 'ما', 'شما', 'او', 'من', 'آن‌ها', 'خود', 'کار', 'دست',
  'دل', 'روز', 'شب', 'راه', 'جان', 'چشم', 'آب', 'زمین', 'آسمان', 'پروانه',
  'پیله', 'پرواز', 'نور', 'دانش', 'آموختن', 'سرعت', 'دقت', 'کلمه', 'سخن',
  'ایران', 'فرهنگ', 'هنر', 'ادب', 'حافظ', 'سعدی', 'اندیشه', 'بهار', 'زیبا',
  'زرین', 'همایونی', 'خسروانی', 'شاهانه', 'گلستان', 'بوستان', 'مثنوی', 'تذهیب',
];

export const ENGLISH_COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'butterfly', 'cocoon', 'silk', 'speed', 'flow', 'rhythm', 'flight', 'wings',
];
