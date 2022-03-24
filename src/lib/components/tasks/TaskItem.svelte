<script lang="ts">
  import type { Course } from '$lib/utils/types/course';

  import type { CourseTask } from '$lib/utils/types/task';
  import Icon from '@iconify/svelte';
  import Tag from '../utils/Tag.svelte';

  export let task: CourseTask;
  export let course: Course;
  export let done: boolean;
  export let unlocked: boolean = false;

  let blocked =
    !done &&
    !unlocked &&
    course.config.tasks.unfulfilledPrerequisites.blockedTaskByUnfulfilledPrerequisites;

  let grayScaled =
    !done &&
    !unlocked &&
    course.config.tasks.unfulfilledPrerequisites.grayedOutTaskByUnfulfilledPrerequisites;
</script>

<a href={!blocked ? `/tasks/${task.taskid}` : ''}>
  <section
    class:cursor-not-allowed={blocked}
    class:bg-base-300={grayScaled}
    class:border-base-300={grayScaled}
    class:hover:bg-base-300={grayScaled}
    class="card btn-outline hover:bg-base-200 bg-base-100 hover:border-base-300 hover:text-current border-base-200 border-2 cursor-pointer task-card w-full shadow-lg"
  >
    <div class="card-body p-3">
      <div class="grid grid-cols-6 place-content-end">
        <h2 class="col-span-5 card-title text-lg">{task.taskDescription.shortname}</h2>
        <div class="col-span-1 flex justify-end gap-1">
          <Icon class="text-red-400" icon="mdi:language-{task.lang}" width={24} height={24} />
          {#if done}
            <Icon class="text-success" icon="mdi:check-circle" width={24} height={24} />
          {:else}
            <Icon class="text-gray-300" icon="mdi:checkbox-blank-circle" width={24} height={24} />
          {/if}
        </div>
      </div>

      <div class="card-actions justify-end">
        {#each task.tags as tag}
          <a href="/tasks?{tag.name}">
            <Tag {tag} />
          </a>
        {/each}
      </div>
    </div>
  </section>
</a>
