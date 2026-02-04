import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { version } from '$app/environment';

export const GET: RequestHandler = async ({}) => {
  return json({
    version,
    timestamp: Date.now()
  });
};
