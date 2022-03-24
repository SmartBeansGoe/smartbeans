<script lang="ts">
  import type { Course } from '$lib/utils/types/course';

  import type { Leader } from '$lib/utils/types/leader';
  import LeaderRow from './LeaderRow.svelte';

  export let leaders: Leader[];
  export let max: number;
  export let course: Course;

  $: leaders.sort((a, b) => b.points - a.points);
  $: meOnSliceEnd = leaders.slice(max).find((leader) => leader.me);
  $: position = leaders.findIndex((leader) => leader.me);
</script>

<table class="table table-zebra w-full">
  <thead>
    <tr>
      <th />
      <th>Name</th>
      <th>Points</th>
    </tr>
  </thead>
  <tbody>
    {#each leaders.slice(0, max) as leader, i}
      <LeaderRow {course} {leader} active={leader.me} position={i + 1} />
    {/each}
    {#if meOnSliceEnd}
      <LeaderRow {course} leader={meOnSliceEnd} active={meOnSliceEnd.me} position={position + 1} />
    {/if}
  </tbody>
</table>
