import { Prerequisite } from './types/prerequisite';
import type { Progress } from './types/progress';
import type { CourseTask } from './types/task';

export const getNextTask = (tasks: CourseTask[], progress: Progress): CourseTask => {
  let remainingTasks = tasks.filter((task) => !progress.includes(task.taskid));
  let unlockedTasks = remainingTasks.filter((task) => new Prerequisite(task.prerequisites));
  unlockedTasks.sort((a, b) => a.orderBy - b.orderBy);
  return unlockedTasks.length > 0 ? unlockedTasks[0] : null;
};
