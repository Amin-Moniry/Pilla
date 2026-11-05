import { FingerType, KeyDef, KeyboardLayoutType } from '../types/typing';

export const FINGER_COLORS: Record<FingerType, { bg: string; text: string; border: string; glow: string; nameEn: string; nameFa: string }> = {
  'left-pinky': {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    glow: 'rgba(244, 63, 94, 0.4)',
    nameEn: 'Left Pinky',
    nameFa: 'انگشت کوچک چپ',
  },
  'left-ring': {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    glow: 'rgba(168, 85, 247, 0.4)',
    nameEn: 'Left Ring',
    nameFa: 'انگشت انگشتری چپ',
  },
  'left-middle': {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    border: 'border-indigo-500/40',
    glow: 'rgba(99, 102, 241, 0.4)',
    nameEn: 'Left Middle',
    nameFa: 'انگشت میانی چپ',
  },
  'left-index': {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    glow: 'rgba(6, 182, 212, 0.4)',
    nameEn: 'Left Index',
    nameFa: 'انگشت اشاره چپ',
  },
  thumb: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.4)',
    nameEn: 'Thumb',
    nameFa: 'شست',
  },
  'right-index': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    glow: 'rgba(245, 158, 11, 0.4)',
    nameEn: 'Right Index',
    nameFa: 'انگشت اشاره راست',
  },
  'right-middle': {
    bg: 'bg-lime-500/20',
    text: 'text-lime-400',
    border: 'border-lime-500/40',
    glow: 'rgba(132, 204, 22, 0.4)',
    nameEn: 'Right Middle',
    nameFa: 'انگشت میانی راست',
  },
  'right-ring': {
    bg: 'bg-sky-500/20',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    glow: 'rgba(14, 165, 233, 0.4)',
    nameEn: 'Right Ring',
    nameFa: 'انگشت انگشتری راست',
  },
  'right-pinky': {
    bg: 'bg-pink-500/20',
    text: 'text-pink-400',
    border: 'border-pink-500/40',
    glow: 'rgba(236, 72, 153, 0.4)',
    nameEn: 'Right Pinky',
    nameFa: 'انگشت کوچک راست',
  },
};

