import { LessonSpec } from './lessonBuilder';
import { DrillContext, joinTokens } from './drills';
import { Rng, pick } from './random';
import {
  L, Spec, altRatio, hasSameFingerPair, listGen, ngramGen, sentenceFromWords, uniq,
} from './specHelpers';
import { EN_BIGRAMS, EN_COMMON, EN_ENDINGS, EN_TRIGRAMS } from './wordsEn';

const U = (k: string) => (/[a-z]/.test(k) ? k.toUpperCase() : k);
const names = (keys: string[]) => keys.map(U).join(' · ');

const intro = (keys: string[], pool: string[], wpm: number, acc = 95, o: Partial<LessonSpec> = {}): Spec => ({
  kind: 'intro', keys, pool, wpm, acc,
  t: [`New Keys: ${names(keys)}`, `کلیدهای تازه: ${names(keys)}`], ...o,
});
const reinf = (keys: string[], pool: string[], wpm: number, acc = 95, o: Partial<LessonSpec> = {}): Spec => ({
  kind: 'reinforce', keys, pool, wpm, acc,
  t: [`Deep Drill: ${names(keys)}`, `تمرین عمیق: ${names(keys)}`], ...o,
});

const HOME = L('asdfghjkl;');
const HOME_L = L('asdfghjkl');
const TOP = L('qwertyuiop');
const BOT = L('zxcvbnm,./');
const LETTERS = L('abcdefghijklmnopqrstuvwxyz');
const LEFT15 = L('qwertasdfgzxcvb');
const RIGHT11 = L('yuiophjklnm');
const leftSet = new Set(LEFT15);

const FINGER: Record<string, string> = {};
const assign = (f: string, s: string) => L(s).forEach((c) => (FINGER[c] = f));
assign('lp', 'qaz'); assign('lr', 'wsx'); assign('lm', 'edc'); assign('li', 'rfvtgb');
assign('ri', 'yhnujm'); assign('rm', 'ik'); assign('rr', 'ol'); assign('rp', 'p');

const pool = (...parts: string[][]) => uniq(parts.flat());
const P1 = pool(L('fj'));
const P2 = pool(P1, L('dk'));
const P3 = pool(P2, L('sl'));
const P4 = pool(P3, L('a;'));
const P5 = pool(P4, L('gh'));
const TOPSTEP = (add: string) => pool(HOME, L(add));

const NAMES = 'Anna Ben Carl Dana Eric Fiona Gabe Hannah Ivan Julia Kevin Laura Mark Nina Oscar Paula Quinn Rosa Sam Tina Uma Victor Wendy Xavier Yara Zack Paris London Rome Madrid Berlin Tokyo Cairo Oslo Lima Delhi Vienna Prague Dublin Boston Dallas Austin'.split(' ');
const EMAILS = ['anna@example.com', 'ben_smith@mail.org', 'www.example.com/learn', 'https://pilla.app/lessons', 'sam-lee@work.net', 'user.name@site.io', 'http://example.org/a/b?x=1', 'info@my-shop.co.uk', 'support@pilla.app', 'https://docs.example.com/guide/start'];
const pangrams = ['the quick brown fox jumps over the lazy dog', 'pack my box with five dozen liquor jugs', 'how vexingly quick daft zebras jump', 'sphinx of black quartz judge my vow', 'jackdaws love my big sphinx of quartz', 'the five boxing wizards jump quickly', 'we promptly judged antique ivory buckles for the next prize'];

const capsGen = (starts: string[]) => (rng: Rng, len: number, ctx: DrillContext) => {
  const set = new Set(starts);
  const words = ctx.words.filter((w) => w.length >= 3 && w.length <= 8 && set.has(w[0]));
  const list = words.map((w) => w[0].toUpperCase() + w.slice(1));
  return joinTokens(rng, () => pick(rng, list), len);
};
const mathGen = (rng: Rng, len: number) =>
  joinTokens(rng, () => {
    const a = 'abcxyz'[Math.floor(rng() * 6)];
    const b = 'abcxyz'[Math.floor(rng() * 6)];
    const op = pick(rng, ['+', '-', '*', '/', '=', '%']);
    const n = 1 + Math.floor(rng() * 99);
    return pick(rng, [`${a}${op}${b}`, `(${a}${op}${n})`, `${n}${op}${n}`, `${a}=${n}${op}${b}`, `[${a}${op}${b}]`]);
  }, len);

const topWords = (from: number, to: number) => EN_COMMON.slice(from, to).filter((w) => w.length >= 2);
const listSpec = (list: string[]) => ({ gen: listGen(list) });

