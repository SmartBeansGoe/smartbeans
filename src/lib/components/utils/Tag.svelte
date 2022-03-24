<script lang="ts">
  import type { Tag } from '$lib/utils/types/tag';

  export let tag: Tag;
  export let showPoints: boolean = false;
</script>

<span class="tooltip-info" class:tooltip={tag.points !== undefined} data-tip="{tag.points} Punkte">
  <button class="btn btn-xs rounded-full btn-info" on:click>
    {tag.name}{#if showPoints}{tag.points ? `: ${tag.points}` : ''}{/if}
  </button>
</span>
