<script lang="ts" context="module">
  export const load: Load = async ({ session, url, fetch }) => {
    const tags = [...url.searchParams.keys()];

    const tasksRequest = await fetch(`/api/courses/${session.course.name}/tasks`);
    const tasks = await tasksRequest.json();

    const progressRequest = await fetch(`/api/courses/${session.course.name}/progress`, {
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    const progress = await progressRequest.json();

    return { props: { tasks: tasks, progress: progress, course: session.course, tags: tags } };
  };
</script>

<script lang="ts">
  import TaskList from '$lib/components/tasks/TaskList.svelte';
  import type { Course } from '$lib/utils/types/course';
  import type { Progress } from '$lib/utils/types/progress';
  import type { CourseTask } from '$lib/utils/types/task';
  import type { Load } from '@sveltejs/kit';

  export let tasks: CourseTask[];
  export let progress: Progress;
  export let course: Course;
  export let tags: string[];

  let filteredTags: string[] = [];

  $: if (tags.length === 0) {
    filteredTags = course.config.tasks.standardView.categorizeByTags;
  } else {
    filteredTags = tags;
  }
</script>

<section class="grid grid-flow-row gap-4">
  {#each filteredTags as tag}
    <TaskList {course} {tasks} {tag} {progress} />
  {/each}
</section>
