import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Language,
  UserStats,
  KeyboardLayoutType,
  TypingMode,
  SessionMetrics,
  SoundTheme,
} from '../../types/typing';
import { RACE_BOTS } from '../../data/achievements';
import { PRACTICE_TEXTS } from '../../data/quotesAndTexts';
import { TypingArena } from '../TypingArena/TypingArena';
import { ResultsSummary } from '../TypingArena/ResultsSummary';
import { ButterflyAvatar } from '../ButterflyAvatar';
import { sound } from '../../utils/sound';
import { Flag, Play, Bot, Trophy, ArrowLeft } from 'lucide-react';

interface RacesViewProps {
  userStats: UserStats;
  language: Language;
  layout: KeyboardLayoutType;
  typingMode: TypingMode;
  soundTheme?: SoundTheme;
  onRaceFinish: (metrics: SessionMetrics) => void;
}

export const RacesView: React.FC<RacesViewProps> = ({
  userStats,
  language,
  layout,
  typingMode,
  soundTheme = 'royal-santoor',
  onRaceFinish,
}) => {
  const isRTL = language === 'fa';
  const [selectedBotId, setSelectedBotId] = useState<string>('bot_chrysalis');
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [botProgress, setBotProgress] = useState(0);
  const [ghostProgress, setGhostProgress] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);

  const raceTexts = PRACTICE_TEXTS.filter((text) => text.language === language);
  const targetText = raceTexts[0]?.text ?? 'Touch typing builds speed and accuracy one stroke at a time.';
  const selectedBot = RACE_BOTS.find((bot) => bot.id === selectedBotId) ?? RACE_BOTS[1];
  const botIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const raceStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isRacing || raceFinished) return;
    raceStartTimeRef.current = Date.now();
    const totalChars = Math.max(1, targetText.length);
    const botCharsPerSec = (selectedBot.targetWpm * 5) / 60;
    const ghostCharsPerSec = ((userStats.bestWpm || 35) * 5) / 60;

    botIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - raceStartTimeRef.current) / 1000;
      setBotProgress(Math.min(100, Math.round((Math.min(totalChars, elapsed * botCharsPerSec) / totalChars) * 100)));
      setGhostProgress(Math.min(100, Math.round((Math.min(totalChars, elapsed * ghostCharsPerSec) / totalChars) * 100)));
    }, 150);

    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
      botIntervalRef.current = null;
    };
  }, [isRacing, raceFinished, selectedBot.targetWpm, userStats.bestWpm, targetText.length]);

  const handleStartRace = () => {
    sound.playCountdownTick(true);
    setMetrics(null);
    setRaceFinished(false);
    setBotProgress(0);
    setGhostProgress(0);
    setUserProgress(0);
    setIsRacing(true);
  };

  const handleComplete = (sessionMetrics: SessionMetrics) => {
    setRaceFinished(true);
    setIsRacing(false);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    setUserProgress(100);
    setMetrics(sessionMetrics);
    sound.playVictory(sessionMetrics.netWpm >= selectedBot.targetWpm ? 3 : 1);
    onRaceFinish(sessionMetrics);
  };

  const handleUserProgress = useCallback((progress: number) => {
    setUserProgress(progress);
  }, []);

  const resetToOpponentSelection = () => {
    setIsRacing(false);
    setRaceFinished(false);
    setMetrics(null);
    setBotProgress(0);
    setGhostProgress(0);
    setUserProgress(0);
  };

  return (
    <div className="pilla-experience-page pilla-race-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="pilla-experience-hero">
        <div className="pilla-experience-hero-mark"><Flag aria-hidden="true" /></div>
        <div className="pilla-experience-hero-copy">
          <p className="pilla-experience-eyebrow">{isRTL ? 'پیست مسابقه' : 'RACE TRACK'}</p>
          <h2>{isRTL ? 'مسابقه با رکورد خودت و ربات‌های هوشمند' : 'Race your record and the AI field'}</h2>
          <p>
            {isRTL
              ? 'سطح حریف را انتخاب کن و پیشرفت را با سرعت واقعی تایپ خودت بسنج.'
              : 'Choose an opponent and watch your lane follow the text you actually type.'}
          </p>
        </div>
        {!isRacing && !metrics && (
          <button type="button" onClick={handleStartRace} className="pilla-primary-action">
            <Play aria-hidden="true" />
            {isRTL ? 'شروع مسابقه' : 'Start race'}
          </button>
        )}
      </header>

      {!isRacing && !metrics && (
        <section className="pilla-opponent-panel">
          <div className="pilla-opponent-panel-heading">
            <div>
              <p className="pilla-experience-eyebrow">{isRTL ? 'انتخاب حریف' : 'CHOOSE AN OPPONENT'}</p>
              <h3>{isRTL ? 'با چه کسی مسابقه می‌دهی؟' : 'Who are you racing?'}</h3>
            </div>
            <span>{isRTL ? `${RACE_BOTS.length} سطح` : `${RACE_BOTS.length} levels`}</span>
          </div>
          <div className="pilla-opponent-grid">
            {RACE_BOTS.map((bot) => (
              <button
                type="button"
                key={bot.id}
                onClick={() => setSelectedBotId(bot.id)}
                className={`pilla-opponent-choice${selectedBotId === bot.id ? ' is-selected' : ''}`}
                aria-pressed={selectedBotId === bot.id}
              >
                <span className="pilla-opponent-choice-top">
                  <span className="pilla-opponent-avatar" aria-hidden="true">{bot.avatar}</span>
                  <span className="pilla-opponent-speed">{bot.targetWpm} WPM</span>
                </span>
                <strong>{isRTL ? bot.nameFa : bot.nameEn}</strong>
                <small>{isRTL ? 'سرعت هدف' : 'Target pace'}</small>
              </button>
            ))}
          </div>
          <p className="pilla-opponent-hint">
            {isRTL
              ? 'ربات‌ها با سرعت ثابت حرکت می‌کنند؛ نوار شما بر اساس پیشرفت واقعی تایپ به‌روز می‌شود.'
              : 'Bots move at a steady pace; your lane updates from your real typing progress.'}
          </p>
        </section>
      )}

      <section className={`pilla-race-track${isRacing ? ' is-live' : ''}`} aria-label={isRTL ? 'وضعیت مسیر مسابقه' : 'Race progress'}>
        <div className="pilla-race-track-heading">
          <div>
            <p className="pilla-experience-eyebrow">{isRacing ? (isRTL ? 'مسابقه در جریان' : 'RACE IN PROGRESS') : (isRTL ? 'وضعیت مسیر' : 'RACE TRACK')}</p>
            <h3>{isRTL ? 'مسیر تا خط پایان' : 'Progress to the finish'}</h3>
          </div>
          {isRacing && <span className="pilla-live-pill"><i />{isRTL ? 'زنده' : 'Live'}</span>}
          {!isRacing && metrics && (
            <span className="pilla-race-finish-note">
              {metrics.netWpm >= selectedBot.targetWpm
                ? isRTL ? 'از حریف جلو زدی' : 'You beat the opponent'
                : isRTL ? 'مسابقه تمام شد' : 'Race complete'}
            </span>
          )}
        </div>

        <RaceLane
          label={isRTL ? 'شما' : 'You'}
          detail={isRTL ? 'سرعت واقعی' : 'Live typing'}
          progress={userProgress}
          tone="user"
          avatar={<ButterflyAvatar stageId={userStats.stage} size="sm" interactive={false} />}
          isRTL={isRTL}
        />
        <RaceLane
          label={isRTL ? 'رکورد شخصی' : 'Personal best ghost'}
          detail={`${userStats.bestWpm || 35} WPM`}
          progress={ghostProgress}
          tone="ghost"
          avatar={<Trophy aria-hidden="true" />}
          isRTL={isRTL}
        />
        <RaceLane
          label={isRTL ? selectedBot.nameFa : selectedBot.nameEn}
          detail={`${selectedBot.targetWpm} WPM`}
          progress={botProgress}
          tone="bot"
          avatar={<Bot aria-hidden="true" />}
          isRTL={isRTL}
        />
      </section>

      {isRacing && !metrics && (
        <section className="pilla-exercise-shell">
          <div className="pilla-exercise-heading">
            <div>
              <p className="pilla-experience-eyebrow">{isRTL ? 'متن مسابقه' : 'RACE TEXT'}</p>
              <h3>{isRTL ? 'با تمرکز تایپ کن' : 'Type to move your lane'}</h3>
            </div>
          </div>
          <TypingArena
            targetText={targetText}
            language={language}
            layout={layout}
            typingMode={typingMode}
            soundTheme={soundTheme}
            showKeyboard
            showHands={false}
            onProgress={handleUserProgress}
            onComplete={handleComplete}
          />
        </section>
      )}

      {metrics && (
        <div className="pilla-results-stack">
          <ResultsSummary
            metrics={metrics}
            stars={metrics.netWpm >= selectedBot.targetWpm ? 3 : 2}
            xpEarned={metrics.netWpm >= selectedBot.targetWpm ? 180 : 80}
            targetWpm={selectedBot.targetWpm}
            language={language}
            onRetry={handleStartRace}
          />
          <button type="button" className="pilla-secondary-action pilla-back-to-practice" onClick={resetToOpponentSelection}>
            <ArrowLeft aria-hidden="true" />
            {isRTL ? 'انتخاب حریف دیگر' : 'Choose another opponent'}
          </button>
        </div>
      )}
    </div>
  );
};

interface RaceLaneProps {
  label: string;
  detail: string;
  progress: number;
  tone: 'user' | 'ghost' | 'bot';
  avatar: React.ReactNode;
  isRTL: boolean;
}

const RaceLane: React.FC<RaceLaneProps> = ({ label, detail, progress, tone, avatar, isRTL }) => (
  <div className={`pilla-race-lane ${tone}`}>
    <div className="pilla-race-lane-heading">
      <span className="pilla-race-lane-identity">
        <span className="pilla-race-lane-avatar">{avatar}</span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <span className="pilla-race-lane-percent">{new Intl.NumberFormat(isRTL ? 'fa-IR' : 'en-US').format(progress)}٪</span>
    </div>
    <div
      className="pilla-race-progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <span className={`pilla-race-progress-fill ${tone}`} style={{ width: `${progress}%` }} />
    </div>
  </div>
);