export const SPECS_EN: Spec[] = [
  // ───────────── Stage 0 · Foundations (3)
  { kind: 'foundation', keys: ['f', 'j'], pool: P1, wpm: 8, acc: 90,
    t: ['Sit Right & Find F and J', 'نشستن درست و یافتن F و J'],
    sub: ['Posture, hand position and the two tactile bumps', 'نشستن، جایگاه دست‌ها و دو برجستگی لمسی'],
    learn: ['Sit upright, feet flat, elbows near 90°, wrists floating above the desk. Put your LEFT index finger on F and your RIGHT index finger on J — feel the small ridges. The other fingers rest on A S D and K L ; .',
            'صاف بنشینید، پاها روی زمین، آرنج‌ها نزدیک ۹۰ درجه و مچ‌ها آزاد بالای میز. انگشت اشارهٔ چپ را روی F و اشارهٔ راست را روی J بگذارید و برجستگی‌ها را حس کنید. بقیهٔ انگشتان روی A S D و K L ; می‌مانند.'] },
  { kind: 'foundation', keys: [' '], pool: P1, wpm: 10, acc: 92,
    t: ['Thumbs & the Space Bar', 'شست‌ها و کلید فاصله'],
    sub: ['One thumb, one clean tap, no pause before the space', 'یک شست، یک ضربهٔ تمیز، بدون مکث پیش از فاصله'],
    learn: ['Choose one thumb (usually the one on your stronger side) and use it for every space. Tap the space bar with the side of the thumb tip. The index fingers stay on F and J.',
            'یک شست را (معمولاً سمت قوی‌تر) برای همهٔ فاصله‌ها انتخاب کنید و با لبهٔ نوک شست ضربه بزنید. اشاره‌ها روی F و J می‌مانند.'] },
  { kind: 'foundation', keys: [], pool: P1, wpm: 12, acc: 93,
    t: ['Eyes on the Screen & Even Rhythm', 'نگاه به صفحه و ریتم یکنواخت'],
    sub: ['Build the habit that makes everything else possible', 'ساختن عادتی که همهٔ چیز به آن وابسته است'],
    learn: ['From now on, never look at the keyboard. If you feel lost, feel for the bumps on F and J. Type with an even beat — like a slow metronome — and let speed come later.',
            'از این پس هرگز به صفحه‌کلید نگاه نکنید. اگر گم شدید، برجستگی F و J را لمس کنید. با ضرب یکنواخت — مثل مترونوم آهسته — تایپ کنید و سرعت را به بعد بسپارید.'] },

  // ───────────── Stage 1 · Home Row (18)
  intro(L('dk'), P2, 12),
  reinf(L('dk'), P2, 14),
  intro(L('sl'), P3, 15),
  reinf(L('sl'), P3, 16),
  intro(['a', ';'], P4, 16),
  reinf(['a', ';'], P4, 18),
  intro(L('gh'), P5, 18),
  reinf(L('gh'), P5, 20),
  { kind: 'hand', hand: 'left', pool: L('asdfg'), keys: [], wpm: 20, acc: 95,
    t: ['Left Hand Alone: A S D F G', 'فقط دست چپ: A S D F G'] },
  { kind: 'hand', hand: 'right', pool: L('hjkl;'), keys: [], wpm: 20, acc: 95,
    t: ['Right Hand Alone: H J K L ;', 'فقط دست راست: H J K L ;'] },
  { kind: 'words', pool: HOME_L, wpm: 22, acc: 95, wordFilter: (w) => altRatio(w, leftSet) >= 0.5,
    t: ['Alternating Hands on the Home Row', 'دست‌های متناوب روی ردیف مبنا'] },
  reinf(L('as'), HOME, 20, 95, { t: ['Weak Fingers I: Left Pinky & Ring', 'انگشتان ضعیف ۱: کوچک و انگشتری چپ'], hand: 'left' }),
  reinf(['l', ';'], HOME, 20, 95, { t: ['Weak Fingers II: Right Ring & Pinky', 'انگشتان ضعیف ۲: انگشتری و کوچک راست'], hand: 'right' }),
  { kind: 'words', pool: HOME_L, wpm: 22, acc: 95, min: 3, t: ['Home Row Words I', 'واژه‌های ردیف مبنا ۱'] },
  { kind: 'words', pool: HOME_L, wpm: 24, acc: 95, min: 4, t: ['Home Row Words II: Longer', 'واژه‌های ردیف مبنا ۲: بلندتر'] },
  { kind: 'review', pool: HOME, wpm: 24, acc: 96, t: ['Home Row Rhythm Lab', 'آزمایشگاه ریتم ردیف مبنا'] },
  { kind: 'review', pool: HOME, wpm: 25, acc: 96, t: ['Home Row Mixed Review', 'مرور ترکیبی ردیف مبنا'] },
  { kind: 'exam', pool: HOME_L, wpm: 26, acc: 96, t: ['Stage 1 Exam: Home Row', 'آزمون مرحله ۱: ردیف مبنا'] },

  // ───────────── Stage 2 · Top Row (24)
  intro(L('ei'), TOPSTEP('ei'), 16),
  reinf(L('ei'), TOPSTEP('ei'), 18),
  intro(L('ru'), TOPSTEP('eiru'), 17),
  reinf(L('ru'), TOPSTEP('eiru'), 19),
  intro(L('ty'), TOPSTEP('eiruty'), 17),
  reinf(L('ty'), TOPSTEP('eiruty'), 19),
  intro(L('wo'), TOPSTEP('eirutywo'), 18),
  reinf(L('wo'), TOPSTEP('eirutywo'), 20),
  intro(L('qp'), pool(HOME, TOP), 18),
  reinf(L('qp'), pool(HOME, TOP), 20),
  { kind: 'hand', hand: 'left', pool: L('qwertasdfg'), keys: [], wpm: 22, acc: 95, t: ['Left Hand: Top & Home Rows', 'دست چپ: ردیف بالا و مبنا'] },
  { kind: 'hand', hand: 'right', pool: L('yuiophjkl'), keys: [], wpm: 22, acc: 95, t: ['Right Hand: Top & Home Rows', 'دست راست: ردیف بالا و مبنا'] },
  { kind: 'words', pool: pool(HOME_L, TOP), wpm: 22, acc: 95, min: 3, max: 6, t: ['Top & Home Words I', 'واژه‌های ردیف بالا و مبنا ۱'] },
  { kind: 'words', pool: pool(HOME_L, TOP), wpm: 24, acc: 95, min: 4, t: ['Top & Home Words II', 'واژه‌های ردیف بالا و مبنا ۲'] },
  { kind: 'words', pool: pool(HOME_L, TOP), wpm: 24, acc: 95, wordFilter: (w) => altRatio(w, leftSet) >= 0.6, t: ['Alternating Hands: Top Row', 'دست‌های متناوب: ردیف بالا'] },
  { kind: 'review', pool: pool(HOME, TOP), wpm: 24, acc: 96, t: ['Reach & Return Home Discipline', 'انضباط رسیدن و بازگشت به خانه'],
    sub: ['After every reach, the finger comes back to its home key', 'پس از هر کشش، انگشت به خانه برمی‌گردد'] },
  reinf(L('qw'), pool(HOME, TOP), 22, 95, { t: ['Weak Fingers III: Left Pinky & Ring (Q W)', 'انگشتان ضعیف ۳: کوچک و انگشتری چپ (Q W)'], hand: 'left' }),
  reinf(L('op'), pool(HOME, TOP), 22, 95, { t: ['Weak Fingers IV: Right Ring & Pinky (O P)', 'انگشتان ضعیف ۴: انگشتری و کوچک راست (O P)'], hand: 'right' }),
  { kind: 'words', pool: TOP, wpm: 22, acc: 95, min: 3, t: ['Typewriter Words: Top Row Only', 'واژه‌های ماشین تحریر: فقط ردیف بالا'] },
  { kind: 'words', pool: pool(HOME_L, TOP), wpm: 26, acc: 95, max: 4, t: ['Short Words Sprint', 'دوی سرعت واژه‌های کوتاه'] },
  { kind: 'words', pool: pool(HOME_L, TOP), wpm: 26, acc: 95, min: 6, t: ['Longer Words (6+ letters)', 'واژه‌های بلندتر (۶ حرف به بالا)'] },
  { kind: 'review', pool: pool(HOME_L, TOP), wpm: 26, acc: 96, t: ['Top Row Speed Ladder', 'نردبان سرعت ردیف بالا'] },
  { kind: 'review', pool: pool(HOME_L, TOP), wpm: 27, acc: 96, t: ['Top Row Mixed Review', 'مرور ترکیبی ردیف بالا'] },
  { kind: 'exam', pool: pool(HOME_L, TOP), wpm: 28, acc: 96, t: ['Stage 2 Exam: Top Row', 'آزمون مرحله ۲: ردیف بالا'] },

  // ───────────── Stage 3 · Bottom Row (24)
  intro(['c', ','], pool(HOME, TOP, L('c,')), 18),
  reinf(['c', ','], pool(HOME, TOP, L('c,')), 20),
  intro(L('vm'), pool(HOME, TOP, L('c,vm')), 18),
  reinf(L('vm'), pool(HOME, TOP, L('c,vm')), 20),
  intro(L('bn'), pool(HOME, TOP, L('c,vmbn')), 18),
  reinf(L('bn'), pool(HOME, TOP, L('c,vmbn')), 20),
  intro(['x', '.'], pool(HOME, TOP, L('c,vmbnx.')), 18),
  reinf(['x', '.'], pool(HOME, TOP, L('c,vmbnx.')), 20),
  intro(['z', '/'], pool(HOME, TOP, BOT), 18),
  reinf(['z', '/'], pool(HOME, TOP, BOT), 20),
  { kind: 'hand', hand: 'left', pool: LEFT15, keys: [], wpm: 24, acc: 95, t: ['Left Hand: All 15 Letters', 'دست چپ: هر ۱۵ حرف'] },
  { kind: 'hand', hand: 'right', pool: RIGHT11, keys: [], wpm: 24, acc: 95, t: ['Right Hand: All Letters', 'دست راست: همهٔ حروف'] },
  { kind: 'words', pool: L('zxcvbnm'), wpm: 22, acc: 95, min: 2, t: ['Bottom Row Words I', 'واژه‌های ردیف پایین ۱'] },
  { kind: 'words', pool: pool(HOME_L, L('zxcvbnm')), wpm: 24, acc: 95, min: 3, t: ['Bottom & Home Words II', 'واژه‌های ردیف پایین و مبنا ۲'] },
  { kind: 'review', pool: pool(LETTERS, L(',.')), wpm: 24, acc: 95, allow: ',. ', source: 'custom',
    gen: (rng, len, ctx) => sentenceFromWords(rng, ctx, LETTERS, len, { commas: true }),
    t: ['Commas & Periods in Sentences', 'ویرگول و نقطه در جمله‌ها'] },
  reinf(L('zx'), pool(HOME, TOP, BOT), 24, 95, { t: ['Weak Fingers V: Left Pinky & Ring (Z X)', 'انگشتان ضعیف ۵: کوچک و انگشتری چپ (Z X)'], hand: 'left' }),
  reinf(['.', '/'], pool(HOME, TOP, BOT), 24, 95, { t: ['Weak Fingers VI: Right Ring & Pinky (. /)', 'انگشتان ضعیف ۶: انگشتری و کوچک راست (. /)'], hand: 'right' }),
  reinf(L('bnytgh'), pool(HOME, TOP, BOT), 24, 95, { t: ['Index Finger Stretch: The Middle Columns', 'کشش انگشتان اشاره: ستون‌های میانی'] }),
  { kind: 'words', pool: LETTERS, wpm: 26, acc: 95, min: 3, max: 6, t: ['All-Letter Words I', 'واژه‌های همهٔ حروف ۱'] },
  { kind: 'words', pool: LETTERS, wpm: 28, acc: 95, min: 5, t: ['All-Letter Words II', 'واژه‌های همهٔ حروف ۲'] },
  { kind: 'review', pool: LETTERS, wpm: 26, acc: 95, ...listSpec(pangrams), t: ['Pangrams: Every Letter in One Line', 'جمله‌های پان‌گرام: همهٔ حروف در یک سطر'] },
  { kind: 'review', pool: LETTERS, wpm: 28, acc: 96, t: ['Alphabet Speed Ladder', 'نردبان سرعت الفبا'] },
  { kind: 'review', pool: pool(LETTERS, L(',.')), wpm: 28, acc: 96, t: ['Full Alphabet Review', 'مرور کامل الفبا'] },
  { kind: 'exam', pool: LETTERS, wpm: 30, acc: 96, t: ['Stage 3 Exam: Every Letter', 'آزمون مرحله ۳: همهٔ حروف'] },

  // ───────────── Stage 4 · Two-Hand Mastery (20)
  { kind: 'hand', hand: 'left', pool: LEFT15, wpm: 26, acc: 96, min: 3, t: ['Left-Hand-Only Words I', 'واژه‌های فقط دست چپ ۱'] },
  { kind: 'hand', hand: 'left', pool: LEFT15, wpm: 28, acc: 96, min: 4, t: ['Left-Hand-Only Words II', 'واژه‌های فقط دست چپ ۲'] },
  { kind: 'hand', hand: 'right', pool: RIGHT11, wpm: 26, acc: 96, min: 3, t: ['Right-Hand-Only Words I', 'واژه‌های فقط دست راست ۱'] },
  { kind: 'hand', hand: 'right', pool: RIGHT11, wpm: 28, acc: 96, min: 4, t: ['Right-Hand-Only Words II', 'واژه‌های فقط دست راست ۲'] },
  { kind: 'words', pool: LETTERS, wpm: 30, acc: 96, min: 4, wordFilter: (w) => altRatio(w, leftSet) >= 0.75, t: ['Perfect Alternation: Hands as a Drum Roll', 'تناوب کامل: دست‌ها مثل ضرب طبل'] },
  { kind: 'words', pool: LETTERS, wpm: 28, acc: 96, min: 3, wordFilter: (w) => hasSameFingerPair(w, FINGER), t: ['Same-Finger Pairs (ed, un, ce, my…)', 'جفت‌حرف‌های هم‌انگشت (ed, un, ce, my…)'] },
  { kind: 'words', pool: LETTERS, wpm: 30, acc: 96, gen: ngramGen(EN_BIGRAMS), t: ['The 40 Most Common Letter Pairs', 'چهل جفت‌حرف پرکاربرد'] },
  { kind: 'words', pool: LETTERS, wpm: 30, acc: 96, gen: ngramGen(EN_TRIGRAMS), t: ['Common Three-Letter Chunks', 'تکه‌های سه‌حرفی پرکاربرد'] },
  { kind: 'words', pool: LETTERS, wpm: 30, acc: 96, gen: ngramGen(EN_ENDINGS), t: ['Word Endings: -ing, -tion, -ed, -ly', 'پایان واژه‌ها: -ing، -tion، -ed، -ly'] },
  { kind: 'words', pool: LETTERS, wpm: 32, acc: 96, max: 3, t: ['Tiny Words (2–3 letters)', 'واژه‌های ریز (۲ تا ۳ حرف)'] },
  { kind: 'words', pool: LETTERS, wpm: 32, acc: 96, min: 5, max: 6, t: ['Medium Words (5–6 letters)', 'واژه‌های میانه (۵ تا ۶ حرف)'] },
  { kind: 'words', pool: LETTERS, wpm: 32, acc: 96, min: 7, t: ['Long Words (7+ letters)', 'واژه‌های بلند (۷ حرف به بالا)'] },
  { kind: 'words', pool: LETTERS, wpm: 32, acc: 96, ...listSpec(topWords(0, 100)), t: ['The 100 Most Common Words I', 'صد واژهٔ پرکاربرد ۱'] },
  { kind: 'words', pool: LETTERS, wpm: 33, acc: 96, ...listSpec(topWords(100, 220)), t: ['The 100 Most Common Words II', 'صد واژهٔ پرکاربرد ۲'] },
  { kind: 'words', pool: LETTERS, wpm: 34, acc: 96, ...listSpec(topWords(220, 600)), t: ['Common Words III: Up to 600', 'واژه‌های پرکاربرد ۳: تا ۶۰۰'] },
  { kind: 'review', pool: LETTERS, wpm: 32, acc: 96, t: ['Metronome Rhythm: Same Beat, Every Key', 'ریتم مترونوم: یک ضرب برای هر کلید'] },
  reinf(L('qzxjvbpk'), LETTERS, 28, 95, { t: ['The Hardest Letters: Q Z X J V B P K', 'دشوارترین حروف: Q Z X J V B P K'] }),
  { kind: 'words', pool: LETTERS, wpm: 32, acc: 96, min: 4, wordFilter: (w) => altRatio(w, leftSet) <= 0.4 || altRatio(w, leftSet) >= 0.8, t: ['Hand Balance: Switching Smoothly', 'توازن دست‌ها: جابه‌جایی روان'] },
  { kind: 'review', pool: LETTERS, wpm: 28, acc: 98, t: ['Accuracy First: 98% or Repeat', 'اول دقت: ۹۸٪ یا تکرار'] },
  { kind: 'exam', pool: LETTERS, wpm: 34, acc: 96, t: ['Stage 4 Exam: Two-Hand Mastery', 'آزمون مرحله ۴: تسلط دو دست'] },

  // ───────────── Stage 5 · Shift, Capitals & Punctuation (16)
  { kind: 'words', hand: 'left', pool: LETTERS, keys: ['Shift'], wpm: 26, acc: 95, caps: true, source: 'custom',
    gen: capsGen(L('jklhyuiopnm')),
    t: ['Left Shift + Right-Hand Capitals', 'شیفت چپ + حروف بزرگ دست راست'],
    learn: ['Hold LEFT Shift with your left pinky while the right hand types a capital: J K L H Y U I O P N M. Release Shift at once and return the pinky to A.', 'شیفت چپ را با کوچک چپ نگه دارید و با دست راست حرف بزرگ بزنید: J K L H Y U I O P N M. بلافاصله رها کنید و کوچک را به A برگردانید.'] },
  { kind: 'words', hand: 'right', pool: LETTERS, keys: ['Shift'], wpm: 26, acc: 95, caps: true, source: 'custom',
    gen: capsGen(LEFT15),
    t: ['Right Shift + Left-Hand Capitals', 'شیفت راست + حروف بزرگ دست چپ'],
    learn: ['Hold RIGHT Shift with your right pinky while the left hand types a capital: Q W E R T A S D F G Z X C V B. The rule: Shift is always pressed by the opposite hand.', 'شیفت راست را با کوچک راست نگه دارید و با دست چپ حرف بزرگ بزنید. قاعده: شیفت را همیشه دست مخالف می‌زند.'] },
  { kind: 'text', pool: LETTERS, source: 'sentences', caps: true, allow: '., ', wpm: 28, acc: 96, t: ['Capitals at the Start of Sentences', 'حروف بزرگ در آغاز جمله'] },
  { kind: 'text', pool: LETTERS, source: 'custom', caps: true, gen: listGen(NAMES), wpm: 28, acc: 96, t: ['Names & Places', 'نام‌ها و مکان‌ها'] },
  { kind: 'words', pool: LETTERS, keys: ['Caps'], caps: true, source: 'custom', wpm: 28, acc: 96,
    gen: (rng, len, ctx) => joinTokens(rng, () => pick(rng, ctx.words.filter((w) => w.length >= 3 && w.length <= 8)).toUpperCase(), len),
    t: ['Caps Lock & ALL CAPS', 'کپس‌لاک و حروف کاملاً بزرگ'] },
  { kind: 'text', pool: LETTERS, source: 'sentences', caps: true, allow: '., ', must: [','], wpm: 30, acc: 96, t: ['Commas & Periods', 'ویرگول و نقطه'] },
  { kind: 'text', pool: LETTERS, keys: ["'", '"'], source: 'sentences', caps: true, allow: '.,?!\'"', must: ["'", '"'], wpm: 30, acc: 96, t: ['Apostrophes & Quotation Marks', 'آپوستروف و گیومهٔ انگلیسی'] },
  { kind: 'text', pool: LETTERS, keys: [':', ';'], source: 'sentences', caps: true, allow: '.,:; ', must: [':', ';'], wpm: 30, acc: 96, t: ['Colon & Semicolon', 'دونقطه و نقطه‌ویرگول'] },
  { kind: 'text', pool: LETTERS, keys: ['?', '!'], source: 'sentences', caps: true, allow: '.,?!\'" ', must: ['?', '!'], wpm: 30, acc: 96, t: ['Question & Exclamation Marks', 'علامت سؤال و تعجب'] },
  { kind: 'text', pool: LETTERS, keys: ['-'], source: 'sentences', caps: true, allow: '.,-', must: ['-'], wpm: 30, acc: 96, t: ['Hyphens & Compound Words', 'خط‌تیره و واژه‌های مرکب'] },
  { kind: 'text', pool: LETTERS, keys: ['"'], source: 'sentences', caps: true, allow: '.,?!\'":;-', must: ['"'], wpm: 32, acc: 96, t: ['Dialogue & Quotations', 'گفت‌وگو و نقل‌قول'] },
  { kind: 'text', pool: LETTERS, source: 'sentences', caps: true, allow: '.,?!\'":;-', wpm: 32, acc: 96, t: ['Full Sentences I', 'جمله‌های کامل ۱'] },
  { kind: 'text', pool: LETTERS, source: 'sentences', caps: true, allow: '.,?!\'":;-', wpm: 34, acc: 96, scale: 1.5, t: ['Full Sentences II: Longer Runs', 'جمله‌های کامل ۲: متن‌های بلندتر'] },
  { kind: 'text', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', wpm: 34, acc: 96, t: ['First Paragraphs', 'نخستین بندها'] },
  { kind: 'review', pool: LETTERS, source: 'sentences', caps: true, allow: '.,?!\'":;-', wpm: 34, acc: 96, t: ['Capitals & Punctuation Speed Review', 'مرور سرعتی حروف بزرگ و علائم'] },
  { kind: 'exam', pool: LETTERS, source: 'sentences', caps: true, allow: '.,?!\'":;-', wpm: 36, acc: 96, t: ['Stage 5 Exam: Sentences', 'آزمون مرحله ۵: جمله‌ها'] },

  // ───────────── Stage 6 · Numbers (14)
  intro(L('47'), L('47'), 14, 95, { source: 'numbers' }),
  reinf(L('47'), L('47'), 16, 95, { source: 'numbers' }),
  intro(L('56'), L('4756'), 15, 95, { source: 'numbers' }),
  reinf(L('56'), L('4756'), 17, 95, { source: 'numbers' }),
  intro(L('38'), L('475638'), 16, 95, { source: 'numbers' }),
  reinf(L('38'), L('475638'), 18, 95, { source: 'numbers' }),
  intro(L('29'), L('47563829'), 16, 95, { source: 'numbers' }),
  reinf(L('29'), L('47563829'), 18, 95, { source: 'numbers' }),
  intro(L('10'), L('1234567890'), 16, 95, { source: 'numbers' }),
  reinf(L('10'), L('1234567890'), 18, 95, { source: 'numbers' }),
  { kind: 'hand', hand: 'left', pool: L('12345'), keys: [], source: 'numbers', wpm: 20, acc: 95, t: ['Left Hand Digits: 1 2 3 4 5', 'ارقام دست چپ: 1 2 3 4 5'] },
  { kind: 'hand', hand: 'right', pool: L('67890'), keys: [], source: 'numbers', wpm: 20, acc: 95, t: ['Right Hand Digits: 6 7 8 9 0', 'ارقام دست راست: 6 7 8 9 0'] },
  { kind: 'text', pool: pool(LETTERS, L('0123456789')), source: 'sentences', caps: true, allow: '., ?!\'":;-0123456789$%', must: L('0123456789'), wpm: 28, acc: 95, t: ['Numbers in Real Text: Dates, Prices, Phones', 'اعداد در متن واقعی: تاریخ، قیمت، تلفن'] },
  { kind: 'exam', pool: L('0123456789'), source: 'numbers', wpm: 28, acc: 96, t: ['Stage 6 Exam: Numbers', 'آزمون مرحله ۶: اعداد'] },

  // ───────────── Stage 7 · Symbols & Code (13)
  { kind: 'intro', pool: pool(L('asdfjkl'), L('!@#$%')), anchors: L('asdfjkl'), keys: L('!@#$%'), source: 'symbols', wpm: 18, acc: 94, t: ['Shift + Numbers: ! @ # $ %', 'شیفت + اعداد: ! @ # $ %'] },
  { kind: 'intro', pool: pool(L('asdfjkl'), L('^&*()')), anchors: L('asdfjkl'), keys: L('^&*()'), source: 'symbols', wpm: 18, acc: 94, t: ['Shift + Numbers: ^ & * ( )', 'شیفت + اعداد: ^ & * ( )'] },
  { kind: 'intro', pool: pool(L('asdfjkl'), L('-_=+')), anchors: L('asdfjkl'), keys: L('-_=+'), source: 'symbols', wpm: 18, acc: 94, t: ['Hyphen, Underscore, Equals, Plus', 'خط‌تیره، زیرخط، مساوی، به‌اضافه'] },
  { kind: 'intro', pool: pool(L('asdfjkl'), L('[]{}')), anchors: L('asdfjkl'), keys: L('[]{}'), source: 'symbols', wpm: 18, acc: 94, t: ['Brackets & Braces: [ ] { }', 'کروشه و آکولاد: [ ] { }'] },
  { kind: 'intro', pool: pool(L('asdfjkl'), L('<>/?')), anchors: L('asdfjkl'), keys: L('<>/?'), source: 'symbols', wpm: 18, acc: 94, t: ['Angle Brackets, Slash & Question Mark', 'کروشه‌های زاویه‌دار، اسلش و علامت سؤال'] },
  { kind: 'intro', pool: pool(L('asdfjkl'), L('\'"`\\|~')), anchors: L('asdfjkl'), keys: L('\'"`\\|~'), source: 'symbols', wpm: 18, acc: 94, t: ['Quotes, Backtick, Backslash, Pipe, Tilde', 'گیومه، بک‌تیک، بک‌اسلش، پایپ، تیلدا'] },
  { kind: 'text', pool: LETTERS, source: 'custom', allow: '@./:_-?=0123456789', gen: listGen(EMAILS), wpm: 24, acc: 95, t: ['E-mail Addresses & Web URLs', 'نشانی ایمیل و وب'] },
  { kind: 'text', pool: pool(L('abcxyz'), L('0123456789+-*/=%()[]')), source: 'custom', gen: mathGen, wpm: 24, acc: 95, t: ['Math & Operators', 'ریاضی و عملگرها'] },
  { kind: 'text', pool: LETTERS, source: 'code', caps: true, allow: '(){}[]=<>;,.:"\'!&|+-*/_%0123456789`$?#', must: ['{', '=>', ';'], wpm: 26, acc: 95, scale: 1.3, t: ['Code I: JavaScript & TypeScript', 'کد ۱: جاوااسکریپت و تایپ‌اسکریپت'] },
  { kind: 'text', pool: LETTERS, source: 'code', caps: true, allow: '(){}[]=<>;,.:"\'!&|+-*/_%0123456789`$?#', must: ['def ', 'range', 'print', 'class'], wpm: 26, acc: 95, scale: 1.3, t: ['Code II: Python', 'کد ۲: پایتون'] },
  { kind: 'text', pool: LETTERS, source: 'code', caps: true, allow: '(){}[]=<>;,.:"\'!&|+-*/_%0123456789`$?#~', must: ['<', 'SELECT', '{"', 'git', 'cd '], wpm: 26, acc: 95, scale: 1.3, t: ['Code III: HTML, CSS, JSON, SQL & Shell', 'کد ۳: HTML، CSS، JSON، SQL و شل'] },
  { kind: 'review', pool: pool(L('asdfjkl'), L('!@#$%^&*()-_=+[]{}<>/?\'"`\\|~')), anchors: L('asdfjkl'), keys: L('!@#$%^&*()-_=+[]{}<>/?\'"`\\|~'), source: 'symbols', wpm: 24, acc: 94, t: ['Every Symbol Review', 'مرور همهٔ نمادها'] },
  { kind: 'exam', pool: LETTERS, source: 'code', caps: true, allow: '(){}[]=<>;,.:"\'!&|+-*/_%0123456789`$?#~', wpm: 28, acc: 95, t: ['Stage 7 Exam: Symbols & Code', 'آزمون مرحله ۷: نمادها و کد'] },

  // ───────────── Stage 8 · Speed Building (10)
  { kind: 'text', pool: LETTERS, source: 'sentences', caps: true, allow: '.,?!\'":;-', wpm: 34, acc: 95, t: ['Short Sentence Sprints', 'دوی سرعت جمله‌های کوتاه'] },
  { kind: 'words', pool: LETTERS, max: 5, wpm: 36, acc: 95, t: ['Burst Typing: Short Fast Bursts', 'تایپ انفجاری: جهش‌های کوتاه و تند'] },
  { kind: 'words', pool: LETTERS, wpm: 38, acc: 95, ...listSpec(topWords(0, 300)), t: ['Common Words Sprint', 'دوی سرعت واژه‌های پرکاربرد'] },
  { kind: 'words', pool: LETTERS, min: 6, wpm: 36, acc: 95, t: ['Long Word Flow', 'جریان واژه‌های بلند'] },
  { kind: 'review', pool: LETTERS, wpm: 34, acc: 98, t: ['Error-Free Runs: 98% Accuracy', 'رکوردهای بی‌خطا: دقت ۹۸٪'] },
  { kind: 'text', pool: LETTERS, source: 'sentences', caps: true, allow: '.,?!\'":;-', wpm: 38, acc: 95, scale: 1.5, t: ['Capitals & Punctuation at Speed', 'حروف بزرگ و علائم با سرعت'] },
  { kind: 'text', pool: pool(LETTERS, L('0123456789')), source: 'sentences', caps: true, allow: '., ?!\'":;-0123456789$%&#@()+=/', must: L('0123456789'), wpm: 36, acc: 95, t: ['Numbers & Words Together', 'اعداد و واژه‌ها با هم'] },
  { kind: 'text', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', wpm: 40, acc: 95, t: ['Paragraph Sprint', 'دوی سرعت بند'] },
  { kind: 'text', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', wpm: 40, acc: 95, scale: 2.2, t: ['Endurance: Three Minutes Without Stopping', 'استقامت: سه دقیقه بی‌توقف'] },
  { kind: 'exam', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', wpm: 45, acc: 96, t: ['Stage 8 Exam: Speed', 'آزمون مرحله ۸: سرعت'] },

  // ───────────── Stage 9 · Real Texts (5)
  { kind: 'text', pool: LETTERS, source: 'quotes', caps: true, allow: '.,?!\'":;-', wpm: 40, acc: 96, t: ['Famous Quotes', 'جمله‌های ماندگار'] },
  { kind: 'text', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', must: ['village', 'butterfly', 'journey'], wpm: 42, acc: 96, scale: 1.4, t: ['Stories & Reflections', 'داستان و اندیشه'] },
  { kind: 'text', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', must: ['Technology', 'Stars', 'keyboard'], wpm: 42, acc: 96, scale: 1.4, t: ['Science & Technology Texts', 'متن‌های علمی و فناوری'] },
  { kind: 'text', pool: LETTERS, source: 'code', caps: true, allow: '(){}[]=<>;,.:"\'!&|+-*/_%0123456789`$?#~', wpm: 36, acc: 95, scale: 1.5, t: ['Programmer\'s Mix: Code Lines', 'ترکیب برنامه‌نویس: خطوط کد'] },
  { kind: 'text', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', wpm: 45, acc: 96, scale: 3, t: ['Long Passage Endurance', 'استقامت در متن بلند'] },

  // ───────────── Stage 10 · Master Exams (3)
  { kind: 'exam', pool: LETTERS, wpm: 40, acc: 96, scale: 1.5, t: ['Master Exam I: Pure Letters', 'آزمون استادی ۱: حروف خالص'] },
  { kind: 'exam', pool: pool(LETTERS, L('0123456789')), source: 'sentences', caps: true, allow: '., ?!\'":;-0123456789$%&#@()+=/', wpm: 42, acc: 96, scale: 1.5, t: ['Master Exam II: Sentences, Numbers & Symbols', 'آزمون استادی ۲: جمله، عدد و نماد'] },
  { kind: 'exam', pool: LETTERS, source: 'paragraphs', caps: true, allow: '.,?!\'":;-', wpm: 50, acc: 97, scale: 2.2, t: ['Master Exam III: The Final Flight', 'آزمون استادی ۳: پرواز پایانی'] },
];
