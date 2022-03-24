import database from '$lib/database/database';
import { schemaAsset, type Asset } from '$lib/utils/types/assets';
import type { RequestHandler } from '@sveltejs/kit';
import * as yup from 'yup';

export const post: RequestHandler = async ({ request }) => {
  if (request.headers.get('Content-Type') !== 'application/json')
    return { status: 400, body: 'Request must be content-type of application/json' };
  if (parseInt(request.headers.get('Content-Length')) === 0)
    return { status: 400, body: 'Request body must be defined' };

  let body: any;
  try {
    body = await request.json();
  } catch {
    return { status: 400, body: 'Request body must be a json object' };
  }

  let asset: Asset;
  // Validate body data
  try {
    asset = await schemaAsset.validate(body, { stripUnknown: true });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: 400, body: JSON.stringify(error.errors) };
    }
  }

  // Check asset already in database then update otherwise insert
  let query = await database.table('assets').where('id', asset.id).first();
  if (query !== undefined) {
    await database.table('assets').update(asset).where('id', asset.id);
  } else {
    await database.table('assets').insert(asset);
  }

  return {};
};
