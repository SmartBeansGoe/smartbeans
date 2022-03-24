<script lang="ts">
  import type { Course } from '$lib/utils/types/course';
  import { Prerequisite } from '$lib/utils/types/prerequisite';
  import type { Progress } from '$lib/utils/types/progress';
  import type { CourseTask } from '$lib/utils/types/task';
  import TaskItem from './TaskItem.svelte';

  export let tasks: CourseTask[];
  export let progress: Progress;
  export let course: Course;
  export let tag: string;

  $: filteredTasks = tasks.filter((task) => {
    const tags = task.tags.map((tag) => tag.name.toLocaleLowerCase());
    return tags.includes(tag.toLocaleLowerCase());
  });
  $: filteredTasks.sort((a, b) => a.orderBy - b.orderBy);
</script>

{#if filteredTasks.length > 0}
  <section class="card card-body shadow-xl">
    <h1 class="card-title text-2xl capitalize">{tag}</h1>
    <progress
      class="progress progress-success bg-base-300 h-3 w-full"
      value={filteredTasks.filter((task) => progress.includes(task.taskid)).length}
      max={filteredTasks.length}
    />

    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {#each filteredTasks as task}
        {@const unlocked = new Prerequisite(task.prerequisites).check(progress)}
        <TaskItem {course} {task} done={progress.includes(task.taskid)} {unlocked} />
      {/each}
    </div>
  </section>
{/if}
