import database from '$lib/database/database';
import { passwordHash, passwordVerify } from '$lib/utils/authentication/password';
import type { RequestHandler } from '@sveltejs/kit';

export const del: RequestHandler = async ({ locals, request }) => {
  const body = await request.json();

  if (body.password === undefined) {
    return { status: 400, body: 'Password is not defined in body.' };
  }
  if (!locals.user.ltiEnabled) {
    return { status: 400, body: 'LTI is disabled. The password cannot be deleted!' };
  }

  let hash = await database
    .table('users')
    .select('password')
    .where('username', locals.user.username)
    .first();

  if (hash.password === null) {
    return { status: 400, body: 'No password set for this user!' };
  }

  if (!(await passwordVerify(hash.password, body.password))) {
    return { status: 401, body: 'Wrong password!' };
  }
  await database.table('users').update('password', null).where('username', locals.user.username);
  return {};
};

export const post: RequestHandler = async ({ locals, request }) => {
  const body = await request.json();

  if (body.password === undefined) {
    return { status: 400, body: 'Password is not defined in body.' };
  }

  if (locals.user.passwordSet) {
    return { status: 401, body: 'Use the patch route for changing password.' };
  }

  await database
    .table('users')
    .update('password', await passwordHash(body.password))
    .where('username', locals.user.username);
  return {};
};

export const patch: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();

  if (body.password === undefined) {
    return { status: 400, body: 'Password is not defined in body.' };
  }
  if (body.oldPassword === undefined) {
    return { status: 400, body: 'Old password is not defined in body.' };
  }

  if (!locals.user.passwordSet) {
    return { status: 401, body: 'Use the post route for creating a password.' };
  }

  let hash = await database
    .table('users')
    .select('password')
    .where('username', locals.user.username)
    .first();

  if (!(await passwordVerify(hash.password, body.oldPassword))) {
    return { status: 401, body: 'Wrong old password!' };
  }

  await database
    .table('users')
    .update('password', await passwordHash(body.password))
    .where('username', locals.user.username);
  return {};
};
