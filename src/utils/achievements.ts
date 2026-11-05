import { ACHIEVEMENTS } from '../data/achievements';
import { UserStats } from '../types/typing';

export function getEligibleAchievementIds(stats: UserStats): string[] {
  const hasSpeed50 = stats.sessionHistory.some(
    (session) => (session.type === 'test' || session.type === 'race') && session.wpm >= 50
  );
  const hasSpeed80 = stats.sessionHistory.some(
    (session) => session.type === 'test' && session.wpm >= 80
  );
  const hasFlawlessTest = stats.sessionHistory.some(
    (session) => session.type === 'test' && session.accuracy === 100 && session.errors === 0
  );
  const persianLessonsCompleted = Object.entries(stats.completedLessons).filter(
    ([lessonId, result]) => lessonId.startsWith('fa-') && result.stars > 0
  ).length;

  const eligible: Record<string, boolean> = {
    first_wing: stats.lessonsCompleted > 0,
    stage_silkworm: stats.level >= 5,
    stage_cocoon: stats.level >= 10,
    stage_butterfly: stats.level >= 20,
    stage_radiant: stats.level >= 30,
    speed_50: hasSpeed50,
    speed_80: hasSpeed80,
    flawless_run: hasFlawlessTest,
    streak_7: stats.dailyStreak >= 7,
    persian_scholar: persianLessonsCompleted >= 150,
  };

  return ACHIEVEMENTS.filter((achievement) => eligible[achievement.id]).map(
    (achievement) => achievement.id
  );
}