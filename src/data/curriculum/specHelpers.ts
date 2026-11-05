import { LessonSpec } from './lessonBuilder';
import { Rng, pick, shuffle } from './random';
import { DrillContext, joinTokens } from './drills';

export const L = (s: string) => s.split('');
export const uniq = <T,>(a: T[]) => Array.from(new Set(a));

export type Spec = LessonSpec;

/** Hand-alternation ratio of a word: share of neighbouring letters typed by different hands. */
export function altRatio(w: string, left: Set<string>): number {
  if (w.length < 2) return 0;
  let sw = 0;
  for (let i = 1; i < w.length; i++) if (left.has(w[i]) !== left.has(w[i - 1])) sw++;
  return sw / (w.length - 1);
}

export function hasSameFingerPair(w: string, finger: Record<string, string>): boolean {
  for (let i = 1; i < w.length; i++) {
    const a = w[i - 1];
    const b = w[i];
    if (a !== b && finger[a] && finger[a] === finger[b]) return true;
  }
  return false;
}

/** Repeating n-gram drill: "th th the then that …" */
export function ngramGen(ngrams: string[]) {
  return (rng: Rng, len: number, ctx: DrillContext) => {
    const order = shuffle(rng, ngrams);
    let i = 0;
    return joinTokens(
      rng,
      () => {
        const g = order[Math.floor(i / 4) % order.length];
        const step = i++ % 4;
        if (step < 2) return g;
        const cands = ctx.words.filter((w) => w.includes(g) && w.length <= 9);
        return cands.length ? pick(rng, cands) : g;
      },
      len
    );
  };
}

export function listGen(list: string[]) {
  return (rng: Rng, len: number) => joinTokens(rng, () => pick(rng, list), len);
}

export function sentenceFromWords(
  rng: Rng,
  ctx: DrillContext,
  pool: string[],
  len: number,
  opts: { caps?: boolean; commas?: boolean }
): string {
  const allowed = new Set(pool);
  const words = ctx.words.filter((w) => w.length >= 2 && [...w].every((c) => allowed.has(c)));
  const src = words.length >= 8 ? words : ctx.words;
  let out = '';
  while (out.length < len) {
    const n = 3 + Math.floor(rng() * 4);
    const parts: string[] = [];
    for (let i = 0; i < n; i++) parts.push(pick(rng, src));
    let sentence = parts.join(' ');
    if (opts.commas && n > 4) {
      const k = 1 + Math.floor(rng() * (n - 2));
      const arr = sentence.split(' ');
      arr[k - 1] += ',';
      sentence = arr.join(' ');
    }
    if (opts.caps) sentence = sentence[0].toUpperCase() + sentence.slice(1);
    out += (out ? ' ' : '') + sentence + '.';
  }
  return out;
}
export type { Rng };
