/**
 * ### GET `/courses/<course>/tasks`
 *
 * Returns a list of all tasks for the given course.
 *
 * ***Output***
 * ```
 * [
 *   {
 *     "taskid": <Integer>,
 *     "taskDescription": <String>,
 *     "lang": <String>,
 *     "tags": <String>,
 *     "orderBy": <Integer>,
 *     "prerequisites": <String>
 *   },
 *   ...
 * ]
 * ```
 *
 * ***Errors***
 * - 404: Invalid course
 */
import database from '$lib/database/database';
import { serverRequestCache } from '$lib/utils/cache';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
  let courseAvailable =
    (await database('courses').select('name').where({ name: params.course })).length > 0;
  if (!courseAvailable) {
    return { status: 404, body: 'Invalid course' };
  }

  let tasks = await serverRequestCache(
    `tasks-${params.course}`,
    600000 /* 10min caching */,
    async () => {
      return await database
        .table('tasks')
        .join('courseTask', 'tasks.taskid', 'courseTask.taskid')
        .select(
          'tasks.taskid',
          'tasks.taskDescription',
          'tasks.solution',
          'tasks.lang',
          'tasks.tests',
          'courseTask.tags',
          'courseTask.orderBy',
          'courseTask.prerequisites'
        )
        .where({ course: params.course });
    }
  );

  return {
    status: 200,
    body: tasks
  };
};
