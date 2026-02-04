import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  if (dev && !event.platform) {
    const { DevDatabase } = await import('$lib/database-dev');
    event.platform = {
      env: {
        DATABASE: new DevDatabase()
      }
    };
  }

  return resolve(event);
};
