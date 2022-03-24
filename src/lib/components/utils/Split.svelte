<script lang="ts" context="module">
  export type Direction = 'vertical' | 'horizontal';
</script>

<script lang="ts">
  import Split from 'split.js';
  import { onMount } from 'svelte';

  export let direction: Direction = 'horizontal';

  let splitLeft: HTMLElement;
  let splitRight: HTMLElement;
  onMount(() => {
    Split([splitLeft, splitRight], {
      direction: direction,
      minSize: 0,
      snapOffset: 10
    });
  });
</script>

<div
  class:split-horizontal={direction === 'horizontal'}
  class:split-vertical={direction === 'vertical'}
  class="h-full w-full"
>
  <div class:max-h-full={direction === 'horizontal'} class="overflow-auto" bind:this={splitLeft}>
    <slot name="left" />
  </div>
  <div class:max-h-full={direction === 'horizontal'} class="overflow-auto" bind:this={splitRight}>
    <slot name="right" />
  </div>
</div>

<style>
  .split-horizontal {
    display: flex;
    flex-direction: row;
  }
  .split-vertical {
    display: flex;
    flex-direction: column;
  }
</style>
