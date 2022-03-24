/**
 * ### PATCH `/auth/lti`
 *
 * Changes the LTI status of the user. Requires header `Authorization: Bearer <valid (session) token>`. Returns 200 on Success.
 *
 * ***Input***
 * ```
 * {
 *   "enable": <bool>
 * }
 * ```
 *
 * ***Output***
 * ```
 * -
 * ```
 *
 * ***Errors***
 * - 400: Invalid header or body format
 * - 401: Invalid token
 */
import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const patch: RequestHandler = async ({ request, locals }) => {
  const user = locals.user;
  const body = await request.json();
  const enable = body.enable;

  if (enable === undefined) {
    return { statud: 400, body: 'Invalid header or body format' };
  }

  await database('users').where({ username: user.username }).update({ ltiEnabled: enable });

  return { status: 200 };
};
