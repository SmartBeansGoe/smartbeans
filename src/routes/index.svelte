<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session, fetch }) => {
    if (session.user) {
      const requestLeaders = await fetch(`/api/courses/${session.course.name}/leaderboard`);
      const leaders = await requestLeaders.json();
      const requestProgress = await fetch(`/api/courses/${session.course.name}/progress`);
      const progress = await requestProgress.json();
      const requestTasks = await fetch(`/api/courses/${session.course.name}/tasks`);
      const tasks = await requestTasks.json();

      return {
        props: {
          leaders: leaders,
          progress: progress,
          tasks: tasks
        }
      };
    } else {
      return { status: 302, redirect: '/auth/login' };
    }
  };
</script>

<script lang="ts">
  import Achievements from '$lib/components/gamification/achievements/Achievements.svelte';
  import Level from '$lib/components/gamification/level/Level.svelte';
  import Leaderboard from '$lib/components/gamification/leaderboard/Leaderboard.svelte';
  import type { Leader } from '$lib/utils/types/leader';
  import Card from '$lib/components/utils/Card.svelte';
  import SkillGraph from '$lib/components/gamification/skillgraph/SkillGraph.svelte';
  import type { CourseTask } from '$lib/utils/types/task';
  import type { Progress } from '$lib/utils/types/progress';
  import { getNextTask } from '$lib/utils/nextTask';
  import NextTask from '$lib/components/tasks/NextTask.svelte';
  import { session } from '$app/stores';

  export let leaders: Leader[];
  export let tasks: CourseTask[];
  export let progress: Progress;

  let config = $session.course.config.gamification;
  let nextTask = getNextTask(tasks, progress);
</script>

<div class="flex gap-4 flex-wrap w-full">
  {#if config.level.points.active || config.level.tasks.active || $session.course.config.tasks.nextExercise.dashboard.active}
    {#if config.level.points.active || config.level.tasks.active}
      <Card
        class={$session.course.config.tasks.nextExercise.dashboard.active
          ? 'lg:w-1/2-gap-4 w-full'
          : 'w-full'}
        title="Fortschritt"
      >
        {#if config.level.points.active}
          <Level
            {progress}
            {tasks}
            unitType="points"
            unitName={config.level.points.unitName}
            levels={config.level.points.levels}
          />
        {/if}
        {#if config.level.tasks.active}
          <Level {progress} {tasks} unitType="tasks" unitName={config.level.tasks.unitName} />
        {/if}
      </Card>
    {/if}

    {#if $session.course.config.tasks.nextExercise.dashboard.active}
      {#if nextTask}
        <a
          class={config.level.points.active || config.level.tasks.active
            ? 'lg:w-1/2-gap-4 w-full'
            : 'w-full'}
          href="/tasks/{nextTask.taskid}"
        >
          <Card class="h-full" title="Nächste Aufgabe: {nextTask.taskDescription.shortname}">
            <NextTask task={nextTask} />
          </Card>
        </a>
      {:else}
        <Card
          class={config.level.points.active || config.level.tasks.active
            ? 'lg:w-1/2-gap-4 w-full'
            : 'w-full'}
          title="Kein Aufgabenvorschlag vorhanden"
        />
      {/if}
    {/if}
  {/if}
  {#if config.skillgraph.active}
    <Card class="lg:w-1/2-gap-4">
      <SkillGraph {progress} {tasks} />
    </Card>
  {/if}
  {#if config.achievements.active || config.leaderboard.active}
    <div class="flex flex-wrap lg:w-1/2-gap-4 gap-4">
      {#if config.achievements.active}
        <Card class="w-full" title="Errungenschaften">
          <Achievements achievements={null} />
        </Card>
      {/if}
      {#if config.leaderboard.active}
        <a class="w-full" href="/leaderboard">
          <Card class="w-full" title="Leaderboard">
            <Leaderboard course={$session.course} {leaders} max={5} />
          </Card>
        </a>
      {/if}
    </div>
  {/if}
</div>
