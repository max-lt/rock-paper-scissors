import type { Cookies } from '@sveltejs/kit';
import type { IPlayer } from './types';
import { getPlayerById } from './db';

const PLAYER_COOKIE = 'player';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPlayer(
  cookies: Cookies,
  db: BindingDatabase
): Promise<IPlayer | null> {
  const playerId = cookies.get(PLAYER_COOKIE);

  if (!playerId) return null;

  // Validate UUID format
  if (!UUID_REGEX.test(playerId)) {
    clearPlayer(cookies);
    return null;
  }

  const player = await getPlayerById(db, playerId);

  if (!player) {
    clearPlayer(cookies);
    return null;
  }

  return player;
}

export function setPlayer(cookies: Cookies, playerId: string): void {
  // Use SvelteKit defaults: sameSite: 'lax', secure: auto
  cookies.set(PLAYER_COOKIE, playerId, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}

export function clearPlayer(cookies: Cookies): void {
  cookies.delete(PLAYER_COOKIE, { path: '/' });
}
