import { Guess, IGameState, IGameStatePrepare, IGameStateSettle, IPlayer } from '~/interfaces';

import { setItem, getItem, InternalGameState } from './storage.utils';
import { playerService } from './player.service';

export const gameService = {
  /**
   * Creates a new game and returns the game state with the computer guess hashed
   */
  async prepareGame(kv: KVNamespace, playerId: string): Promise<IGameStatePrepare> {
    const guess = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as Guess;

    const id = crypto.randomUUID();
    const nonce = crypto.randomUUID().slice(0, 8);

    // Perform hash of nonce + guess
    const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(nonce + guess));

    // Turn digest into a hex string
    const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');

    const game: IGameState = { id, state: 'prepare', hash, player: playerId };

    // Store game with nonce
    await setItem(kv, id, { ...game, nonce, computerGuess: guess });

    return game;
  },
  /**
   * Computer unveils its guess and the result of the game
   */
  async settleGame(kv: KVNamespace, id: string, playerGuess: Guess): Promise<IGameStateSettle | null> {
    const game = await getItem<InternalGameState>(kv, id);
    if (!game) {
      return null;
    }

    if (game.state !== 'prepare') {
      return null;
    }

    const { computerGuess } = game;

    const result = (() => {
      if (playerGuess === computerGuess) {
        return 'draw';
      }

      if (playerGuess === 'rock' && computerGuess === 'scissors') {
        return 'win';
      }

      if (playerGuess === 'paper' && computerGuess === 'rock') {
        return 'win';
      }

      if (playerGuess === 'scissors' && computerGuess === 'paper') {
        return 'win';
      }

      return 'lose';
    })();

    // Assign result to game
    const settled: IGameState = { ...game, state: 'settle', userGuess: playerGuess, result };

    // Update game
    await setItem(kv, id, settled);

    // Update player score
    await playerService.updateScore(kv, game.player, result);

    return settled;
  }
};
