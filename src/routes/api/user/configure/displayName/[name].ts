import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ locals, params }) => {
  if (params.name.length < 3 || params.name.length > 16) {
    return { status: 400, body: 'Display name length must be between 3 and 16 characters!' };
  }
  await database
    .table('users')
    .update({ displayName: params.name })
    .where('username', locals.user.username);

  return {};
};
