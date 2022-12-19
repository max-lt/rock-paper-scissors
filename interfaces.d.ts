export type Guess = 'rock' | 'paper' | 'scissors';
export type State = 'prepare' | 'settle';
export type Result = 'win' | 'lose' | 'draw';

interface ICommonGameProperties {
  id: string;
  player: string;
  state: State;
  hash: string; // Computer hashed guess, sha256(nonce + guess)
}

export interface IGameStatePrepare extends ICommonGameProperties {
  state: 'prepare';
}

export interface IGameStateSettle extends ICommonGameProperties {
  state: 'settle';
  userGuess: Guess;

  /**
   * The computer's guess
   */
  computerGuess: Guess;

  /**
   * The nonce used to generate the hash
   * to verify the computer's guess: sha256(nonce + guess) = hash
   */
  nonce: string;

  result: Result;
}

export type IGameState = IGameStatePrepare | IGameStateSettle;

export interface Player {
  id: string;
  name: string;
  wins: number;
  games: number;
} 

export type LeaderBoard = Omit<Player, 'id'>[];
