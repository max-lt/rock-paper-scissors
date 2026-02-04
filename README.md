# Rock Paper Scissors

Provably fair rock paper scissors game with leaderboard and player authentication.

Originally a [technical assignment](./INSTRUCTIONS.md), now serving as a demo for [@openworkers/adapter-sveltekit](https://github.com/openworkers/adapter-sveltekit) with per-endpoint workers.

**Live demo:** [rock-paper-scissors.workers.rocks](https://rock-paper-scissors.workers.rocks/)

## Features

- **Provably fair**: Computer commits to its move before you play (SHA-1 hash verification)
- **Leaderboard**: Track wins across all players
- **Secure authentication**: Cookie-based player sessions with database verification
- **Per-endpoint workers**: Each API route compiled into its own optimized worker

## Development

### Install dependencies

```bash
bun install
```

### Database setup

Execute `schema.sql` in the OpenWorkers dashboard SQL console to create the required tables.

### Run dev server

```bash
bun run dev
```

## Building

```bash
bun run build
```

## Type checking

```bash
bun run check
```
