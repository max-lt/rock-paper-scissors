# Code assignment: Rock Paper Scissors

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

### Create KV for production and dev

```bash
wrangler kv:namespace create "rock_paper_scissors"
wrangler kv:namespace create --preview "rock_paper_scissors"
```

```toml
#  worker/wrangler.toml 
kv_namespaces = [
  { binding = "rock_paper_scissors", id = "...", preview_id = "..." }
]
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
