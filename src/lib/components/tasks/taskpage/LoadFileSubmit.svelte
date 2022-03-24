<script lang="ts">
  import Icon from '@iconify/svelte';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let submitting: boolean;

  let filename: string = '';
  let uploadedCode: string;

  const uploadFile = (event: Event) => {
    let file = event.target['files'][0];
    filename = file.name;
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      uploadedCode = reader.result.toString();
    };
  };

  const onSubmit = () => {
    if (uploadedCode) dispatch('submit', { code: uploadedCode });
    uploadedCode = null;
    filename = '';
  };
</script>

<div class="flex justify-between">
  <div class="form-control">
    <label class="input-group">
      <label for="file" class="btn btn-info no-animation">Datei öffnen</label>
      <label class="flex px-2 items-center w-48 border-info border-4 rounded-r-lg" for="file"
        >{filename}</label
      >
      <input id="file" name="file" type="file" on:change={uploadFile} class="hidden" />
    </label>
  </div>
  {#if submitting}
    <button disabled={!uploadedCode} class="btn btn-success loading gap-2" on:click={onSubmit}>
      Abgeben
    </button>
  {:else}
    <button disabled={!uploadedCode} class="btn btn-success gap-2" on:click={onSubmit}>
      <Icon icon="mdi:upload" width={24} height={24} />
      Abgeben
    </button>
  {/if}
</div>
