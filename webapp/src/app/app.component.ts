import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Guess, IGameState, IGameStatePrepare, IGameStateSettle } from '~/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public game: IGameState | null = null;

  constructor(private http: HttpClient) {
    this.prepareGame();
  }

  /**
   * Prepare a game - this is called when the page loads and when the user clicks on the "Play Again" button
   */
  async prepareGame() {
    this.game = await firstValueFrom(this.http.get<IGameStatePrepare>('/api/game/prepare'));
  }

  /**
   * Play a game - this is called when the user clicks on a button
   *
   * @param userGuess the user's guess (rock, paper, scissors)
   */
  async play(userGuess: Guess) {
    // Sanity check, at this stage we should have a game in prepare state
    if (!this.game || this.game.state !== 'prepare') {
      return;
    }

    const computerGuess = this.game.computerGuess;

    this.game = await firstValueFrom(
      this.http.post<IGameStateSettle>('/api/game/settle', { userGuess, computerGuess })
    );
  }
}
