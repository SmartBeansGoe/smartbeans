<script lang="ts">
  import Asset from './Asset.svelte';
  import Body from './Body.svelte';

  export let pantsId: string;
  export let hatId: string;
  export let shirtId: string;
  export let skin: string;
  export let alpha: number = 1.0;
</script>

<Body color={skin} {alpha}>
  <slot />
  <Asset slot="pants" id={pantsId} />
  <Asset slot="shirt" id={shirtId} />
  <Asset slot="hat" id={hatId} />
</Body>
