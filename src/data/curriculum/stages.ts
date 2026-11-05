import { CurriculumStage } from '../../types/curriculum';
import { Language } from '../../types/typing';

/** Number of lessons in every stage — identical for the Persian and English tracks (total = 150). */
export const STAGE_LESSON_COUNTS = [3, 18, 24, 24, 20, 16, 14, 13, 10, 5, 3] as const;
export const TOTAL_LESSONS_PER_TRACK = STAGE_LESSON_COUNTS.reduce((a, b) => a + b, 0); // 150

const common = [
  { iconName: 'Anchor', accentColor: '#D97706' },
  { iconName: 'Home', accentColor: '#F59E0B' },
  { iconName: 'ArrowUp', accentColor: '#FBBF24' },
  { iconName: 'ArrowDown', accentColor: '#D97706' },
  { iconName: 'Hand', accentColor: '#F59E0B' },
  { iconName: 'ArrowBigUp', accentColor: '#FBBF24' },
  { iconName: 'Hash', accentColor: '#D97706' },
  { iconName: 'Code', accentColor: '#F59E0B' },
  { iconName: 'Gauge', accentColor: '#FBBF24' },
  { iconName: 'BookOpen', accentColor: '#D97706' },
  { iconName: 'Crown', accentColor: '#FDE68A' },
];

export const STAGES_EN: CurriculumStage[] = [
  {
    id: 0,
    titleEn: 'Stage 0 · Foundations: Posture, Thumbs & Anchors',
    titleFa: 'گام صفر · بنیاد: نشستن درست، شست‌ها و جایگاه انگشتان',
    descriptionEn: 'Sit correctly, find the F and J bumps and learn to type without looking.',
    descriptionFa: 'درست بنشینید، برجستگی F و J را بیابید و بدون نگاه کردن تایپ کنید.',
  },
  {
    id: 1,
    titleEn: 'Stage 1 · Home Row: A S D F G H J K L ;',
    titleFa: 'مرحله ۱ · ردیف مبنا: خانهٔ انگشتان',
    descriptionEn: 'Every finger learns its home key — two keys at a time, each drilled for minutes.',
    descriptionFa: 'هر انگشت خانهٔ خود را می‌آموزد؛ هر بار دو کلید و هر کلید چند دقیقه تمرین.',
  },
  {
    id: 2,
    titleEn: 'Stage 2 · Top Row: Q W E R T Y U I O P',
    titleFa: 'مرحله ۲ · ردیف بالا',
    descriptionEn: 'Reach up and come back home. Left and right hand are trained separately, then together.',
    descriptionFa: 'بالا بروید و به خانه برگردید. دست چپ و راست جداگانه و سپس با هم تمرین می‌شوند.',
  },
  {
    id: 3,
    titleEn: 'Stage 3 · Bottom Row: Z X C V B N M , . /',
    titleFa: 'مرحله ۳ · ردیف پایین',
    descriptionEn: 'The hardest reach. After this stage every letter of the alphabet is under your fingers.',
    descriptionFa: 'دشوارترین کشش. پس از این مرحله همهٔ حروف الفبا زیر انگشتان شماست.',
  },
  {
    id: 4,
    titleEn: 'Stage 4 · Two-Hand Mastery & Letter Combinations',
    titleFa: 'مرحله ۴ · تسلط دو دست و ترکیب حروف',
    descriptionEn: 'Left-only, right-only, alternating hands, bigrams, trigrams and word shapes.',
    descriptionFa: 'فقط چپ، فقط راست، دست‌های متناوب، ترکیب‌های دوحرفی و سه‌حرفی و شکل واژه‌ها.',
  },
  {
    id: 5,
    titleEn: 'Stage 5 · Shift, Capitals & Punctuation',
    titleFa: 'مرحله ۵ · شیفت، حروف بزرگ و علائم نگارشی',
    descriptionEn: 'Opposite-hand Shift, capitals, quotes, colons, question marks and full sentences.',
    descriptionFa: 'شیفتِ دست مخالف، حروف بزرگ، نقل‌قول، دونقطه، علامت سؤال و جمله‌های کامل.',
  },
  {
    id: 6,
    titleEn: 'Stage 6 · The Number Row: 1 2 3 4 5 6 7 8 9 0',
    titleFa: 'مرحله ۶ · ردیف اعداد',
    descriptionEn: 'Reach to the numbers without losing home position. Dates, prices and phone numbers.',
    descriptionFa: 'بدون از دست دادن جایگاه، به اعداد برسید. تاریخ، قیمت و شمارهٔ تلفن.',
  },
  {
    id: 7,
    titleEn: 'Stage 7 · Symbols & Code',
    titleFa: 'مرحله ۷ · نمادها و کدنویسی',
    descriptionEn: 'Shifted symbols, brackets, operators, e-mail, URLs and real code.',
    descriptionFa: 'نمادهای شیفتی، کروشه و آکولاد، عملگرها، ایمیل، نشانی وب و کد واقعی.',
  },
  {
    id: 8,
    titleEn: 'Stage 8 · Speed Building',
    titleFa: 'مرحله ۸ · ساختن سرعت',
    descriptionEn: 'Bursts, rhythm, long words and endurance with rising speed targets.',
    descriptionFa: 'تایپ انفجاری، ریتم، واژه‌های بلند و استقامت با هدف‌های سرعتیِ فزاینده.',
  },
  {
    id: 9,
    titleEn: 'Stage 9 · Real Texts',
    titleFa: 'مرحله ۹ · متن‌های واقعی',
    descriptionEn: 'Quotes, stories, news and long passages — typing like you will in real life.',
    descriptionFa: 'جمله‌های ماندگار، داستان، خبر و متن‌های بلند — تایپ مثل زندگی واقعی.',
  },
  {
    id: 10,
    titleEn: 'Stage 10 · Master Exams',
    titleFa: 'مرحله ۱۰ · آزمون‌های استادی',
    descriptionEn: 'Three final exams that prove complete, two-handed, eyes-free mastery.',
    descriptionFa: 'سه آزمون پایانی که تسلط کامل، دو‌دستی و بدون نگاه را ثابت می‌کند.',
  },
].map((s, i) => ({ ...s, ...common[i] })) as CurriculumStage[];

export const STAGES_FA: CurriculumStage[] = STAGES_EN.map((s) => ({ ...s }));
STAGES_FA[7] = {
  ...STAGES_FA[7],
  titleEn: 'Stage 7 · Symbols, Diacritics & Formal Writing',
  titleFa: 'مرحله ۷ · نمادها، اعراب و نگارش رسمی',
  descriptionEn: 'Shifted symbols, guillemets, vowel marks, dates, prices and formal letters.',
  descriptionFa: 'نمادهای شیفتی، گیومه، اعراب، تاریخ، قیمت و نامهٔ رسمی.',
};
STAGES_FA[5] = {
  ...STAGES_FA[5],
  titleEn: 'Stage 5 · Shift, Special Letters, ZWNJ & Punctuation',
  titleFa: 'مرحله ۵ · شیفت، حروف ویژه، نیم‌فاصله و علائم نگارشی',
  descriptionEn: 'آ ژ ئ ء, the half-space (ZWNJ), Persian comma, semicolon, question mark and guillemets.',
  descriptionFa: 'آ ژ ئ ء، نیم‌فاصله، ویرگول و نقطه‌ویرگول فارسی، علامت سؤال و گیومه.',
};

export function getStages(language: Language): CurriculumStage[] {
  return language === 'fa' ? STAGES_FA : STAGES_EN;
}
