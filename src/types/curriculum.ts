import { Language } from './typing';

export type CurriculumStageId = number;

export type LessonKind =
  | 'foundation'
  | 'intro'
  | 'reinforce'
  | 'hand'
  | 'words'
  | 'text'
  | 'review'
  | 'exam';

export type LessonHand = 'left' | 'right' | 'both';

export interface LessonStep {
  type: 'learn' | 'watch' | 'guided' | 'free' | 'test';
  titleEn: string;
  titleFa: string;
  instructionsEn: string;
  instructionsFa: string;
  targetText: string;
}

export interface Lesson {
  id: string;
  stageId: CurriculumStageId;
  language: Language;
  order: number;
  titleEn: string;
  titleFa: string;
  subtitleEn: string;
  subtitleFa: string;
  keysIntroduced: string[];
  kind?: LessonKind;
  hand?: LessonHand;
  estMinutes?: number;
  whyThisLessonEn: string;
  whyThisLessonFa: string;
  commonMistakesEn: string;
  commonMistakesFa: string;
  targetWpm: number;
  minAccuracy: number; // e.g. 95%
  xpReward: number;
  steps: LessonStep[];
}

export interface CurriculumStage {
  id: CurriculumStageId;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  iconName: string;
  accentColor: string;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  icon: string;
  xpBonus: number;
  isUnlocked?: boolean;
}

export interface RaceBot {
  id: string;
  nameEn: string;
  nameFa: string;
  avatar: string;
  targetWpm: number;
  variance: number; // speed fluctuations
  color: string;
}
