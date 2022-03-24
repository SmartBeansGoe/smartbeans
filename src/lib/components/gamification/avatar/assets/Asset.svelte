<script lang="ts" context="module">
  export const loadAsset = async (assetId: string) => {
    const res = await fetch(`${config.staticAssetPath}/${assetId}.svg`, {
      headers: { 'Cache-Control': 'public' }
    });
    if (res.ok) {
      return await res.text();
    }
    return '';
  };
</script>

<script lang="ts">
  import config from '$config';

  export let id: string;
</script>

{#if id}
  {#await loadAsset(id) then svg}
    <svg version="1.1" viewBox="0 0 77.707 108.77">
      {@html svg}
    </svg>
  {/await}
{/if}
