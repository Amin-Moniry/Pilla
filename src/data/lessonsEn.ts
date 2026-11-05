import { Lesson } from '../types/curriculum';
import { buildTrack } from './curriculum/lessonBuilder';
import { SPECS_EN } from './curriculum/specsEn';

/** 150 step-by-step lessons for the English (QWERTY) keyboard. Generated from curriculum/specsEn.ts. */
export const ENGLISH_LESSONS: Lesson[] = buildTrack(SPECS_EN, 'en');
