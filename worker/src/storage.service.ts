import { Guess, IGameState, Player } from "~/interfaces";

export const players = new Map<string, Player>();

export const games = new Map<string, IGameState & { nonce: string; computerGuess: Guess }>();
