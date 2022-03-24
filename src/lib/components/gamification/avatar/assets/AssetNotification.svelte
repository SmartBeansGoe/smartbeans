<script lang="ts">
  import Asset from './Asset.svelte';

  export let id: string;
  export let text: string;
</script>

<div>
  {text}
  <div class="w-3/12">
    <Asset {id} />
  </div>
</div>
