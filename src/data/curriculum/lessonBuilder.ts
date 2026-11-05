import { Lesson, LessonHand, LessonKind, LessonStep } from '../../types/curriculum';
import { FingerType, KeyboardLayoutType, Language } from '../../types/typing';
import { FINGER_COLORS, findKeyForChar } from '../../utils/fingerMapping';
import { FINGER_TIPS, FREE_SUFFIX, KIND_DEFAULTS, ROLE_COPY } from './copy';
import {
  DrillContext,
  digitDrill,
  fits,
  groupDrill,
  isolateDrill,
  joinTokens,
  makeContext,
  pairDrill,
  symbolDrill,
  textDrill,
  wordDrill,
} from './drills';
import { Rng, makeRng, pick } from './random';
import { STAGE_LESSON_COUNTS, TOTAL_LESSONS_PER_TRACK } from './stages';
import { EN_CODE, EN_PARAGRAPHS, EN_QUOTES, EN_SENTENCES } from './textsEn';
import { FA_DIACRITIC_WORDS, FA_LETTERS, FA_PARAGRAPHS, FA_QUOTES, FA_SENTENCES } from './textsFa';
import { FA_ZWNJ_WORDS } from './wordsFa';

export type TextSource =
  | 'words'
  | 'sentences'
  | 'paragraphs'
  | 'quotes'
  | 'code'
  | 'letters'
  | 'numbers'
  | 'symbols'
  | 'diacritics'
  | 'zwnj'
  | 'custom';

export interface LessonSpec {
  kind: LessonKind;
  /** [English title, Persian title] */
  t: [string, string];
  sub?: [string, string];
  keys?: string[];
  /** Characters that drills may use (letters etc.). Space is always allowed. */
  pool: string[];
  anchors?: string[];
  focus?: string[];
  hand?: LessonHand;
  wpm: number;
  acc: number;
  learn?: [string, string];
  why?: [string, string];
  mistakes?: [string, string];
  source?: TextSource;
  must?: string[];
  caps?: boolean;
  allow?: string;
  min?: number;
  max?: number;
  wordFilter?: (w: string) => boolean;
  extraWords?: string[];
  gen?: (rng: Rng, len: number, ctx: DrillContext) => string;
  scale?: number;
}

type Role = 'isolate' | 'anchor' | 'groups' | 'words' | 'mixed' | 'text';
interface PlanItem {
  type: LessonStep['type'];
  role: Role;
  len: number;
}

const PLANS: Record<LessonKind, PlanItem[]> = {
  foundation: [
    { type: 'watch', role: 'anchor', len: 36 },
    { type: 'guided', role: 'isolate', len: 56 },
    { type: 'guided', role: 'anchor', len: 72 },
    { type: 'guided', role: 'groups', len: 84 },
    { type: 'free', role: 'groups', len: 96 },
    { type: 'free', role: 'words', len: 108 },
    { type: 'free', role: 'mixed', len: 120 },
    { type: 'test', role: 'mixed', len: 130 },
  ],
  intro: [
    { type: 'watch', role: 'anchor', len: 36 },
    { type: 'guided', role: 'isolate', len: 56 },
    { type: 'guided', role: 'anchor', len: 72 },
    { type: 'guided', role: 'groups', len: 84 },
    { type: 'free', role: 'groups', len: 96 },
    { type: 'free', role: 'words', len: 108 },
    { type: 'free', role: 'mixed', len: 120 },
    { type: 'test', role: 'mixed', len: 130 },
  ],
  reinforce: [
    { type: 'watch', role: 'groups', len: 36 },
    { type: 'guided', role: 'groups', len: 72 },
    { type: 'guided', role: 'words', len: 90 },
    { type: 'guided', role: 'mixed', len: 100 },
    { type: 'free', role: 'words', len: 110 },
    { type: 'free', role: 'words', len: 120 },
    { type: 'free', role: 'mixed', len: 130 },
    { type: 'test', role: 'mixed', len: 150 },
  ],
  hand: [
    { type: 'watch', role: 'groups', len: 36 },
    { type: 'guided', role: 'groups', len: 72 },
    { type: 'guided', role: 'words', len: 90 },
    { type: 'guided', role: 'mixed', len: 100 },
    { type: 'free', role: 'words', len: 110 },
    { type: 'free', role: 'words', len: 120 },
    { type: 'free', role: 'mixed', len: 130 },
    { type: 'test', role: 'mixed', len: 150 },
  ],
  words: [
    { type: 'watch', role: 'words', len: 40 },
    { type: 'guided', role: 'words', len: 80 },
    { type: 'guided', role: 'mixed', len: 100 },
    { type: 'free', role: 'words', len: 120 },
    { type: 'free', role: 'words', len: 130 },
    { type: 'free', role: 'mixed', len: 140 },
    { type: 'test', role: 'mixed', len: 160 },
  ],
  review: [
    { type: 'watch', role: 'words', len: 40 },
    { type: 'guided', role: 'words', len: 80 },
    { type: 'guided', role: 'mixed', len: 100 },
    { type: 'free', role: 'words', len: 120 },
    { type: 'free', role: 'words', len: 130 },
    { type: 'free', role: 'mixed', len: 140 },
    { type: 'test', role: 'mixed', len: 160 },
  ],
  text: [
    { type: 'watch', role: 'text', len: 60 },
    { type: 'guided', role: 'text', len: 100 },
    { type: 'guided', role: 'text', len: 120 },
    { type: 'free', role: 'text', len: 140 },
    { type: 'free', role: 'text', len: 160 },
    { type: 'free', role: 'text', len: 180 },
    { type: 'test', role: 'text', len: 200 },
  ],
  exam: [
    { type: 'watch', role: 'mixed', len: 50 },
    { type: 'guided', role: 'mixed', len: 90 },
    { type: 'free', role: 'mixed', len: 120 },
    { type: 'free', role: 'mixed', len: 150 },
    { type: 'test', role: 'mixed', len: 230 },
  ],
};

