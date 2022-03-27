<script lang="ts" context="module">
  export const load: Load = async ({ session, fetch }) => {
    const request = await fetch(`/api/courses/${session.course.name}/leaderboard`);
    const leaders = await request.json();
    return {
      props: {
        leaders: leaders
      }
    };
  };
</script>

<script lang="ts">
  import { session } from '$app/stores';

  import Leaderboard from '$lib/components/gamification/leaderboard/Leaderboard.svelte';

  import Card from '$lib/components/utils/Card.svelte';
  import type { Leader } from '$lib/utils/types/leader';
  import type { Load } from '@sveltejs/kit';

  export let leaders: Leader[];
  let title: string = 'Hall of Fame';
</script>

<Card {title} centered={true}>
  <div class="grid grid-cols-1 place-items-center gap-4 w-full">
    <img src="/images/leaderboard_badge.png" width="200" height="200" alt="" />
    <div class="w-full max-w-2xl">
      <Leaderboard course={$session.course} {leaders} max={leaders.length} />
    </div>
  </div>
</Card>
