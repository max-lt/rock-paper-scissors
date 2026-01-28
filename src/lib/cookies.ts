import type { Cookies } from '@sveltejs/kit';
import type { IPlayer } from './types';

const PLAYER_COOKIE = 'player';

export function getPlayer(cookies: Cookies): IPlayer | null {
  const raw = cookies.get(PLAYER_COOKIE);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setPlayer(cookies: Cookies, player: IPlayer): void {
  cookies.set(PLAYER_COOKIE, JSON.stringify(player), {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}
