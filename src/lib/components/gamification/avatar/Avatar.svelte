<script lang="ts">
  import type { Avatar } from '$lib/utils/types/avatar';

  import Asset from './assets/Asset.svelte';
  import Body from './assets/Body.svelte';
  import Face from './assets/Face.svelte';
  export let avatar: Avatar;
  let bodyColor = avatar.skin ? avatar.skin : '#558844';
</script>

{#if avatar}
  <Body color={bodyColor}>
    <Face slot="face" />
    <Asset slot="pants" id={avatar.pants} />
    <Asset slot="shirt" id={avatar.shirt} />
    <Asset slot="hat" id={avatar.hat} />
  </Body>
{/if}
