<script lang="ts" context="module">
  export const editorValueStore = (taskid: number, taskEditorInput: string) => {
    let initialValue: string;
    if (browser) {
      initialValue = localStorage.getItem(`editorValue-${taskid}`);
    }
    if (initialValue === undefined || initialValue === null) {
      initialValue = taskEditorInput;
    }

    const store = writable<string>(initialValue);
    store.subscribe((value) => {
      if (browser) localStorage.setItem(`editorValue-${taskid}`, value);
    });
    return store;
  };
</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type Monaco from 'monaco-editor';
  import type { CourseTask } from '$lib/utils/types/task';
  import Icon from '@iconify/svelte';
  import { writable } from 'svelte/store';
  import { browser } from '$app/env';
  import { afterNavigate } from '$app/navigation';

  export let task: CourseTask;

  let editor: Monaco.editor.IStandaloneCodeEditor;
  let htmlElement: HTMLElement;
  let monaco: any;

  const dipatch = createEventDispatcher();

  $: editorStore = editorValueStore(task.taskid, task.taskDescription.defaultEditorInput);
  onMount(async () => {
    monaco = await import('monaco-editor');
    editor = monaco.editor.create(htmlElement, {
      language: task.lang,
      automaticLayout: true
    });
    editor.getModel().onDidChangeContent(() => {
      $editorStore = editor.getModel().getValue();
    });
    editor.getModel().setValue($editorStore);
  });

  afterNavigate(() => {
    editor.getModel().setValue($editorStore);
  });

  export let submitting = false;
  const onSubmit = () => {
    dipatch('submit', { editorValue: $editorStore });
  };

  const onDownload = () => {
    let element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent($editorStore)
    );
    element.setAttribute('download', `${task.taskid}.${task.lang}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  let fileInputComponent: HTMLElement;
  const onUpload = async (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let uploadedCode = reader.result.toString();
      editor.getModel().setValue(uploadedCode);
    };
  };
</script>

<div class="h-full">
  <div class="editor-height">
    <div class="h-full" bind:this={htmlElement} />
  </div>
  <div class="grid mx-4 content-center btn-group-height">
    <div class="flex justify-between overflow-y-auto">
      <div class="flex gap-2">
        <button class="btn btn-info btn-outline gap-2" on:click={onDownload}>
          <Icon icon="mdi:file-download" width={24} height={24} />
          Download
        </button>
        <button class="btn btn-info btn-outline gap-2" on:click={() => fileInputComponent.click()}>
          <Icon icon="mdi:file-upload" width={24} height={24} />
          Upload
        </button>
      </div>
      {#if submitting}
        <button class="btn btn-success loading gap-2" on:click={onSubmit}> Abgeben </button>
      {:else}
        <button class="btn btn-success gap-2" on:click={onSubmit}>
          <Icon icon="mdi:upload" width={24} height={24} />
          Abgeben
        </button>
      {/if}
    </div>
  </div>
</div>

<!--Needed for document upload-->
<input class="hidden" on:change={onUpload} type="file" bind:this={fileInputComponent} />

<style>
  :root {
    --editor-btn-height: 64px;
  }

  .editor-height {
    height: calc(100% - var(--editor-btn-height));
  }

  .btn-group-height {
    height: var(--editor-btn-height);
  }
</style>
