import { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Github } from 'lucide-react';
import {
  Language,
  SessionMetrics,
  UserSettings,
  UserStats,
  KeyboardLayoutType,
} from './types/typing';
import { Lesson } from './types/curriculum';
import { getDayDifference, getLocalDateKey, loadSettings, saveSettings, loadStats, saveStats } from './utils/storage';
import { getStageForLevel, getLevelFromXp } from './utils/metamorphosis';
import { sound } from './utils/sound';
import { ACHIEVEMENTS } from './data/achievements';
import { getEligibleAchievementIds } from './utils/achievements';
import { Navbar } from './components/Navbar';

const DashboardView = lazy(() =>
  import('./components/Dashboard/DashboardView').then((module) => ({ default: module.DashboardView }))
);
const CurriculumRoadmap = lazy(() =>
  import('./components/Learn/CurriculumRoadmap').then((module) => ({ default: module.CurriculumRoadmap }))
);
const LessonPlayer = lazy(() =>
  import('./components/Learn/LessonPlayer').then((module) => ({ default: module.LessonPlayer }))
);
const AdaptivePractice = lazy(() =>
  import('./components/Practice/AdaptivePractice').then((module) => ({ default: module.AdaptivePractice }))
);
const RacesView = lazy(() =>
  import('./components/Races/RacesView').then((module) => ({ default: module.RacesView }))
);
const SpeedTestView = lazy(() =>
  import('./components/Test/SpeedTestView').then((module) => ({ default: module.SpeedTestView }))
);
const StatsAnalytics = lazy(() =>
  import('./components/Stats/StatsAnalytics').then((module) => ({ default: module.StatsAnalytics }))
);
const PostureGuide = lazy(() =>
  import('./components/Posture/PostureGuide').then((module) => ({ default: module.PostureGuide }))
);
const SettingsModal = lazy(() =>
  import('./components/Settings/SettingsModal').then((module) => ({ default: module.SettingsModal }))
);

const loadLessons = async (language: Language): Promise<Lesson[]> => {
  if (language === 'fa') {
    const module = await import('./data/lessonsFa');
    return module.PERSIAN_LESSONS;
  }
  const module = await import('./data/lessonsEn');
  return module.ENGLISH_LESSONS;
};

