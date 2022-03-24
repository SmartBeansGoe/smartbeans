<script lang="ts" context="module">
  export const load: Load = async ({ fetch }) => {
    const requestAssets = await fetch('/api/user/assets');
    const assets = await requestAssets.json();
    return { props: { assets: assets } };
  };
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import Wardrobe from '$lib/components/gamification/wardrobe/Wardrobe.svelte';
  import Card from '$lib/components/utils/Card.svelte';
  import type { Asset } from '$lib/utils/types/assets';
  import type { Load } from '@sveltejs/kit';

  export let assets: Asset[];
</script>

<Card class="h-full" classCardBody="overflow-y-auto" title="Kleiderschrank">
  <Wardrobe {assets} avatar={$session.user.avatar} />
</Card>
