<script lang="ts" context="module">
  import TasksGraph from '$lib/components/tasksgraph/TasksGraph.svelte';
  import Card from '$lib/components/utils/Card.svelte';
  import type { Course } from '$lib/utils/types/course';
  import type { Progress } from '$lib/utils/types/progress';
  import type { CourseTask } from '$lib/utils/types/task';
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, url, fetch }) => {
    const tasksRequest = await fetch(`/api/courses/${session.course.name}/tasks`);
    const tasks = await tasksRequest.json();

    const progressRequest = await fetch(`/api/courses/${session.course.name}/progress`, {
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' }
    });
    const progress = await progressRequest.json();

    return { props: { tasks: tasks, progress: progress, course: session.course } };
  };
</script>

<script lang="ts">
  export let progress: Progress;
  export let tasks: CourseTask[];
  export let course: Course;
</script>

<Card title="Aufgabengraph" class="h-full bg-base-100 p-4" classCardBody="p-0">
  <TasksGraph {progress} {tasks} {course} />
</Card>
