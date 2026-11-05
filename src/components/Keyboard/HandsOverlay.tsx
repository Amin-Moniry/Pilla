import React from 'react';
import { FingerType, Language } from '../../types/typing';
import { FINGER_COLORS } from '../../utils/fingerMapping';

interface HandsOverlayProps {
  activeFinger: FingerType | null;
  language: Language;
}

export const HandsOverlay: React.FC<HandsOverlayProps> = ({ activeFinger, language }) => {
  const isLeftPinky = activeFinger === 'left-pinky';
  const isLeftRing = activeFinger === 'left-ring';
  const isLeftMiddle = activeFinger === 'left-middle';
  const isLeftIndex = activeFinger === 'left-index';
  const isThumb = activeFinger === 'thumb';
  const isRightIndex = activeFinger === 'right-index';
  const isRightMiddle = activeFinger === 'right-middle';
  const isRightRing = activeFinger === 'right-ring';
  const isRightPinky = activeFinger === 'right-pinky';

  return (
    <div className="flex items-center justify-center gap-12 sm:gap-20 py-2 select-none">
      {/* Left Hand SVG */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 140" className="w-28 sm:w-36 h-24 sm:h-30">
          <defs>
            <radialGradient id="leftHandGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(30, 20, 50, 0.7)" />
              <stop offset="100%" stopColor="rgba(15, 10, 28, 0.9)" />
            </radialGradient>
          </defs>

          {/* Palm base */}
          <path
            d="M 30 70 Q 25 110 55 125 Q 95 130 115 110 Q 130 90 125 70 Z"
            fill="url(#leftHandGrad)"
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="1.5"
          />

          {/* Left Pinky */}
          <rect
            x="20"
            y={isLeftPinky ? 32 : 36}
            width="14"
            height="44"
            rx="7"
            className={`transition-all duration-150 ${
              isLeftPinky
                ? 'fill-rose-500 stroke-rose-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                : 'fill-slate-800/80 stroke-rose-500/30'
            }`}
          />
          {/* Left Ring */}
          <rect
            x="40"
            y={isLeftRing ? 20 : 24}
            width="15"
            height="56"
            rx="7.5"
            className={`transition-all duration-150 ${
              isLeftRing
                ? 'fill-purple-500 stroke-purple-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                : 'fill-slate-800/80 stroke-purple-500/30'
            }`}
          />
          {/* Left Middle */}
          <rect
            x="62"
            y={isLeftMiddle ? 12 : 16}
            width="16"
            height="64"
            rx="8"
            className={`transition-all duration-150 ${
              isLeftMiddle
                ? 'fill-indigo-500 stroke-indigo-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]'
                : 'fill-slate-800/80 stroke-indigo-500/30'
            }`}
          />
          {/* Left Index (with Home Bump anchor indicator) */}
          <rect
            x="85"
            y={isLeftIndex ? 22 : 26}
            width="16"
            height="56"
            rx="8"
            className={`transition-all duration-150 ${
              isLeftIndex
                ? 'fill-cyan-500 stroke-cyan-200 stroke-2 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                : 'fill-slate-800/80 stroke-cyan-500/40'
            }`}
          />
          {/* Tactile Bump Ring on Left Index */}
          <circle cx="93" cy="46" r="3" fill="#22D3EE" opacity="0.8" />

          {/* Left Thumb */}
          <path
            d={
              isThumb
                ? 'M 115 75 Q 140 80 148 95 Q 145 105 130 102 Q 115 95 110 85 Z'
                : 'M 115 78 Q 138 82 145 96 Q 142 105 128 102 Q 115 95 110 88 Z'
            }
            className={`transition-all duration-150 ${
              isThumb
                ? 'fill-emerald-500 stroke-emerald-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                : 'fill-slate-800/80 stroke-emerald-500/30'
            }`}
          />
        </svg>
        <span className="text-[11px] font-medium text-slate-400 mt-1">
          {language === 'fa' ? 'دست چپ (مبنا: ب)' : 'Left Hand (Anchor: F)'}
        </span>
      </div>

      {/* Active Finger Callout Pill */}
      {activeFinger && (
        <div className="hidden md:flex flex-col items-center">
          <div
            className={`px-3 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              FINGER_COLORS[activeFinger].bg
            } ${FINGER_COLORS[activeFinger].text} ${FINGER_COLORS[activeFinger].border}`}
            style={{ boxShadow: `0 0 15px ${FINGER_COLORS[activeFinger].glow}` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FINGER_COLORS[activeFinger].glow }} />
            <span>
              {language === 'fa'
                ? FINGER_COLORS[activeFinger].nameFa
                : FINGER_COLORS[activeFinger].nameEn}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {language === 'fa' ? 'انگشت فعال' : 'Target Finger'}
          </span>
        </div>
      )}

      {/* Right Hand SVG */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 140" className="w-28 sm:w-36 h-24 sm:h-30">
          <defs>
            <radialGradient id="rightHandGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(30, 20, 50, 0.7)" />
              <stop offset="100%" stopColor="rgba(15, 10, 28, 0.9)" />
            </radialGradient>
          </defs>

          {/* Palm base */}
          <path
            d="M 130 70 Q 135 110 105 125 Q 65 130 45 110 Q 30 90 35 70 Z"
            fill="url(#rightHandGrad)"
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="1.5"
          />

          {/* Right Thumb */}
          <path
            d={
              isThumb
                ? 'M 45 75 Q 20 80 12 95 Q 15 105 30 102 Q 45 95 50 85 Z'
                : 'M 45 78 Q 22 82 15 96 Q 18 105 32 102 Q 45 95 50 88 Z'
            }
            className={`transition-all duration-150 ${
              isThumb
                ? 'fill-emerald-500 stroke-emerald-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                : 'fill-slate-800/80 stroke-emerald-500/30'
            }`}
          />

          {/* Right Index (with Home Bump anchor indicator) */}
          <rect
            x="59"
            y={isRightIndex ? 22 : 26}
            width="16"
            height="56"
            rx="8"
            className={`transition-all duration-150 ${
              isRightIndex
                ? 'fill-amber-500 stroke-amber-200 stroke-2 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                : 'fill-slate-800/80 stroke-amber-500/40'
            }`}
          />
          {/* Tactile Bump Ring on Right Index */}
          <circle cx="67" cy="46" r="3" fill="#F59E0B" opacity="0.8" />

          {/* Right Middle */}
          <rect
            x="82"
            y={isRightMiddle ? 12 : 16}
            width="16"
            height="64"
            rx="8"
            className={`transition-all duration-150 ${
              isRightMiddle
                ? 'fill-lime-500 stroke-lime-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(132,204,22,0.8)]'
                : 'fill-slate-800/80 stroke-lime-500/30'
            }`}
          />
          {/* Right Ring */}
          <rect
            x="105"
            y={isRightRing ? 20 : 24}
            width="15"
            height="56"
            rx="7.5"
            className={`transition-all duration-150 ${
              isRightRing
                ? 'fill-sky-500 stroke-sky-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]'
                : 'fill-slate-800/80 stroke-sky-500/30'
            }`}
          />
          {/* Right Pinky */}
          <rect
            x="126"
            y={isRightPinky ? 32 : 36}
            width="14"
            height="44"
            rx="7"
            className={`transition-all duration-150 ${
              isRightPinky
                ? 'fill-pink-500 stroke-pink-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]'
                : 'fill-slate-800/80 stroke-pink-500/30'
            }`}
          />
        </svg>
        <span className="text-[11px] font-medium text-slate-400 mt-1">
          {language === 'fa' ? 'دست راست (مبنا: ت)' : 'Right Hand (Anchor: J)'}
        </span>
      </div>
    </div>
  );
};
