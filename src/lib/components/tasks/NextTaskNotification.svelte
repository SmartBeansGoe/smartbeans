<script lang="ts">
  import type { CourseTask } from '$lib/utils/types/task';

  import Icon from '@iconify/svelte';
  import { toast } from '@zerodevx/svelte-toast';

  export let task: CourseTask;

  function handleClick() {
    toast.pop();
  }
</script>

<a href="/tasks/{task.taskid}" on:click={handleClick}>
  <div class="flex">
    <span class="flex items-center"><Icon icon="mdi:chevron-right" width={36} height={36} /></span>
    <article>
      <h3>Nächste Aufgabe:</h3>
      {task.taskDescription.shortname}
    </article>
  </div>
</a>
