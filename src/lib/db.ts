import type {
  Guess,
  IGameState,
  IGameStatePrepare,
  ILeaderBoard,
  IPlayer,
  Result
} from './types';

export async function getPlayerById(
  db: BindingDatabase,
  id: string
): Promise<IPlayer | null> {
  const rows = await db.query<IPlayer>(
    `SELECT id, name, wins, draws, games FROM players WHERE id = $1::uuid`,
    [id]
  );

  return rows[0] || null;
}

export async function getGame(
  db: BindingDatabase,
  id: string
): Promise<IGameState | undefined> {
  const rows = await db.query<IGameState>(
    `SELECT id, state, hash, player, nonce, computer_guess as "computerGuess", user_guess as "userGuess", result FROM games WHERE id = $1::uuid`,
    [id]
  );

  return rows[0];
}

export async function getActiveGame(
  db: BindingDatabase,
  playerId: string
): Promise<IGameState | undefined> {
  const rows = await db.query<IGameState>(
    `SELECT id, state, hash, player FROM games WHERE player = $1::uuid AND state = 'prepare' ORDER BY id DESC LIMIT 1`,
    [playerId]
  );

  return rows[0];
}

export async function createGame(
  db: BindingDatabase,
  game: {
    hash: string;
    player: string;
    nonce: string;
    computerGuess: Guess;
  }
): Promise<IGameStatePrepare | null> {
  const games = await db.query<IGameStatePrepare>(
    `INSERT INTO games (hash, player, nonce, computer_guess) 
      VALUES ($1, $2::uuid, $3, $4)
      RETURNING id, state, hash, player`,
    [game.hash, game.player, game.nonce, game.computerGuess]
  );

  return games?.[0] || null;
}

export async function settleGame(
  db: BindingDatabase,
  id: string,
  userGuess: Guess,
  result: Result
): Promise<void> {
  await db.query(
    `UPDATE games SET state = 'settle', user_guess = $1, result = $2 WHERE id = $3::uuid`,
    [userGuess, result, id]
  );
}

export async function createPlayer(
  db: BindingDatabase,
  name: string
): Promise<IPlayer | null> {
  const rows = await db.query<IPlayer>(
    `INSERT INTO players (name) VALUES ($1) RETURNING id, name, wins, draws, games`,
    [name]
  );

  return rows[0] || null;
}

export async function updatePlayerScore(
  db: BindingDatabase,
  id: string,
  win: boolean,
  draw: boolean
): Promise<void> {
  await db.query(
    `UPDATE players SET games = games + 1, wins = wins + $1::int, draws = draws + $2::int WHERE id = $3::uuid`,
    [win ? 1 : 0, draw ? 1 : 0, id]
  );
}

export async function getLeaderboard(
  db: BindingDatabase
): Promise<ILeaderBoard> {
  return await db.query<ILeaderBoard[number]>(
    `SELECT name, wins, draws, games FROM players WHERE games > 0 ORDER BY wins::float / games DESC LIMIT 10`
  );
}
