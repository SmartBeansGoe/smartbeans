import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

// Returns the asset data for the requested asset id
export const get: RequestHandler = async ({ locals, params }) => {
  const assets = await database.table('assets').select('*').where('id', params.id);

  const unlocked: string[] = (
    await database
      .table('unlockedAssets')
      .where('user', locals.user.username)
      .andWhere('assetId', params.id)
      .select('assetId')
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
