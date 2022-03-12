import type {
  AchievementRow,
  AchievementUnlockedRow,
  CourseAchievementRow
} from '$lib/utils/types/achievement';
import type { CourseMappingRow, CourseRow } from '$lib/utils/types/course';
import type { SessionRow } from '$lib/utils/types/session';
import type { SubmissionRow } from '$lib/utils/types/submission';
import type { CourseTaskRow, TaskRow } from '$lib/utils/types/task';
import type { UserRow } from '$lib/utils/types/user';

declare module 'knex/types/tables' {
  interface Tables {
    achievements: AchievementRow;
    achievementUnlocked: AchievementUnlockedRow;
    courses: CourseRow;
    courseAchievement: CourseAchievementRow;
    courseMapping: CourseMappingRow;
    courseTask: CourseTaskRow;
    sessions: SessionRow;
    submissions: SubmissionRow;
    tasks: TaskRow;
    users: UserRow;
  }
}
