import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { IGameStatePrepare, IGameStateSettle, ILeaderBoard } from '~/interfaces';
import { PlayerService } from './player.service';

interface IResponse<T = IGameStatePrepare | IGameStateSettle> {
  game: T;
  board: ILeaderBoard;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient, private playerService: PlayerService) {}

  public prepareGame() {
    const player = this.playerService.getPlayer();
    if (!player) {
      throw new Error('Player is not registered');
    }

    return firstValueFrom(this.http.post<IResponse<IGameStatePrepare>>('/api/game/prepare', { playerId: player.id }));
  }

  public settleGame(id: string, userGuess: string) {
    return firstValueFrom(this.http.post<IResponse<IGameStateSettle>>('/api/game/settle', { id, userGuess }));
  }

  public getBoard() {
    return firstValueFrom(this.http.get<IResponse<never>>('/api/game/board'));
  }
}
