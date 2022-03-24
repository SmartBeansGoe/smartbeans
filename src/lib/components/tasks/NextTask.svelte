<script lang="ts">
  import type { CourseTask } from '$lib/utils/types/task';
  import Tag from '../utils/Tag.svelte';

  export let task: CourseTask;
</script>

<section class="flex flex-col h-full">
  <div class="grow">{task.taskDescription.title}</div>

  <div class="flex justify-self-end gap-2">
    {#each task.tags as tag}
      <Tag {tag} showPoints={true} />
    {/each}
  </div>
</section>
