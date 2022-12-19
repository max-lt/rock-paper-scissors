import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Player } from '~/interfaces';

function tryParse<T>(value: string): T | null {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private player: Player | null;

  constructor(private http: HttpClient) {
    const player = localStorage.getItem('player') ?? null;
    this.player = player ? tryParse(player) : null;
  }

  public getPlayer() {
    return this.player;
  }

  public async registerPlayer(name: string) {
    const { player } = await firstValueFrom(this.http.post<{ player: Player }>('/api/player/register', { name }));

    this.player = player;

    localStorage.setItem('player', JSON.stringify(player));

    return player;
  }
}
