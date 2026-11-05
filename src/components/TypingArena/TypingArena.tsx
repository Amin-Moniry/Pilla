import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FingerType,
  KeyboardLayoutType,
  KeystrokeEvent,
  Language,
  SessionMetrics,
  SoundTheme,
  TypingMode,
} from '../../types/typing';
import {
  calcAccuracy,
  calcGrossWpm,
  calcNetWpm,
  computeSessionMetrics,
  isCharMatch,
} from '../../utils/typingEngine';
import { getFingerForChar } from '../../utils/fingerMapping';
import { sound } from '../../utils/sound';
import { VirtualKeyboard } from '../Keyboard/VirtualKeyboard';
import { HandsOverlay } from '../Keyboard/HandsOverlay';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface TypingArenaProps {
  targetText: string;
  language: Language;
  layout: KeyboardLayoutType;
  typingMode: TypingMode;
  showKeyboard?: boolean;
  showHands?: boolean;
  timeLimitSeconds?: number; // Optional countdown mode
  soundTheme?: SoundTheme;
  soundEnabled?: boolean;
  onProgress?: (progressPercent: number) => void;
  onComplete: (metrics: SessionMetrics) => void;
  onRestart?: () => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  targetText,
  language,
  layout,
  typingMode,
  showKeyboard = true,
  showHands = true,
  timeLimitSeconds,
  soundTheme = 'cherry-mx',
  soundEnabled = true,
  onProgress,
  onComplete,
  onRestart,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [lastMistakeChar, setLastMistakeChar] = useState<string | null>(null);
  const [lastPressedCode, setLastPressedCode] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(!soundEnabled);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishSessionRef = useRef<() => void>(() => undefined);
  const lastKeyTimeRef = useRef<number>(Date.now());
  const currentStreakRef = useRef<number>(0);

  const currentIndex = typedChars.length;
  const isComplete = currentIndex >= targetText.length && targetText.length > 0;
  const nextExpectedChar = isComplete ? null : targetText[currentIndex];

  const activeFinger: FingerType | null = nextExpectedChar
    ? getFingerForChar(nextExpectedChar, layout)
    : null;

  // Sound sync
  useEffect(() => {
    sound.setMuted(isMuted);
  }, [isMuted]);

  // Restart handler
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedChars([]);
    setKeystrokes([]);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setLastMistakeChar(null);
    setLastPressedCode(null);
    lastKeyTimeRef.current = Date.now();
    currentStreakRef.current = 0;
    if (onRestart) onRestart();
    if (containerRef.current) containerRef.current.focus();
  }, [onRestart]);

  // Timer loop
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        setElapsedSeconds(elapsed);

        if (timeLimitSeconds && elapsed >= timeLimitSeconds) {
          finishSessionRef.current();
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished, timeLimitSeconds]);

  // Finish session calculation
  const finishSession = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const now = Date.now();
    const duration = startTime ? Math.max(1, (now - startTime) / 1000) : 1;
    const metrics = computeSessionMetrics(keystrokes, duration, (c) =>
      getFingerForChar(c, layout)
    );
    onComplete(metrics);
  }, [isFinished, startTime, keystrokes, layout, onComplete]);

  useEffect(() => {
    finishSessionRef.current = finishSession;
  }, [finishSession]);

  // Check completion
  useEffect(() => {
    if (isComplete && !isFinished && typedChars.length > 0) {
      finishSession();
    }
  }, [isComplete, isFinished, typedChars.length, finishSession]);

  // Keystroke handler
  const handleInputChar = useCallback(
    (char: string, code?: string) => {
      if (isFinished || isComplete) return;

      const now = Date.now();
      if (!startTime) {
        setStartTime(now);
      }

      const expected = targetText[currentIndex];
      const isCorrect = isCharMatch(expected, char);
      const timeSinceLastMs = Math.min(2500, Math.max(15, now - lastKeyTimeRef.current));
      lastKeyTimeRef.current = now;

      if (code) {
        setLastPressedCode(code);
        setTimeout(() => setLastPressedCode(null), 120);
      }

      if (isCorrect) {
        const keyType = char === ' ' ? 'space' : char === '\n' ? 'enter' : 'alpha';
        sound.playKeyClick(soundTheme, keyType);
        setLastMistakeChar(null);
        setTypedChars((prev) => [...prev, char]);

        currentStreakRef.current += 1;
        if ([15, 30, 50, 75, 100, 150, 200].includes(currentStreakRef.current)) {
          sound.playStreakMilestone(currentStreakRef.current);
        }
      } else {
        currentStreakRef.current = 0;
        sound.playError();
        setLastMistakeChar(char);
        if (typingMode === 'forgiving') {
          setTypedChars((prev) => [...prev, char]);
        }
        // In strict mode, do not advance index on error
      }

      setKeystrokes((prev) => [
        ...prev,
        {
          expected,
          actual: char,
          timestamp: now,
          isCorrect,
          timeSinceLastMs,
        },
      ]);
    },
    [isFinished, isComplete, startTime, targetText, currentIndex, soundTheme, typingMode]
  );

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore system hotkeys (Ctrl+R, Alt+Tab, Cmd, F5, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        // Exception: ZWNJ on Ctrl+Shift+2
        if (e.ctrlKey && e.shiftKey && e.code === 'Digit2') {
          e.preventDefault();
          handleInputChar('\u200C', e.code);
          return;
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (typedChars.length > 0 && !isFinished) {
          setTypedChars((prev) => prev.slice(0, -1));
          setLastMistakeChar(null);
          currentStreakRef.current = Math.max(0, currentStreakRef.current - 1);
          sound.playKeyClick(soundTheme, 'backspace');
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        handleReset();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
        return;
      }

      // Check for space with Shift (Persian standard ZWNJ: Shift+Space)
      if (e.code === 'Space' && e.shiftKey) {
        e.preventDefault();
        handleInputChar('\u200C', 'Space');
        return;
      }

      // Printable character
      if (e.key.length === 1) {
        e.preventDefault();
        handleInputChar(e.key, e.code);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedChars.length, isFinished, handleInputChar, handleReset, soundTheme]);

  // Live real-time stats
  const totalTyped = keystrokes.length;
  const correctTyped = keystrokes.filter((k) => k.isCorrect).length;
  const uncorrectedErrors = totalTyped - correctTyped;
  const liveGrossWpm = calcGrossWpm(totalTyped, elapsedSeconds);
  const liveNetWpm = calcNetWpm(liveGrossWpm, uncorrectedErrors, elapsedSeconds);
  const liveAccuracy = calcAccuracy(correctTyped, totalTyped);

  const progressPercent = Math.min(
    100,
    Math.round((currentIndex / Math.max(1, targetText.length)) * 100)
  );

  useEffect(() => {
    onProgress?.(progressPercent);
  }, [onProgress, progressPercent]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="w-full flex flex-col items-center gap-5 focus:outline-none select-none"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Live HUD Metrics Strip */}
      <div className="w-full max-w-4xl flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#130926]/80 border border-purple-900/40 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">
              {language === 'fa' ? 'سرعت خالص' : 'Net WPM'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {liveNetWpm}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">
              {language === 'fa' ? 'دقت' : 'Accuracy'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {liveAccuracy}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">
              {language === 'fa' ? 'زمان' : 'Time'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-purple-300 tabular-nums">
              {Math.floor(elapsedSeconds)}s
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Restart (Tab or Esc)"
            aria-label="Restart Drill"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'شروع دوباره' : 'Restart'}</span>
          </button>
        </div>
      </div>

      {/* Text Passage Typing Surface */}
      <div className="w-full max-w-4xl p-6 sm:p-8 rounded-2xl bg-[#140A28]/90 border border-purple-900/50 backdrop-blur-lg shadow-xl relative overflow-hidden">
        {/* Progress Bar Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-950/50">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Text Stream */}
        <div
          className={`text-lg sm:text-2xl leading-relaxed sm:leading-loose tracking-wide font-normal ${
            language === 'fa' ? 'font-fa' : 'font-mono'
          }`}
        >
          {targetText.split('').map((char, idx) => {
            let status: 'correct' | 'incorrect' | 'current' | 'pending' = 'pending';
            if (idx < currentIndex) {
              const actual = typedChars[idx];
              status = isCharMatch(char, actual) ? 'correct' : 'incorrect';
            } else if (idx === currentIndex) {
              status = 'current';
            }

            return (
              <span
                key={idx}
                className={`relative transition-colors duration-75 ${
                  status === 'correct'
                    ? 'text-amber-300'
                    : status === 'incorrect'
                    ? 'text-rose-400 bg-rose-950/50 rounded px-0.5 underline decoration-rose-500'
                    : status === 'current'
                    ? 'text-white font-semibold'
                    : 'text-slate-500/70'
                }`}
              >
                {/* Blinking Caret on current character */}
                {status === 'current' && (
                  <span
                    className="absolute -left-[2px] top-1 bottom-1 w-[2.5px] bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_#f59e0b]"
                    aria-hidden="true"
                  />
                )}
                {char === '\u200C' ? (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-purple-900/60 text-purple-300 font-sans">
                    [‌]
                  </span>
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>

        {/* Bottom Hint */}
        <div className="mt-4 pt-3 border-t border-purple-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            {language === 'fa'
              ? 'با فشردن هر کلید ضربه ثبت می‌شود. کلید Tab برای شروع مجدد.'
              : 'Press any key to begin. Press Tab or Esc to reset.'}
          </span>
          <span className="tabular-nums">
            {currentIndex} / {targetText.length}
          </span>
        </div>
      </div>

      {/* On-Screen Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          layout={layout}
          language={language}
          nextChar={nextExpectedChar}
          lastMistakeChar={lastMistakeChar}
          pressedCode={lastPressedCode}
          onVirtualKeyPress={(char) => handleInputChar(char)}
        />
      )}

      {/* Hands Overlay */}
      {showHands && <HandsOverlay activeFinger={activeFinger} language={language} />}
    </div>
  );
};
