/**
 * ### GET `/courses/<course>/tasks/<taskid>/submissions/<submissionid>`
 *
 * Returns a specific submission for the user in this course. Requires header `Authorization: Bearer <valid (session) token>`.
 *
 * ***Output***
 * ```
 * {
 *   "id": <Integer>,
 *   "taskid": <Integer>,
 *   "timestamp": <Integer>,
 *   "content": <String>,
 *   "result_type" <String>,
 *   "simplified": {
 *     "compiler": {
 *       "stdout": <String>,
 *       "statusCode": <Integer>
 *     },
 *     "testCase": {
 *       "stdin": <String>,
 *       "stdout": <String>,
 *       "expectedStdout": <String>,
 *       "statusCode": <Integer>
 *     }
 *   },
 *   "score": <Float>
 * }
 * ```
 *
 * ***Errors***
 * - 400: Invalid header format
 * - 401: Invalid token
 * - 403: Course does not correspond with session course
 * - 404: Submission not found
 */
import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals, params }) => {
  const user = locals.user;
  if (user.activeCourse !== params.course) {
    return { status: 403, body: 'Course does not correspond with session course' };
  }

  let submissions = await database
    .table('submissions')
    .join('courseTask', 'submissions.taskid', 'courseTask.taskid')
    .where('submissions.id', params.submissionid)
    .andWhere('submissions.taskid', params.taskid)
    .andWhere('user', user.username)
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

  if (submissions.length === 0) return { status: 404, body: 'Submissions not found' };

  return { body: submissions[0] };
};
