import { connect } from '@planetscale/database';

// Production config
const config = {
  host: '...',
  username: '...',
  password: '...'
};

import { Guess, IGameState, IPlayer } from '~/interfaces';

type InternalGameState = IGameState & { nonce: string; computerGuess: Guess };

const conn = connect(config);

type PartialWithId<T> = Partial<T> & { id: string };

export const storageService = {
  setGame: (game: InternalGameState) => {
    return conn.execute(
      'INSERT INTO games (id, player, state, hash, nonce, computerGuess) VALUES (:id, :player, :state, :hash, :nonce, :computerGuess)',
      game
    );
  },
  updateGame: (game: PartialWithId<InternalGameState>) => {
    return conn.execute(
      'UPDATE games SET state = :state, userGuess = :userGuess, result = :result WHERE id = :id',
      game
    );
  },
  getGame: (gameId: string) => {
    return conn
      .execute('SELECT * FROM games WHERE id = :gameId', { gameId })
      .then(({ rows }) => rows[0] as InternalGameState);
  },
  setPlayer: (player: IPlayer) => {
    return conn.execute(
      'INSERT INTO players (id, name, wins, draws, games) VALUES (:id, :name, :wins, :draws, :games)',
      player
    );
  },
  updatePlayer: (player: PartialWithId<IPlayer>) => {
    return conn.execute('UPDATE players SET wins = :wins, draws = :draws, games = :games WHERE id = :id', player);
  },
  getPlayer: (playerId: string) => {
    return conn
      .execute('SELECT * FROM players WHERE id = :playerId', { playerId })
      .then(({ rows }) => rows[0] as IPlayer);
  },
  getPlayers(): Promise<IPlayer[]> {
    return conn.execute('SELECT * FROM players WHERE games > 0').then(({ rows }) => rows as IPlayer[]);
  }
};
