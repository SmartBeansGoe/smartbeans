/**
 * ### DELETE `/api/auth/logout/<token>`
 *
 * Deletes the token from the database. Returns 200, regardless whether the token existed or not.
 *
 * ***Input/Output***
 * ```
 * -
 * ```
 */

import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const del: RequestHandler = async ({ params }) => {
  const token = params.token;
  await database.table('sessions').where('token', token).del();
  return { status: 200, headers: { 'set-cookie': 'token=; path=/;' } };
};
