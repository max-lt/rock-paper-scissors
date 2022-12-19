import { Pipe, PipeTransform } from '@angular/core';
import { Guess } from '~/interfaces';

@Pipe({ name: 'guessName' })
export class GuessNamePipe implements PipeTransform {
  transform(value: Guess): unknown {
    switch (value) {
      case 'rock':
        return 'Rock 👊';
      case 'paper':
        return 'Paper ✋';
      case 'scissors':
        return 'Scissors ✌';
    }
  }
}
