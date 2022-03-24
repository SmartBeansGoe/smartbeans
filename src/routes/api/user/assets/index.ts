import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals }) => {
  const assets = await database.table('assets').select('*');

  const unlocked: string[] = (
    await database.table('unlockedAssets').where('user', locals.user.username).select('assetId')
  ).map((x) => x.assetId);

  let prepared = assets.map((asset) => {
    return {
      ...asset,
      unlocked: unlocked.includes(asset.id)
    };
  });

  prepared.sort((a, b) => (a.unlocked ? -1 : 1));

  return { body: prepared };
};
