import React, { useMemo, useState } from 'react';
import { Language, UserStats, FingerType } from '../../types/typing';
import { ACHIEVEMENTS } from '../../data/achievements';
import { exportUserData, importUserData } from '../../utils/storage';
import {
  BarChart2,
  Download,
  Upload,
  Award,
  Activity,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Fingerprint,
  CheckCircle2,
} from 'lucide-react';

interface StatsAnalyticsProps {
  userStats: UserStats;
  language: Language;
  onStatsUpdated: () => void;
}

type HistoryRecord = UserStats['sessionHistory'][number];
type TrendMetric = 'wpm' | 'accuracy' | 'consistency';

const FINGER_LABELS: Record<FingerType, { fa: string; en: string }> = {
  'left-pinky': { fa: 'کوچک چپ', en: 'Left little' },
  'left-ring': { fa: 'حلقه چپ', en: 'Left ring' },
  'left-middle': { fa: 'میانی چپ', en: 'Left middle' },
  'left-index': { fa: 'اشاره چپ', en: 'Left index' },
  thumb: { fa: 'شست', en: 'Thumb' },
  'right-index': { fa: 'اشاره راست', en: 'Right index' },
  'right-middle': { fa: 'میانی راست', en: 'Right middle' },
  'right-ring': { fa: 'حلقه راست', en: 'Right ring' },
  'right-pinky': { fa: 'کوچک راست', en: 'Right little' },
};

const TYPE_LABELS: Record<HistoryRecord['type'], { fa: string; en: string }> = {
  lesson: { fa: 'درس', en: 'Lesson' },
  practice: { fa: 'تمرین', en: 'Practice' },
  race: { fa: 'مسابقه', en: 'Race' },
  test: { fa: 'آزمون', en: 'Test' },
};