const FINGER_SHORT_FA: Record<FingerType, string> = {
  'left-pinky': 'کوچک چپ',
  'left-ring': 'انگشتری چپ',
  'left-middle': 'میانی چپ',
  'left-index': 'اشارهٔ چپ',
  thumb: 'شست',
  'right-index': 'اشارهٔ راست',
  'right-middle': 'میانی راست',
  'right-ring': 'انگشتری راست',
  'right-pinky': 'کوچک راست',
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const faNum = (v: string | number) => String(v).replace(/\d/g, (d) => FA_DIGITS[+d]);

function layoutFor(lang: Language): KeyboardLayoutType {
  return lang === 'fa' ? 'persian-standard' : 'qwerty';
}

function displayKey(k: string): string {
  if (k === '\u200C') return 'ZWNJ';
  if (k === ' ') return 'Space';
  return k;
}

function fingerLines(keys: string[], lang: Language): { en: string; fa: string } {
  const layout = layoutFor(lang);
  const en: string[] = [];
  const fa: string[] = [];
  for (const k of keys) {
    if (!k.trim() && k !== ' ') continue;
    const { keyDef, requiresShift } = findKeyForChar(k, layout);
    if (!keyDef) continue;
    const f = keyDef.finger;
    const shiftEn = requiresShift ? ' + Shift (opposite pinky)' : '';
    const shiftFa = requiresShift ? ' + تبدیل (با کوچک دست مخالف)' : '';
    en.push(`${FINGER_COLORS[f].nameEn} → ${displayKey(k)}${shiftEn}.`);
    fa.push(`انگشت ${FINGER_SHORT_FA[f]} ← ${displayKey(k)}${shiftFa}.`);
  }
  return { en: en.join(' '), fa: fa.join(' ') };
}

function firstFinger(keys: string[], lang: Language): FingerType | null {
  for (const k of keys) {
    const { keyDef } = findKeyForChar(k, layoutFor(lang));
    if (keyDef) return keyDef.finger;
  }
  return null;
}

const BANK = {
  en: { sentences: EN_SENTENCES, paragraphs: EN_PARAGRAPHS, quotes: EN_QUOTES, code: EN_CODE, letters: EN_QUOTES },
  fa: { sentences: FA_SENTENCES, paragraphs: FA_PARAGRAPHS, quotes: FA_QUOTES, code: FA_SENTENCES, letters: FA_LETTERS },
};

function allowedSet(spec: LessonSpec, lang: Language): Set<string> {
  const set = new Set<string>([...spec.pool, ...(spec.keys ?? []), ' ']);
  for (const ch of spec.allow ?? '') set.add(ch);
  if (spec.caps && lang === 'en') for (const c of [...set]) set.add(c.toUpperCase());
  return set;
}

function makeText(
  spec: LessonSpec,
  lang: Language,
  ctx: DrillContext,
  rng: Rng,
  role: Role,
  len: number,
  variant: number
): string {
  const pool = spec.pool;
  const keys = spec.keys ?? [];
  const keyChars = keys.filter((k) => k.trim());
  const focus = spec.focus ?? (keyChars.length ? keyChars : pool);
  const anchors = spec.anchors && spec.anchors.length ? spec.anchors : pool.filter((c) => !keys.includes(c));
  const wordOpts = { min: spec.min, max: spec.max, filter: spec.wordFilter, extraWords: spec.extraWords };
  const plainWords = () => wordDrill(ctx, rng, pool, focus, len, wordOpts);

  if (spec.gen) return spec.gen(rng, len, ctx);

  const src: TextSource = spec.source ?? 'words';
  const allowed = allowedSet(spec, lang);
  const must = spec.must ?? [];

  if (src === 'sentences' || src === 'paragraphs' || src === 'quotes' || src === 'code' || src === 'letters') {
    const bank = BANK[lang][src];
    return textDrill(rng, bank, allowed, must, len, plainWords);
  }
  if (src === 'numbers') {
    const digits = pool.filter((c) => /[0-9\u06F0-\u06F9]/.test(c));
    return digitDrill(rng, digits.length ? digits : pool, len);
  }
  if (src === 'symbols') {
    const syms = (spec.keys && spec.keys.length ? spec.keys : pool).filter((c) => c.trim());
    const letters = anchors.length ? anchors : pool;
    return symbolDrill(rng, syms, letters.filter((c) => c.trim()), len);
  }
  if (src === 'diacritics') {
    const bank = FA_DIACRITIC_WORDS.filter((w) => !must.length || must.some((m) => w.includes(m)));
    const list = bank.length >= 4 ? bank : FA_DIACRITIC_WORDS;
    return joinTokens(rng, () => pick(rng, list), len);
  }
  if (src === 'zwnj') {
    const wordList = must.length ? FA_ZWNJ_WORDS.filter((w) => must.some((m) => w.startsWith(m))) : FA_ZWNJ_WORDS;
    const words = wordList.length >= 4 ? wordList : FA_ZWNJ_WORDS;
    const sent = FA_SENTENCES.filter((s) => s.includes('\u200C') && fits(s, allowed));
    const list = variant % 2 === 0 || sent.length === 0 ? words : [...words, ...sent];
    return joinTokens(rng, () => pick(rng, list), len);
  }

  // Default: key-based drills
  switch (role) {
    case 'isolate':
      return isolateDrill(rng, keyChars.length ? keyChars : pool, len);
    case 'anchor':
      return pairDrill(rng, keyChars.length ? keyChars : pool, anchors, len);
    case 'groups':
      return groupDrill(rng, pool, focus, len);
    case 'mixed': {
      const keepFocus = spec.kind === 'intro' || spec.kind === 'reinforce';
      return wordDrill(ctx, rng, pool, keepFocus ? focus : [], len, wordOpts);
    }
    default:
      return plainWords();
  }
}

function demoClip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return text.slice(0, cut > 10 ? cut : max);
}

