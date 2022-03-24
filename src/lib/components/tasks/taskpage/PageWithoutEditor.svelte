<script lang="ts">
  import Card from '$lib/components/utils/Card.svelte';
  import Split from '$lib/components/utils/Split.svelte';
  import type { Submission } from '$lib/utils/types/submission';
  import type { CourseTask } from '$lib/utils/types/task';
  import { createEventDispatcher } from 'svelte';
  import Description from './Description.svelte';
  import LoadFileSubmit from './LoadFileSubmit.svelte';
  import Submissions from './Submissions.svelte';

  export let task: CourseTask;
  export let submissions: Submission[];
  export let submitting: boolean;

  const dispatch = createEventDispatcher();

  const onSubmit = (event: CustomEvent) => {
    const code = event.detail.code;
    dispatch('submit', { code: code });
  };
</script>

<Card class="h-full" classCardBody="h-full p-0">
  <Split>
    <section class="h-1/2 p-6" slot="left">
      <Description {task} {submissions} />
    </section>
    <section class="h-1/2" slot="right">
      <div class="pt-6 pb-3 px-6">
        <LoadFileSubmit {submitting} on:submit={onSubmit} />
      </div>
      <Submissions {submissions} {task} />
    </section>
  </Split>
</Card>
