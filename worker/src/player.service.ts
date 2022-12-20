import { storageService } from './storage.service';
import { IPlayer } from '~/interfaces';

export const playerService = {
  async registerPlayer(name: string): Promise<IPlayer> {
    const id = crypto.randomUUID();
    const player: IPlayer = { id, name, wins: 0, draws: 0, games: 0 };
    await storageService.setPlayer(player);
    return player;
  },
  async updateScore(playerId: string, result: 'win' | 'lose' | 'draw') {
    const player = await storageService.getPlayer(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    await storageService.updatePlayer({
      id: player.id,
      games: player.games + 1,
      draws: player.draws + (result === 'draw' ? 1 : 0),
      wins: player.wins + (result === 'win' ? 1 : 0)
    });
  }
};
