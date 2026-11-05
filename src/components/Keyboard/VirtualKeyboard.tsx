import React from 'react';
import { FingerType, KeyDef, KeyboardLayoutType, Language } from '../../types/typing';
import { FINGER_COLORS, getLayoutRows, findKeyForChar } from '../../utils/fingerMapping';

interface VirtualKeyboardProps {
  layout: KeyboardLayoutType;
  language: Language;
  nextChar: string | null;
  lastMistakeChar: string | null;
  pressedCode?: string | null;
  onVirtualKeyPress?: (char: string) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  layout,
  nextChar,
  lastMistakeChar,
  pressedCode,
  onVirtualKeyPress,
}) => {
  const rows = getLayoutRows(layout);
  const nextTarget = nextChar ? findKeyForChar(nextChar, layout) : null;
  const targetKeyDef = nextTarget?.keyDef;
  const requiresShift = nextTarget?.requiresShift || false;
  // Touch-typing rule: Shift is pressed by the pinky of the OPPOSITE hand.
  const shiftCodeToHighlight =
    requiresShift && targetKeyDef
      ? targetKeyDef.finger.startsWith('left')
        ? 'ShiftRight'
        : 'ShiftLeft'
      : null;

  const mistakeTarget = lastMistakeChar ? findKeyForChar(lastMistakeChar, layout) : null;
  const mistakeKeyDef = mistakeTarget?.keyDef;

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 rounded-2xl bg-[#120824]/90 border border-purple-900/40 backdrop-blur-md shadow-2xl select-none">
      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5 w-full">
            {row.map((keyDef: KeyDef) => {
              const isTarget = targetKeyDef?.code === keyDef.code;
              const isMistake = mistakeKeyDef?.code === keyDef.code;
              const isPressed = pressedCode === keyDef.code;
              const isShiftActive = keyDef.code === shiftCodeToHighlight;

              const fingerStyle = FINGER_COLORS[keyDef.finger];

              // Dynamic width flex sizing
              const flexGrow = keyDef.width ? keyDef.width : 1;

              return (
                <button
                  type="button"
                  key={keyDef.code}
                  onClick={() => onVirtualKeyPress && onVirtualKeyPress(requiresShift ? keyDef.shiftChar || keyDef.char : keyDef.char)}
                  style={{ flexGrow, minWidth: keyDef.width ? `${keyDef.width * 28}px` : '28px' }}
                  className={`relative flex flex-col items-center justify-between h-10 sm:h-12 px-1 sm:px-1.5 py-1 rounded-lg transition-all duration-100 text-xs sm:text-sm font-medium border ${
                    isMistake
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-bounce shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                      : isTarget || isShiftActive
                      ? 'bg-purple-900/80 border-amber-400 text-white shadow-[0_0_18px_rgba(245,158,11,0.7)] scale-[1.03] z-10'
                      : isPressed
                      ? 'bg-purple-800 border-purple-400 text-white scale-95'
                      : 'bg-[#180E30]/80 hover:bg-[#231545] border-purple-950/70 text-slate-200'
                  }`}
                  aria-label={`Key ${keyDef.char}`}
                >
                  {/* Finger color accent bar at key bottom */}
                  <div
                    className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full opacity-60"
                    style={{ backgroundColor: fingerStyle.glow }}
                  />

                  {/* Top / Shift char */}
                  <div className="w-full flex justify-between items-center text-[10px] sm:text-[11px] text-slate-400 leading-none">
                    <span>{keyDef.shiftChar || ''}</span>
                    {keyDef.isHomeBump && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" title="Tactile bump" />
                    )}
                  </div>

                  {/* Primary Char */}
                  <div className="font-semibold text-center text-xs sm:text-base leading-none">
                    {keyDef.char === ' ' ? 'Space' : keyDef.char}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Visual Finger Color Key Guide Strip */}
      <div className="mt-3 pt-2.5 border-t border-purple-950/60 hidden sm:flex items-center justify-between text-[11px] text-slate-400 px-2">
        <span className="font-medium text-purple-300/80">Finger Zones:</span>
        <div className="flex items-center gap-3">
          {(
            [
              'left-pinky',
              'left-ring',
              'left-middle',
              'left-index',
              'thumb',
              'right-index',
              'right-middle',
              'right-ring',
              'right-pinky',
            ] as FingerType[]
          ).map(f => (
            <div key={f} className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: FINGER_COLORS[f].glow }}
              />
              <span className="text-[10px] hidden md:inline text-slate-400">
                {FINGER_COLORS[f].nameEn.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
