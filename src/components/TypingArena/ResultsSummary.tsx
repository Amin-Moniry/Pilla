import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Language, SessionMetrics } from '../../types/typing';
import { sound } from '../../utils/sound';
import { Star, RotateCcw, ArrowRight, Zap, Target, Gauge, Activity } from 'lucide-react';

interface ResultsSummaryProps {
  metrics: SessionMetrics;
  stars: number;
  xpEarned: number;
  targetWpm?: number;
  minAccuracy?: number;
  language: Language;
  onRetry: () => void;
  onNext?: () => void;
  nextLabel?: { fa: string; en: string };
  onPracticeWeakKeys?: (keys: string[]) => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  metrics,
  stars,
  xpEarned,
  targetWpm = 25,
  minAccuracy = 95,
  language,
  onRetry,
  onNext,
  nextLabel,
  onPracticeWeakKeys,
}) => {
  useEffect(() => {
    sound.playVictory(stars);
    if (stars >= 2) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#FBBF24', '#D97706', '#F59E0B'],
        });
      } catch {
        // ignore
      }
    }
  }, [stars]);

  const weakKeys = metrics.mostErrorKeys.map((k) => k.char);

  return (
    <div
      className="w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#130826]/95 border border-purple-800/50 backdrop-blur-xl shadow-2xl flex flex-col gap-6"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Header & Stars */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-2 mb-1">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-8 h-8 transition-all ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-110'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          {stars === 3
            ? language === 'fa'
              ? 'شاهکار! پرواز بی‌نقص پروانه'
              : 'Flawless Flight! Exceptional Mastery'
            : stars === 2
            ? language === 'fa'
              ? 'بسیار عالی! هدف فتح شد'
              : 'Well Done! Target Achieved'
            : stars === 1
            ? language === 'fa'
              ? 'خوب، اما جای ارتقا دارد'
              : 'Good Effort! Keep Polishing'
            : language === 'fa'
            ? 'نیاز به تمرین بیشتر'
            : 'Target Missed. Try Once More'}
        </h3>

        <div className="flex items-center gap-2 text-sm text-purple-300">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>
            {language === 'fa' ? `+${xpEarned} امتیاز تجربه (XP) کسب شد` : `+${xpEarned} XP Earned`}
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Net WPM */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'fa' ? 'سرعت خالص' : 'Net WPM'}</span>
          </div>
          <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
            {metrics.netWpm}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {language === 'fa' ? `هدف: ${targetWpm}` : `Goal: ${targetWpm}`}
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'fa' ? 'دقت' : 'Accuracy'}</span>
          </div>
          <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            {metrics.accuracy}%
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {language === 'fa' ? `حداقل: ${minAccuracy}%` : `Min: ${minAccuracy}%`}
          </span>
        </div>

        {/* Gross WPM */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'fa' ? 'سرعت ناخالص' : 'Gross WPM'}</span>
          </div>
          <span className="text-3xl font-bold font-mono text-purple-300 tabular-nums">
            {metrics.grossWpm}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {language === 'fa' ? `${metrics.cpm} حرف/دقیقه` : `${metrics.cpm} CPM`}
          </span>
        </div>

        {/* Consistency */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'fa' ? 'یکنواختی ریتم' : 'Consistency'}</span>
          </div>
          <span className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
            {metrics.consistency}%
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {language === 'fa' ? `${metrics.durationSeconds} ثانیه` : `${metrics.durationSeconds}s duration`}
          </span>
        </div>
      </div>

      {/* Diagnostics: Weak Keys & Errors */}
      {metrics.mostErrorKeys.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex flex-col gap-2">
          <span className="text-xs font-semibold text-rose-300">
            {language === 'fa'
              ? 'کلیدهای دارای بیشترین خطا (فرصت یادگیری):'
              : 'Keys with Most Errors (Practice Targets):'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {metrics.mostErrorKeys.map((k) => (
              <div
                key={k.char}
                className="px-2.5 py-1 rounded-lg bg-rose-900/30 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-1.5"
              >
                <span className="font-bold text-white text-sm">{k.char === ' ' ? 'Space' : k.char}</span>
                <span className="text-[10px] text-rose-400">
                  ({k.errors} {language === 'fa' ? 'خطا' : 'errors'})
                </span>
              </div>
            ))}

            {onPracticeWeakKeys && (
              <button
                type="button"
                onClick={() => onPracticeWeakKeys(weakKeys)}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
              >
                {language === 'fa' ? 'تمرین هدفمند این کلیدها' : 'Drill Weak Keys'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-slate-200 hover:text-white text-sm font-medium border border-purple-800/50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'fa' ? 'تلاش دوباره' : 'Try Again'}</span>
        </button>

        {onNext && stars >= 1 && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-sm font-semibold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
          >
            <span>
              {language === 'fa'
                ? nextLabel?.fa ?? 'درس بعدی'
                : nextLabel?.en ?? 'Next Lesson'}
            </span>
            <ArrowRight className={`w-4 h-4 ${language === 'fa' ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
