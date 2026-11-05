import { LessonSpec } from './lessonBuilder';
import { DrillContext, joinTokens } from './drills';
import { Rng, pick } from './random';
import { L, Spec, altRatio, hasSameFingerPair, listGen, ngramGen, sentenceFromWords, uniq } from './specHelpers';
import { FA_BIGRAMS, FA_COMMON, FA_ENDINGS, FA_TRIGRAMS } from './wordsFa';

const names = (keys: string[]) => keys.join(' · ');

const intro = (keys: string[], pool: string[], wpm: number, acc = 94, o: Partial<LessonSpec> = {}): Spec => ({
  kind: 'intro', keys, pool, wpm, acc,
  t: [`New Keys: ${names(keys)}`, `کلیدهای تازه: ${names(keys)}`], ...o,
});
const reinf = (keys: string[], pool: string[], wpm: number, acc = 94, o: Partial<LessonSpec> = {}): Spec => ({
  kind: 'reinforce', keys, pool, wpm, acc,
  t: [`Deep Drill: ${names(keys)}`, `تمرین عمیق: ${names(keys)}`], ...o,
});

const pool = (...parts: string[][]) => uniq(parts.flat());

const HOME = L('شسیبلاتنمکگ');
const TOP = L('ضصثقفغعهخحجچ');
const BOT = L('ظطزرذدوپ');
const ALL = pool(HOME, TOP, BOT);
const LEFT_FA = L('ضصثقفشسیبلظطزرذ');
const RIGHT_FA = L('غعهخحجچپاتنمکگدو');
const leftSet = new Set(LEFT_FA);
const DIG = L('۱۲۳۴۵۶۷۸۹۰');
const FD = '۰۱۲۳۴۵۶۷۸۹';
const fa = (n: number | string) => String(n).replace(/\d/g, (d) => FD[+d]);
const pad = (n: number) => String(n).padStart(2, '0');

const FINGER: Record<string, string> = {};
const assign = (f: string, s: string) => L(s).forEach((c) => (FINGER[c] = f));
assign('lp', 'ضشظ'); assign('lr', 'صسط'); assign('lm', 'ثیز'); assign('li', 'قفرذبل');
assign('ri', 'غعاتدپ'); assign('rm', 'هنو'); assign('rr', 'خم'); assign('rp', 'حجچکگ');

const PUNCT = '.،؛؟!«»():\u200C';
const alphabetLines = ['ضصثقفغعهخحجچ', 'شسیبلاتنمکگ', 'ظطزرذدوپ', 'ضشظ صسط ثیز قبر فلذ', 'غاد عتپ هنو خم حکج چگ', 'ضصثقف شسیبل ظطزرذ', 'غعهخحجچ اتنمکگ دوپ'];

const int = (rng: Rng, n: number) => Math.floor(rng() * n);
const datesGen = (rng: Rng, len: number) =>
  joinTokens(rng, () => {
    const r = rng();
    if (r < 0.4) return `${fa(1385 + int(rng, 20))}/${fa(pad(1 + int(rng, 12)))}/${fa(pad(1 + int(rng, 28)))}`;
    if (r < 0.7) return `${fa(pad(int(rng, 24)))}:${fa(pad(int(rng, 60)))}`;
    let s = '۰۹';
    for (let i = 0; i < 9; i++) s += fa(int(rng, 10));
    return s;
  }, len);
const pricesGen = (rng: Rng, len: number) =>
  joinTokens(rng, () => {
    const r = rng();
    if (r < 0.35) return `${fa(1 + int(rng, 99))}٬${fa(String(int(rng, 10)) + '00')} تومان`;
    if (r < 0.6) return `${fa(1 + int(rng, 99))}٪`;
    if (r < 0.8) return `${fa(1 + int(rng, 99))}٫${fa(1 + int(rng, 9))} ${pick(rng, ['کیلو', 'متر', 'لیتر'])}`;
    return `${fa(1 + int(rng, 999))} ${pick(rng, ['ریال', 'تومان', 'درصد', 'عدد'])}`;
  }, len);

const topWords = (from: number, to: number) => FA_COMMON.slice(from, to).filter((w) => w.length >= 2);
const listSpec = (list: string[]) => ({ gen: listGen(list) });
const SENT_ALLOW = PUNCT;
const NUM_ALLOW = PUNCT + '۰۱۲۳۴۵۶۷۸۹٬٫٪+/-=×÷ ';

