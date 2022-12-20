import { ILeaderBoard, IPlayer } from '~/interfaces';
import { getItem, setItem } from './storage.utils';

export const boardService = {
  async getLeaderBoard(kv: KVNamespace): Promise<ILeaderBoard> {
    return ((await getItem<IPlayer[]>(kv, 'board')) ?? [])
      .sort((a, b) => b.wins / b.games - a.wins / a.games)
      .slice(0, 10)
      .map(({ id, ...player }) => ({ ...player }));
  },
  async updateLeaderBoard(kv: KVNamespace, player: IPlayer): Promise<void> {
    const board = (await getItem<IPlayer[]>(kv, 'board')) ?? [];

    const index = board.findIndex((p) => p.id === player.id);

    if (index === -1) {
      board.push(player);
    } else {
      board[index] = player;
    }

    await setItem(kv, 'board', board);
  }
};
