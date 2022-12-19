import { Player } from '~/interfaces';

import { setItem, getItem } from './storage.utils';
import { boardService } from './board.service';

export const playerService = {
  async registerPlayer(kv: KVNamespace, name: string): Promise<Player> {
    const id = crypto.randomUUID();
    const player: Player = { id, name, wins: 0, games: 0 };
    await setItem(kv, id, player);
    return player;
  },
  async getPlayer(kv: KVNamespace, id: string): Promise<Player | null> {
    return getItem(kv, id);
  },
  async updatePlayer(kv: KVNamespace, player: Player): Promise<Player> {
    await setItem(kv, player.id, player);

    // Update board
    await boardService.updateLeaderBoard(kv, player);

    return player;
  }
};
