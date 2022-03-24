import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals, params }) => {
  const { unlockableAssets } = await database
    .table('courseTask')
    .select('unlockableAssets')
    .where('taskid', params.taskid)
    .first();

  let assets = [];
  unlockableAssets.forEach(async (assetId) => {
    let asset = await database.table('assets').select('*').where('id', assetId).first();
    if (asset) assets.push(asset);
  });

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
