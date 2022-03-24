<script>
  // Not refactored and no typescript
  import { createEventDispatcher } from 'svelte';

  export let id;
  export let positionTop;
  export let positionLeft;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  {id}
  class="absolute m-1 w-80 z-index-1 shadow-md hover:shadow-lg transition-shadow duration-100"
  style="top: {8 * positionTop}rem;left: {26 * positionLeft}rem;"
  on:mouseover={() => dispatch('mouseover')}
  on:mouseout={() => dispatch('mouseout')}
>
  <slot />
</div>
