import type { Cookies } from '@sveltejs/kit';
import type { IPlayer } from './types';
import { getPlayerById } from './db';

const PLAYER_COOKIE = 'player';

function getPlayerFromCookie(cookies: Cookies): IPlayer | null {
  const raw = cookies.get(PLAYER_COOKIE);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getPlayer(
  cookies: Cookies,
  db: BindingDatabase
): Promise<IPlayer | null> {
  const cookiePlayer = getPlayerFromCookie(cookies);

  if (!cookiePlayer) return null;

  const player = await getPlayerById(db, cookiePlayer.id);

  if (!player) {
    clearPlayer(cookies);
    return null;
  }

  return player;
}

export function setPlayer(cookies: Cookies, player: IPlayer): void {
  cookies.set(PLAYER_COOKIE, JSON.stringify(player), {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}

export function clearPlayer(cookies: Cookies): void {
  cookies.delete(PLAYER_COOKIE, { path: '/' });
}
