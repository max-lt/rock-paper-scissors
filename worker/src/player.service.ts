import { Player } from '~/interfaces';

import { players } from './storage.service';

export const playerService = {
  async registerPlayer(name: string): Promise<Player> {
    const id = crypto.randomUUID();
    const player: Player = { id, name, wins: 0, games: 0 };
    players.set(id, player);
    return player;
  }
};
