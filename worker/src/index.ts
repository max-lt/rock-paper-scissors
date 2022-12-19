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

import { Guess } from '~/interfaces';
import { boardService } from './board.service';
import { gameService } from './game.service';
import { playerService } from './player.service';

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

export interface Env { rock_paper_scissors: KVNamespace; }

// Register player
api.post('/player/register', async (request: Request, env: Env) => {
  const kv = env.rock_paper_scissors;
  const { name } = await request.json<{ name: string }>();
  const player = await playerService.registerPlayer(kv, name);
  return new JSONResponse({ player }, { headers });
});

// Get board only
api.get('/game/board', async (request: Request, env: Env) => {
  const kv = env.rock_paper_scissors;
  const board = await boardService.getLeaderBoard(kv);
  return new JSONResponse({ board }, { headers });
});

// Get new game and board
api.post('/game/prepare', async (request: Request, env: Env) => {
  const kv = env.rock_paper_scissors;
  const { playerId } = await request.json<{ playerId: string }>();

  const game = await gameService.prepareGame(kv, playerId);
  const board = await boardService.getLeaderBoard(kv);
  
  return new JSONResponse({ game, board }, { headers });
});

// Settle game and refreshed board
api.post('/game/settle', async (request: Request, env: Env) => {
  const kv = env.rock_paper_scissors;
  const { id, userGuess } = await request.json<{ id: string, userGuess: Guess }>();

  const game = await gameService.settleGame(kv, id, userGuess);
  if (!game) {
    return new NotFound();
  }

  const board = await boardService.getLeaderBoard(kv);

  return new JSONResponse({ game, board }, { headers });
});

// Bind API routes to main router, defaults to 404
router.all('/api/*', api.handle).all('*', () => new NotFound());

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, ctx);
  }
};
