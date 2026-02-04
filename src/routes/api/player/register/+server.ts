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
  const player = await createPlayer(db, name);

  if (!player) {
    return json({ error: 'Failed to create player' }, { status: 500 });
  }

  setPlayer(cookies, player.id);

  return json({ player });
};
