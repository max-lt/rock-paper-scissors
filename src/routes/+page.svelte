<script lang="ts">
  import { onMount } from 'svelte';
  import type { Guess, IGameState, ILeaderBoard, IPlayer } from '$lib/types';
  import { guessName } from '$lib/game';
  import GameFairness from '$lib/components/GameFairness.svelte';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  // svelte-ignore state_referenced_locally
  let player: IPlayer | null = $state(data.player);
  let playerName = $state('');
  // svelte-ignore state_referenced_locally
  let game: IGameState | null = $state(data.game);
  // svelte-ignore state_referenced_locally
  let board: ILeaderBoard = $state(data.board);

  onMount(() => {
    if (player && !game) {
      prepareGame();
    }
  });

  async function registerPlayer() {
    const res = await fetch('/api/player/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName })
    });
    const data: { player: IPlayer } = await res.json();
    player = data.player;
    prepareGame();
  }

  async function prepareGame() {
    if (!player) return;

    const res = await fetch('/api/game/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: player.id })
    });
    const data: { game: IGameState; board: ILeaderBoard } = await res.json();
    game = data.game;
    board = data.board;
  }

  async function play(userGuess: Guess) {
    if (!game || game.state !== 'prepare') return;

    const res = await fetch('/api/game/settle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: game.id, userGuess })
    });
    const data: { game: IGameState; board: ILeaderBoard } = await res.json();
    game = data.game;
    board = data.board;
  }
</script>

<div class="mx-auto flex h-screen align-middle">
  <div class="mx-auto flex flex-col">
    <h1 class="mt-8 rounded-lg bg-orange-100 p-4 text-center uppercase">
      Rock Paper Scissors
    </h1>

    <div class="py-8">
      <p>Proof of concept of a provably fair rock paper scissors game:</p>
      <p class="note">
        the computer provides his guess first, but the user discovers <br />
        the computer guess only after his own guess has been submitted
      </p>
      <p class="note">
        to check if the computer cheated: perform a sha1 hash of the <br />
        computer guess + nonce and compare it to the computer result hash <br />
        that have been provided before the user guess
      </p>
    </div>

    <!-- Register player -->
    {#if !player}
      <div class="flex flex-col">
        <label for="name" class="mb-2">Player name</label>
        <input
          id="name"
          type="text"
          placeholder="Your player name"
          bind:value={playerName}
        />
      </div>
      <button class="btn btn-gray btn-xl mt-4" onclick={registerPlayer}>
        Register
      </button>
    {/if}

    <!-- Game is ready -->
    {#if game}
      <!-- Game fairness -->
      <div class="mt-6 mb-12">
        <GameFairness {game} />
      </div>

      <!-- Buttons for user guess -->
      {#if game.state === 'prepare'}
        <div class="flex flex-col">
          <button class="btn btn-gray btn-xl mt-4" onclick={() => play('rock')}>
            {guessName('rock')}
          </button>
          <button
            class="btn btn-gray btn-xl mt-4"
            onclick={() => play('paper')}
          >
            {guessName('paper')}
          </button>
          <button
            class="btn btn-gray btn-xl mt-4"
            onclick={() => play('scissors')}
          >
            {guessName('scissors')}
          </button>
        </div>
      {/if}

      <!-- Game result -->
      {#if game.state === 'settle'}
        <p class="text-2xl">You chose {guessName(game.userGuess)}</p>
        <p class="text-2xl">Computer chose {guessName(game.computerGuess)}</p>

        <div class="mt-12 text-center text-3xl">
          <strong>
            {#if game.result === 'win'}
              You win!
            {:else if game.result === 'lose'}
              You lose!
            {:else}
              Draw!
            {/if}
          </strong>
        </div>
      {/if}

      {#if !game || game.state === 'settle'}
        <div class="text-center">
          <button class="btn btn-gray btn-xl mt-4" onclick={prepareGame}>
            Play again
          </button>
        </div>
      {/if}
    {/if}

    <!-- Leaderboard -->
    <div class="mt-16 pb-8">
      <table>
        <thead>
          <tr>
            <th class="p-4 text-left">Player</th>
            <th class="p-4 text-right">Wins / Draws / Games</th>
          </tr>
        </thead>

        <tbody>
          {#each board as entry}
            <tr>
              <td>{entry.name}</td>
              <td class="text-right"
                >{entry.wins} / {entry.draws} / {entry.games}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
