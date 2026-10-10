import type { PageServerLoad } from './$types';
import { getLeaderboard } from '$lib/db';
import { openGame } from '$lib/server/game';
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

    // The page renders with the hash of the game, so the client does not
    // prepare one after it loads
    if (player) {
      game = await openGame(db, player.id);
    }
  }

  return { player, board, game };
};
