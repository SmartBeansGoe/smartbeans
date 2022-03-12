/**
 * ### DELETE `/api/auth/logout`
 *
 * Logouts from current session and deletes the token from the database. Returns 200, regardless whether the token existed or not.
 *
 * ***Input/Output***
 * ```
 * -
 * ```
 */

import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';

export const del: RequestHandler = async ({ request }) => {
  const cookieString = request.headers.get('cookie');
  const cookies = cookieString ? cookie.parse(cookieString) : undefined;
  if (cookies) {
    await database.table('sessions').where('token', cookies.token).del();
  }
  return {
    status: 200,
    headers: { 'set-cookie': ['token=; path=/;'] }
  };
};