export function buildLesson(spec: LessonSpec, lang: Language, index: number, stageId: number): Lesson {
  const ctx = makeContext(lang);
  const id = `${lang}-${String(index + 1).padStart(3, '0')}`;
  const keys = spec.keys ?? [];
  const defaults = KIND_DEFAULTS[spec.kind];
  const scale = spec.scale ?? (stageId >= 8 ? 1.4 : stageId >= 5 ? 1.2 : 1);
  const plan = PLANS[spec.kind];
  const accText = `${spec.acc}%`;

  // ---- learn step
  const fl = fingerLines(keys, lang);
  const keyList = keys.map(displayKey).join(' · ');
  let learnEn: string;
  let learnFa: string;
  if (spec.learn) {
    [learnEn, learnFa] = spec.learn;
  } else if (spec.kind === 'intro' && keys.length) {
    learnEn = `New keys: ${keyList}. ${fl.en} Press, then return the finger to its home key. Keep your eyes on the screen.`;
    learnFa = `کلیدهای تازه: ${keyList}. ${fl.fa} پس از هر ضربه انگشت را به خانهٔ اصلی برگردانید و به صفحه نگاه کنید.`;
  } else if (spec.kind === 'reinforce' && keys.length) {
    learnEn = `Second long session on ${keyList}. ${fl.en} Slow and clean beats fast and sloppy.`;
    learnFa = `نشست دوم روی ${keyList}. ${fl.fa} آهسته و تمیز بهتر از سریع و نامرتب است.`;
  } else if (spec.kind === 'exam') {
    learnEn = `Exam briefing: warm up, then type the final text at ${spec.wpm}+ WPM with ${accText}+ accuracy. No keyboard hints in the free steps.`;
    learnFa = `توضیح آزمون: گرم کنید، سپس متن پایانی را با سرعت ${faNum(spec.wpm)}+ و دقت ${faNum(spec.acc)}٪+ تایپ کنید. در گام‌های آزاد صفحه‌کلید پنهان است.`;
  } else {
    learnEn = `${spec.sub ? spec.sub[0] : defaults.subEn}. Reach goal: ${spec.wpm} WPM at ${accText} accuracy.`;
    learnFa = `${spec.sub ? spec.sub[1] : defaults.subFa}. هدف: ${faNum(spec.wpm)} کلمه در دقیقه با دقت ${faNum(spec.acc)}٪.`;
  }

  const steps: LessonStep[] = [
    {
      type: 'learn',
      titleEn: spec.kind === 'intro' ? 'Meet the new keys' : spec.kind === 'exam' ? 'Exam briefing' : 'Warm-up & goal',
      titleFa: spec.kind === 'intro' ? 'آشنایی با کلیدهای تازه' : spec.kind === 'exam' ? 'توضیح آزمون' : 'گرم کردن و هدف',
      instructionsEn: learnEn,
      instructionsFa: learnFa,
      targetText: demoClip(
        makeText(spec, lang, ctx, makeRng(`${id}-learn`), keys.length ? 'isolate' : 'groups', 30, 0),
        30
      ),
    },
  ];

  let totalChars = 0;
  plan.forEach((p, i) => {
    const len = Math.round(p.len * scale);
    const rng = makeRng(`${id}-${i}`);
    let text = makeText(spec, lang, ctx, rng, p.role, len, i);
    if (p.type === 'watch') text = demoClip(text, 48);
    text = text.trim();
    totalChars += text.length;
    const copy = ROLE_COPY[p.role];
    const isTest = p.type === 'test';
    const isFree = p.type === 'free';
    steps.push({
      type: p.type,
      titleEn: isTest ? 'Lesson test' : p.type === 'watch' ? 'Watch the rhythm' : copy.tEn,
      titleFa: isTest ? 'آزمون درس' : p.type === 'watch' ? 'تماشای ریتم' : copy.tFa,
      instructionsEn: isTest
        ? `Goal: ${spec.wpm}+ WPM with ${accText}+ accuracy.`
        : p.type === 'watch'
        ? 'Press Play and watch the letters light up. Imagine each finger moving and coming home.'
        : copy.iEn + (isFree ? FREE_SUFFIX.en : ''),
      instructionsFa: isTest
        ? `هدف: ${faNum(spec.wpm)}+ کلمه در دقیقه با دقت ${faNum(spec.acc)}٪+.`
        : p.type === 'watch'
        ? 'دکمهٔ پخش را بزنید و روشن شدن حروف را ببینید. حرکت و بازگشت هر انگشت را در ذهن مجسم کنید.'
        : copy.iFa + (isFree ? FREE_SUFFIX.fa : ''),
      targetText: text,
    });
  });

  const tip = firstFinger(keys, lang) ? FINGER_TIPS[firstFinger(keys, lang) as FingerType] : null;
  const useTip = (spec.kind === 'intro' || spec.kind === 'reinforce') && tip;
  const why = spec.why ?? (useTip ? [tip.whyEn, tip.whyFa] : [defaults.whyEn, defaults.whyFa]);
  const mistakes = spec.mistakes ?? (useTip ? [tip.errEn, tip.errFa] : [defaults.errEn, defaults.errFa]);
  const typedCharsPerMin = Math.max(30, spec.wpm * 5);
  const estMinutes = Math.max(3, Math.ceil((totalChars / typedCharsPerMin) * 1.4));
  const xp = 50 + stageId * 12 + (spec.kind === 'exam' ? 100 : 0);

  return {
    id,
    stageId,
    language: lang,
    order: index + 1,
    titleEn: spec.t[0],
    titleFa: spec.t[1],
    subtitleEn: spec.sub ? spec.sub[0] : defaults.subEn,
    subtitleFa: spec.sub ? spec.sub[1] : defaults.subFa,
    keysIntroduced: keys,
    kind: spec.kind,
    hand: spec.hand,
    estMinutes,
    whyThisLessonEn: why[0],
    whyThisLessonFa: why[1],
    commonMistakesEn: mistakes[0],
    commonMistakesFa: mistakes[1],
    targetWpm: spec.wpm,
    minAccuracy: spec.acc,
    xpReward: xp,
    steps,
  };
}

export function buildTrack(specs: LessonSpec[], lang: Language): Lesson[] {
  if (specs.length !== TOTAL_LESSONS_PER_TRACK) {
    throw new Error(`${lang} track must have ${TOTAL_LESSONS_PER_TRACK} lessons, got ${specs.length}`);
  }
  const lessons: Lesson[] = [];
  let i = 0;
  STAGE_LESSON_COUNTS.forEach((count, stageId) => {
    for (let n = 0; n < count; n++, i++) lessons.push(buildLesson(specs[i], lang, i, stageId));
  });
  return lessons;
}

export { fits };
