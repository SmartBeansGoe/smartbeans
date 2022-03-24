/**
 * ### POST `/auth/register`
 *
 * Register a new user. Requires header `Authorization: Bearer <any auth.password.registration_keys>` if `auth.password.key_required = true`. Returns 200 on Success.
 *
 * ***Input***
 * ```
 * {
 *   "username": <String>,
 *   "password": <String>,
 *   "displayName?": <String>
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
 * - 401: Invalid key (only with `auth.password.key_required = true`)
 * - 403: Username already exists
 *
 */
import config from '$config';
import { createUser } from '$lib/utils/authentication/register';
import { sleep } from '$lib/utils/sleep';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
  if (!request.body) return { status: 400, body: 'Body must include username, password' };
  const body = await request.json();
  const username = body.username;
  const password = body.password;
  let displayName = body.displayName;

  if (!username) return { status: 400, body: 'Body must include username' };
  if (!password) return { status: 400, body: 'Body must include password' };
  if (!displayName) displayName = username;

  let authHeader = request.headers.get('authorization');
  let token: string;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    if (!config.registrationKeys.includes(token)) {
      await sleep(100); // for security reasons
      return { status: 401, body: 'Invalid registration key' };
    }
  } else {
    return { status: 401, body: 'Authorization header required' };
  }

  let successful = await createUser(username, password, displayName);

  if (!successful) {
    return { status: 400, body: 'Username already exists' };
  }

  return {};
};
