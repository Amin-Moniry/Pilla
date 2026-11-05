import { MetamorphosisStageId, MetamorphosisStageInfo } from '../types/typing';

export const METAMORPHOSIS_STAGES: Record<MetamorphosisStageId, MetamorphosisStageInfo> = {
  egg: {
    id: 'egg',
    minLevel: 1,
    nameEn: 'Silk Genesis (Awakening)',
    nameFa: 'سرآغاز ابریشم (پویه نخست)',
    titleEn: 'Royal Foundation & Home Bumps',
    titleFa: 'استقرار سرانگشتان بر کلیدهای زرین مبنا (ب و ت)',
    descriptionEn: 'The sacred seed of touch typing. Aligning posture and blind tactile anchoring on the home bumps.',
    descriptionFa: 'نخستین گام در دیوان نگارش؛ استقرار سرانگشتان بر برجستگی‌های مبنا (ب و ت) و رهایی از بند نگریستن به کلیدها.',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    accentColor: '#F59E0B',
  },
  silkworm: {
    id: 'silkworm',
    minLevel: 5,
    nameEn: 'Silk Weaver (Pilgrim)',
    nameFa: 'رهروی ابریشم (پویه دوم)',
    titleEn: 'Feasting on Words & Cadence',
    titleFa: 'سلوک در ردیف‌های زرین و تغذیه از شهد واژگان',
    descriptionEn: 'Gliding across key rows with unbroken rhythm, weaving motor memory thread by thread.',
    descriptionFa: 'پیمودن ردیف‌های بالا و پایین با گام‌های استوار و حفظ پیوستگی ضرباهنگ بدون توقف ذهن.',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    accentColor: '#FBBF24',
  },
  cocoon: {
    id: 'cocoon',
    minLevel: 10,
    nameEn: 'Golden Cocoon (Integration)',
    nameFa: 'پیله زرین (پویه سوم)',
    titleEn: 'Deep Subconscious Mastery',
    titleFa: 'تنیدن تارهای زرین و ثبت ناخودآگاه در حریر پیله',
    descriptionEn: 'Wrapped in threads of subconscious fluid flow. Accuracy stabilizes above 95%, punctuation becomes instinct.',
    descriptionFa: 'در پناه پیله زرین، دقت بالاتر از ۹۵٪ تثبیت می‌گردد و نیم‌فاصله‌ها و علائم نگارشی بی‌درنگ به نگارش درمی‌آیند.',
    glowColor: 'rgba(217, 119, 6, 0.5)',
    accentColor: '#D97706',
  },
  emerging: {
    id: 'emerging',
    minLevel: 15,
    nameEn: 'Royal Emergence',
    nameFa: 'شکفتن شاهانه (پویه چهارم)',
    titleEn: 'Breaking the Cocoon Veil',
    titleFa: 'گسستن دیواره پیله و جلوه آغازین پرواز',
    descriptionEn: 'The cocoon parts. Typing velocity surges past 45+ WPM with swift, light, majestic strokes.',
    descriptionFa: 'سرعت دست‌ها مرز ۴۵ کلمه بر دقیقه را درمی‌نوردد و حرکت سرانگشتان سبک، بی‌صدا و خسروانی می‌شود.',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    accentColor: '#FBBF24',
  },
  butterfly: {
    id: 'butterfly',
    minLevel: 20,
    nameEn: 'Imperial Butterfly',
    nameFa: 'شهپر همایونی (پویه پنجم)',
    titleEn: 'Sovereign Flight of Words',
    titleFa: 'پرواز سبک‌بال و خسروانی بر فراز گلستان سخن',
    descriptionEn: 'Wings unfurled with regal majesty. Floating past 70+ WPM with effortless poetic grace.',
    descriptionFa: 'بال‌های مذهب و زرین گشوده شده؛ تایپ روان بالاتر از ۷۰ کلمه بر دقیقه، فارغ از اندیشیدن به حروف و کلیدها.',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    accentColor: '#C084FC',
  },
  'radiant-butterfly': {
    id: 'radiant-butterfly',
    minLevel: 30,
    nameEn: 'Celestial Radiant Butterfly',
    nameFa: 'پروانه زرین خسروانی (کمال مطلق)',
    titleEn: 'Transcendent Sovereign Flight',
    titleFa: 'اوج کمال، درخشش تذهیب و سرعت مافوق ۱۰۰ کلمه',
    descriptionEn: 'A glowing masterpiece leaving golden auroral trails. Pure typing velocity surpassing 100+ WPM in complete harmony.',
    descriptionFa: 'شهپر زرین و جواهرنشان با سرعتی فراتر از ۱۰۰ کلمه در دقیقه؛ یکی شدن کامل اندیشه و سرانگشتان در دیوان ادب.',
    glowColor: 'rgba(251, 191, 36, 0.85)',
    accentColor: '#FBBF24',
  },
};

export function getStageForLevel(level: number): MetamorphosisStageInfo {
  if (level >= 30) return METAMORPHOSIS_STAGES['radiant-butterfly'];
  if (level >= 20) return METAMORPHOSIS_STAGES['butterfly'];
  if (level >= 15) return METAMORPHOSIS_STAGES['emerging'];
  if (level >= 10) return METAMORPHOSIS_STAGES['cocoon'];
  if (level >= 5) return METAMORPHOSIS_STAGES['silkworm'];
  return METAMORPHOSIS_STAGES['egg'];
}

export function getNextStage(currentId: MetamorphosisStageId): MetamorphosisStageInfo | null {
  const order: MetamorphosisStageId[] = ['egg', 'silkworm', 'cocoon', 'emerging', 'butterfly', 'radiant-butterfly'];
  const currentIndex = order.indexOf(currentId);
  if (currentIndex < order.length - 1) {
    return METAMORPHOSIS_STAGES[order[currentIndex + 1]];
  }
  return null;
}

/**
 * Calculates XP required to reach a specific level.
 */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.round(80 * Math.pow(i, 1.35));
  }
  return total;
}

/**
 * Determines current level from total accumulated XP.
 */
export function getLevelFromXp(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXpRequired: number;
  progressPercent: number;
} {
  let level = 1;
  while (totalXp >= totalXpForLevel(level + 1)) {
    level++;
  }
  const levelStartXp = totalXpForLevel(level);
  const nextLevelStartXp = totalXpForLevel(level + 1);
  const currentLevelXp = totalXp - levelStartXp;
  const nextLevelXpRequired = nextLevelStartXp - levelStartXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / nextLevelXpRequired) * 100)));

  return {
    level,
    currentLevelXp,
    nextLevelXpRequired,
    progressPercent,
  };
}
