/**
 * ### GET `/courses/<course>/tasks/<taskid>`
 *
 * Returns a single task.
 *
 * ***Output***
 * ```
 * {
 *   "taskid": number,
 *   "task_description": string,
 *   "lang": string,
 *   "tags": [ { name: string, points?: number } ],
 *   "order_by": number,
 *   "prerequisites": number[],
 *   "unlockableAssets": number[]
 * }
 * ```
 *
 * ***Errors***
 * - 404: Invalid course or task id
 * - 500: Multipe tasks with same taskid
 *
 */
import database from '$lib/database/database';
import { serverRequestCache } from '$lib/utils/cache';
import type { RequestHandler } from '@sveltejs/kit';
import * as yup from 'yup';

export const get: RequestHandler = async ({ params }) => {
  if (!yup.number().isValidSync(params.taskid)) {
    return { status: 400, body: 'Taskid needs to be an integer' };
  }

  let task = await serverRequestCache(
    `task-${params.course}-${params.taskid}`,
    600000 /* 10min caching */,
    async () => {
      return await database
        .table('tasks')
        .leftJoin('courseTask', 'tasks.taskid', 'courseTask.taskid')
        .select(
          'tasks.taskid',
          'tasks.taskDescription',
          'tasks.lang',
          'courseTask.tags',
          'courseTask.orderBy',
          'courseTask.prerequisites',
          'courseTask.unlockableAssets'
        )
        .where('tasks.taskid', params.taskid)
        .andWhere('course', params.course);
    }
  );

  if (task.length === 0) {
    return { status: 404, body: 'Invalid course or taskid' };
  }
  if (task.length > 1) {
    return { status: 500, body: 'Multipe tasks with same taskid' };
  }
  task = task[0];

  return {
    status: 200,
    body: task
  };
};
