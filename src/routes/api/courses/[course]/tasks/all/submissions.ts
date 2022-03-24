/**
 * ### GET `/courses/<course>/tasks/all/submissions`
 *
 * Returns all submissions for the user in this course.
 * Requires header `Authorization: Bearer <valid (session) token>`.
 *
 * ***Output***
 * ```
 * [
 *   {
 *     "id": <Integer>,
 *     "taskid": <Integer>,
 *     "timestamp": <Integer>,
 *     "content": <String>,
 *     "result_type" <String>,
 *     "simplified": {
 *       "compiler": {
 *         "stdout": <String>,
 *         "statusCode": <Integer>
 *       },
 *       "testCase": {
 *         "stdin": <String>,
 *         "stdout": <String>,
 *         "expectedStdout": <String>,
 *         "statusCode": <Integer>
 *       }
 *     },
 *     "score": <Float>
 *   },
 *   ...
 * ]
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
  const user = locals.user;
  if (user.activeCourse !== params.course) {
    return { status: 403, body: 'Course does not correspond with session course' };
  }

  let submissions = await database('submissions')
    .join('courseTask', 'submissions.taskid', 'courseTask.taskid')
    .where('user', user.username)
    .andWhere('courseTask.course', params.course)
    .select(
      'submissions.id',
      'submissions.course',
      'submissions.taskid',
      'timestamp',
      'content',
      'resultType',
      'simplified',
      'details',
      'score'
    );

  return { body: submissions };
};
