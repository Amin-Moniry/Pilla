import { Language } from '../../types/typing';
import { Rng, pick, shuffle, unique } from './random';
import { EN_ALL_WORDS } from './wordsEn';
import { FA_ALL_WORDS } from './wordsFa';

const EN_VOWELS = new Set('aeiou'.split(''));

export interface DrillContext {
  lang: Language;
  words: string[];
}

export function makeContext(lang: Language): DrillContext {
  return { lang, words: lang === 'fa' ? FA_ALL_WORDS : EN_ALL_WORDS };
}

export function fits(text: string, allowed: Set<string>): boolean {
  for (const ch of text) if (!allowed.has(ch)) return false;
  return true;
}

/** Real words made only of allowed letters, 2..max letters long. */
export function wordsFor(ctx: DrillContext, allowed: Set<string>, min = 2, max = 9): string[] {
  return ctx.words.filter((w) => {
    if (w.length < min || w.length > max) return false;
    if (ctx.lang === 'en' && w.length === 1) return false;
    return fits(w, allowed);
  });
}

export function pseudoWord(ctx: DrillContext, rng: Rng, pool: string[], focus: string[]): string {
  const len = 3 + Math.floor(rng() * 3);
  const chars: string[] = [];
  const vowels = pool.filter((c) => EN_VOWELS.has(c));
  const cons = pool.filter((c) => !EN_VOWELS.has(c));
  const useCV = ctx.lang === 'en' && vowels.length > 0 && cons.length > 0;
  let vowelNext = rng() < 0.5;
  for (let i = 0; i < len; i++) {
    if (useCV) {
      chars.push(pick(rng, vowelNext ? vowels : cons));
      vowelNext = !vowelNext;
    } else {
      chars.push(pick(rng, pool));
    }
  }
  if (focus.length > 0 && !chars.some((c) => focus.includes(c))) {
    chars[Math.floor(rng() * chars.length)] = pick(rng, focus);
  }
  return chars.join('');
}

/** Join tokens with spaces until `len` characters are reached (never repeats a token twice in a row). */
export function joinTokens(rng: Rng, nextToken: () => string, len: number): string {
  const out: string[] = [];
  let total = 0;
  let last = '';
  let guard = 0;
  while (total < len && guard++ < 2000) {
    let t = nextToken();
    let tries = 0;
    while (t === last && tries++ < 6) t = nextToken();
    out.push(t);
    last = t;
    total += t.length + 1;
  }
  return out.join(' ');
}

/** "dd kk ddd kkk d k d k" — each new key on its own, then alternating. */
export function isolateDrill(rng: Rng, keys: string[], len: number): string {
  const ks = keys.filter((k) => k.trim());
  if (ks.length === 0) return '';
  let i = 0;
  const patterns = [
    (k: string) => k + k,
    (k: string) => k + k + k,
    (k: string) => k,
    (k: string) => k + k + k + k,
  ];
  return joinTokens(rng, () => {
    const k = ks[i++ % ks.length];
    return pick(rng, patterns)(k);
  }, len);
}

/** New keys paired with anchor keys in both orders: "dj kf dk fd …". */
export function pairDrill(rng: Rng, keys: string[], anchors: string[], len: number): string {
  const ks = keys.filter((k) => k.trim());
  const as = anchors.filter((k) => k.trim());
  const base = as.length ? as : ks;
  return joinTokens(rng, () => {
    const k = pick(rng, ks);
    const a = pick(rng, base);
    const r = rng();
    if (r < 0.4) return k + a;
    if (r < 0.8) return a + k;
    return k + a + k;
  }, len);
}

/** Random letter groups of 2-4 letters, each containing at least one focus key. */
export function groupDrill(rng: Rng, pool: string[], focus: string[], len: number): string {
  const f = focus.length ? focus : pool;
  return joinTokens(rng, () => {
    const n = 2 + Math.floor(rng() * 3);
    const chars: string[] = [];
    for (let i = 0; i < n; i++) chars.push(pick(rng, rng() < 0.55 ? f : pool));
    if (!chars.some((c) => f.includes(c))) chars[Math.floor(rng() * n)] = pick(rng, f);
    return chars.join('');
  }, len);
}

/** Real words (weighted towards focus keys) topped up with pseudo-words when real words are scarce. */
export function wordDrill(
  ctx: DrillContext,
  rng: Rng,
  pool: string[],
  focus: string[],
  len: number,
  opts: { min?: number; max?: number; filter?: (w: string) => boolean; extraWords?: string[] } = {}
): string {
  const allowed = new Set(pool);
  let real = wordsFor(ctx, allowed, opts.min ?? 2, opts.max ?? 9);
  if (opts.extraWords) real = unique([...real, ...opts.extraWords.filter((w) => fits(w, allowed))]);
  if (opts.filter) real = real.filter(opts.filter);
  const weighted: string[] = [];
  for (const w of real) {
    const hit = focus.length === 0 || [...w].some((c) => focus.includes(c));
    weighted.push(w);
    if (hit) weighted.push(w, w);
  }
  const preferred = focus.length ? real.filter((w) => [...w].some((c) => focus.includes(c))) : real;
  const scarce = preferred.length < 8;
  return joinTokens(rng, () => {
    if (weighted.length === 0 || (scarce && rng() < 0.6)) return pseudoWord(ctx, rng, pool, focus);
    return pick(rng, weighted);
  }, len);
}

/** Pick whole sentences / paragraphs that fit the allowed characters until `len` is reached. */
export function textDrill(
  rng: Rng,
  bank: string[],
  allowed: Set<string>,
  must: string[],
  len: number,
  fallback: () => string
): string {
  let ok = bank.filter((s) => fits(s, allowed));
  const withMust = must.length ? ok.filter((s) => must.some((m) => s.includes(m))) : ok;
  if (withMust.length >= 3) ok = withMust;
  if (ok.length === 0) return fallback();
  const order = shuffle(rng, ok);
  const out: string[] = [];
  let total = 0;
  let i = 0;
  while (total < len && i < order.length * 3) {
    const s = order[i++ % order.length];
    out.push(s);
    total += s.length + 1;
    if (i >= order.length && total < len * 0.6) continue;
  }
  return out.join(' ');
}

export function symbolDrill(rng: Rng, symbols: string[], letters: string[], len: number): string {
  return joinTokens(rng, () => {
    const s = pick(rng, symbols);
    const a = pick(rng, letters);
    const b = pick(rng, letters);
    const r = rng();
    if (r < 0.2) return s;
    if (r < 0.4) return s + s;
    if (r < 0.7) return a + s + b;
    if (r < 0.85) return s + a + s;
    return a + b + s;
  }, len);
}

export function digitDrill(rng: Rng, digits: string[], len: number): string {
  return joinTokens(rng, () => {
    const n = 2 + Math.floor(rng() * 3);
    let t = '';
    for (let i = 0; i < n; i++) t += pick(rng, digits);
    return t;
  }, len);
}
