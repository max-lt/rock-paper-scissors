import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getLeaderboard } from '$lib/db';

export const GET: RequestHandler = async ({ platform }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  return json({ board: await getLeaderboard(db) });
};
