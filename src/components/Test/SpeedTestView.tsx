import React, { useMemo, useState } from 'react';
import {
  Language,
  KeyboardLayoutType,
  TypingMode,
  UserStats,
  SessionMetrics,
  SoundTheme,
} from '../../types/typing';
import { PRACTICE_TEXTS } from '../../data/quotesAndTexts';
import { TypingArena } from '../TypingArena/TypingArena';
import { ResultsSummary } from '../TypingArena/ResultsSummary';
import { sound } from '../../utils/sound';
import { Clock, Award, Printer, CheckCircle, Play, X, ArrowLeft } from 'lucide-react';

interface SpeedTestViewProps {
  userStats: UserStats;
  language: Language;
  layout: KeyboardLayoutType;
  typingMode: TypingMode;
  soundTheme?: SoundTheme;
  onTestFinish: (metrics: SessionMetrics) => void;
}

const PASS_WPM = 40;
const PASS_ACCURACY = 95;
const TEST_DURATIONS = [15, 30, 60, 120];

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({
  language,
  layout,
  typingMode,
  soundTheme = 'royal-santoor',
  onTestFinish,
}) => {
  const isRTL = language === 'fa';
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const locale = isRTL ? 'fa-IR' : 'en-US';
  const number = new Intl.NumberFormat(locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date());

  const targetText = useMemo(() => {
    const passages = PRACTICE_TEXTS
      .filter((item) => item.language === language)
      .map((item) => item.text.trim())
      .filter(Boolean);
    const baseText =
      passages.join('\n\n') ||
      (isRTL
        ? 'تمرین پیوسته به افزایش دقت، سرعت و آرامش در تایپ کمک می‌کند.'
        : 'Consistent practice improves accuracy, speed, and confidence.');
    // Keep enough text on screen for a full timed run, even at a fast pace.
    const minimumCharacters = selectedDuration * 24;
    let expandedText = baseText;
    while (expandedText.length < minimumCharacters) expandedText += `\n\n${baseText}`;
    return expandedText;
  }, [language, isRTL, selectedDuration]);

  const handleStart = () => {
    sound.playCountdownTick(true);
    setIsTestActive(true);
    setMetrics(null);
    setShowCertificate(false);
  };

  const handleComplete = (sessionMetrics: SessionMetrics) => {
    setIsTestActive(false);
    setMetrics(sessionMetrics);
    sound.playVictory(
      sessionMetrics.netWpm >= PASS_WPM && sessionMetrics.accuracy >= PASS_ACCURACY ? 3 : 2
    );
    onTestFinish(sessionMetrics);
  };

  const handlePrintCertificate = () => window.print();
  const passed = Boolean(
    metrics && metrics.netWpm >= PASS_WPM && metrics.accuracy >= PASS_ACCURACY
  );

  return (
    <div className="pilla-experience-page pilla-test-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="pilla-experience-hero">
        <div className="pilla-experience-hero-mark"><Clock aria-hidden="true" /></div>
        <div className="pilla-experience-hero-copy">
          <p className="pilla-experience-eyebrow">{isRTL ? 'مرکز سنجش' : 'SPEED LAB'}</p>
          <h2>{isRTL ? 'آزمون سرعت و دقت تایپ' : 'Typing speed & accuracy test'}</h2>
          <p>
            {isRTL
              ? 'سرعت خالص بر پایهٔ پنج نویسه برای هر واژه محاسبه می‌شود؛ زمان از اولین کلید شروع می‌شود.'
              : 'Net WPM uses five characters per word. The clock begins with your first keystroke.'}
          </p>
        </div>
        {isTestActive && (
          <button
            type="button"
            className="pilla-secondary-action"
            onClick={() => setIsTestActive(false)}
          >
            <X aria-hidden="true" />
            {isRTL ? 'لغو آزمون' : 'Cancel test'}
          </button>
        )}
      </header>

      {!isTestActive && !metrics && (
        <section className="pilla-test-setup">
          <div className="pilla-test-setup-heading">
            <div>
              <p className="pilla-experience-eyebrow">{isRTL ? 'تنظیم آزمون' : 'TEST SETUP'}</p>
              <h3>{isRTL ? 'مدت آزمون را انتخاب کن' : 'Choose a test duration'}</h3>
            </div>
            <span className="pilla-test-method-chip">
              {isRTL ? 'زمان‌سنج واقعی' : 'Timed'}
            </span>
          </div>
          <div className="pilla-duration-grid" role="group" aria-label={isRTL ? 'مدت آزمون' : 'Test duration'}>
            {TEST_DURATIONS.map((seconds) => (
              <button
                type="button"
                key={seconds}
                className={`pilla-duration-choice${selectedDuration === seconds ? ' is-selected' : ''}`}
                aria-pressed={selectedDuration === seconds}
                onClick={() => setSelectedDuration(seconds)}
              >
                <strong>{number.format(seconds)}</strong>
                <span>{isRTL ? 'ثانیه' : 'seconds'}</span>
                {seconds === 60 && <small>{isRTL ? 'استاندارد' : 'Standard'}</small>}
              </button>
            ))}
          </div>
          <div className="pilla-test-setup-footer">
            <p>
              {isRTL
                ? `متن آزمون برای ${number.format(selectedDuration)} ثانیه آماده می‌شود و در صورت نیاز ادامه پیدا می‌کند.`
                : `The passage is extended to cover a ${number.format(selectedDuration)}-second run.`}
            </p>
            <button type="button" className="pilla-primary-action" onClick={handleStart}>
              <Play aria-hidden="true" />
              {isRTL ? `شروع آزمون ${number.format(selectedDuration)} ثانیه‌ای` : `Start ${number.format(selectedDuration)}-second test`}
            </button>
          </div>
        </section>
      )}

      {isTestActive && (
        <section className="pilla-exercise-shell">
          <div className="pilla-exercise-heading">
            <div>
              <p className="pilla-experience-eyebrow">{isRTL ? 'آزمون در جریان' : 'TEST IN PROGRESS'}</p>
              <h3>{isRTL ? `${number.format(selectedDuration)} ثانیه` : `${number.format(selectedDuration)} seconds`}</h3>
            </div>
            <span className="pilla-live-pill"><i />{isRTL ? 'زمان با اولین کلید آغاز می‌شود' : 'Clock starts on first key'}</span>
          </div>
          <TypingArena
            targetText={targetText}
            language={language}
            layout={layout}
            typingMode={typingMode}
            soundTheme={soundTheme}
            timeLimitSeconds={selectedDuration}
            showKeyboard
            showHands={false}
            onComplete={handleComplete}
          />
        </section>
      )}

      {metrics && !showCertificate && (
        <div className="pilla-results-stack">
          <ResultsSummary
            metrics={metrics}
            stars={passed ? 3 : metrics.netWpm >= 32 && metrics.accuracy >= 90 ? 2 : 1}
            xpEarned={passed ? 150 : 75}
            targetWpm={PASS_WPM}
            minAccuracy={PASS_ACCURACY}
            language={language}
            onRetry={handleStart}
          />
          {passed && (
            <section className="pilla-certificate-promo">
              <span className="pilla-certificate-mark"><Award aria-hidden="true" /></span>
              <div>
                <p className="pilla-experience-eyebrow">{isRTL ? 'دستاورد آزمون' : 'TEST MILESTONE'}</p>
                <h3>{isRTL ? 'شرایط دریافت گواهی را به دست آوردی' : 'You met the certificate standard'}</h3>
                <p>
                  {isRTL
                    ? `حدنصاب این نسخه: ${number.format(PASS_WPM)} واژه در دقیقه و ${number.format(PASS_ACCURACY)}٪ دقت.`
                    : `This certificate requires ${PASS_WPM} WPM and ${PASS_ACCURACY}% accuracy.`}
                </p>
              </div>
              <button type="button" className="pilla-secondary-action" onClick={() => setShowCertificate(true)}>
                <Award aria-hidden="true" />
                {isRTL ? 'ساخت گواهی' : 'Create certificate'}
              </button>
            </section>
          )}
          <div className="pilla-test-result-actions">
            <button
              type="button"
              className="pilla-secondary-action"
              onClick={() => {
                setMetrics(null);
                setShowCertificate(false);
              }}
            >
              <ArrowLeft aria-hidden="true" />
              {isRTL ? 'تغییر مدت آزمون' : 'Change duration'}
            </button>
          </div>
        </div>
      )}

      {showCertificate && metrics && (
        <section className="pilla-certificate">
          <div className="pilla-certificate-inner">
            <div className="pilla-certificate-top">
              <span className="pilla-experience-eyebrow">PILLA · TYPING ACADEMY</span>
              <span className="pilla-certificate-seal"><CheckCircle aria-hidden="true" /></span>
            </div>
            <h2>{isRTL ? 'گواهی تسلط بر تایپ' : 'Certificate of Typing Proficiency'}</h2>
            <p className="pilla-certificate-description">
              {isRTL ? 'این گواهی به' : 'This certificate is awarded to'}
            </p>
            <label className="pilla-candidate-field">
              <span>{isRTL ? 'نام دریافت‌کننده' : 'Recipient name'}</span>
              <input
                value={candidateName}
                onChange={(event) => setCandidateName(event.target.value)}
                placeholder={isRTL ? 'نام خود را وارد کن' : 'Enter a name'}
                aria-label={isRTL ? 'نام دریافت‌کنندهٔ گواهی' : 'Certificate recipient name'}
              />
            </label>
            <p className="pilla-certificate-description">
              {isRTL ? 'برای دستیابی به حدنصاب سرعت و دقت تایپ.' : 'for meeting the typing speed and accuracy standard.'}
            </p>
            <div className="pilla-certificate-scores">
              <div><strong>{number.format(metrics.netWpm)}</strong><span>WPM</span></div>
              <div><strong>{number.format(metrics.accuracy)}٪</strong><span>{isRTL ? 'دقت' : 'Accuracy'}</span></div>
              <div><strong>{number.format(metrics.consistency)}٪</strong><span>{isRTL ? 'یکنواختی' : 'Consistency'}</span></div>
            </div>
            <div className="pilla-certificate-date">
              <span>{date}</span>
              <span>{isRTL ? 'تأییدشده در پیلا' : 'Pilla Academy'}</span>
            </div>
            <div className="pilla-certificate-actions">
              <button type="button" className="pilla-primary-action" onClick={handlePrintCertificate}>
                <Printer aria-hidden="true" />
                {isRTL ? 'چاپ یا ذخیره PDF' : 'Print / Save PDF'}
              </button>
              <button type="button" className="pilla-secondary-action" onClick={() => setShowCertificate(false)}>
                <ArrowLeft aria-hidden="true" />
                {isRTL ? 'بازگشت به نتیجه' : 'Back to results'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};