export type Guess = 'rock' | 'paper' | 'scissors';
export type State = 'prepare' | 'settle';
export type Result = 'win' | 'lose' | 'draw';

export interface IGameStatePrepare {
  state: 'prepare';
  computerGuess: Guess;
}

export interface IGameStateSettle {
  state: 'settle';
  result: Result;
  computerGuess: Guess;
  userGuess: Guess;
}

export type IGameState = IGameStatePrepare | IGameStateSettle;