export const StatsAnalytics: React.FC<StatsAnalyticsProps> = ({
  userStats,
  language,
  onStatsUpdated,
}) => {
  const isRTL = language === 'fa';
  const locale = isRTL ? 'fa-IR' : 'en-US';
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const decimal = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );
  const [windowSize, setWindowSize] = useState(12);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const allHistory = (userStats.sessionHistory ?? []).filter(
    (session) =>
      Number.isFinite(session.wpm) &&
      Number.isFinite(session.accuracy) &&
      Boolean(session.date)
  );
  const visibleHistory = allHistory.slice(-windowSize);
  const latest = visibleHistory.at(-1);
  const previous = visibleHistory.at(-2);
  const averageWpm = average(visibleHistory.map((session) => session.wpm));
  const averageAccuracy = average(visibleHistory.map((session) => session.accuracy));
  const consistencySessions = visibleHistory.filter(
    (session) => typeof session.consistency === 'number' && Number.isFinite(session.consistency)
  );
  const averageConsistency = average(consistencySessions.map((session) => session.consistency!));
  const typedSessions = visibleHistory.filter(
    (session) =>
      typeof session.totalKeystrokes === 'number' &&
      typeof session.correctKeystrokes === 'number' &&
      session.totalKeystrokes > 0
  );
  const typedCount = typedSessions.reduce((sum, session) => sum + (session.totalKeystrokes ?? 0), 0);
  const correctCount = typedSessions.reduce((sum, session) => sum + (session.correctKeystrokes ?? 0), 0);
  const aggregateAccuracy = typedCount ? (correctCount / typedCount) * 100 : null;

  const keyErrors = useMemo(() => aggregateKeyErrors(visibleHistory), [visibleHistory]);
  const fingerErrors = useMemo(() => aggregateFingerErrors(visibleHistory), [visibleHistory]);
  const detailedSessionCount = visibleHistory.filter((session) => Array.isArray(session.keyStats)).length;

  const handleExport = () => {
    const data = exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `pilla-typing-progress-${new Date().toISOString().split('T')[0]}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const content = loadEvent.target?.result;
      const success = typeof content === 'string' && importUserData(content);
      setImportMessage(
        success
          ? isRTL
            ? 'پیشرفت با موفقیت بازیابی شد.'
            : 'Progress restored successfully.'
          : isRTL
            ? 'فایل انتخاب‌شده معتبر نیست.'
            : 'The selected file is not a valid backup.'
      );
      if (success) onStatsUpdated();
      event.target.value = '';
    };
    reader.onerror = () => {
      setImportMessage(isRTL ? 'خواندن فایل ممکن نشد.' : 'Could not read the selected file.');
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: '2-digit' }).format(parsed);
  };
  const formatWpm = (value: number) => `${number.format(Math.round(value))} WPM`;
  const formatPercent = (value: number) => `${decimal.format(value)}٪`;
  const deltaLabel = (value: number, unit: 'wpm' | 'pp') => {
    const sign = value > 0 ? '+' : value < 0 ? '−' : '';
    const magnitude = number.format(Math.abs(Math.round(value * 10) / 10));
    return unit === 'wpm'
      ? `${sign}${magnitude} WPM`
      : `${sign}${magnitude} ${isRTL ? 'واحد درصد' : 'percentage points'}`;
  };
  const windowLabel =
    isRTL ? `آخرین ${number.format(windowSize)} جلسه` : `Last ${number.format(windowSize)} sessions`;

  return (
    <div className="pilla-experience-page pilla-stats-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="pilla-experience-hero pilla-stats-hero">
        <div className="pilla-experience-hero-mark"><BarChart2 aria-hidden="true" /></div>
        <div className="pilla-experience-hero-copy">
          <p className="pilla-experience-eyebrow">{isRTL ? 'داشبورد عملکرد' : 'PERFORMANCE OVERVIEW'}</p>
          <h2>{isRTL ? 'پیشرفت واقعی، از روی جلسه‌های ثبت‌شده' : 'Your progress, grounded in real sessions'}</h2>
          <p>
            {isRTL
              ? 'سرعت، دقت و یکنواختی جداگانه سنجیده می‌شوند؛ داده‌ای حدس زده یا جایگزین نمی‌شود.'
              : 'Speed, accuracy, and consistency are measured separately—no estimated values are added.'}
          </p>
        </div>
        <div className="pilla-data-actions">
          <button type="button" className="pilla-secondary-action" onClick={handleExport}>
            <Download aria-hidden="true" />
            {isRTL ? 'دریافت نسخهٔ پشتیبان' : 'Export backup'}
          </button>
          <label className="pilla-secondary-action pilla-import-action">
            <Upload aria-hidden="true" />
            {isRTL ? 'بازیابی نسخه' : 'Import backup'}
            <input type="file" accept=".json,application/json" onChange={handleImport} />
          </label>
        </div>
      </header>

      {importMessage && (
        <div className="pilla-import-message" role="status">
          <CheckCircle2 aria-hidden="true" />
          {importMessage}
        </div>
      )}

      <section className="pilla-stats-toolbar" aria-label={isRTL ? 'دورهٔ آمار' : 'Statistics range'}>
        <div>
          <p className="pilla-experience-eyebrow">{isRTL ? 'بازهٔ قابل مشاهده' : 'VISIBLE WINDOW'}</p>
          <h3>{windowLabel}</h3>
        </div>
        <div className="pilla-range-toggle" role="group" aria-label={isRTL ? 'تعداد جلسه‌ها' : 'Number of sessions'}>
          {[5, 12, 30].map((size) => (
            <button
              type="button"
              key={size}
              aria-pressed={windowSize === size}
              className={windowSize === size ? 'is-selected' : ''}
              onClick={() => setWindowSize(size)}
            >
              {number.format(size)}
            </button>
          ))}
        </div>
      </section>

      <section className="pilla-stats-summary-grid" aria-label={isRTL ? 'خلاصهٔ عملکرد' : 'Performance summary'}>
        <MetricCard
          icon={<Activity aria-hidden="true" />}
          label={isRTL ? 'میانگین سرعت در این بازه' : 'Average speed in this window'}
          value={averageWpm === null ? '—' : formatWpm(averageWpm)}
          foot={latest ? `${isRTL ? 'جلسهٔ آخر' : 'Latest'} · ${formatWpm(latest.wpm)}` : isRTL ? 'هنوز جلسه‌ای ثبت نشده' : 'No sessions yet'}
          tone="gold"
        />
        <MetricCard
          icon={<Target aria-hidden="true" />}
          label={aggregateAccuracy === null
            ? isRTL ? 'میانگین دقت جلسه‌ها' : 'Mean session accuracy'
            : isRTL ? 'دقت تجمیعی ضربه‌ها' : 'Pooled keystroke accuracy'}
          value={aggregateAccuracy === null
            ? averageAccuracy === null ? '—' : formatPercent(averageAccuracy)
            : formatPercent(aggregateAccuracy)}
          foot={aggregateAccuracy === null
            ? isRTL ? 'بر پایهٔ میانگین جلسه‌ها' : 'Mean of session results'
            : `${number.format(correctCount)} / ${number.format(typedCount)} ${isRTL ? 'ضربهٔ درست' : 'correct keystrokes'}`}
          tone="sage"
        />
        <MetricCard
          icon={<Zap aria-hidden="true" />}
          label={isRTL ? 'یکنواختی ضربه‌ها' : 'Typing consistency'}
          value={averageConsistency === null ? '—' : formatPercent(averageConsistency)}
          foot={isRTL
            ? `${number.format(consistencySessions.length)} جلسه دارای دادهٔ یکنواختی`
            : `${number.format(consistencySessions.length)} sessions with consistency data`}
          tone="lavender"
        />
        <MetricCard
          icon={<Clock aria-hidden="true" />}
          label={isRTL ? 'رکورد سرعت ثبت‌شده' : 'Recorded speed record'}
          value={formatWpm(userStats.bestWpm || 0)}
          foot={isRTL
            ? `${number.format(allHistory.length)} جلسه در تاریخچهٔ موجود`
            : `${number.format(allHistory.length)} sessions in available history`}
          tone="blue"
        />
      </section>

      {visibleHistory.length > 0 ? (
        <>
          <section className="pilla-stats-chart-grid" aria-label={isRTL ? 'روند عملکرد' : 'Performance trends'}>
            <TrendChart
              metric="wpm"
              title={isRTL ? 'روند سرعت خالص' : 'Net speed trend'}
              subtitle={isRTL ? 'واژه در دقیقه · هر نقطه یک جلسه' : 'Words per minute · one point per session'}
              data={visibleHistory}
              locale={locale}
              number={number}
              formatDate={formatDate}
              color="gold"
              isRTL={isRTL}
            />
            <TrendChart
              metric="accuracy"
              title={isRTL ? 'روند دقت' : 'Accuracy trend'}
              subtitle={isRTL ? 'درصد پاسخ‌های درست در هر جلسه' : 'Correct keystrokes per session'}
              data={visibleHistory}
              locale={locale}
              number={number}
              formatDate={formatDate}
              color="sage"
              isRTL={isRTL}
            />
            <TrendChart
              metric="consistency"
              title={isRTL ? 'روند یکنواختی' : 'Consistency trend'}
              subtitle={isRTL ? 'درصد یکنواختی محاسبه‌شده برای هر جلسه' : 'Calculated consistency for each session'}
              data={visibleHistory}
              locale={locale}
              number={number}
              formatDate={formatDate}
              color="lavender"
              isRTL={isRTL}
            />
          </section>

          <section className="pilla-session-insight">
            <div className="pilla-session-insight-heading">
              <span className="pilla-insight-icon"><TrendingUp aria-hidden="true" /></span>
              <div>
                <p className="pilla-experience-eyebrow">{isRTL ? 'مقایسهٔ کوتاه' : 'SESSION COMPARISON'}</p>
                <h3>{isRTL ? 'جلسهٔ آخر در برابر جلسهٔ قبل' : 'Latest session vs. previous session'}</h3>
              </div>
            </div>
            {latest && previous ? (
              <div className="pilla-session-deltas">
                <DeltaItem
                  label={isRTL ? 'سرعت خالص' : 'Net speed'}
                  value={deltaLabel(latest.wpm - previous.wpm, 'wpm')}
                  direction={latest.wpm - previous.wpm}
                  positiveWhenUp
                  isRTL={isRTL}
                />
                <DeltaItem
                  label={isRTL ? 'دقت' : 'Accuracy'}
                  value={deltaLabel(latest.accuracy - previous.accuracy, 'pp')}
                  direction={latest.accuracy - previous.accuracy}
                  positiveWhenUp
                  isRTL={isRTL}
                />
                {typeof latest.consistency === 'number' && typeof previous.consistency === 'number' && (
                  <DeltaItem
                    label={isRTL ? 'یکنواختی' : 'Consistency'}
                    value={deltaLabel(latest.consistency - previous.consistency, 'pp')}
                    direction={latest.consistency - previous.consistency}
                    positiveWhenUp
                    isRTL={isRTL}
                  />
                )}
              </div>
            ) : (
              <p className="pilla-session-insight-empty">
                {isRTL ? 'برای مقایسهٔ جلسه‌به‌جلسه، دست‌کم دو جلسهٔ ثبت‌شده لازم است.' : 'At least two recorded sessions are needed for a session-to-session comparison.'}
              </p>
            )}
          </section>

          <section className="pilla-diagnostics-grid">
            <div className="pilla-diagnostic-panel">
              <div className="pilla-diagnostic-heading">
                <span className="pilla-diagnostic-icon"><Fingerprint aria-hidden="true" /></span>
                <div>
                  <p className="pilla-experience-eyebrow">{isRTL ? 'دقت کلیدها' : 'KEY ACCURACY'}</p>
                  <h3>{isRTL ? 'کلیدهایی که بیشترین خطا را داشته‌اند' : 'Keys with the most recorded errors'}</h3>
                </div>
              </div>
              {keyErrors.length ? (
                <>
                  <div className="pilla-key-error-list">
                    {keyErrors.map((key) => (
                      <div className="pilla-key-error-row" key={key.char}>
                        <kbd>{key.char === ' ' ? (isRTL ? 'فاصله' : 'Space') : key.char}</kbd>
                        <div className="pilla-key-error-info">
                          <div className="pilla-key-error-label">
                            <span>{formatPercent((key.errors / key.total) * 100)} {isRTL ? 'خطا' : 'error rate'}</span>
                            <small>{number.format(key.errors)} / {number.format(key.total)} {isRTL ? 'ضربه' : 'keystrokes'}</small>
                          </div>
                          <div className="pilla-key-error-track" aria-hidden="true">
                            <span style={{ width: `${Math.min(100, (key.errors / key.total) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="pilla-data-footnote">
                    {isRTL
                      ? `دادهٔ جزئی کلیدها در ${number.format(detailedSessionCount)} جلسه از این بازه موجود است؛ نرخ‌ها فقط از همان جلسه‌ها محاسبه شده‌اند.`
                      : `Detailed key data is available for ${number.format(detailedSessionCount)} sessions in this window; rates use only those sessions.`}
                  </p>
                </>
              ) : (
                <EmptyDiagnostic isRTL={isRTL} text={isRTL ? 'برای تحلیل کلیدها، یک تمرین تازه انجام بده.' : 'Complete a new session to begin key-level analysis.'} />
              )}
            </div>

            <div className="pilla-diagnostic-panel">
              <div className="pilla-diagnostic-heading">
                <span className="pilla-diagnostic-icon sage"><Activity aria-hidden="true" /></span>
                <div>
                  <p className="pilla-experience-eyebrow">{isRTL ? 'تحلیل انگشت‌ها' : 'FINGER ANALYSIS'}</p>
                  <h3>{isRTL ? 'نرخ خطا بر اساس انگشت' : 'Error rate by finger'}</h3>
                </div>
              </div>
              {fingerErrors.length ? (
                <div className="pilla-finger-error-list">
                  {fingerErrors.map((finger) => (
                    <div className="pilla-finger-error-row" key={finger.id}>
                      <span>{isRTL ? FINGER_LABELS[finger.id].fa : FINGER_LABELS[finger.id].en}</span>
                      <div className="pilla-key-error-track" aria-hidden="true">
                        <span style={{ width: `${Math.min(100, (finger.errors / finger.total) * 100)}%` }} />
                      </div>
                      <strong>{formatPercent((finger.errors / finger.total) * 100)}</strong>
                      <small>{number.format(finger.errors)} / {number.format(finger.total)}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyDiagnostic isRTL={isRTL} text={isRTL ? 'دادهٔ انگشت‌ها با جلسه‌های جدید ثبت می‌شود.' : 'Finger-level data will appear after a new session.'} />
              )}
              <p className="pilla-data-footnote">
                {isRTL ? 'حداقل ۵ ضربه برای هر انگشت در بازهٔ انتخاب‌شده لازم است.' : 'At least five keystrokes per finger are required in the selected window.'}
              </p>
            </div>
          </section>

          <details className="pilla-data-details">
            <summary>{isRTL ? 'مشاهدهٔ مقادیر دقیق جلسه‌ها' : 'View exact session values'}</summary>
            <div className="pilla-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{isRTL ? 'تاریخ' : 'Date'}</th>
                    <th>{isRTL ? 'نوع' : 'Type'}</th>
                    <th>WPM</th>
                    <th>{isRTL ? 'دقت' : 'Accuracy'}</th>
                    <th>{isRTL ? 'یکنواختی' : 'Consistency'}</th>
                    <th>{isRTL ? 'خطا' : 'Errors'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...visibleHistory].reverse().map((session, index) => (
                    <tr key={`${session.date}-${index}`}>
                      <td>{formatDate(session.date)}</td>
                      <td>{isRTL ? TYPE_LABELS[session.type].fa : TYPE_LABELS[session.type].en}</td>
                      <td>{number.format(session.wpm)}</td>
                      <td>{formatPercent(session.accuracy)}</td>
                      <td>{typeof session.consistency === 'number' ? formatPercent(session.consistency) : '—'}</td>
                      <td>{number.format(session.errors)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <section className="pilla-stats-empty">
          <span><BarChart2 aria-hidden="true" /></span>
          <h3>{isRTL ? 'هنوز داده‌ای برای رسم نمودار وجود ندارد' : 'Your first session will start the charts'}</h3>
          <p>{isRTL ? 'بعد از یک درس، تمرین، مسابقه یا آزمون، روندهای واقعی اینجا نمایش داده می‌شوند.' : 'Complete a lesson, practice, race, or test to see your real trends here.'}</p>
        </section>
      )}

      <section className="pilla-achievements-panel">
        <div className="pilla-diagnostic-heading">
          <span className="pilla-diagnostic-icon gold"><Award aria-hidden="true" /></span>
          <div>
            <p className="pilla-experience-eyebrow">{isRTL ? 'دستاوردها' : 'MILESTONES'}</p>
            <h3>{isRTL ? 'نشان‌های دگردیسی' : 'Metamorphosis achievements'}</h3>
          </div>
          <span className="pilla-achievement-count">{number.format(ACHIEVEMENTS.length)}</span>
        </div>
        <div className="pilla-achievement-grid">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = userStats.unlockedAchievements.includes(achievement.id);
            return (
              <article className={`pilla-achievement-card${unlocked ? ' is-unlocked' : ''}`} key={achievement.id}>
                <span className="pilla-achievement-badge" aria-hidden="true">{unlocked ? '✦' : '◇'}</span>
                <div>
                  <strong>{isRTL ? achievement.titleFa : achievement.titleEn}</strong>
                  <p>{isRTL ? achievement.descriptionFa : achievement.descriptionEn}</p>
                </div>
                {unlocked && <small>+{number.format(achievement.xpBonus)} XP</small>}
              </article>
            );
          })}
        </div>
      </section>

      <p className="pilla-history-note">
        {isRTL
          ? `تاریخچهٔ محلی حداکثر ${number.format(30)} جلسه را نگه می‌دارد؛ میانگین‌ها فقط از جلسه‌های قابل مشاهده در بازهٔ انتخابی هستند.`
          : `Local history keeps up to ${number.format(30)} sessions. Averages use only the visible sessions in the selected window.`}
      </p>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  foot: string;
  tone: 'gold' | 'sage' | 'lavender' | 'blue';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, foot, tone }) => (
  <article className={`pilla-metric-card ${tone}`}>
    <span className="pilla-metric-icon">{icon}</span>
    <p>{label}</p>
    <strong>{value}</strong>
    <small>{foot}</small>
  </article>
);

