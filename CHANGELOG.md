## Initial commit: 
 - copy instructions `curl https://raw.githubusercontent.com/sweepbright/assignment-rock-paper-scissors/main/README.md > INSTRUCTIONS.md`

## Generate web application:

We will use angular for this application.

```bash
ng new app --minimal --skip-tests --strict --style=scss --directory webapp
```

## Generate serverless handler

As the backend part seems simple enough (3 endpoints at most *), and as we don't want to pay for any of this,
we will use Cloudflare Workers to serve our API for free (if this game gains in popularity, CF Workers allows us to scale painlessly).

> \* as I imagine the application from now, there will be 2 endpoints for the game itself (prepareGame & settleGame) as we want our game to be provably fair and one endpoints to publish the leaderboard. Maybe some more for user identification (optionally, as this is not this project goal)

We will later use the same worker to serve the web application.

```bash
npm i -g wrangler
mkdir worker
cd worker
wrangler init --yes
```

## Set Angular proxy conf

We add `webapp/proxy.conf.json` to link `/api/*` calls to our worker.

Worker now has an `api` router that provides `/api/random` endpoint that returns a random number (to test that our proxy works).

## Can play a game vs computer

We now can play a game vs computer, but there is two problems at this stage :
  - an advanced user can cheat by looking into the developers tools network tab (because computer sends his guess first)
  - the average user cannot verify that the computer did not cheat

## Provably fair game

We now have a provably fair game, but there is still a bit of work to do on UI so the user can understands what happens.

## Add some style to webapp

Added tailwind lib to webapp

## Add leaderboard

## Add persistance with KV.

## Serve static content with worker

## Use planetscale for persistance

We noticed consistency issues with Cloudflare KVs so we now use planetscale database, we no longer need KV bindings
