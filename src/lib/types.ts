export type Guess = 'rock' | 'paper' | 'scissors';
export type State = 'prepare' | 'settle';
export type Result = 'win' | 'lose' | 'draw';

interface ICommonGameProperties {
  id: string;
  player: string;
  state: State;
  hash: string; // Computer hashed guess, sha1(nonce + guess)
}

export interface IGameStatePrepare extends ICommonGameProperties {
  state: 'prepare';
}

export interface IGameStateSettle extends ICommonGameProperties {
  state: 'settle';
  userGuess: Guess;
  computerGuess: Guess;
  nonce: string;
  result: Result;
}

export type IGameState = IGameStatePrepare | IGameStateSettle;

export interface IPlayer {
  id: string;
  name: string;
  wins: number;
  draws: number;
  games: number;
}

export type ILeaderBoard = Omit<IPlayer, 'id'>[];