export const SPECS_FA: Spec[] = [
  // ───────────── Stage 0 · Foundations (3)
  { kind: 'foundation', keys: ['ب', 'ت'], pool: L('بت'), wpm: 8, acc: 90,
    t: ['Sit Right & Find ب and ت', 'نشستن درست و یافتن ب و ت'],
    sub: ['Posture, hand position and the two tactile bumps (F and J keys)', 'نشستن، جایگاه دست‌ها و دو برجستگی لمسی (کلیدهای F و J)'],
    learn: ['Sit upright, feet flat, elbows near 90°, wrists floating above the desk. Put your LEFT index finger on ب and your RIGHT index finger on ت — feel the small ridges. The other fingers rest on ش س ی and ن م ک.',
            'صاف بنشینید، پاها روی زمین، آرنج‌ها نزدیک ۹۰ درجه و مچ‌ها آزاد بالای میز. انگشت اشارهٔ چپ را روی «ب» و اشارهٔ راست را روی «ت» بگذارید و برجستگی‌ها را حس کنید. بقیهٔ انگشتان روی «ش س ی» و «ن م ک» می‌مانند.'] },
  { kind: 'foundation', keys: [' '], pool: L('بت'), wpm: 10, acc: 92,
    t: ['Thumbs & the Space Bar', 'شست‌ها و کلید فاصله'],
    sub: ['One thumb, one clean tap, no pause before the space', 'یک شست، یک ضربهٔ تمیز، بدون مکث پیش از فاصله'],
    learn: ['Choose one thumb and use it for every space. Tap the space bar with the side of the thumb tip. The index fingers stay on ب and ت.',
            'یک شست را برای همهٔ فاصله‌ها انتخاب کنید و با لبهٔ نوک شست ضربه بزنید. انگشتان اشاره روی «ب» و «ت» می‌مانند.'] },
  { kind: 'foundation', keys: [], pool: L('بت'), wpm: 12, acc: 93,
    t: ['Eyes on the Screen & Even Rhythm', 'نگاه به صفحه و ریتم یکنواخت'],
    sub: ['Build the habit that makes everything else possible', 'ساختن عادتی که همهٔ چیز به آن وابسته است'],
    learn: ['From now on, never look at the keyboard. If you feel lost, feel for the bumps under ب and ت. Type with an even beat and let speed come later.',
            'از این پس هرگز به صفحه‌کلید نگاه نکنید. اگر گم شدید، برجستگی زیر «ب» و «ت» را لمس کنید. با ضرب یکنواخت تایپ کنید و سرعت را به بعد بسپارید.'] },

  // ───────────── Stage 1 · Home Row (18)
  intro(L('ین'), L('بتین'), 11),
  reinf(L('ین'), L('بتین'), 13),
  intro(L('سم'), L('بتینسم'), 14),
  reinf(L('سم'), L('بتینسم'), 15),
  intro(L('شک'), L('بتینسمشک'), 15),
  reinf(L('شک'), L('بتینسمشک'), 17),
  intro(L('لا'), L('بتینسمشکلا'), 17),
  reinf(L('لا'), L('بتینسمشکلا'), 19),
  intro(['گ'], HOME, 17),
  reinf(['گ'], HOME, 19),
  { kind: 'hand', hand: 'left', pool: L('شسیبل'), keys: [], wpm: 18, acc: 94, t: ['Left Hand Alone: ش س ی ب ل', 'فقط دست چپ: ش س ی ب ل'] },
  { kind: 'hand', hand: 'right', pool: L('اتنمکگ'), keys: [], wpm: 18, acc: 94, t: ['Right Hand Alone: ا ت ن م ک گ', 'فقط دست راست: ا ت ن م ک گ'] },
  { kind: 'words', pool: HOME, wpm: 20, acc: 94, wordFilter: (w) => altRatio(w, leftSet) >= 0.5, t: ['Alternating Hands on the Home Row', 'دست‌های متناوب روی ردیف مبنا'] },
  reinf(L('شس'), HOME, 18, 94, { t: ['Weak Fingers I: Left Pinky & Ring (ش س)', 'انگشتان ضعیف ۱: کوچک و انگشتری چپ (ش س)'], hand: 'left' }),
  reinf(L('مکگ'), HOME, 18, 94, { t: ['Weak Fingers II: Right Ring & Pinky (م ک گ)', 'انگشتان ضعیف ۲: انگشتری و کوچک راست (م ک گ)'], hand: 'right' }),
  { kind: 'words', pool: HOME, wpm: 20, acc: 94, min: 3, t: ['Home Row Words I', 'واژه‌های ردیف مبنا ۱'] },
  { kind: 'words', pool: HOME, wpm: 22, acc: 95, min: 4, t: ['Home Row Words II: Longer', 'واژه‌های ردیف مبنا ۲: بلندتر'] },
  { kind: 'exam', pool: HOME, wpm: 24, acc: 95, t: ['Stage 1 Exam: Home Row', 'آزمون مرحله ۱: ردیف مبنا'] },

  // ───────────── Stage 2 · Top Row (24)
  intro(L('ثه'), pool(HOME, L('ثه')), 15),
  reinf(L('ثه'), pool(HOME, L('ثه')), 17),
  intro(L('قع'), pool(HOME, L('ثهقع')), 16),
  reinf(L('قع'), pool(HOME, L('ثهقع')), 18),
  intro(L('فغ'), pool(HOME, L('ثهقعفغ')), 16),
  reinf(L('فغ'), pool(HOME, L('ثهقعفغ')), 18),
  intro(L('صخ'), pool(HOME, L('ثهقعفغصخ')), 17),
  reinf(L('صخ'), pool(HOME, L('ثهقعفغصخ')), 19),
  intro(L('ضح'), pool(HOME, L('ثهقعفغصخضح')), 17),
  reinf(L('ضح'), pool(HOME, L('ثهقعفغصخضح')), 19),
  intro(L('جچ'), pool(HOME, TOP), 17),
  reinf(L('جچ'), pool(HOME, TOP), 19),
  { kind: 'hand', hand: 'left', pool: L('ضصثقفشسیبل'), keys: [], wpm: 20, acc: 94, t: ['Left Hand: Top & Home Rows', 'دست چپ: ردیف بالا و مبنا'] },
  { kind: 'hand', hand: 'right', pool: L('غعهخحجچاتنمکگ'), keys: [], wpm: 20, acc: 94, t: ['Right Hand: Top & Home Rows', 'دست راست: ردیف بالا و مبنا'] },
  { kind: 'words', pool: pool(HOME, TOP), wpm: 20, acc: 94, min: 3, max: 6, t: ['Top & Home Words I', 'واژه‌های ردیف بالا و مبنا ۱'] },
  { kind: 'words', pool: pool(HOME, TOP), wpm: 22, acc: 94, min: 4, t: ['Top & Home Words II', 'واژه‌های ردیف بالا و مبنا ۲'] },
  { kind: 'words', pool: pool(HOME, TOP), wpm: 22, acc: 94, wordFilter: (w) => altRatio(w, leftSet) >= 0.6, t: ['Alternating Hands: Top Row', 'دست‌های متناوب: ردیف بالا'] },
  { kind: 'review', pool: pool(HOME, TOP), wpm: 22, acc: 95, t: ['Reach & Return Home Discipline', 'انضباط رسیدن و بازگشت به خانه'],
    sub: ['After every reach, the finger comes back to its home key', 'پس از هر کشش، انگشت به خانه برمی‌گردد'] },
  reinf(L('ضص'), pool(HOME, TOP), 20, 94, { t: ['Weak Fingers III: Left Pinky & Ring (ض ص)', 'انگشتان ضعیف ۳: کوچک و انگشتری چپ (ض ص)'], hand: 'left' }),
  reinf(L('حخجچ'), pool(HOME, TOP), 20, 94, { t: ['Weak Fingers IV: Right Ring & Pinky (خ ح ج چ)', 'انگشتان ضعیف ۴: انگشتری و کوچک راست (خ ح ج چ)'], hand: 'right' }),
  { kind: 'words', pool: pool(HOME, TOP), wpm: 24, acc: 95, min: 5, t: ['Longer Words (5+ letters)', 'واژه‌های بلندتر (۵ حرف به بالا)'] },
  { kind: 'review', pool: pool(HOME, TOP), wpm: 24, acc: 95, t: ['Top Row Speed Ladder', 'نردبان سرعت ردیف بالا'] },
  { kind: 'review', pool: pool(HOME, TOP), wpm: 25, acc: 95, t: ['Top Row Mixed Review', 'مرور ترکیبی ردیف بالا'] },
  { kind: 'exam', pool: pool(HOME, TOP), wpm: 26, acc: 95, t: ['Stage 2 Exam: Top Row', 'آزمون مرحله ۲: ردیف بالا'] },

  // ───────────── Stage 3 · Bottom Row (24)
  intro(L('زو'), pool(HOME, TOP, L('زو')), 16),
  reinf(L('زو'), pool(HOME, TOP, L('زو')), 18),
  intro(L('رد'), pool(HOME, TOP, L('زورد')), 16),
  reinf(L('رد'), pool(HOME, TOP, L('زورد')), 18),
  intro(L('ذپ'), pool(HOME, TOP, L('زوردذپ')), 16),
  reinf(L('ذپ'), pool(HOME, TOP, L('زوردذپ')), 18),
  intro(['ط', '.'], pool(HOME, TOP, L('زوردذپط')), 16),
  reinf(['ط', '.'], pool(HOME, TOP, L('زوردذپط')), 18),
  intro(['ظ', '/'], pool(ALL), 16),
  reinf(['ظ', '/'], pool(ALL), 18),
  { kind: 'hand', hand: 'left', pool: LEFT_FA, keys: [], wpm: 22, acc: 94, t: ['Left Hand: All 16 Letters', 'دست چپ: هر ۱۶ حرف'] },
  { kind: 'hand', hand: 'right', pool: RIGHT_FA, keys: [], wpm: 22, acc: 94, t: ['Right Hand: All Letters', 'دست راست: همهٔ حروف'] },
  { kind: 'words', pool: L('ظطزرذدوپ'), wpm: 20, acc: 94, min: 2, t: ['Bottom Row Words I', 'واژه‌های ردیف پایین ۱'] },
  { kind: 'words', pool: pool(HOME, L('ظطزرذدوپ')), wpm: 22, acc: 94, min: 3, t: ['Bottom & Home Words II', 'واژه‌های ردیف پایین و مبنا ۲'] },
  { kind: 'review', pool: pool(ALL, ['.']), allow: '. ', source: 'custom', wpm: 22, acc: 94,
    gen: (rng, len, ctx) => sentenceFromWords(rng, ctx, ALL, len, {}), t: ['Periods in Sentences', 'نقطه در جمله‌ها'] },
  reinf(L('ظط'), ALL, 22, 94, { t: ['Weak Fingers V: Left Pinky & Ring (ظ ط)', 'انگشتان ضعیف ۵: کوچک و انگشتری چپ (ظ ط)'], hand: 'left' }),
  reinf(['.', '/'], ALL, 22, 94, { source: 'words', t: ['Weak Fingers VI: Right Ring & Pinky (. /)', 'انگشتان ضعیف ۶: انگشتری و کوچک راست (. /)'], hand: 'right' }),
  reinf(L('بلاتغعذدپ'), ALL, 22, 94, { t: ['Index Finger Stretch: The Middle Columns', 'کشش انگشتان اشاره: ستون‌های میانی'] }),
  { kind: 'words', pool: ALL, wpm: 24, acc: 94, min: 3, max: 5, t: ['All-Letter Words I', 'واژه‌های همهٔ حروف ۱'] },
  { kind: 'words', pool: ALL, wpm: 26, acc: 94, min: 5, t: ['All-Letter Words II', 'واژه‌های همهٔ حروف ۲'] },
  { kind: 'review', pool: ALL, wpm: 24, acc: 94, ...listSpec(alphabetLines), t: ['Alphabet Lines: Every Key in a Row', 'ردیف‌های الفبا: همهٔ کلیدها پشت هم'] },
  { kind: 'review', pool: ALL, wpm: 26, acc: 95, t: ['Alphabet Speed Ladder', 'نردبان سرعت الفبا'] },
  { kind: 'review', pool: ALL, wpm: 26, acc: 95, t: ['Full Alphabet Review', 'مرور کامل الفبا'] },
  { kind: 'exam', pool: ALL, wpm: 28, acc: 95, t: ['Stage 3 Exam: Every Letter', 'آزمون مرحله ۳: همهٔ حروف'] },

  // ───────────── Stage 4 · Two-Hand Mastery (20)
  { kind: 'hand', hand: 'left', pool: LEFT_FA, wpm: 24, acc: 95, min: 2, t: ['Left-Hand-Only Words I', 'واژه‌های فقط دست چپ ۱'] },
  { kind: 'hand', hand: 'left', pool: LEFT_FA, wpm: 26, acc: 95, min: 3, t: ['Left-Hand-Only Words II', 'واژه‌های فقط دست چپ ۲'] },
  { kind: 'hand', hand: 'right', pool: RIGHT_FA, wpm: 24, acc: 95, min: 2, t: ['Right-Hand-Only Words I', 'واژه‌های فقط دست راست ۱'] },
  { kind: 'hand', hand: 'right', pool: RIGHT_FA, wpm: 26, acc: 95, min: 3, t: ['Right-Hand-Only Words II', 'واژه‌های فقط دست راست ۲'] },
  { kind: 'words', pool: ALL, wpm: 28, acc: 95, min: 3, wordFilter: (w) => altRatio(w, leftSet) >= 0.75, t: ['Perfect Alternation: Hands as a Drum Roll', 'تناوب کامل: دست‌ها مثل ضرب طبل'] },
  { kind: 'words', pool: ALL, wpm: 26, acc: 95, min: 3, wordFilter: (w) => hasSameFingerPair(w, FINGER), t: ['Same-Finger Pairs', 'جفت‌حرف‌های هم‌انگشت'] },
  { kind: 'words', pool: ALL, wpm: 28, acc: 95, gen: ngramGen(FA_BIGRAMS), t: ['The Most Common Letter Pairs', 'پرکاربردترین جفت‌حرف‌ها'] },
  { kind: 'words', pool: ALL, wpm: 28, acc: 95, gen: ngramGen(FA_TRIGRAMS), t: ['Common Three-Letter Chunks', 'تکه‌های سه‌حرفی پرکاربرد'] },
  { kind: 'words', pool: ALL, wpm: 28, acc: 95, gen: ngramGen(FA_ENDINGS), t: ['Word Endings: ها، ان، تر، مند', 'پایان واژه‌ها: ها، ان، تر، مند'] },
  { kind: 'words', pool: ALL, wpm: 30, acc: 95, max: 3, t: ['Tiny Words (2–3 letters)', 'واژه‌های ریز (۲ تا ۳ حرف)'] },
  { kind: 'words', pool: ALL, wpm: 30, acc: 95, min: 4, max: 5, t: ['Medium Words (4–5 letters)', 'واژه‌های میانه (۴ تا ۵ حرف)'] },
  { kind: 'words', pool: ALL, wpm: 30, acc: 95, min: 6, t: ['Long Words (6+ letters)', 'واژه‌های بلند (۶ حرف به بالا)'] },
  { kind: 'words', pool: ALL, wpm: 30, acc: 95, ...listSpec(topWords(0, 100)), t: ['Everyday Words I', 'واژه‌های روزمره ۱'] },
  { kind: 'words', pool: ALL, wpm: 31, acc: 95, ...listSpec(topWords(100, 240)), t: ['Everyday Words II', 'واژه‌های روزمره ۲'] },
  { kind: 'words', pool: ALL, wpm: 32, acc: 95, ...listSpec(topWords(240, 660)), t: ['Everyday Words III: The Full List', 'واژه‌های روزمره ۳: فهرست کامل'] },
  { kind: 'review', pool: ALL, wpm: 30, acc: 95, t: ['Metronome Rhythm: Same Beat, Every Key', 'ریتم مترونوم: یک ضرب برای هر کلید'] },
  reinf(L('ظطذضثصغق'), ALL, 26, 94, { t: ['The Hardest Letters: ظ ط ذ ض ث ص غ ق', 'دشوارترین حروف: ظ ط ذ ض ث ص غ ق'] }),
  { kind: 'words', pool: ALL, wpm: 30, acc: 95, min: 3, wordFilter: (w) => altRatio(w, leftSet) <= 0.4 || altRatio(w, leftSet) >= 0.8, t: ['Hand Balance: Switching Smoothly', 'توازن دست‌ها: جابه‌جایی روان'] },
  { kind: 'review', pool: ALL, wpm: 26, acc: 98, t: ['Accuracy First: 98% or Repeat', 'اول دقت: ۹۸٪ یا تکرار'] },
  { kind: 'exam', pool: ALL, wpm: 32, acc: 95, t: ['Stage 4 Exam: Two-Hand Mastery', 'آزمون مرحله ۴: تسلط دو دست'] },

  // ───────────── Stage 5 · Special letters, ZWNJ & Punctuation (16)
  { kind: 'intro', keys: ['آ'], pool: pool(ALL, ['آ']), wpm: 22, acc: 94, t: ['Shift + H: آ', 'شیفت + H: «آ»'],
    learn: ['Hold the opposite-hand Shift (left pinky, because آ is on the right hand) and press آ. Shift is always pressed by the hand that is NOT typing the letter.', 'شیفت دست مخالف را نگه دارید (کوچک چپ، چون «آ» با دست راست است) و «آ» را بزنید. شیفت را همیشه دستی می‌زند که حرف را تایپ نمی‌کند.'] },
  { kind: 'intro', keys: ['ژ'], pool: pool(ALL, ['ژ']), wpm: 22, acc: 94, t: ['Shift + C: ژ', 'شیفت + C: «ژ»'] },
  { kind: 'intro', keys: ['ئ', 'ء', 'ؤ'], pool: pool(ALL, L('ئءؤ')), wpm: 22, acc: 94, t: ['Hamza Letters: ئ ء ؤ', 'حروف همزه‌دار: ئ ء ؤ'] },
  { kind: 'words', keys: ['\u200C'], pool: ALL, source: 'zwnj', allow: SENT_ALLOW, must: ['می‌', 'نمی‌'], wpm: 22, acc: 94, t: ['The Half-Space (ZWNJ) I: می‌ and نمی‌', 'نیم‌فاصله ۱: «می‌» و «نمی‌»'],
    learn: ['The half-space (ZWNJ, نیم‌فاصله) is typed with Shift + Space. It keeps letters apart without a visible gap: می‌روم، کتاب‌ها. Press Shift with the little finger, then the space bar with your thumb.', 'نیم‌فاصله با شیفت + فاصله تایپ می‌شود و حروف را بی‌شکاف از هم جدا می‌کند: می‌روم، کتاب‌ها. شیفت را با انگشت کوچک و فاصله را با شست بزنید.'] },
  { kind: 'words', keys: ['\u200C'], pool: ALL, source: 'zwnj', allow: SENT_ALLOW, wpm: 24, acc: 94, t: ['The Half-Space (ZWNJ) II: Plural & Suffixes', 'نیم‌فاصله ۲: جمع و پسوندها'] },
  { kind: 'text', pool: ALL, source: 'sentences', allow: SENT_ALLOW, must: ['\u200C'], wpm: 26, acc: 94, t: ['The Half-Space (ZWNJ) III: Sentences', 'نیم‌فاصله ۳: جمله‌ها'] },
  { kind: 'text', pool: ALL, keys: ['،', '؛'], source: 'sentences', allow: SENT_ALLOW, must: ['،', '؛'], wpm: 26, acc: 94, t: ['Persian Comma ، and Semicolon ؛', 'ویرگول «،» و نقطه‌ویرگول «؛»'] },
  { kind: 'text', pool: ALL, keys: ['؟', '!'], source: 'sentences', allow: SENT_ALLOW, must: ['؟', '!'], wpm: 26, acc: 94, t: ['Question ؟ and Exclamation !', 'علامت سؤال «؟» و تعجب «!»'] },
  { kind: 'text', pool: ALL, keys: ['«', '»'], source: 'sentences', allow: SENT_ALLOW, must: ['«', '»'], wpm: 26, acc: 94, t: ['Guillemets « » for Quotations', 'گیومه « » برای نقل‌قول'] },
  { kind: 'text', pool: ALL, keys: ['(', ')', ':'], source: 'sentences', allow: SENT_ALLOW, must: ['(', ':'], wpm: 26, acc: 94, t: ['Parentheses ( ) and Colon :', 'پرانتز ( ) و دونقطه :'] },
  { kind: 'text', pool: ALL, source: 'sentences', allow: SENT_ALLOW, wpm: 28, acc: 95, t: ['Full Sentences I', 'جمله‌های کامل ۱'] },
  { kind: 'text', pool: ALL, source: 'sentences', allow: SENT_ALLOW, wpm: 30, acc: 95, scale: 1.5, t: ['Full Sentences II: Longer Runs', 'جمله‌های کامل ۲: متن‌های بلندتر'] },
  { kind: 'text', pool: ALL, source: 'quotes', allow: SENT_ALLOW, wpm: 30, acc: 95, t: ['Poetry Lines', 'مصرع‌ها و بیت‌ها'] },
  { kind: 'text', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, wpm: 30, acc: 95, t: ['First Paragraphs', 'نخستین بندها'] },
  { kind: 'review', pool: ALL, source: 'sentences', allow: SENT_ALLOW, wpm: 30, acc: 95, t: ['Punctuation Speed Review', 'مرور سرعتی علائم نگارشی'] },
  { kind: 'exam', pool: ALL, source: 'sentences', allow: SENT_ALLOW, wpm: 32, acc: 95, t: ['Stage 5 Exam: Sentences', 'آزمون مرحله ۵: جمله‌ها'] },

  // ───────────── Stage 6 · Numbers (14)
  intro(L('۴۷'), L('۴۷'), 14, 95, { source: 'numbers' }),
  reinf(L('۴۷'), L('۴۷'), 16, 95, { source: 'numbers' }),
  intro(L('۵۶'), L('۴۷۵۶'), 15, 95, { source: 'numbers' }),
  reinf(L('۵۶'), L('۴۷۵۶'), 17, 95, { source: 'numbers' }),
  intro(L('۳۸'), L('۴۷۵۶۳۸'), 16, 95, { source: 'numbers' }),
  reinf(L('۳۸'), L('۴۷۵۶۳۸'), 18, 95, { source: 'numbers' }),
  intro(L('۲۹'), L('۴۷۵۶۳۸۲۹'), 16, 95, { source: 'numbers' }),
  reinf(L('۲۹'), L('۴۷۵۶۳۸۲۹'), 18, 95, { source: 'numbers' }),
  intro(L('۱۰'), DIG, 16, 95, { source: 'numbers' }),
  reinf(L('۱۰'), DIG, 18, 95, { source: 'numbers' }),
  { kind: 'hand', hand: 'left', pool: L('۱۲۳۴۵'), keys: [], source: 'numbers', wpm: 20, acc: 95, t: ['Left Hand Digits: ۱ ۲ ۳ ۴ ۵', 'ارقام دست چپ: ۱ ۲ ۳ ۴ ۵'] },
  { kind: 'hand', hand: 'right', pool: L('۶۷۸۹۰'), keys: [], source: 'numbers', wpm: 20, acc: 95, t: ['Right Hand Digits: ۶ ۷ ۸ ۹ ۰', 'ارقام دست راست: ۶ ۷ ۸ ۹ ۰'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'sentences', allow: NUM_ALLOW, must: DIG, wpm: 26, acc: 94, t: ['Numbers in Real Text: Dates, Prices, Phones', 'اعداد در متن واقعی: تاریخ، قیمت، تلفن'] },
  { kind: 'exam', pool: DIG, source: 'numbers', wpm: 26, acc: 95, t: ['Stage 6 Exam: Numbers', 'آزمون مرحله ۶: اعداد'] },

  // ───────────── Stage 7 · Symbols, Diacritics & Formal Writing (13)
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('!٫٬٪×')), anchors: L('شسیبتنم'), keys: L('!٫٬٪×'), source: 'symbols', wpm: 18, acc: 93, t: ['Shift + Numbers: ! ٫ ٬ ٪ ×', 'شیفت + اعداد: ! ٫ ٬ ٪ ×'] },
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('*)(ـ')), anchors: L('شسیبتنم'), keys: L('*)(ـ'), source: 'symbols', wpm: 18, acc: 93, t: ['Shift + Numbers: * ) ( ـ', 'شیفت + اعداد: * ) ( ـ'] },
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('-_=+')), anchors: L('شسیبتنم'), keys: L('-_=+'), source: 'symbols', wpm: 18, acc: 93, t: ['Hyphen, Underscore, Equals, Plus', 'خط‌تیره، زیرخط، مساوی، به‌اضافه'] },
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('[]{}')), anchors: L('شسیبتنم'), keys: L('[]{}'), source: 'symbols', wpm: 18, acc: 93, t: ['Brackets & Braces: [ ] { }', 'کروشه و آکولاد: [ ] { }'] },
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('«»<>')), anchors: L('شسیبتنم'), keys: L('«»<>'), source: 'symbols', wpm: 18, acc: 93, t: ['Guillemets & Angle Brackets: « » < >', 'گیومه و کروشهٔ زاویه‌دار: « » < >'] },
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('\u064E\u0650\u064F')), anchors: L('شسیبتنم'), keys: L('\u064E\u0650\u064F'), source: 'diacritics', must: L('\u064E\u0650\u064F'), wpm: 14, acc: 92, t: ['Vowel Marks I: زَبَر زیر پیش', 'اعراب ۱: زَبَر، زیر، پیش'] },
  { kind: 'intro', pool: pool(L('شسیبتنم'), L('\u064B\u064D\u064C\u0651\u0652')), anchors: L('شسیبتنم'), keys: L('\u064B\u064D\u064C\u0651\u0652'), source: 'diacritics', must: L('\u064B\u064D\u064C\u0651\u0652'), wpm: 14, acc: 92, t: ['Vowel Marks II: تنوین، تشدید، سکون', 'اعراب ۲: تنوین، تشدید، سکون'] },
  { kind: 'text', pool: ALL, source: 'diacritics', wpm: 14, acc: 92, scale: 1.2, t: ['Words with Full Vowel Marks', 'واژه‌های کاملاً اعراب‌گذاری‌شده'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'custom', gen: datesGen, allow: NUM_ALLOW, wpm: 24, acc: 94, t: ['Dates, Times & Phone Numbers', 'تاریخ، ساعت و شمارهٔ تلفن'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'custom', gen: pricesGen, allow: NUM_ALLOW, wpm: 24, acc: 94, t: ['Prices, Percentages & Units', 'قیمت، درصد و واحدها'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'letters', allow: NUM_ALLOW, wpm: 26, acc: 94, scale: 1.3, t: ['Formal Letters & E-mails', 'نامهٔ رسمی و ایمیل'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'sentences', allow: NUM_ALLOW, must: DIG, wpm: 28, acc: 94, scale: 1.3, t: ['Mixed Text: Words, Numbers & Symbols', 'متن ترکیبی: واژه، عدد و نماد'] },
  { kind: 'exam', pool: pool(ALL, DIG), source: 'letters', allow: NUM_ALLOW, wpm: 28, acc: 94, t: ['Stage 7 Exam: Symbols & Formal Writing', 'آزمون مرحله ۷: نمادها و نگارش رسمی'] },

  // ───────────── Stage 8 · Speed Building (10)
  { kind: 'text', pool: ALL, source: 'sentences', allow: SENT_ALLOW, wpm: 32, acc: 94, t: ['Short Sentence Sprints', 'دوی سرعت جمله‌های کوتاه'] },
  { kind: 'words', pool: ALL, max: 4, wpm: 34, acc: 94, t: ['Burst Typing: Short Fast Bursts', 'تایپ انفجاری: جهش‌های کوتاه و تند'] },
  { kind: 'words', pool: ALL, wpm: 35, acc: 94, ...listSpec(topWords(0, 300)), t: ['Everyday Words Sprint', 'دوی سرعت واژه‌های روزمره'] },
  { kind: 'words', pool: ALL, min: 6, wpm: 34, acc: 94, t: ['Long Word Flow', 'جریان واژه‌های بلند'] },
  { kind: 'review', pool: ALL, wpm: 32, acc: 98, t: ['Error-Free Runs: 98% Accuracy', 'رکوردهای بی‌خطا: دقت ۹۸٪'] },
  { kind: 'text', pool: ALL, source: 'sentences', allow: SENT_ALLOW, wpm: 36, acc: 94, scale: 1.5, t: ['Punctuation & ZWNJ at Speed', 'علائم و نیم‌فاصله با سرعت'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'sentences', allow: NUM_ALLOW, must: DIG, wpm: 34, acc: 94, t: ['Numbers & Words Together', 'اعداد و واژه‌ها با هم'] },
  { kind: 'text', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, wpm: 38, acc: 94, t: ['Paragraph Sprint', 'دوی سرعت بند'] },
  { kind: 'text', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, wpm: 38, acc: 94, scale: 2.2, t: ['Endurance: Three Minutes Without Stopping', 'استقامت: سه دقیقه بی‌توقف'] },
  { kind: 'exam', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, wpm: 42, acc: 95, t: ['Stage 8 Exam: Speed', 'آزمون مرحله ۸: سرعت'] },

  // ───────────── Stage 9 · Real Texts (5)
  { kind: 'text', pool: ALL, source: 'quotes', allow: SENT_ALLOW, wpm: 38, acc: 95, t: ['Classical Verses', 'ابیات کلاسیک'] },
  { kind: 'text', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, must: ['دهکده', 'پروانه', 'سفر'], wpm: 40, acc: 95, scale: 1.4, t: ['Stories & Reflections', 'داستان و اندیشه'] },
  { kind: 'text', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, must: ['فناوری', 'ستاره', 'صفحه‌کلید'], wpm: 40, acc: 95, scale: 1.4, t: ['Science & Technology Texts', 'متن‌های علمی و فناوری'] },
  { kind: 'text', pool: pool(ALL, DIG), source: 'letters', allow: NUM_ALLOW, wpm: 36, acc: 94, scale: 1.5, t: ['Office Writing: Letters & Reports', 'نگارش اداری: نامه و گزارش'] },
  { kind: 'text', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, wpm: 42, acc: 95, scale: 3, t: ['Long Passage Endurance', 'استقامت در متن بلند'] },

  // ───────────── Stage 10 · Master Exams (3)
  { kind: 'exam', pool: ALL, wpm: 38, acc: 95, scale: 1.5, t: ['Master Exam I: Pure Letters', 'آزمون استادی ۱: حروف خالص'] },
  { kind: 'exam', pool: pool(ALL, DIG), source: 'sentences', allow: NUM_ALLOW, wpm: 40, acc: 95, scale: 1.5, t: ['Master Exam II: Sentences, Numbers & Symbols', 'آزمون استادی ۲: جمله، عدد و نماد'] },
  { kind: 'exam', pool: ALL, source: 'paragraphs', allow: SENT_ALLOW, wpm: 46, acc: 96, scale: 2.2, t: ['Master Exam III: The Final Flight', 'آزمون استادی ۳: پرواز پایانی'] },
];
export type { DrillContext };
