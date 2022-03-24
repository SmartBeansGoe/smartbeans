<script lang="ts">
  import Card from '$lib/components/utils/Card.svelte';
  import Split from '$lib/components/utils/Split.svelte';
  import type { Submission } from '$lib/utils/types/submission';
  import type { CourseTask } from '$lib/utils/types/task';
  import { createEventDispatcher } from 'svelte';
  import Description from './Description.svelte';
  import Editor from './Editor.svelte';
  import Submissions from './Submissions.svelte';

  export let task: CourseTask;
  export let submissions: Submission[];
  export let submitting: boolean;

  const dispatch = createEventDispatcher();

  const onSubmit = (event: CustomEvent) => {
    const code = event.detail.editorValue;
    dispatch('submit', { code: code });
  };
</script>

<Card class="h-full" classCardBody="h-full p-0">
  <Split>
    <section class="h-full" slot="left">
      <Split direction="vertical">
        <section class="h-1/2 p-6" slot="left">
          <Description {task} {submissions} />
        </section>
        <section class="h-1/2" slot="right">
          <Submissions {submissions} {task} />
        </section>
      </Split>
    </section>

    <section slot="right" class="h-full">
      <Editor {submitting} {task} on:submit={onSubmit} />
    </section>
  </Split>
</Card>
