import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getGame,
  settleGame,
  updatePlayerScore,
  getLeaderboard
} from '$lib/db';
import { getWinner } from '$lib/game';

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  const { id, userGuess } = await request.json();
  const game = await getGame(db, id);

  if (!game || game.state !== 'prepare') {
    return json({ error: 'Game not found' }, { status: 404 });
  }

  const result = getWinner(userGuess, (game as any).computerGuess);

  await settleGame(db, id, userGuess, result);
  await updatePlayerScore(db, game.player, result === 'win', result === 'draw');

  return json({
    game: { ...game, state: 'settle', userGuess, result },
    board: await getLeaderboard(db)
  });
};
