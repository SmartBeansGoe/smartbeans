<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { CourseTask } from '$lib/utils/types/task';
  import { marked } from 'marked';
  import hljs from 'highlight.js';
  import type { Submission } from '$lib/utils/types/submission';
  import Tag from '$lib/components/utils/Tag.svelte';

  export let task: CourseTask;
  export let submissions: Submission[];

  $: done = submissions.find((x) => x.score > 0.99999) !== undefined;

  marked.setOptions({
    langPrefix: 'hljs language-',
    highlight: (code: string) => {
      return hljs.highlightAuto(code).value;
    }
  });
</script>

<section class="grid grid-cols-6">
  <div class="col-span-5">
    <h1 class="font-semibold text-2xl">{task.taskDescription.title}</h1>
    <h2 class="text-lg">{task.taskDescription.shortname}</h2>
  </div>
  <div class="flex justify-end col-span-1">
    {#if done}
      <Icon class="text-success" icon="mdi:check-thick" width={48} height={48} />
    {/if}
  </div>
</section>
<div class="flex gap-2 mb-2">
  {#each task.tags as tag}
    <Tag {tag} showPoints={true} />
  {/each}
</div>

{@html marked.parse(task.taskDescription.task)}
