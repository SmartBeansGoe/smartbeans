<script lang="ts">
  import type { Course } from '$lib/utils/types/course';
  import type { Leader } from '$lib/utils/types/leader';
  import Avatar from '../avatar/Avatar.svelte';

  export let leader: Leader;
  export let position: number;
  export let active: boolean;
  export let course: Course;
</script>

<tr class:active>
  <th>{position}</th>
  <td>
    <div class="flex items-center space-x-3">
      {#if course.config.gamification.avatar.active}
        <div class="avatar">
          <div class="mask mask-squircle w-12 h-12 bg-base-300">
            <Avatar avatar={leader.avatar} />
          </div>
        </div>
      {/if}
      <div>
        <div class="font-bold">{leader.name}</div>
      </div>
    </div>
  </td>
  <td>{leader.points}</td>
</tr>
