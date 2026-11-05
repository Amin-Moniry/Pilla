import React, { useMemo, useState } from 'react';
import {
  Language,
  KeyboardLayoutType,
  TypingMode,
  UserStats,
  SessionMetrics,
  SoundTheme,
} from '../../types/typing';
import { PRACTICE_TEXTS, PERSIAN_COMMON_WORDS, ENGLISH_COMMON_WORDS } from '../../data/quotesAndTexts';
import { TypingArena } from '../TypingArena/TypingArena';
import { ResultsSummary } from '../TypingArena/ResultsSummary';
import { Zap, FileText, Code, Hash, Feather, Sparkles, ArrowLeft, Play } from 'lucide-react';

interface AdaptivePracticeProps {
  userStats: UserStats;
  language: Language;
  layout: KeyboardLayoutType;
  typingMode: TypingMode;
  soundTheme?: SoundTheme;
  initialWeakKeys?: string[];
  onPracticeFinish: (metrics: SessionMetrics) => void;
}

type PracticeCategory = 'adaptive' | 'words' | 'code' | 'poetry' | 'custom';

export const AdaptivePractice: React.FC<AdaptivePracticeProps> = ({
  userStats,
  language,
  layout,
  typingMode,
  soundTheme = 'royal-santoor',
  initialWeakKeys,
  onPracticeFinish,
}) => {
  const isRTL = language === 'fa';
  const [activeCategory, setActiveCategory] = useState<PracticeCategory>('adaptive');
  const [customInputText, setCustomInputText] = useState('');
  const [activeDrillText, setActiveDrillText] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);

  const categories = useMemo(
    () => [
      {
        id: 'adaptive' as const,
        icon: Zap,
        title: isRTL ? 'تمرین تطبیقی' : 'Adaptive',
        description: isRTL ? 'تمرکز روی کلیدهایی که نیاز به تمرین بیشتری دارند.' : 'Focus on keys that need more practice.',
      },
      {
        id: 'words' as const,
        icon: FileText,
        title: isRTL ? 'واژگان پرتکرار' : 'Common words',
        description: isRTL ? 'یک مجموعهٔ تازه از واژه‌های رایج بسازید.' : 'Build fluency with a fresh set of common words.',
      },
      {
        id: 'code' as const,
        icon: Code,
        title: isRTL ? 'کدنویسی' : 'Code',
        description: isRTL ? 'تمرین نشانه‌ها و عبارت‌های پرکاربرد کدنویسی.' : 'Practice familiar programming syntax and symbols.',
      },
      {
        id: 'poetry' as const,
        icon: Feather,
        title: isRTL ? 'شعر و متن' : 'Literature',
        description: isRTL ? 'با یک متن ادبی، ریتم تایپ را تمرین کنید.' : 'Practice rhythm with a literary passage.',
      },
      {
        id: 'custom' as const,
        icon: Hash,
        title: isRTL ? 'متن دلخواه' : 'Custom text',
        description: isRTL ? 'هر متنی را که می‌خواهید، برای تمرین وارد کنید.' : 'Bring your own text to practice.',
      },
    ],
    [isRTL]
  );

  const generateAdaptiveDrill = () => {
    let weakKeys = initialWeakKeys ?? [];
    if (weakKeys.length === 0) {
      weakKeys = Object.entries(userStats.keyMastery ?? {})
        .filter(([, data]) => data.total > 0 && data.correct / data.total < 0.9)
        .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
        .slice(0, 8)
        .map(([key]) => key);
    }
    if (weakKeys.length === 0) {
      weakKeys = isRTL ? ['ب', 'ت', 'ی', 'ن', 'س', 'م'] : ['f', 'j', 'd', 'k', 's', 'l'];
    }
    return Array.from({ length: 18 }, (_, index) => {
      const first = weakKeys[index % weakKeys.length];
      const second = weakKeys[(index + 1) % weakKeys.length];
      return `${first}${second}${first}`;
    }).join(' ');
  };

  const startCategory = (category: PracticeCategory = activeCategory) => {
    setActiveCategory(category);
    setMetrics(null);
    setActiveDrillText(null);

    if (category === 'adaptive') {
      setActiveDrillText(generateAdaptiveDrill());
    } else if (category === 'words') {
      const source = isRTL ? PERSIAN_COMMON_WORDS : ENGLISH_COMMON_WORDS;
      const shuffled = [...source];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
      }
      setActiveDrillText(shuffled.slice(0, 20).join(' '));
    } else if (category === 'code') {
      const codeItem = PRACTICE_TEXTS.find(
        (item) => item.category === 'code' && item.language === language
      );
      setActiveDrillText(codeItem?.text ?? 'const sum = (a: number, b: number) => a + b;');
    } else if (category === 'poetry') {
      const passage = PRACTICE_TEXTS.find(
        (item) => item.category === 'poetry' && item.language === language
      );
      setActiveDrillText(
        passage?.text ??
          (isRTL ? 'به نام آن‌که جان را فکرت آموخت' : 'Practice makes progress, one thoughtful keystroke at a time.')
      );
    } else if (category === 'custom' && customInputText.trim().length >= 5) {
      setActiveDrillText(customInputText.trim());
    }
  };

  const handleComplete = (sessionMetrics: SessionMetrics) => {
    setMetrics(sessionMetrics);
    onPracticeFinish(sessionMetrics);
  };

  const selectedCategory = categories.find((category) => category.id === activeCategory)!;
  const SelectedIcon = selectedCategory.icon;

  return (
    <div className="pilla-experience-page pilla-practice-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="pilla-experience-hero">
        <div className="pilla-experience-hero-mark"><Sparkles aria-hidden="true" /></div>
        <div className="pilla-experience-hero-copy">
          <p className="pilla-experience-eyebrow">{isRTL ? 'کارگاه تمرین' : 'PRACTICE STUDIO'}</p>
          <h2>{isRTL ? 'تمرین با هدف، پیشرفت با ریتم خودت' : 'Practice with purpose, at your pace'}</h2>
          <p>
            {isRTL
              ? 'یک مسیر را انتخاب کن؛ داده‌های هر جلسه بعد از پایان به آمار تو اضافه می‌شود.'
              : 'Choose a drill. Each completed session is added to your progress history.'}
          </p>
        </div>
      </header>

      {!activeDrillText && !metrics && (
        <>
          <section className="pilla-category-grid" aria-label={isRTL ? 'انتخاب نوع تمرین' : 'Choose a practice type'}>
            {categories.map(({ id, icon: Icon, title, description }) => (
              <button
                type="button"
                key={id}
                className={`pilla-category-choice${activeCategory === id ? ' is-selected' : ''}`}
                aria-pressed={activeCategory === id}
                onClick={() => {
                  setActiveCategory(id);
                  setMetrics(null);
                  setActiveDrillText(null);
                }}
              >
                <span className="pilla-category-icon"><Icon aria-hidden="true" /></span>
                <span className="pilla-category-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </button>
            ))}
          </section>

          <section className="pilla-practice-config">
            <div className="pilla-practice-config-heading">
              <span className="pilla-category-icon"><SelectedIcon aria-hidden="true" /></span>
              <div>
                <p className="pilla-experience-eyebrow">{isRTL ? 'آماده‌سازی جلسه' : 'SESSION SETUP'}</p>
                <h3>{selectedCategory.title}</h3>
              </div>
            </div>
            <p className="pilla-practice-config-description">{selectedCategory.description}</p>

            {activeCategory === 'custom' ? (
              <div className="pilla-custom-practice">
                <label htmlFor="custom-practice-text">
                  {isRTL ? 'متن تمرین' : 'Practice text'}
                </label>
                <textarea
                  id="custom-practice-text"
                  value={customInputText}
                  onChange={(event) => setCustomInputText(event.target.value)}
                  rows={5}
                  placeholder={isRTL ? 'متن دلخواهت را اینجا وارد یا جای‌گذاری کن…' : 'Type or paste your own text here…'}
                />
                <div className="pilla-custom-practice-footer">
                  <span>{isRTL ? `${customInputText.length} نویسه` : `${customInputText.length} characters`}</span>
                  <button
                    type="button"
                    className="pilla-primary-action"
                    disabled={customInputText.trim().length < 5}
                    onClick={() => startCategory('custom')}
                  >
                    <Play aria-hidden="true" />
                    {isRTL ? 'شروع تمرین' : 'Start practice'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pilla-practice-config-footer">
                <span>
                  {activeCategory === 'adaptive'
                    ? isRTL
                      ? 'تمرین از روی کلیدهای ضعیف ثبت‌شده ساخته می‌شود.'
                      : 'A drill is generated from your recorded weak keys.'
                    : activeCategory === 'words'
                    ? isRTL
                      ? 'هر بار مجموعه‌ای تازه از واژه‌ها انتخاب می‌شود.'
                      : 'A fresh set of words is selected each time.'
                    : activeCategory === 'code'
                    ? isRTL
                      ? 'نمونهٔ کد متناسب با زبان انتخابی آماده می‌شود.'
                      : 'A language-matched code sample is ready.'
                    : isRTL
                    ? 'یک متن ادبی متناسب با زبان انتخابی آماده می‌شود.'
                    : 'A language-matched literary passage is ready.'}
                </span>
                <button type="button" className="pilla-primary-action" onClick={() => startCategory()}>
                  <Play aria-hidden="true" />
                  {isRTL ? 'شروع تمرین' : 'Start practice'}
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {activeDrillText && !metrics && (
        <section className="pilla-exercise-shell">
          <div className="pilla-exercise-heading">
            <div>
              <p className="pilla-experience-eyebrow">{isRTL ? 'جلسهٔ فعال' : 'ACTIVE SESSION'}</p>
              <h3>{selectedCategory.title}</h3>
            </div>
            <button
              type="button"
              className="pilla-secondary-action"
              onClick={() => {
                setActiveDrillText(null);
                setMetrics(null);
              }}
            >
              <ArrowLeft aria-hidden="true" />
              {isRTL ? 'انتخاب تمرین دیگر' : 'Choose another drill'}
            </button>
          </div>
          <TypingArena
            targetText={activeDrillText}
            language={language}
            layout={layout}
            typingMode={typingMode}
            soundTheme={soundTheme}
            showKeyboard
            showHands
            onComplete={handleComplete}
          />
        </section>
      )}

      {metrics && (
        <div className="pilla-results-stack">
          <ResultsSummary
            metrics={metrics}
            stars={metrics.accuracy >= 95 ? 3 : 2}
            xpEarned={metrics.accuracy >= 95 ? 90 : 45}
            language={language}
            onRetry={() => setMetrics(null)}
            onNext={() => startCategory(activeCategory)}
            nextLabel={{ fa: 'تمرین بعدی', en: 'Next drill' }}
          />
          <button
            type="button"
            className="pilla-secondary-action pilla-back-to-practice"
            onClick={() => {
              setMetrics(null);
              setActiveDrillText(null);
            }}
          >
            <ArrowLeft aria-hidden="true" />
            {isRTL ? 'بازگشت به انتخاب تمرین' : 'Back to practice choices'}
          </button>
        </div>
      )}
    </div>
  );
};