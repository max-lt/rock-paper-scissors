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

