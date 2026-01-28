import type { Guess, Result } from './types';

export async function sha1(data: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-1',
    new TextEncoder().encode(data)
  );

  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getWinner(player: Guess, computer: Guess): Result {
  if (player === computer) return 'draw';

  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }

  return 'lose';
}

export function guessName(guess: Guess): string {
  switch (guess) {
    case 'rock':
      return 'Rock 👊';
    case 'paper':
      return 'Paper ✋';
    case 'scissors':
      return 'Scissors ✌';
  }
}
