import React from 'react';
import { UserStats, Language } from '../../types/typing';
import { getStageForLevel, getLevelFromXp } from '../../utils/metamorphosis';
import { MetamorphosisShowcase } from './MetamorphosisShowcase';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Feather,
  Flag,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  userStats: UserStats;
  language: Language;
  onNavigate: (tab: string) => void;
  onStartQuickPractice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  language,
  onNavigate,
  onStartQuickPractice,
}) => {
  const isRTL = language === 'fa';
  const stage = getStageForLevel(userStats.level);
  const levelInfo = getLevelFromXp(userStats.xp);
  const NavigationArrow = isRTL ? ArrowLeft : ArrowRight;

  const goalProgress = Math.min(
    100,
    Math.round((userStats.todayKeystrokes / Math.max(1, userStats.todayGoalKeystrokes)) * 100)
  );

  const features = [
    {
      id: 'races',
      icon: Flag,
      tone: 'gold',
      title: isRTL ? 'میدان مسابقه و حریفان' : 'Races & opponents',
      description: isRTL
        ? 'با رکورد شخصی یا حریفان هوشمند مسابقه بده و پیشرفتت را بسنج.'
        : 'Race your personal best or smart opponents and see how far you have come.',
    },
    {
      id: 'test',
      icon: Clock,
      tone: 'lavender',
      title: isRTL ? 'آزمون سرعت و دقت' : 'Speed & accuracy test',
      description: isRTL
        ? 'در آزمون‌های زمان‌دار، سرعت و دقت تایپت را با معیارهای روشن بررسی کن.'
        : 'Measure your typing speed and accuracy in timed tests.',
    },
    {
      id: 'practice',
      icon: Sparkles,
      tone: 'sage',
      title: isRTL ? 'تمرین متناسب با تو' : 'Practice for you',
      description: isRTL
        ? 'روی کلیدهای دشوار تمرکز کن یا با متن و شعر تمرینت را متنوع‌تر کن.'
        : 'Focus on challenging keys, or explore text and poetry drills.',
    },
  ];

  return (
    <div
      className="pilla-home-page"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <aside className="pilla-home-note">
        <div className="pilla-home-note-mark" aria-hidden="true">
          <Sparkles />
        </div>
        <div className="pilla-home-note-copy">
          <p className="pilla-home-eyebrow">
            {isRTL ? 'مسیر تمرین روزانه' : 'Your daily practice path'}
          </p>
          <p>
            {isRTL
              ? 'تمرین کوتاه و پیوسته، دستانت را قدم‌به‌قدم به تایپی روان‌تر می‌رساند.'
              : 'Small, regular practice helps your hands grow into fluent, confident typing.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('posture')}
          className="pilla-home-note-action"
        >
          <Feather aria-hidden="true" />
          <span>{isRTL ? 'راهنمای ارگونومی' : 'Ergonomics guide'}</span>
          <NavigationArrow aria-hidden="true" />
        </button>
      </aside>

      <MetamorphosisShowcase
        userStats={userStats}
        language={language}
        onStartQuickPractice={onStartQuickPractice}
        onExploreCurriculum={() => onNavigate('learn')}
      />

      <section className="pilla-home-metrics" aria-label={isRTL ? 'نمای کلی پیشرفت' : 'Progress overview'}>
        <article className="pilla-home-metric lavender">
          <div className="pilla-home-metric-label">
            <span>{isRTL ? 'زنجیره تمرین' : 'Practice streak'}</span>
            <span className="pilla-home-metric-icon"><Flame aria-hidden="true" /></span>
          </div>
          <div className="pilla-home-metric-value">
            <strong>{userStats.dailyStreak}</strong>
            <span>{isRTL ? 'روز' : 'days'}</span>
          </div>
          <p>{isRTL ? 'هر روز تمرین، یک قدم رو به جلو' : 'A small step forward each day'}</p>
        </article>

        <article className="pilla-home-metric gold">
          <div className="pilla-home-metric-label">
            <span>{isRTL ? 'بهترین سرعت' : 'Best speed'}</span>
            <span className="pilla-home-metric-icon"><Trophy aria-hidden="true" /></span>
          </div>
          <div className="pilla-home-metric-value">
            <strong>{userStats.bestWpm || 0}</strong>
            <span>WPM</span>
          </div>
          <p>{isRTL ? 'سرعت خالص؛ استاندارد ۵ حرف' : 'Net speed using the 5-character standard'}</p>
        </article>

        <article className="pilla-home-metric sage">
          <div className="pilla-home-metric-label">
            <span>{isRTL ? 'ضربه‌های امروز' : "Today's keystrokes"}</span>
            <span className="pilla-home-metric-icon"><Target aria-hidden="true" /></span>
          </div>
          <div className="pilla-home-metric-value">
            <strong>{userStats.todayKeystrokes}</strong>
            <span>/ {userStats.todayGoalKeystrokes}</span>
          </div>
          <div
            className="pilla-home-goal-track"
            role="progressbar"
            aria-label={isRTL ? 'پیشرفت هدف روزانه' : 'Daily goal progress'}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={goalProgress}
          >
            <span style={{ width: `${goalProgress}%` }} />
          </div>
        </article>

        <article className="pilla-home-metric lavender">
          <div className="pilla-home-metric-label">
            <span>{isRTL ? 'میانگین دقت' : 'Average accuracy'}</span>
            <span className="pilla-home-metric-icon"><Zap aria-hidden="true" /></span>
          </div>
          <div className="pilla-home-metric-value">
            <strong>{userStats.averageAccuracy}%</strong>
          </div>
          <p>{isRTL ? 'دقت پایه‌ای برای سرعت روان' : 'Accuracy is the foundation of fluency'}</p>
        </article>
      </section>

      <section className="pilla-home-features" aria-label={isRTL ? 'بخش‌های برنامه' : 'Explore Pilla'}>
        {features.map(({ id, icon: Icon, tone, title, description }) => (
          <button
            type="button"
            key={id}
            className={`pilla-home-feature ${tone}`}
            onClick={() => onNavigate(id)}
          >
            <span className="pilla-home-feature-icon"><Icon aria-hidden="true" /></span>
            <span className="pilla-home-feature-copy">
              <strong>{title}</strong>
              <span>{description}</span>
            </span>
            <NavigationArrow className="pilla-home-feature-arrow" aria-hidden="true" />
          </button>
        ))}
      </section>

      <div className="sr-only">
        {isRTL ? `مرحلهٔ کنونی: ${stage.nameFa}` : `Current stage: ${stage.nameEn}`}
      </div>
    </div>
  );
};