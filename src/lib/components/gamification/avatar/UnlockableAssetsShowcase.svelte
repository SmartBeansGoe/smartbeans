<script lang="ts">
  import Card from '$lib/components/utils/Card.svelte';
  import type { Asset } from '$lib/utils/types/assets';
  import { onMount } from 'svelte';
  import Outfit from './assets/Outfit.svelte';

  export let course: string;
  export let taskid: string;

  let assets: Asset[];
  let outfits;

  onMount(async () => {
    assets = await (await fetch(`/api/courses/${course}/tasks/${taskid}/assets`)).json();
    outfits = assets.reduce((prev, curr) => {
      if (prev[curr.outfitId] === undefined) {
        prev[curr.outfitId] = {};
      }
      if (prev[curr.outfitId][curr.type] === undefined) {
        prev[curr.outfitId][curr.type] = curr.id;
      }
      return prev;
    }, {});
  });
</script>

{#if assets && assets.length > 0 && outfits}
  <Card
    title="Neue Outfits"
    description="Bei erfolgreicher Abgabe, {Object.keys(outfits).length > 1
      ? 'werden diese Outfits'
      : 'wird dieses Outfit'} freigeschaltet:"
  >
    <div class="flex">
      {#each Object.keys(outfits) as outfitId}
        <div class="w-1/3">
          <Outfit
            skin="#ccc"
            alpha={0.5}
            hatId={outfits[outfitId].hat}
            pantsId={outfits[outfitId].pants}
            shirtId={outfits[outfitId].shirt}
          />
        </div>
      {/each}
    </div>
  </Card>
{/if}
