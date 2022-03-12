export type AchievementRow = {
  id: number;
  evalFunc: string;
  svgPath: string;
  hidden: boolean;
  enabled: boolean;
  details: {
    unlocked: {
      title: string;
      description: string;
    };
    title: string;
    description: string;
    svgPath: string;
  };
};

export interface Achievement {
  id: string | number;
  unlocked?: number; // timestamp
  title: string;
  description: string;
  svgPath: string;
  unlockFrequency: number;
}

export type AchievementType = 'locked' | 'unlocked';

export type AchievementUnlockedRow = {
  achievementId: number;
  username: string;
  unlocked: number;
};

export type CourseAchievementRow = {
  achievementId: number;
  course: string;
};