interface TrendChartProps {
  metric: TrendMetric;
  title: string;
  subtitle: string;
  data: HistoryRecord[];
  locale: string;
  number: Intl.NumberFormat;
  formatDate: (date: string) => string;
  color: 'gold' | 'sage' | 'lavender';
  isRTL: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({
  metric,
  title,
  subtitle,
  data,
  number,
  formatDate,
  color,
  isRTL,
}) => {
  const width = 680;
  const height = 224;
  const left = 42;
  const right = 12;
  const top = 14;
  const bottom = 35;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const getValue = (session: HistoryRecord) => {
    const value = session[metric];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  };
  const validValues = data.map(getValue).filter((value): value is number => value !== null);
  const ceiling =
    metric === 'wpm'
      ? Math.max(20, Math.ceil(Math.max(0, ...validValues) / 20) * 20)
      : 100;
  const tickCount = 4;
  const yFor = (value: number) => top + plotHeight - (value / ceiling) * plotHeight;
  const xFor = (index: number) =>
    left + (data.length <= 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const points = data.map((session, index) => {
    const value = getValue(session);
    return value === null ? null : { x: xFor(index), y: yFor(value), value, session, index };
  });
  const segments: Array<Array<NonNullable<(typeof points)[number]>>> = [];
  let currentSegment: Array<NonNullable<(typeof points)[number]>> = [];
  points.forEach((point) => {
    if (point) currentSegment.push(point);
    else if (currentSegment.length) {
      segments.push(currentSegment);
      currentSegment = [];
    }
  });
  if (currentSegment.length) segments.push(currentSegment);
  const labelIndexes = Array.from(new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]));
  const formatValue = (value: number) =>
    metric === 'wpm' ? `${number.format(value)} WPM` : `${number.format(Math.round(value * 10) / 10)}٪`;
  const accessibleValues = points
    .filter((point): point is NonNullable<(typeof points)[number]> => point !== null)
    .map((point) => `${formatDate(point.session.date)}: ${formatValue(point.value)}`);

