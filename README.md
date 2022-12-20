# Code assignment: Rock Paper Scissors

Application deployed here [rock-paper-scissors-worker-production.devcat.workers.dev](https://rock-paper-scissors-worker-production.devcat.workers.dev/) 

## Development setup

### Install dependencies
Worker
```bash
cd worker 
npm i
```

Webapp
```bash
cd webapp 
npm i
```

### Set your Cloudflare account ID in /worker/wrangler.toml (uncommitted)
```toml
account_id = "..."
```

### Run project
Worker
```bash
npm start
```

Webapp
```bash
npm start
```

## Deploy in production
```
cd webapp
npm run build

cd worker
npm run deploy
```
