import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createGame, getLeaderboard } from '$lib/db';
import { sha1 } from '$lib/game';
import type { Guess } from '$lib/types';

const GUESSES: Guess[] = ['rock', 'paper', 'scissors'];

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  const { playerId } = await request.json();
  const id = crypto.randomUUID();
  const nonce = crypto.randomUUID().slice(0, 8);
  const computerGuess = GUESSES[Math.floor(Math.random() * 3)];
  const hash = await sha1(nonce + computerGuess);

  await createGame(db, {
    id,
    state: 'prepare',
    hash,
    player: playerId,
    nonce,
    computerGuess
  });

  return json({
    game: { id, state: 'prepare', hash, player: playerId },
    board: await getLeaderboard(db)
  });
};
