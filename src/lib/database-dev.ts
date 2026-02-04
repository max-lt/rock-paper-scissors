/// <reference types="bun-types" />

import { Database } from 'bun:sqlite';
import type { SQLQueryBindings } from 'bun:sqlite';

// In-memory SQLite database for development
// No DEFAULT UUID generation in SQLite, so we inject them in the query method
const db = new Database('/tmp/rock-paper-scissors-database.sqlite');

db.run(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    wins INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    games INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    state TEXT DEFAULT 'prepare',
    hash TEXT NOT NULL,
    player TEXT NOT NULL,
    nonce TEXT NOT NULL,
    computer_guess TEXT NOT NULL,
    user_guess TEXT,
    result TEXT,
    FOREIGN KEY (player) REFERENCES players(id)
  );
`);

export class DevDatabase implements BindingDatabase {
  async query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
    let sqliteSql = sql
      .replace(/\$\d+::(uuid|int|float)/g, '?')
      .replace(/\$\d+/g, '?')
      .replace(/(\w+)::(uuid|int|float|text)/g, '$1');

    const safeParams = (params || []) as SQLQueryBindings[];

    if (sql.trim().toUpperCase().startsWith('INSERT')) {
      const uuid = crypto.randomUUID();
      const insertMatch = sqliteSql.match(/INSERT INTO (\w+) \((.*?)\)/);

      if (insertMatch) {
        const [, tableName, columns] = insertMatch;
        const columnList = columns.split(',').map((c) => c.trim());

        if (!columnList.includes('id')) {
          sqliteSql = sqliteSql.replace(
            `INSERT INTO ${tableName} (${columns})`,
            `INSERT INTO ${tableName} (id, ${columns})`
          );

          const valuesMatch = sqliteSql.match(/VALUES \((.*?)\)/);
          if (valuesMatch) {
            const placeholders = valuesMatch[1];
            sqliteSql = sqliteSql.replace(
              `VALUES (${placeholders})`,
              `VALUES (?, ${placeholders})`
            );
            safeParams.unshift(uuid);
          }
        }
      }
    }

    const stmt = db.prepare(sqliteSql);

    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...safeParams) as T[];
    }

    stmt.run(...safeParams);

    if (
      sql.trim().toUpperCase().startsWith('INSERT') &&
      sql.includes('RETURNING')
    ) {
      const tableName = sql.match(/INSERT INTO (\w+)/)?.[1];
      if (tableName) {
        const row = db
          .prepare(`SELECT * FROM ${tableName} ORDER BY rowid DESC LIMIT 1`)
          .get();
        return [row] as T[];
      }
    }

    return [] as T[];
  }
}
