import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPlayer } from '$lib/db';
import { setPlayer } from '$lib/cookies';

export const POST: RequestHandler = async ({ request, platform, cookies }) => {
  const db = platform?.env.DATABASE;

  if (!db) {
    return json({ error: 'Database not available' }, { status: 500 });
  }

  const { name } = await request.json();
  const id = crypto.randomUUID();

  await createPlayer(db, { id, name });

  const player = { id, name, wins: 0, draws: 0, games: 0 };

  setPlayer(cookies, player);

  return json({ player });
};
