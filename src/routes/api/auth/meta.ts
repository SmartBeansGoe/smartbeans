import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
  const courses = await database.table('courses').select('name');
  return { body: courses };
};
