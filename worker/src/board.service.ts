import { LeaderBoard } from '~/interfaces';
import { players } from './storage.service';

export const boardService = {
  async getLeaderBoard(): Promise<LeaderBoard> {
    return Array.from(players.values())
      .sort((a, b) => (b.wins / b.games) - (a.wins / a.games))
      .slice(0, 10);
  }
};
