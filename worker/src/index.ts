/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from 'itty-router';

import { Guess, IGameState, IGameStateSettle } from '~/interfaces';

const router = Router(); // Main router
const api = Router({ base: '/api' }); // API router

// CORS headers
const headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
headers.append('Access-Control-Allow-Methods', 'GET, POST');
headers.append('Access-Control-Allow-Headers', 'DNT,User-Agent,Content-Type,Range');
headers.append('Access-Control-Expose-Headers', 'Content-Length,Content-Range');

// Not Found response
export class NotFound extends Response {
  constructor(message = 'Not Found') {
    super(message, { status: 404 });
  }
}

// JSON response
export class JSONResponse<T> extends Response {
  constructor(body: object, options: ResponseInit & { headers?: Headers } = {}) {
    if (!options.headers) {
      options.headers = new Headers();
    }

    options.headers.append('Content-Type', 'application/json');

    super(JSON.stringify(body), options);
  }
}

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

// Todo: persist games in KV
const games = new Map<string, IGameState & { nonce: string; computerGuess: Guess }>();

api.get('/game/prepare', async () => {
  const guess = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as Guess;

  const id = crypto.randomUUID();
  const nonce = crypto.randomUUID().slice(0, 8);

  // Perform hash of nonce + guess
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(nonce + guess));

  // Turn digest into a hex string
  const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');

  const game: IGameState = { id, state: 'prepare', hash };

  // Store game with nonce
  games.set(id, { ...game, nonce, computerGuess: guess });

  return new JSONResponse(game, { headers });
});

api.post('/game/settle', async (request: Request) => {
  const { id, userGuess } = await request.json<Pick<IGameStateSettle, 'id' | 'userGuess'>>();

  const game = games.get(id);
  if (!game) {
    return new NotFound();
  }

  const { computerGuess } = game;

  const result = (() => {
    if (userGuess === computerGuess) {
      return 'draw';
    }

    if (userGuess === 'rock' && computerGuess === 'scissors') {
      return 'win';
    }

    if (userGuess === 'paper' && computerGuess === 'rock') {
      return 'win';
    }

    if (userGuess === 'scissors' && computerGuess === 'paper') {
      return 'win';
    }

    return 'lose';
  })();

  // Assign result to game
  const settled: IGameState = { ...game, state: 'settle', userGuess, result };

  // Update game
  games.set(id, settled);

  return new JSONResponse(settled, { headers });
});

// Bind API routes to main router, defaults to 404
router.all('/api/*', api.handle).all('*', () => new NotFound());

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, ctx);
  }
};
