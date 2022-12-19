import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { IGameStatePrepare, IGameStateSettle } from '~/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) {}

  public prepareGame() {
    return firstValueFrom(this.http.get<IGameStatePrepare>('/api/game/prepare'));
  }

  public settleGame(id: string, userGuess: string) {
    return firstValueFrom(this.http.post<IGameStateSettle>('/api/game/settle', { id, userGuess }));
  }
}
