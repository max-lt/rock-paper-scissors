import { Component, Input, OnChanges } from '@angular/core';
import { IGameState } from '~/interfaces';

type VerificationState = 'prepare' | 'verifying' | 'verified' | 'failed';

@Component({
  selector: 'game-fairness',
  templateUrl: './game-fairness.component.html'
})
export class GameFairnessComponent implements OnChanges {
  @Input()
  game!: IGameState;

  verified: VerificationState = 'prepare';

  public async verify() {
    if (this.game.state !== 'settle') {
      this.verified = 'prepare';
      return;
    }

    this.verified = 'verifying';

    const hash = await this.checksum(`${this.game.nonce}${this.game.computerGuess}`);

    this.verified = hash === this.game.hash ? 'verified' : 'failed';
  }

  ngOnChanges() {
    this.verify();
  }

  private async checksum(str: string) {
    const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));

    // Turn digest into a hex string
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
