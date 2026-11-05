import React, { useMemo, useState } from 'react';
import { Lesson } from '../../types/curriculum';
import { Language, UserStats } from '../../types/typing';
import { getStages } from '../../data/curriculum/stages';
import { Star, CheckCircle2, Play, Crown, Lock, ChevronDown, Clock, ArrowRight, Unlock } from 'lucide-react';

interface CurriculumRoadmapProps {
  lessons: Lesson[];
  userStats: UserStats;
  language: Language;
  onSelectLesson: (lesson: Lesson) => void;
}

const UNLOCK_KEY = 'pilla_unlock_all_v1';
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({
  lessons,
  userStats,
  language,
  onSelectLesson,
}) => {
  const isRTL = language === 'fa';
  const num = (n: number | string) => (isRTL ? String(n).replace(/\d/g, (d) => FA_DIGITS[+d]) : String(n));
  const stages = getStages(language);

  const [unlockAll, setUnlockAll] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === '1';
    } catch {
      return false;
    }
  });

  const isDone = (l: Lesson) => (userStats.completedLessons[l.id]?.stars ?? 0) >= 1;
  const doneCount = lessons.filter(isDone).length;
  const nextIndex = lessons.findIndex((l) => !isDone(l));
  const nextLesson = nextIndex >= 0 ? lessons[nextIndex] : null;
  const totalMinutes = lessons.reduce((a, l) => a + (l.estMinutes ?? 0), 0);

  const [openStages, setOpenStages] = useState<Set<number>>(
    () => new Set([nextLesson ? nextLesson.stageId : 0])
  );

  const isUnlocked = (index: number) =>
    unlockAll || index === 0 || isDone(lessons[index - 1]) || isDone(lessons[index]);

  const toggleStage = (id: number) =>
    setOpenStages((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const toggleUnlock = () => {
    const v = !unlockAll;
    setUnlockAll(v);
    try {
      localStorage.setItem(UNLOCK_KEY, v ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const stageSummaries = useMemo(
    () =>
      stages.map((st) => {
        const ls = lessons.filter((l) => l.stageId === st.id);
        return { st, ls };
      }),
    [stages, lessons]
  );

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Royal Banner */}
      <div className="p-6 sm:p-8 rounded-3xl royal-card border border-amber-500/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-amber-400">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{isRTL ? 'نقشه راه دگردیسی' : 'The Metamorphosis Roadmap'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold gold-text-gradient">
            {isRTL
              ? `${num(lessons.length)} درس گام‌به‌گام تا تسلط کامل`
              : `${lessons.length} step-by-step lessons to full mastery`}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            {isRTL
              ? `هر کلید ساعت‌ها تمرین می‌شود: ابتدا تنها، سپس با کلیدهای آشنا، و در پایان با هر دو دست ترکیب می‌شود. زمان تقریبی دوره: ${num(Math.round(totalMinutes / 60))} ساعت.`
              : `Every key is drilled for hours: alone first, then with familiar keys, then combined with both hands. Estimated course time: ${Math.round(totalMinutes / 60)} hours.`}
          </p>
          {nextLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 text-slate-950 text-sm font-bold shadow-[0_0_14px_rgba(245,158,11,0.4)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {doneCount === 0
                  ? isRTL ? 'شروع از درس ۱' : 'Start Lesson 1'
                  : isRTL ? `ادامه: درس ${num(nextLesson.order)}` : `Continue: Lesson ${nextLesson.order}`}
              </span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#1E0935]/80 border border-amber-500/30 shadow-inner min-w-[170px]">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-amber-300 font-mono">
              {num(doneCount)} / {num(lessons.length)}
            </span>
            <span className="text-[11px] text-amber-400/80 mt-0.5">
              {isRTL ? 'درس‌های فتح‌شده' : 'Mastered Lessons'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-purple-950 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-purple-500"
              style={{ width: `${Math.round((doneCount / Math.max(1, lessons.length)) * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={toggleUnlock}
            className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-amber-200 transition-colors"
          >
            {unlockAll ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>
              {unlockAll
                ? isRTL ? 'همهٔ درس‌ها باز است' : 'All lessons unlocked'
                : isRTL ? 'باز کردن همهٔ درس‌ها' : 'Unlock all lessons'}
            </span>
          </button>
        </div>
      </div>

      {/* Stage Sections */}
      <div className="flex flex-col gap-5">
        {stageSummaries.map(({ st, ls }) => {
          if (ls.length === 0) return null;
          const done = ls.filter(isDone).length;
          const open = openStages.has(st.id);
          return (
            <div key={st.id} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => toggleStage(st.id)}
                className="flex items-center gap-3 border-b border-amber-500/25 pb-2 text-start w-full"
                aria-expanded={open}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: st.accentColor, boxShadow: `0 0 8px ${st.accentColor}` }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-amber-200">
                    {isRTL ? st.titleFa : st.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{isRTL ? st.descriptionFa : st.descriptionEn}</p>
                </div>
                <span className="text-xs font-mono text-amber-300 shrink-0">
                  {num(done)} / {num(ls.length)}
                </span>
                <ChevronDown className={`w-4 h-4 text-amber-300 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ls.map((l) => {
                    const index = lessons.indexOf(l);
                    const record = userStats.completedLessons[l.id];
                    const stars = record ? record.stars : 0;
                    const isCompleted = stars >= 1;
                    const unlocked = isUnlocked(index);
                    const isNext = nextLesson?.id === l.id;

                    return (
                      <div
                        key={l.id}
                        className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                          !unlocked
                            ? 'royal-card opacity-50'
                            : isCompleted
                            ? 'royal-card royal-card-highlight hover:border-amber-400'
                            : isNext
                            ? 'royal-card border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.25)]'
                            : 'royal-card opacity-90 hover:opacity-100 hover:border-amber-500/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-amber-300/80">#{num(l.order)}</span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= stars
                                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]'
                                        : 'text-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-amber-300 font-mono">+{num(l.xpReward)} XP</span>
                          </div>

                          <h4 className="text-base font-bold text-white mb-1">{isRTL ? l.titleFa : l.titleEn}</h4>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {isRTL ? l.subtitleFa : l.subtitleEn}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {l.hand && l.hand !== 'both' && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-200 text-[11px] font-semibold">
                                {l.hand === 'left' ? (isRTL ? 'دست چپ' : 'Left hand') : isRTL ? 'دست راست' : 'Right hand'}
                              </span>
                            )}
                            {l.keysIntroduced.slice(0, 8).map((k) => (
                              <span
                                key={k}
                                className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold"
                              >
                                {k === ' ' ? 'Space' : k === '\u200C' ? (isRTL ? 'نیم‌فاصله' : 'ZWNJ') : k}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-purple-950/70">
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            {record ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {num(record.bestWpm)} WPM
                              </span>
                            ) : (
                              <span className="text-amber-300/70">
                                {isRTL ? `هدف: ${num(l.targetWpm)} WPM` : `Goal: ${l.targetWpm} WPM`}
                              </span>
                            )}
                            {l.estMinutes ? (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock className="w-3 h-3" />
                                {num(l.estMinutes)}′
                              </span>
                            ) : null}
                          </div>

                          {unlocked ? (
                            <button
                              type="button"
                              onClick={() => onSelectLesson(l)}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isCompleted
                                  ? 'bg-purple-950/60 hover:bg-purple-900/70 text-amber-200 border border-amber-500/30'
                                  : 'bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{isCompleted ? (isRTL ? 'تکرار' : 'Retry') : isRTL ? 'آغاز' : 'Start'}</span>
                            </button>
                          ) : (
                            <span
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-400 bg-slate-900/60 border border-slate-700/60"
                              title={isRTL ? 'ابتدا درس قبل را با موفقیت بگذرانید' : 'Pass the previous lesson first'}
                            >
                              <Lock className="w-3 h-3" />
                              <span>{isRTL ? 'قفل' : 'Locked'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
