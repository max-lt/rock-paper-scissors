import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createGame, getLeaderboard } from '$lib/db';
import { getPlayer } from '$lib/cookies';
import { sha1 } from '$lib/game';
import type { Guess } from '$lib/types';

const GUESSES: Guess[] = ['rock', 'paper', 'scissors'];

export const POST: RequestHandler = async ({ cookies, platform }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  const player = await getPlayer(cookies, db);

  if (!player) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const nonce = crypto.randomUUID().slice(0, 8);
  const computerGuess = GUESSES[Math.floor(Math.random() * 3)];
  const hash = await sha1(nonce + computerGuess);

  const game = await createGame(db, {
    hash,
    player: player.id,
    nonce,
    computerGuess
  });

  if (!game) {
    return json({ error: 'Failed to create game' }, { status: 500 });
  }

  return json({
    game,
    board: await getLeaderboard(db)
  });
};
