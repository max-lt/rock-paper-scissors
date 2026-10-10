import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getLeaderboard } from '$lib/db';
import { getPlayer } from '$lib/cookies';
import { openGame } from '$lib/server/game';

export const POST: RequestHandler = async ({ cookies, platform }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  const player = await getPlayer(cookies, db);

  if (!player) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const game = await openGame(db, player.id);

  if (!game) {
    return json({ error: 'Failed to create game' }, { status: 500 });
  }

  return json({
    game,
    board: await getLeaderboard(db)
  });
};
