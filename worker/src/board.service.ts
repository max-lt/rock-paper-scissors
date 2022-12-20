import { ILeaderBoard } from '~/interfaces';
import { storageService } from './storage.service';

export const boardService = {
  async getLeaderBoard(): Promise<ILeaderBoard> {
    const players = await storageService.getPlayers();

    return players
      .sort((a, b) => b.wins / b.games - a.wins / a.games)
      .slice(0, 10)
      .map(({ id, ...player }) => ({ ...player }));
  }
};
