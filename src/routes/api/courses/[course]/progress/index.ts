/**
 * ### GET `/courses/<course>/progress`
 *
 * Returns all solved tasks as a list of taskids. Requires header `Authorization: Bearer <valid (session) token>`.
 *
 * ***Output***
 * ```
 * [<Integer>, ...]
 * ```
 *
 * ***Errors***
 * - 400: Invalid header format
 * - 401: Invalid token
 * - 403: Course does not correspond with session course
 */
import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals, params }) => {
  let user = locals.user;
  if (user.activeCourse !== params.course) {
    return { status: 403, body: 'Course does not correspond with session course' };
  }

  let progress = (
    await database
      .table('submissions')
      .join('courseTask', 'submissions.taskid', 'courseTask.taskid')
      .where('user', user.username)
      .andWhere('courseTask.course', params.course)
      .andWhere('score', '>=', 0.9999)
      .select('submissions.taskid')
  ).map((x) => x.taskid);
  progress = [...new Set(progress)];
  return { body: progress };
};
