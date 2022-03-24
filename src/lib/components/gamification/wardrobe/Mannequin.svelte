<script lang="ts">
  import type { Asset } from '$lib/utils/types/assets';
  import Body from '$lib/components/gamification/avatar/assets/Body.svelte';
  import { loadAsset } from '../avatar/assets/Asset.svelte';

  export let asset: Asset;
  export let selected: boolean;

  $: _class = selected ? 'selected' : 'unselected';
</script>

<button disabled={!asset.unlocked} class={_class} on:click>
  {#await loadAsset(asset.id)}
    <Body color="#999" alpha={0.3} />
  {:then svg}
    <div class="content-center w-full h-full">
      <Body color="#999" alpha={0.3}>
        <svg version="1.1" viewBox="0 0 77.707 108.77">
          {@html svg}
        </svg>
      </Body>
    </div>
  {:catch error}
    Fehler beim Laden!
  {/await}
</button>

<style lang="postcss">
  button {
    @apply rounded-md m-0.5 h-40 w-28 align-middle;
    @apply disabled:cursor-not-allowed;
    @apply disabled:bg-base-300 cursor-pointer border-base-300 hover:transition duration-200 ease-in-out focus:outline-none;
  }

  button:disabled {
    @apply opacity-50 grayscale;
  }

  .selected {
    @apply bg-opacity-0 shadow-md hover:shadow-lg border-2 p-0;
  }

  .unselected {
    @apply bg-base-200 shadow-sm hover:shadow-md border-2 p-2;
  }
</style>
