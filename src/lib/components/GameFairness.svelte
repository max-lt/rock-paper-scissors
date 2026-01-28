<script lang="ts">
  import type { IGameState } from '$lib/types';
  import { sha1 } from '$lib/game';

  type VerificationState = 'prepare' | 'verifying' | 'verified' | 'failed';

  let { game }: { game: IGameState } = $props();

  let verified: VerificationState = $state('prepare');

  async function verify() {
    if (game.state !== 'settle') {
      verified = 'prepare';
      return;
    }

    verified = 'verifying';

    const hash = await sha1(`${game.nonce}${game.computerGuess}`);

    verified = hash === game.hash ? 'verified' : 'failed';
  }

  $effect(() => {
    verify();
  });
</script>

{#if game}
  <div>
    Computer result hash: <code>{game.hash}</code>

    {#if game.state === 'settle'}
      <div>
        Is computer result hash equals to <code
          >{game.computerGuess} + {game.nonce}</code
        >
        ?

        <div class="mt-12">
          <code
            class="text-center text-3xl"
            class:bg-lime-100={verified === 'verified'}
            class:bg-white={verified !== 'verified'}
          >
            {#if verified === 'verifying'}
              Verifying computer result hash...
            {:else if verified === 'verified'}
              Computer result hash is valid ❎
            {:else if verified === 'failed'}
              Computer result hash is invalid ❌
            {/if}
          </code>
        </div>
      </div>
    {/if}
  </div>
{/if}
