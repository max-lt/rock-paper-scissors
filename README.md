# Rock Paper Scissors

Proof of concept of a provably fair rock paper scissors game.

The computer provides his guess first, but the user discovers the computer guess only after his own guess has been submitted. To verify fairness: compute `sha1(nonce + computerGuess)` and compare it to the hash provided before your guess.

**Live demo:** [rock-paper-scissors.workers.rocks](https://rock-paper-scissors.workers.rocks/)

## Tech Stack

- **Framework:** SvelteKit 2
- **Styling:** Tailwind CSS
- **Runtime:** OpenWorkers
- **Database:** PostgreSQL

## Development

### Install dependencies

```bash
bun install
```

### Database setup

```bash
psql -f database-init.sql
```

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
