import type { PageServerLoad } from './$types';
import { getLeaderboard, getActiveGame } from '$lib/db';
import { getPlayer } from '$lib/cookies';
import type { ILeaderBoard, IGameState, IPlayer } from '$lib/types';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  const db = platform?.env.DATABASE;

  let player: IPlayer | null = null;
  let board: ILeaderBoard = [];
  let game: IGameState | null = null;

  if (db) {
    player = await getPlayer(cookies, db);
    board = await getLeaderboard(db);

    if (player) {
      const activeGame = await getActiveGame(db, player.id);

      if (activeGame) {
        game = activeGame;
      }
    }
  }

  return { player, board, game };
};
