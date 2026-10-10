import { createGame, getActiveGame } from '$lib/db';
import { sha1 } from '$lib/game';
import type { Guess, IGameState } from '$lib/types';

const GUESSES: Guess[] = ['rock', 'paper', 'scissors'];

/**
 * The open game of a player: the one in the prepare state, or a new one. The
 * computer guess and its nonce stay in the database until the game settles;
 * the player gets only their hash.
 */
export async function openGame(
  db: BindingDatabase,
  playerId: string
): Promise<IGameState | null> {
  const active = await getActiveGame(db, playerId);

  if (active) {
    return active;
  }

  const nonce = crypto.randomUUID().slice(0, 8);
  const computerGuess = GUESSES[Math.floor(Math.random() * 3)];

  return createGame(db, {
    hash: await sha1(nonce + computerGuess),
    player: playerId,
    nonce,
    computerGuess
  });
}
