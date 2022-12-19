import { Guess, IGameState, IGameStatePrepare, IGameStateSettle, Player } from '~/interfaces';

import { games, players } from './storage.service';

export const gameService = {
  /**
   * Creates a new game and returns the game state with the computer guess hashed
   */
  async prepareGame(playerId: string): Promise<IGameStatePrepare> {
    const guess = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as Guess;

    const id = crypto.randomUUID();
    const nonce = crypto.randomUUID().slice(0, 8);

    // Perform hash of nonce + guess
    const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(nonce + guess));

    // Turn digest into a hex string
    const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');

    const game: IGameState = { id, state: 'prepare', hash, player: playerId };

    // Store game with nonce
    games.set(id, { ...game, nonce, computerGuess: guess });

    return game;
  },
  /**
   * Computer unveils its guess and the result of the game
   */
  async settleGame(id: string, playerGuess: Guess): Promise<IGameStateSettle | null> {  
    const game = games.get(id);
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
    games.set(id, settled);

    // Update player
    const player = players.get(game.player);
    if (player) {
      players.set(game.player, { ...player, games: player.games + 1, wins: player.wins + (result === 'win' ? 1 : 0) });
    } else {
      players.set(game.player, { id: game.player, name: game.player, games: 1, wins: result === 'win' ? 1 : 0 });
    }

    return settled;
  }
};