  return (
    <article className={`pilla-chart-panel ${color}`}>
      <div className="pilla-chart-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="pilla-chart-latest">
          {accessibleValues.at(-1) ?? (isRTL ? 'بدون داده' : 'No data')}
        </span>
      </div>
      {validValues.length ? (
        <>
          <div className="pilla-chart-wrap">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={`${title}. ${accessibleValues.join('; ')}`}
              preserveAspectRatio="none"
            >
              {[0, 1, 2, 3, 4].map((step) => {
                const value = (ceiling / tickCount) * step;
                const y = yFor(value);
                return (
                  <g key={step}>
                    <line x1={left} x2={width - right} y1={y} y2={y} className="pilla-chart-gridline" />
                    <text x={left - 8} y={y + 4} textAnchor="end" className="pilla-chart-tick">
                      {number.format(Math.round(value))}
                    </text>
                  </g>
                );
              })}
              {segments.map((segment, index) => (
                <polyline
                  key={index}
                  points={segment.map((point) => `${point.x},${point.y}`).join(' ')}
                  className="pilla-chart-line"
                  fill="none"
                />
              ))}
              {points.map((point, index) =>
                point ? (
                  <circle
                    key={`${point.session.date}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    className="pilla-chart-point"
                    tabIndex={0}
                  >
                    <title>{`${formatDate(point.session.date)} · ${formatValue(point.value)}`}</title>
                  </circle>
                ) : null
              )}
              {labelIndexes.map((index) => (
                <text
                  key={index}
                  x={xFor(index)}
                  y={height - 8}
                  textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
                  className="pilla-chart-date"
                >
                  {formatDate(data[index].date)}
                </text>
              ))}
            </svg>
          </div>
          <ul className="pilla-visually-hidden">
            {accessibleValues.map((value) => <li key={value}>{value}</li>)}
          </ul>
        </>
      ) : (
        <div className="pilla-chart-no-data">
          {isRTL
            ? 'این داده برای جلسه‌های قدیمی‌تر ذخیره نشده است.'
            : 'This measure was not recorded for older sessions.'}
        </div>
      )}
    </article>
  );
};

interface DeltaItemProps {
  label: string;
  value: string;
  direction: number;
  positiveWhenUp: boolean;
  isRTL: boolean;
}

const DeltaItem: React.FC<DeltaItemProps> = ({ label, value, direction, positiveWhenUp, isRTL }) => {
  const tone = direction === 0 ? 'neutral' : (direction > 0) === positiveWhenUp ? 'positive' : 'negative';
  return (
    <div className={`pilla-delta-item ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{isRTL ? 'نسبت به جلسهٔ پیشین' : 'vs. previous session'}</small>
    </div>
  );
};

const EmptyDiagnostic: React.FC<{ isRTL: boolean; text: string }> = ({ isRTL: _isRTL, text }) => (
  <div className="pilla-diagnostic-empty">{text}</div>
);

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function aggregateKeyErrors(sessions: HistoryRecord[]) {
  const aggregate = new Map<string, { total: number; errors: number }>();
  sessions.forEach((session) => {
    session.keyStats?.forEach((key) => {
      if (!key.char.trim() || key.total < 1) return;
      const current = aggregate.get(key.char) ?? { total: 0, errors: 0 };
      current.total += key.total;
      current.errors += key.errors;
      aggregate.set(key.char, current);
    });
  });
  return [...aggregate.entries()]
    .map(([char, values]) => ({ char, ...values }))
    .filter((key) => key.total >= 3 && key.errors > 0)
    .sort((a, b) => b.errors / b.total - a.errors / a.total || b.errors - a.errors)
    .slice(0, 6);
}

function aggregateFingerErrors(sessions: HistoryRecord[]) {
  const aggregate = new Map<FingerType, { total: number; errors: number }>();
  sessions.forEach((session) => {
    if (!session.fingerStats) return;
    (Object.keys(session.fingerStats) as FingerType[]).forEach((finger) => {
      const value = session.fingerStats?.[finger];
      if (!value) return;
      const current = aggregate.get(finger) ?? { total: 0, errors: 0 };
      current.total += value.total;
      current.errors += value.errors;
      aggregate.set(finger, current);
    });
  });
  return [...aggregate.entries()]
    .map(([id, values]) => ({ id, ...values }))
    .filter((finger) => finger.total >= 5)
    .sort((a, b) => b.errors / b.total - a.errors / a.total);
}