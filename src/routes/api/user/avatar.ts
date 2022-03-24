/**
 * ### GET `/user/avatar`
 *
 * Returns character data for the user. Requires header `Authorization: Bearer <valid (session) token>`.
 *
 * ***Output***
 * ```
 * {
 *   "skin": <String | null>,
 *   "hatId": <String | null>,
 *   "faceId": <String | null>,
 *   "shirtId": <String | null>,
 *   "pantsId": <String | null>
 * }
 * ```
 *
 * ***Errors***
 * - 400: Invalid header format
 * - 401: Invalid token
 *
 * ### PATCH `/user/avatar`
 *
 * Changes character data for the user. All JSON fields in the request body are optional; only provided fields are changed. Requires header `Authorization: Bearer <valid (session) token>`. Returns 200 on success.
 *
 * **Please note:** The data is currently written to the database without any verification. Therefore, it is not guaranteed that the provided data are in fact valid asset ids.
 *
 * ***Input***
 * ```
 * {
 *   "skin": <String | null>,
 *   "hat": <String | null>,
 *   "shirt": <String | null>,
 *   "pants": <String | null>
 * }
 * ```
 *
 * ***Output***
 * ```
 * -
 * ```
 *
 * ***Errors***
 * - 400: Invalid header format or invalid body
 * - 401: Invalid token
 */

import database from '$lib/database/database';
import { InvalidError, userCredentials, WrongFormatError } from '$lib/session';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ request }) => {
  let user;
  try {
    user = await userCredentials(request.headers.get('authorization'));
  } catch (err) {
    if (err instanceof WrongFormatError) {
      return { status: 400, body: err.message };
    }
    if (err instanceof InvalidError) {
      return { status: 401, body: err.message };
    }
  }

  let avatar = (await database.table('users').where({ username: user.username }).first()).avatar;

  return { body: avatar };
};

export const patch: RequestHandler = async ({ request, locals }) => {
  const user = locals.user;

  const body = await request.json();
  if (
    body.skin === undefined ||
    body.hat === undefined ||
    body.pants === undefined ||
    body.shirt === undefined
  ) {
    return { status: 400, body: 'Invalid body' };
  }

  const avatar = {
    skin: body.skin,
    hat: body.hat,
    pants: body.pants,
    shirt: body.shirt
  };
  await database.table('users').where({ username: user.username }).update('avatar', avatar);

  return { status: 200, body: avatar };
};
