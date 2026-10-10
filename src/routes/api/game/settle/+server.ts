import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getGame,
  settleGame,
  updatePlayerScore,
  getLeaderboard
} from '$lib/db';
import { getWinner } from '$lib/game';
import { getPlayer } from '$lib/cookies';

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  const player = await getPlayer(cookies, db);

  if (!player) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id, userGuess } = await request.json();
  const game = await getGame(db, id);

  if (!game || game.state !== 'prepare' || game.player !== player.id) {
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