const createCrossfadedLoop = (
  context: AudioContext,
  source: AudioBuffer,
  crossfadeSeconds = 5
): AudioBuffer => {
  const fadeSamples = Math.max(
    1,
    Math.min(
      Math.floor(source.sampleRate * crossfadeSeconds),
      Math.floor(source.length / 8)
    )
  );
  const loop = context.createBuffer(
    source.numberOfChannels,
    source.length - fadeSamples,
    source.sampleRate
  );
  const bodyLength = source.length - fadeSamples * 2;

  for (let channel = 0; channel < source.numberOfChannels; channel += 1) {
    const input = source.getChannelData(channel);
    const output = loop.getChannelData(channel);
    output.set(input.subarray(fadeSamples, source.length - fadeSamples), 0);

    for (let sample = 0; sample < fadeSamples; sample += 1) {
      const progress = sample / Math.max(1, fadeSamples - 1);
      const tailGain = Math.cos((progress * Math.PI) / 2);
      const headGain = Math.sin((progress * Math.PI) / 2);
      const tailSample = input[source.length - fadeSamples + sample];
      const headSample = input[sample];
      output[bodyLength + sample] = tailSample * tailGain + headSample * headGain;
    }
  }

  return loop;
};

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [currentLessons, setCurrentLessons] = useState<Lesson[]>([]);
  const [loadedLanguage, setLoadedLanguage] = useState<Language | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adaptiveWeakKeys, setAdaptiveWeakKeys] = useState<string[]>([]);
  const musicContextRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicLoadingRef = useRef(false);
  const musicVolumeRef = useRef(
    settings.ambientMusicEnabled ? settings.ambientMusicVolume : 0
  );
  musicVolumeRef.current = settings.ambientMusicEnabled
    ? Math.min(0.18, Math.max(0, settings.ambientMusicVolume))
    : 0;

  // Sync document RTL / LTR direction and lang
  useEffect(() => {
    const isFa = settings.language === 'fa';
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  // Start one persistent Web Audio source after the first gesture. A short
  // crossfade makes the local piano loop feel continuous instead of restarting.
  useEffect(() => {
    let disposed = false;

    const startAmbientMusic = async () => {
      if (musicSourceRef.current || musicLoadingRef.current) {
        void musicContextRef.current?.resume().catch(() => {});
        return;
      }

      const AudioContextConstructor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextConstructor) return;

      musicLoadingRef.current = true;
      try {
        const context = musicContextRef.current ?? new AudioContextConstructor();
        musicContextRef.current = context;
        void context.resume().catch(() => {});

        const gain = musicGainRef.current ?? context.createGain();
        musicGainRef.current = gain;
        gain.gain.value = 0;
        gain.connect(context.destination);

        const response = await fetch('/audio/soft-piano.mp3');
        if (!response.ok) throw new Error('Could not load the piano track.');
        const decoded = await context.decodeAudioData(await response.arrayBuffer());
        if (disposed) return;

        const source = context.createBufferSource();
        source.buffer = createCrossfadedLoop(context, decoded, 5);
        source.loop = true;
        source.loopStart = 0;
        source.loopEnd = source.buffer.duration;
        source.connect(gain);
        source.start();
        musicSourceRef.current = source;

        gain.gain.setTargetAtTime(musicVolumeRef.current, context.currentTime, 1.4);
      } catch {
        // Audio is optional; keep the app usable if a browser blocks playback.
      } finally {
        musicLoadingRef.current = false;
      }
    };

    const enableAudio = () => {
      void startAmbientMusic();
      window.removeEventListener('pointerdown', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };

    // Try immediately on entry where the browser permits autoplay. If audio is
    // blocked, the first pointer/keyboard gesture resumes this same persistent loop.
    void startAmbientMusic();
    window.addEventListener('pointerdown', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });
    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', enableAudio);
      window.removeEventListener('keydown', enableAudio);
      musicSourceRef.current?.stop();
      musicSourceRef.current?.disconnect();
      musicGainRef.current?.disconnect();
      void musicContextRef.current?.close().catch(() => {});
      musicSourceRef.current = null;
      musicGainRef.current = null;
      musicContextRef.current = null;
    };
  }, []);

  useEffect(() => {
    const context = musicContextRef.current;
    const gain = musicGainRef.current;
    if (!context || !gain) return;

    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setTargetAtTime(musicVolumeRef.current, context.currentTime, 1.2);
  }, [settings.ambientMusicEnabled, settings.ambientMusicVolume]);

  // Autostart URL support for ultra mode verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1') {
        setActiveTab('dashboard');
      }
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setLoadedLanguage(null);
    loadLessons(settings.language).then((lessons) => {
      if (isCurrent) {
        setCurrentLessons(lessons);
        setLoadedLanguage(settings.language);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [settings.language]);

  // Toggle Language Handler
  const handleToggleLanguage = useCallback(() => {
    const nextLang: Language = settings.language === 'fa' ? 'en' : 'fa';
    const nextLayout: KeyboardLayoutType = nextLang === 'fa' ? 'persian-standard' : 'qwerty';
    const updated: UserSettings = { ...settings, language: nextLang, keyboardLayout: nextLayout };
    setSettings(updated);
    saveSettings(updated);
    // Reset active lesson if language switches
    setActiveLesson(null);
  }, [settings]);

  // Save Settings
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Process Completed Session (from Lesson, Practice, Test, or Race)
  const processSessionMetrics = useCallback(
    (
      metrics: SessionMetrics,
      xpEarned: number,
      lessonId?: string,
      stars?: number,
      sessionType: 'lesson' | 'practice' | 'race' | 'test' = 'practice'
    ) => {
      setStats((prev) => {
        const prevLevel = prev.level;
        const newXp = prev.xp + xpEarned;
        const newLevelInfo = getLevelFromXp(newXp);
        const newStage = getStageForLevel(newLevelInfo.level).id;
        const today = getLocalDateKey();
        const practicedToday = prev.lastActiveDate === today;
        const sessionCountBefore = prev.sessionsCompleted || prev.testsCompleted;
        const sessionCountAfter = sessionCountBefore + 1;
        const dayGap = getDayDifference(prev.lastActiveDate, today);
        const dailyStreak = practicedToday
          ? prev.dailyStreak
          : dayGap === 1
          ? prev.dailyStreak + 1
          : 1;

        // Update Key Mastery
        const updatedKeyMastery = { ...prev.keyMastery };
        const sessionKeys = metrics.keyStats?.length
          ? metrics.keyStats
          : metrics.mostErrorKeys.map((key) => ({
              char: key.char,
              total: key.total,
              correct: key.total - key.errors,
              errors: key.errors,
              avgSpeedMs: 0,
              speedSamples: 0,
            }));
        sessionKeys.forEach((key) => {
          const existing = updatedKeyMastery[key.char] ?? {
            total: 0,
            correct: 0,
            avgSpeedMs: 0,
            speedSamples: 0,
          };
          const previousSpeedSamples = existing.speedSamples ?? 0;
          const nextSpeedSamples = previousSpeedSamples + key.speedSamples;
          updatedKeyMastery[key.char] = {
            total: existing.total + key.total,
            correct: existing.correct + key.correct,
            avgSpeedMs: nextSpeedSamples
              ? Math.round(
                  (existing.avgSpeedMs * previousSpeedSamples +
                    key.avgSpeedMs * key.speedSamples) /
                    nextSpeedSamples
                )
              : existing.avgSpeedMs,
            speedSamples: nextSpeedSamples,
          };
        });

        // Update Completed Lessons
        const updatedCompletedLessons = { ...prev.completedLessons };
        let lessonsCount = prev.lessonsCompleted;
        if (lessonId && stars !== undefined && stars >= 1) {
          if (!updatedCompletedLessons[lessonId]) {
            lessonsCount += 1;
          }
          const prevBest = updatedCompletedLessons[lessonId]?.bestWpm || 0;
          updatedCompletedLessons[lessonId] = {
            stars: Math.max(stars, updatedCompletedLessons[lessonId]?.stars || 0),
            bestWpm: Math.max(metrics.netWpm, prevBest),
            accuracy: Math.max(metrics.accuracy, updatedCompletedLessons[lessonId]?.accuracy || 0),
            date: new Date().toISOString(),
          };
        }

        // Best WPM & Averages
        const newBestWpm = Math.max(prev.bestWpm || 0, metrics.netWpm);
        const newAvgAccuracy = Math.round(
          ((prev.averageAccuracy * sessionCountBefore) + metrics.accuracy) / sessionCountAfter
        );
        const newAvgWpm = Math.round(
          ((prev.averageWpm * sessionCountBefore) + metrics.netWpm) / sessionCountAfter
        );
        const sessionHistory = [
          ...(prev.sessionHistory ?? []),
          {
            date: new Date().toISOString(),
            type: sessionType,
            wpm: metrics.netWpm,
            accuracy: metrics.accuracy,
            errors: metrics.uncorrectedErrors + metrics.correctedErrors,
            consistency: metrics.consistency,
            totalKeystrokes: metrics.totalKeystrokes,
            correctKeystrokes: metrics.correctKeystrokes,
            keyStats: metrics.keyStats,
            fingerStats: metrics.fingerStats,
          },
        ].slice(-30);

        const newStats: UserStats = {
          ...prev,
          xp: newXp,
          level: newLevelInfo.level,
          stage: newStage,
          dailyStreak,
          lastActiveDate: today,
          todayKeystrokes: (practicedToday ? prev.todayKeystrokes : 0) + metrics.totalKeystrokes,
          bestWpm: newBestWpm,
          averageWpm: newAvgWpm,
          averageAccuracy: newAvgAccuracy,
          testsCompleted: prev.testsCompleted + (sessionType === 'test' ? 1 : 0),
          sessionsCompleted: sessionCountAfter,
          lessonsCompleted: lessonsCount,
          totalPracticeTimeSeconds: prev.totalPracticeTimeSeconds + metrics.durationSeconds,
          sessionHistory,
          keyMastery: updatedKeyMastery,
          completedLessons: updatedCompletedLessons,
        };

        let rewardedStats = newStats;
        const unlockedIds = [...(prev.unlockedAchievements ?? [])];
        for (let i = 0; i < ACHIEVEMENTS.length; i++) {
          const newlyUnlocked = getEligibleAchievementIds(rewardedStats).filter(
            (id) => !unlockedIds.includes(id)
          );
          if (newlyUnlocked.length === 0) break;

          const bonusXp = newlyUnlocked.reduce(
            (sum, id) => sum + (ACHIEVEMENTS.find((achievement) => achievement.id === id)?.xpBonus ?? 0),
            0
          );
          unlockedIds.push(...newlyUnlocked);
          const rewardedLevel = getLevelFromXp(rewardedStats.xp + bonusXp);
          rewardedStats = {
            ...rewardedStats,
            xp: rewardedStats.xp + bonusXp,
            level: rewardedLevel.level,
            stage: getStageForLevel(rewardedLevel.level).id,
            unlockedAchievements: unlockedIds,
          };
        }

        if (rewardedStats.level > prevLevel) {
          setTimeout(() => sound.playLevelUp(), 250);
        }

        saveStats(rewardedStats);
        return rewardedStats;
      });
    },
    []
  );

  const handleLessonComplete = (
    lessonId: string,
    stars: number,
    metrics: SessionMetrics,
    xpEarned: number
  ) => {
    processSessionMetrics(metrics, xpEarned, lessonId, stars, 'lesson');
  };

  const handlePracticeWeakKeys = (keys: string[]) => {
    setAdaptiveWeakKeys(keys);
    setActiveTab('practice');
  };

  // Next lesson trigger
  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = currentLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex >= 0 && currentIndex < currentLessons.length - 1) {
      setActiveLesson(currentLessons[currentIndex + 1]);
    } else {
      setActiveLesson(null);
      setActiveTab('learn');
    }
  };

  const handleStartQuickPractice = useCallback(async () => {
    const lessons =
      loadedLanguage === settings.language ? currentLessons : await loadLessons(settings.language);
    const next = lessons.find((lesson) => (stats.completedLessons[lesson.id]?.stars ?? 0) < 1);
    setActiveLesson(next ?? lessons[0] ?? null);
  }, [currentLessons, loadedLanguage, settings.language, stats.completedLessons]);

  return (
    <div className="min-h-screen bg-[#0B0614] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-100">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeLesson ? 'learn' : activeTab}
        language={settings.language}
        userStats={stats}
        onSelectTab={(tab) => {
          setActiveLesson(null);
          setActiveTab(tab);
        }}
        onToggleLanguage={handleToggleLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Stage */}
      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ${
          activeTab === 'dashboard' && !activeLesson ? 'pilla-home-stage' : 'pilla-cohesive-stage'
        }`}
      >
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-amber-300" aria-live="polite">
              {settings.language === 'fa' ? 'در حال آماده‌سازی…' : 'Loading…'}
            </div>
          }
        >
          {/* If a lesson is actively open in the player */}
          {activeLesson ? (
            <LessonPlayer
              key={activeLesson.id}
              lesson={activeLesson}
              language={settings.language}
              layout={settings.keyboardLayout}
              typingMode={settings.typingMode}
              soundTheme={settings.soundTheme}
              onLessonComplete={handleLessonComplete}
              onExit={() => setActiveLesson(null)}
              onNextLesson={handleNextLesson}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  userStats={stats}
                  language={settings.language}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onStartQuickPractice={handleStartQuickPractice}
                />
              )}

              {activeTab === 'learn' && (
                loadedLanguage === settings.language ? (
                  <CurriculumRoadmap
                    lessons={currentLessons}
                    userStats={stats}
                    language={settings.language}
                    onSelectLesson={(lesson) => setActiveLesson(lesson)}
                  />
                ) : (
                  <div className="py-12 text-center text-sm text-amber-300" aria-live="polite">
                    {settings.language === 'fa' ? 'در حال بارگذاری برنامهٔ درسی…' : 'Loading curriculum…'}
                  </div>
                )
              )}

            {activeTab === 'practice' && (
              <AdaptivePractice
                userStats={stats}
                language={settings.language}
                layout={settings.keyboardLayout}
                typingMode={settings.typingMode}
                soundTheme={settings.soundTheme}
                initialWeakKeys={adaptiveWeakKeys}
        onPracticeFinish={(m) => processSessionMetrics(m, 50, undefined, undefined, 'practice')}
              />
            )}

            {activeTab === 'races' && (
              <RacesView
                userStats={stats}
                language={settings.language}
                layout={settings.keyboardLayout}
                typingMode={settings.typingMode}
                soundTheme={settings.soundTheme}
                onRaceFinish={(m) => processSessionMetrics(m, 120, undefined, undefined, 'race')}
              />
            )}

            {activeTab === 'test' && (
              <SpeedTestView
                userStats={stats}
                language={settings.language}
                layout={settings.keyboardLayout}
                typingMode={settings.typingMode}
                soundTheme={settings.soundTheme}
                onTestFinish={(m) => processSessionMetrics(m, 100, undefined, undefined, 'test')}
              />
            )}

            {activeTab === 'stats' && (
              <StatsAnalytics
                userStats={stats}
                language={settings.language}
                onStatsUpdated={() => setStats(loadStats())}
              />
            )}

            {activeTab === 'posture' && <PostureGuide language={settings.language} />}
            </>
          )}
        </Suspense>
      </main>

      <footer className="pilla-footer">
        <span className="pilla-footer-rule" aria-hidden="true" />
        <p>
          {settings.language === 'fa' ? 'ساخته‌شده توسط ' : 'Created by '}
          <a
            href="https://github.com/Amin-Moniry"
            dir="ltr"
            target="_blank"
            rel="noopener noreferrer"
            className="pilla-creator-link"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            <span>AminTivanix2</span>
            <span className="pilla-creator-name">(Amin Moniry)</span>
          </a>
        </p>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            settings={settings}
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onSaveSettings={handleSaveSettings}
            onResetProgress={() => setStats(loadStats())}
          />
        </Suspense>
      )}
    </div>
  );
}
