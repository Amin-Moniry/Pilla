import React, { useState, useEffect } from 'react';
import { Lesson, LessonStep } from '../../types/curriculum';
import { KeyboardLayoutType, Language, SessionMetrics, SoundTheme, TypingMode } from '../../types/typing';
import { calculateStars } from '../../utils/typingEngine';
import { TypingArena } from '../TypingArena/TypingArena';
import { ResultsSummary } from '../TypingArena/ResultsSummary';
import { HandsOverlay } from '../Keyboard/HandsOverlay';
import { getFingerForChar } from '../../utils/fingerMapping';
import { sound } from '../../utils/sound';
import { TOTAL_LESSONS_PER_TRACK } from '../../data/curriculum/stages';
import {
  BookOpen,
  Eye,
  Compass,
  Zap,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface LessonPlayerProps {
  lesson: Lesson;
  language: Language;
  layout: KeyboardLayoutType;
  typingMode: TypingMode;
  soundTheme?: SoundTheme;
  onLessonComplete: (lessonId: string, stars: number, metrics: SessionMetrics, xpEarned: number) => void;
  onExit: () => void;
  onNextLesson?: () => void;
}

const STEP_ICON: Record<LessonStep['type'], React.ReactNode> = {
  learn: <BookOpen className="w-3.5 h-3.5" />,
  watch: <Eye className="w-3.5 h-3.5" />,
  guided: <Compass className="w-3.5 h-3.5" />,
  free: <Zap className="w-3.5 h-3.5" />,
  test: <Award className="w-3.5 h-3.5" />,
};

const STEP_LABEL: Record<LessonStep['type'], { en: string; fa: string }> = {
  learn: { en: 'Learn', fa: 'آموزش' },
  watch: { en: 'Watch', fa: 'مشاهده' },
  guided: { en: 'Guided', fa: 'راهنما' },
  free: { en: 'Free', fa: 'آزاد' },
  test: { en: 'Test', fa: 'آزمون' },
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const faNum = (n: number | string) => String(n).replace(/\d/g, (d) => FA_DIGITS[+d]);

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  language,
  layout,
  typingMode,
  soundTheme = 'royal-santoor',
  onLessonComplete,
  onExit,
  onNextLesson,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [testMetrics, setTestMetrics] = useState<SessionMetrics | null>(null);
  const [stepResult, setStepResult] = useState<SessionMetrics | null>(null);
  const [watchDemoCharIndex, setWatchDemoCharIndex] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const isRTL = language === 'fa';
  const totalSteps = lesson.steps.length;
  const currentStep: LessonStep = lesson.steps[currentStepIndex] || lesson.steps[0];
  const num = (n: number | string) => (isRTL ? faNum(n) : String(n));

  const goToStep = (idx: number) => {
    setTestMetrics(null);
    setStepResult(null);
    setIsDemoRunning(false);
    setWatchDemoCharIndex(0);
    setAttempt(0);
    setCurrentStepIndex(Math.max(0, Math.min(totalSteps - 1, idx)));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Watch step automated typing demo simulation
  useEffect(() => {
    if (currentStep.type === 'watch' && isDemoRunning) {
      const text = currentStep.targetText;
      const interval = setInterval(() => {
        setWatchDemoCharIndex((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            setIsDemoRunning(false);
            sound.playVictory(1);
            return prev;
          }
          const char = text[prev];
          sound.playKeyClick(soundTheme, char === ' ' ? 'space' : 'alpha');
          return prev + 1;
        });
      }, 230);
      return () => clearInterval(interval);
    }
  }, [currentStep.type, currentStep.targetText, isDemoRunning, soundTheme]);

  const handleTestComplete = (metrics: SessionMetrics) => {
    setTestMetrics(metrics);
    const stars = calculateStars(metrics.netWpm, lesson.targetWpm, metrics.accuracy, lesson.minAccuracy);
    const xp = stars > 0 ? lesson.xpReward + stars * 20 : 15;
    onLessonComplete(lesson.id, stars, metrics, xp);
  };

  const handleDrillComplete = (metrics: SessionMetrics) => {
    sound.playVictory(1);
    setStepResult(metrics);
  };

  const stepKey = `${lesson.id}-${currentStepIndex}-${attempt}`;
  const stepTitle = isRTL ? currentStep.titleFa : currentStep.titleEn;
  const stepText = isRTL ? currentStep.instructionsFa : currentStep.instructionsEn;
  const labelFor = (t: LessonStep['type']) => (isRTL ? STEP_LABEL[t].fa : STEP_LABEL[t].en);
  const drillNumber = lesson.steps.slice(0, currentStepIndex + 1).filter((s) => s.type === 'guided' || s.type === 'free').length;
  const drillTotal = lesson.steps.filter((s) => s.type === 'guided' || s.type === 'free').length;

  const StepHeader = ({ tone }: { tone: 'gold' | 'purple' }) => (
    <div
      className={`p-4 rounded-xl border flex flex-col gap-1 ${
        tone === 'gold'
          ? 'bg-amber-950/20 border-amber-900/30'
          : 'bg-purple-950/30 border-purple-900/40'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm sm:text-base font-bold text-white">{stepTitle}</h3>
        {currentStep.type !== 'test' && (
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {isRTL ? `تمرین ${num(drillNumber)} از ${num(drillTotal)}` : `Drill ${drillNumber} of ${drillTotal}`}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{stepText}</p>
    </div>
  );

  const StepResultCard = () => {
    if (!stepResult) return null;
    const good = stepResult.accuracy >= Math.max(85, lesson.minAccuracy - 5);
    return (
      <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-[#130826]/90 border border-purple-900/50 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-emerald-300 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>{isRTL ? 'این تمرین به پایان رسید' : 'Drill complete'}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-purple-950/40">
            <div className="text-2xl font-mono font-bold text-amber-300">{num(stepResult.netWpm)}</div>
            <div className="text-[11px] text-slate-400">{isRTL ? 'سرعت خالص' : 'Net WPM'}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/40">
            <div className={`text-2xl font-mono font-bold ${good ? 'text-emerald-300' : 'text-amber-300'}`}>
              {num(stepResult.accuracy)}%
            </div>
            <div className="text-[11px] text-slate-400">{isRTL ? 'دقت' : 'Accuracy'}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/40">
            <div className="text-2xl font-mono font-bold text-purple-300">{num(stepResult.totalKeystrokes)}</div>
            <div className="text-[11px] text-slate-400">{isRTL ? 'ضربه' : 'Keystrokes'}</div>
          </div>
        </div>
        {!good && (
          <p className="text-xs text-amber-200 leading-relaxed">
            {isRTL
              ? 'دقت از هدف پایین‌تر است. پیشنهاد می‌شود یک بار دیگر و آهسته‌تر تکرار کنید — تکرار، حافظهٔ عضلانی می‌سازد.'
              : 'Accuracy is below the goal. Repeat once more, slower — repetition builds muscle memory.'}
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setStepResult(null);
              setAttempt((a) => a + 1);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-slate-200 text-xs font-semibold border border-purple-800/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isRTL ? 'تکرار این تمرین' : 'Repeat this drill'}</span>
          </button>
          <button
            type="button"
            onClick={() => goToStep(currentStepIndex + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <span>{isRTL ? 'ادامه' : 'Continue'}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Breadcrumb & Step Navigation */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#120824]/90 border border-purple-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-white text-xs font-medium transition-colors shrink-0"
          >
            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isRTL ? 'نقشه راه' : 'Curriculum'}</span>
          </button>
          <div className="min-w-0">
            <div className="text-[11px] text-amber-300/80 font-mono">
              {isRTL ? `درس ${num(lesson.order)} از ${num(TOTAL_LESSONS_PER_TRACK)}` : `Lesson ${lesson.order} of ${TOTAL_LESSONS_PER_TRACK}`}
              {lesson.estMinutes ? (
                <span className="inline-flex items-center gap-1 mx-2 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {isRTL ? `حدود ${num(lesson.estMinutes)} دقیقه` : `~${lesson.estMinutes} min`}
                </span>
              ) : null}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {isRTL ? lesson.titleFa : lesson.titleEn}
            </h2>
            <p className="text-xs text-purple-300 truncate">{isRTL ? lesson.subtitleFa : lesson.subtitleEn}</p>
          </div>
        </div>

        {/* Step tracker: one dot per step */}
        <div className="flex flex-wrap items-center gap-1.5">
          {lesson.steps.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <button
                type="button"
                key={idx}
                title={`${num(idx + 1)} · ${labelFor(s.type)}`}
                onClick={() => goToStep(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : isPassed
                    ? 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/40'
                    : 'bg-purple-950/20 text-slate-400 hover:bg-purple-950/40'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : STEP_ICON[s.type]}
                <span className="font-mono">{num(idx + 1)}</span>
                <span className="hidden lg:inline">{labelFor(s.type)}</span>
              </button>
            );
          })}
        </div>
        <div className="h-1 rounded-full bg-purple-950/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-300"
            style={{ width: `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%` }}
          />
        </div>
      </div>

      {/* Learn */}
      {currentStep.type === 'learn' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#130826]/90 border border-purple-900/50 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isRTL ? 'آموزش: تکنیک و جایگاه انگشتان' : 'Learn: Technique & Finger Placement'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{stepTitle}</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{stepText}</p>
          </div>

          {lesson.keysIntroduced.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">{isRTL ? 'کلیدهای این درس:' : 'Keys in this lesson:'}</span>
              {lesson.keysIntroduced.map((k) => (
                <span
                  key={k}
                  className="px-3 py-1 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-300 font-bold font-mono text-base shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                >
                  {k === ' ' ? 'Space' : k === '\u200C' ? (isRTL ? 'نیم‌فاصله' : 'ZWNJ') : k}
                </span>
              ))}
            </div>
          )}

          <div className="py-2 bg-[#0E061A] rounded-xl border border-purple-950/70">
            <HandsOverlay
              activeFinger={
                lesson.keysIntroduced[0] ? getFingerForChar(lesson.keysIntroduced[0], layout) : 'left-index'
              }
              language={language}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-purple-200 mb-1">
                  {isRTL ? 'چرا این درس مهم است؟' : 'Why this lesson?'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRTL ? lesson.whyThisLessonFa : lesson.whyThisLessonEn}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-200 mb-1">
                  {isRTL ? 'خطاهای رایج که باید پرهیز کرد:' : 'Common mistakes to avoid:'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRTL ? lesson.commonMistakesFa : lesson.commonMistakesEn}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
            <span>
              {isRTL
                ? `این درس ${num(totalSteps)} گام دارد: ${num(drillTotal)} تمرین و یک آزمون.`
                : `This lesson has ${totalSteps} steps: ${drillTotal} drills and one test.`}
            </span>
            <button
              type="button"
              onClick={() => goToStep(currentStepIndex + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-sm font-semibold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <span>{isRTL ? 'شروع تمرین' : 'Start practice'}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Watch */}
      {currentStep.type === 'watch' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#130826]/90 border border-purple-900/50 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {isRTL ? 'مشاهده: الگوی ضربه' : 'Watch: Stroke Pattern'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{stepTitle}</h3>
              <p className="text-xs text-slate-300 mt-1">{stepText}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setWatchDemoCharIndex(0);
                setIsDemoRunning(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-semibold shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all shrink-0"
            >
              {isDemoRunning ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isDemoRunning ? (isRTL ? 'شروع مجدد' : 'Replay') : isRTL ? 'پخش دمو' : 'Play Demo'}</span>
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F071D] border border-purple-950/80 text-center min-h-[120px] flex items-center justify-center">
            <div className={`text-2xl sm:text-3xl tracking-widest ${isRTL ? 'font-fa' : 'font-mono'}`}>
              {currentStep.targetText.split('').map((char, idx) => {
                const isTyped = idx < watchDemoCharIndex;
                const isCurrent = idx === watchDemoCharIndex;
                return (
                  <span
                    key={idx}
                    className={`transition-all duration-100 ${
                      isTyped
                        ? 'text-amber-400 font-bold'
                        : isCurrent
                        ? 'text-white underline decoration-amber-400 animate-pulse'
                        : 'text-slate-600'
                    }`}
                  >
                    {char === '\u200C' ? '[‌]' : char}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => goToStep(currentStepIndex - 1)}
              className="px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 text-xs font-medium"
            >
              {isRTL ? 'بازگشت' : 'Back'}
            </button>
            <button
              type="button"
              onClick={() => goToStep(currentStepIndex + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <span>{isRTL ? 'گام بعد: تمرین' : 'Next: Practice'}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Guided drill (keyboard + hands) */}
      {currentStep.type === 'guided' && (
        <div className="flex flex-col gap-4">
          <StepHeader tone="gold" />
          {stepResult ? (
            <StepResultCard />
          ) : (
            <TypingArena
              key={stepKey}
              targetText={currentStep.targetText}
              language={language}
              layout={layout}
              typingMode={typingMode}
              soundTheme={soundTheme}
              showKeyboard={true}
              showHands={true}
              onComplete={handleDrillComplete}
            />
          )}
        </div>
      )}

      {/* Free drill (no keyboard) */}
      {currentStep.type === 'free' && (
        <div className="flex flex-col gap-4">
          <StepHeader tone="purple" />
          {stepResult ? (
            <StepResultCard />
          ) : (
            <TypingArena
              key={stepKey}
              targetText={currentStep.targetText}
              language={language}
              layout={layout}
              typingMode={typingMode}
              soundTheme={soundTheme}
              showKeyboard={false}
              showHands={false}
              onComplete={handleDrillComplete}
            />
          )}
        </div>
      )}

      {/* Test */}
      {currentStep.type === 'test' && (
        <div className="flex flex-col gap-4">
          {!testMetrics ? (
            <>
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 flex items-center justify-between gap-3 text-xs text-amber-200">
                <span>
                  {isRTL
                    ? `آزمون درس: حداقل ${num(lesson.targetWpm)} کلمه در دقیقه با دقت ${num(lesson.minAccuracy)}٪.`
                    : `Lesson test: goal ≥ ${lesson.targetWpm} WPM with ≥ ${lesson.minAccuracy}% accuracy.`}
                </span>
                <span className="font-bold text-amber-400 shrink-0">+{num(lesson.xpReward)} XP</span>
              </div>
              <TypingArena
                key={stepKey}
                targetText={currentStep.targetText}
                language={language}
                layout={layout}
                typingMode={typingMode}
                soundTheme={soundTheme}
                showKeyboard={lesson.kind !== 'exam'}
                showHands={false}
                onComplete={handleTestComplete}
              />
            </>
          ) : (
            <ResultsSummary
              metrics={testMetrics}
              stars={calculateStars(testMetrics.netWpm, lesson.targetWpm, testMetrics.accuracy, lesson.minAccuracy)}
              xpEarned={
                calculateStars(testMetrics.netWpm, lesson.targetWpm, testMetrics.accuracy, lesson.minAccuracy) > 0
                  ? lesson.xpReward
                  : 15
              }
              targetWpm={lesson.targetWpm}
              minAccuracy={lesson.minAccuracy}
              language={language}
              onRetry={() => {
                setTestMetrics(null);
                setAttempt((a) => a + 1);
              }}
              onNext={onNextLesson}
            />
          )}
        </div>
      )}
    </div>
  );
};
