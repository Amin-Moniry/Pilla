import { Lesson } from '../types/curriculum';
import { buildTrack } from './curriculum/lessonBuilder';
import { SPECS_FA } from './curriculum/specsFa';

/** 150 step-by-step lessons for the Persian (ISIRI / Windows standard) keyboard. Generated from curriculum/specsFa.ts. */
export const PERSIAN_LESSONS: Lesson[] = buildTrack(SPECS_FA, 'fa');
