import { setItem, getItem } from './storage.utils';
import { boardService } from './board.service';
import { IPlayer } from '~/interfaces';

export const playerService = {
  async registerPlayer(kv: KVNamespace, name: string): Promise<IPlayer> {
    const id = crypto.randomUUID();
    const player: IPlayer = { id, name, wins: 0, draws: 0, games: 0 };
    await setItem(kv, id, player);
    return player;
  },
  async getPlayer(kv: KVNamespace, id: string): Promise<IPlayer | null> {
    return getItem(kv, id);
  },
  async updateScore(kv: KVNamespace, playerId: string, result: 'win' | 'lose' | 'draw') {
    const player = await getItem<IPlayer>(kv, playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const updated = {
      ...player,
      games: player.games + 1,
      draws: player.draws + (result === 'draw' ? 1 : 0),
      wins: player.wins + (result === 'win' ? 1 : 0)
    }
    
    await setItem(kv, player.id, updated);

    // Update board
    await boardService.updateLeaderBoard(kv, updated);
  }
};
