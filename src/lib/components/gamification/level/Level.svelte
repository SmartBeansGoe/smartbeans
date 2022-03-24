<script lang="ts">
  import type { Progress } from '$lib/utils/types/progress';
  import type { CourseTask } from '$lib/utils/types/task';
  import { calcProgressPointsFrom } from '../skillgraph/SkillGraph.svelte';

  export let progress: Progress;
  export let tasks: CourseTask[];
  export let unitType: 'tasks' | 'points';
  export let unitName: string;
  export let levels: number[] = [];

  let level: number = 0;
  let points: number;
  if (unitType === 'points') {
    points = (Object.values(calcProgressPointsFrom(tasks, progress)) as number[]).reduce(
      (a: number, b: number) => a + b,
      0
    );
    level = levels.findIndex((l) => l > points);
    if (level === -1) {
      level = levels.length;
    }
  }
</script>

{#if unitType === 'tasks'}
  <section class="relative">
    <progress
      class="progress progress-success bg-base-300 w-full h-6"
      value={progress.length}
      max={tasks.length}
    />
    <p class="absolute top-0 text-center w-full text-sm font-bold">
      {progress.length}/{tasks.length}
      {unitName}
    </p>
  </section>
{:else if unitType === 'points'}
  {#if levels.length > 0}
    <h3>Level {level}/{levels.length}</h3>
  {/if}
  <section class="relative">
    <progress
      class="progress progress-info bg-base-300 w-full h-6"
      value={points}
      max={levels[level] !== undefined ? levels[level] : points}
    />
    <p class="absolute top-0 text-center w-full text-sm font-bold">
      {points}/{levels[level] !== undefined ? levels[level] : '∞'}
      {unitName}
    </p>
  </section>
{/if}
