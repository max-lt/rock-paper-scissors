import { Component } from '@angular/core';

import { Guess, IGameState } from '~/interfaces';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public game: IGameState | null = null;

  constructor(private gameService: GameService) {
    this.prepareGame();
  }

  /**
   * Prepare a game - this is called when the page loads and when the user clicks on the "Play Again" button
   */
  async prepareGame() {
    this.game = await this.gameService.prepareGame();
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

    const id = this.game.id;

    this.game = await this.gameService.settleGame(id, userGuess);
  }

  async verifyGame() {
    
  }
}