// Base layout definitions
export const QWERTY_LAYOUT_ROWS: KeyDef[][] = [
  // Number row
  [
    { code: 'Backquote', char: '`', shiftChar: '~', finger: 'left-pinky' },
    { code: 'Digit1', char: '1', shiftChar: '!', finger: 'left-pinky' },
    { code: 'Digit2', char: '2', shiftChar: '@', finger: 'left-ring' },
    { code: 'Digit3', char: '3', shiftChar: '#', finger: 'left-middle' },
    { code: 'Digit4', char: '4', shiftChar: '$', finger: 'left-index' },
    { code: 'Digit5', char: '5', shiftChar: '%', finger: 'left-index' },
    { code: 'Digit6', char: '6', shiftChar: '^', finger: 'right-index' },
    { code: 'Digit7', char: '7', shiftChar: '&', finger: 'right-index' },
    { code: 'Digit8', char: '8', shiftChar: '*', finger: 'right-middle' },
    { code: 'Digit9', char: '9', shiftChar: '(', finger: 'right-ring' },
    { code: 'Digit0', char: '0', shiftChar: ')', finger: 'right-pinky' },
    { code: 'Minus', char: '-', shiftChar: '_', finger: 'right-pinky' },
    { code: 'Equal', char: '=', shiftChar: '+', finger: 'right-pinky' },
    { code: 'Backspace', char: '⌫', finger: 'right-pinky', width: 1.5 },
  ],
  // Top row
  [
    { code: 'Tab', char: 'Tab', finger: 'left-pinky', width: 1.3 },
    { code: 'KeyQ', char: 'q', shiftChar: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', char: 'w', shiftChar: 'W', finger: 'left-ring' },
    { code: 'KeyE', char: 'e', shiftChar: 'E', finger: 'left-middle' },
    { code: 'KeyR', char: 'r', shiftChar: 'R', finger: 'left-index' },
    { code: 'KeyT', char: 't', shiftChar: 'T', finger: 'left-index' },
    { code: 'KeyY', char: 'y', shiftChar: 'Y', finger: 'right-index' },
    { code: 'KeyU', char: 'u', shiftChar: 'U', finger: 'right-index' },
    { code: 'KeyI', char: 'i', shiftChar: 'I', finger: 'right-middle' },
    { code: 'KeyO', char: 'o', shiftChar: 'O', finger: 'right-ring' },
    { code: 'KeyP', char: 'p', shiftChar: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', char: '[', shiftChar: '{', finger: 'right-pinky' },
    { code: 'BracketRight', char: ']', shiftChar: '}', finger: 'right-pinky' },
    { code: 'Backslash', char: '\\', shiftChar: '|', finger: 'right-pinky', width: 1.2 },
  ],
  // Home row
  [
    { code: 'CapsLock', char: 'Caps', finger: 'left-pinky', width: 1.5 },
    { code: 'KeyA', char: 'a', shiftChar: 'A', finger: 'left-pinky' },
    { code: 'KeyS', char: 's', shiftChar: 'S', finger: 'left-ring' },
    { code: 'KeyD', char: 'd', shiftChar: 'D', finger: 'left-middle' },
    { code: 'KeyF', char: 'f', shiftChar: 'F', finger: 'left-index', isHomeBump: true },
    { code: 'KeyG', char: 'g', shiftChar: 'G', finger: 'left-index' },
    { code: 'KeyH', char: 'h', shiftChar: 'H', finger: 'right-index' },
    { code: 'KeyJ', char: 'j', shiftChar: 'J', finger: 'right-index', isHomeBump: true },
    { code: 'KeyK', char: 'k', shiftChar: 'K', finger: 'right-middle' },
    { code: 'KeyL', char: 'l', shiftChar: 'L', finger: 'right-ring' },
    { code: 'Semicolon', char: ';', shiftChar: ':', finger: 'right-pinky' },
    { code: 'Quote', char: "'", shiftChar: '"', finger: 'right-pinky' },
    { code: 'Enter', char: '↵', finger: 'right-pinky', width: 1.7 },
  ],
  // Bottom row
  [
    { code: 'ShiftLeft', char: 'Shift', finger: 'left-pinky', width: 2.0 },
    { code: 'KeyZ', char: 'z', shiftChar: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', char: 'x', shiftChar: 'X', finger: 'left-ring' },
    { code: 'KeyC', char: 'c', shiftChar: 'C', finger: 'left-middle' },
    { code: 'KeyV', char: 'v', shiftChar: 'V', finger: 'left-index' },
    { code: 'KeyB', char: 'b', shiftChar: 'B', finger: 'left-index' },
    { code: 'KeyN', char: 'n', shiftChar: 'N', finger: 'right-index' },
    { code: 'KeyM', char: 'm', shiftChar: 'M', finger: 'right-index' },
    { code: 'Comma', char: ',', shiftChar: '<', finger: 'right-middle' },
    { code: 'Period', char: '.', shiftChar: '>', finger: 'right-ring' },
    { code: 'Slash', char: '/', shiftChar: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', char: 'Shift', finger: 'right-pinky', width: 2.2 },
  ],
  // Spacebar row
  [
    { code: 'ControlLeft', char: 'Ctrl', finger: 'left-pinky', width: 1.3 },
    { code: 'AltLeft', char: 'Alt', finger: 'thumb', width: 1.2 },
    { code: 'Space', char: 'Space', shiftChar: 'Space', finger: 'thumb', width: 6.2 },
    { code: 'AltRight', char: 'Alt', finger: 'thumb', width: 1.2 },
    { code: 'ControlRight', char: 'Ctrl', finger: 'right-pinky', width: 1.3 },
  ],
];

// Persian Standard ISIRI 9147 Layout
export const PERSIAN_STANDARD_LAYOUT_ROWS: KeyDef[][] = [
  // Number row
  [
    { code: 'Backquote', char: '‌', shiftChar: '÷', finger: 'left-pinky' }, // ZWNJ also on backquote
    { code: 'Digit1', char: '۱', shiftChar: '!', finger: 'left-pinky' },
    { code: 'Digit2', char: '۲', shiftChar: '٫', finger: 'left-ring' },
    { code: 'Digit3', char: '۳', shiftChar: '٬', finger: 'left-middle' },
    { code: 'Digit4', char: '۴', shiftChar: '٪', finger: 'left-index' },
    { code: 'Digit5', char: '۵', shiftChar: '×', finger: 'left-index' },
    { code: 'Digit6', char: '۶', shiftChar: '،', finger: 'right-index' },
    { code: 'Digit7', char: '۷', shiftChar: '*', finger: 'right-index' },
    { code: 'Digit8', char: '۸', shiftChar: ')', finger: 'right-middle' },
    { code: 'Digit9', char: '۹', shiftChar: '(', finger: 'right-ring' },
    { code: 'Digit0', char: '۰', shiftChar: 'ـ', finger: 'right-pinky' },
    { code: 'Minus', char: '-', shiftChar: '_', finger: 'right-pinky' },
    { code: 'Equal', char: '=', shiftChar: '+', finger: 'right-pinky' },
    { code: 'Backspace', char: '⌫', finger: 'right-pinky', width: 1.5 },
  ],
  // Top row
  [
    { code: 'Tab', char: 'تب', finger: 'left-pinky', width: 1.3 },
    { code: 'KeyQ', char: 'ض', shiftChar: 'ْ', finger: 'left-pinky' },
    { code: 'KeyW', char: 'ص', shiftChar: 'ٌ', finger: 'left-ring' },
    { code: 'KeyE', char: 'ث', shiftChar: 'ٍ', finger: 'left-middle' },
    { code: 'KeyR', char: 'ق', shiftChar: 'ً', finger: 'left-index' },
    { code: 'KeyT', char: 'ف', shiftChar: 'ُ', finger: 'left-index' },
    { code: 'KeyY', char: 'غ', shiftChar: 'ِ', finger: 'right-index' },
    { code: 'KeyU', char: 'ع', shiftChar: 'َ', finger: 'right-index' },
    { code: 'KeyI', char: 'ه', shiftChar: 'ّ', finger: 'right-middle' },
    { code: 'KeyO', char: 'خ', shiftChar: ']', finger: 'right-ring' },
    { code: 'KeyP', char: 'ح', shiftChar: '[', finger: 'right-pinky' },
    { code: 'BracketLeft', char: 'ج', shiftChar: '}', finger: 'right-pinky' },
    { code: 'BracketRight', char: 'چ', shiftChar: '{', finger: 'right-pinky' },
    { code: 'Backslash', char: 'پ', shiftChar: '»', finger: 'right-pinky', width: 1.2 },
  ],
  // Home row (Home bumps: ب on KeyF, ت on KeyJ)
  [
    { code: 'CapsLock', char: 'Caps', finger: 'left-pinky', width: 1.5 },
    { code: 'KeyA', char: 'ش', shiftChar: 'ؤ', finger: 'left-pinky' },
    { code: 'KeyS', char: 'س', shiftChar: 'ئ', finger: 'left-ring' },
    { code: 'KeyD', char: 'ی', shiftChar: 'ي', finger: 'left-middle' },
    { code: 'KeyF', char: 'ب', shiftChar: 'إ', finger: 'left-index', isHomeBump: true },
    { code: 'KeyG', char: 'ل', shiftChar: 'أ', finger: 'left-index' },
    { code: 'KeyH', char: 'ا', shiftChar: 'آ', finger: 'right-index' },
    { code: 'KeyJ', char: 'ت', shiftChar: 'ة', finger: 'right-index', isHomeBump: true },
    { code: 'KeyK', char: 'ن', shiftChar: '»', finger: 'right-middle' },
    { code: 'KeyL', char: 'م', shiftChar: '«', finger: 'right-ring' },
    { code: 'Semicolon', char: 'ک', shiftChar: ':', finger: 'right-pinky' },
    { code: 'Quote', char: 'گ', shiftChar: '؛', finger: 'right-pinky' },
    { code: 'Enter', char: '↵', finger: 'right-pinky', width: 1.7 },
  ],
  // Bottom row
  [
    { code: 'ShiftLeft', char: 'تبدیل', finger: 'left-pinky', width: 2.0 },
    { code: 'KeyZ', char: 'ظ', shiftChar: 'ك', finger: 'left-pinky' },
    { code: 'KeyX', char: 'ط', shiftChar: 'ٓ', finger: 'left-ring' },
    { code: 'KeyC', char: 'ز', shiftChar: 'ژ', finger: 'left-middle' },
    { code: 'KeyV', char: 'ر', shiftChar: 'ٰ', finger: 'left-index' },
    { code: 'KeyB', char: 'ذ', shiftChar: '‌', finger: 'left-index' },
    { code: 'KeyN', char: 'د', shiftChar: 'ء', finger: 'right-index' },
    { code: 'KeyM', char: 'پ', shiftChar: 'ٔ', finger: 'right-index' },
    { code: 'Comma', char: 'و', shiftChar: '<', finger: 'right-middle' },
    { code: 'Period', char: '.', shiftChar: '>', finger: 'right-ring' },
    { code: 'Slash', char: '/', shiftChar: '؟', finger: 'right-pinky' },
    { code: 'ShiftRight', char: 'تبدیل', finger: 'right-pinky', width: 2.2 },
  ],
  // Spacebar row
  [
    { code: 'ControlLeft', char: 'Ctrl', finger: 'left-pinky', width: 1.3 },
    { code: 'AltLeft', char: 'Alt', finger: 'thumb', width: 1.2 },
    { code: 'Space', char: 'فاصله', shiftChar: 'نیم‌فاصله', finger: 'thumb', width: 6.2 },
    { code: 'AltRight', char: 'Alt', finger: 'thumb', width: 1.2 },
    { code: 'ControlRight', char: 'Ctrl', finger: 'right-pinky', width: 1.3 },
  ],
];

export function getLayoutRows(layout: KeyboardLayoutType): KeyDef[][] {
  switch (layout) {
    case 'persian-standard':
      return PERSIAN_STANDARD_LAYOUT_ROWS;
    case 'qwerty':
    default:
      return QWERTY_LAYOUT_ROWS;
  }
}

/**
 * Maps a character to its corresponding physical key code and shift requirement.
 */
export function findKeyForChar(
  char: string,
  layout: KeyboardLayoutType
): { keyDef: KeyDef | null; requiresShift: boolean } {
  const rows = getLayoutRows(layout);

  if (char === ' ') {
    return {
      keyDef: { code: 'Space', char: ' ', finger: 'thumb' },
      requiresShift: false,
    };
  }

  // ZWNJ on Persian standard layout is Shift+Space or Backquote
  if (char === '\u200C' || char === '\u200D') {
    return {
      keyDef: { code: 'Space', char: 'فاصله', shiftChar: 'نیم‌فاصله', finger: 'thumb' },
      requiresShift: true,
    };
  }

  // Some characters live on two physical keys (e.g. Persian "پ" on M and on the
  // backslash key). Collect every match and prefer the easier, non-pinky key.
  const matches: { keyDef: KeyDef; requiresShift: boolean }[] = [];
  for (const row of rows) {
    for (const key of row) {
      if (key.char === char) {
        matches.push({ keyDef: key, requiresShift: false });
      } else if (key.shiftChar === char) {
        matches.push({ keyDef: key, requiresShift: true });
      }
    }
  }
  if (matches.length > 0) {
    return (
      matches.find((m) => !m.keyDef.finger.endsWith('pinky') && !m.requiresShift) ??
      matches[0]
    );
  }

  // Fallback search: case-insensitive for letters
  const lower = char.toLowerCase();
  for (const row of rows) {
    for (const key of row) {
      if (key.char.toLowerCase() === lower) {
        const isUpper = char !== lower && char === char.toUpperCase();
        return { keyDef: key, requiresShift: isUpper };
      }
    }
  }

  return { keyDef: null, requiresShift: false };
}

/**
 * Gets finger responsible for a character.
 */
export function getFingerForChar(char: string, layout: KeyboardLayoutType = 'qwerty'): FingerType {
  const result = findKeyForChar(char, layout);
  if (result.keyDef) return result.keyDef.finger;
  if (char === ' ' || char === '\u200C') return 'thumb';
  return 'right-index';
}
