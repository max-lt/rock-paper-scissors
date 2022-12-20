import { Component } from '@angular/core';

import { Guess, IGameState, ILeaderBoard, IPlayer } from '~/interfaces';
import { GameService } from './game.service';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public player: IPlayer | null;
  public playerName = '';

  public game: IGameState | null = null;
  public board?: ILeaderBoard;

  constructor(private gameService: GameService, private playerService: PlayerService) {
    this.player = playerService.getPlayer();
    if (this.player) {
      this.prepareGame();
    } else {
      this.getBoard();
    }
  }

  async getBoard() {
    const { board } = await this.gameService.getBoard();
    this.board = board;
  }

  async registerPlayer() {
    this.player = await this.playerService.registerPlayer(this.playerName);
    this.prepareGame();
  }

  /**
   * Prepare a game - this is called when the page loads and when the user clicks on the "Play Again" button
   */
  async prepareGame() {
    const { game, board } = await this.gameService.prepareGame();
    this.game = game;
    this.board = board;
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

    const { game, board } = await this.gameService.settleGame(id, userGuess);
    this.game = game;
    this.board = board;
  }
}
