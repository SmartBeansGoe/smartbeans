/**
 * ### GET `/courses/<course>/meta`
 *
 * ***Output***
 * ```
 * {
 *   "name": <String>,
 *   "title": <String>,
 *   "config": {
 *     ...
 *   }
 * }
 * ```
 *
 * ***Errors***
 * - 404: Invalid course
 *
 */
import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
  let course = await database.table('courses').where({ name: params.course });
  if (course.length === 0) {
    return { status: 404, body: 'Invalid course' };
  }
  return { body: course };
};
