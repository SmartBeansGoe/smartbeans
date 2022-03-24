<script lang="ts" context="module">
  export const load: Load = async ({ fetch, session, params }) => {
    const taskRequest = await fetch(`/api/courses/${session.course.name}/tasks/${params.taskid}`);

    if (!taskRequest.ok) return { status: taskRequest.status, error: await taskRequest.text() };
    const task = await taskRequest.json();

    const submissionsRequest = await fetch(
      `/api/courses/${session.course.name}/tasks/${params.taskid}/submissions`
    );
    const submissions = await submissionsRequest.json();
    return { props: { task: task, submissions: submissions, course: session.course } };
  };
</script>

<script lang="ts">
  import Asset from '$lib/components/gamification/avatar/assets/Asset.svelte';
  import AssetNotification from '$lib/components/gamification/avatar/assets/AssetNotification.svelte';

  import NextTaskNotification from '$lib/components/tasks/NextTaskNotification.svelte';

  import PageWithEditor from '$lib/components/tasks/taskpage/PageWithEditor.svelte';
  import PageWithoutEditor from '$lib/components/tasks/taskpage/PageWithoutEditor.svelte';
  import { getNextTask } from '$lib/utils/nextTask';
  import type { Course } from '$lib/utils/types/course';
  import type { Submission } from '$lib/utils/types/submission';
  import type { CourseTask } from '$lib/utils/types/task';
  import type { Load } from '@sveltejs/kit';
  import { toast } from '@zerodevx/svelte-toast';

  export let task: CourseTask;
  export let course: Course;
  export let submissions: Submission[];

  let submitting = false;
  const onSubmit = async (event: CustomEvent) => {
    submitting = true;
    const code = event.detail.code;

    let submissionResponse: Response;

    submissionResponse = await fetch(
      `/api/courses/${course.name}/tasks/${task.taskid}/submissions`,
      {
        method: 'POST',
        body: JSON.stringify({ submission: code }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!submissionResponse.ok) {
      toast.push(`${submissionResponse.status} ${submissionResponse.statusText}`, {
        theme: {
          '--toastBackground': '#f87272',
          '--toastBarBackground': '#db0a0a'
        }
      });
      submitting = false;
      return;
    }
    const submissionResponseBody = await submissionResponse.json();
    const submission: Submission = submissionResponseBody.result;

    if (submission.score > 0.99999) {
      toast.push('Erfolgreiche Abgabe!<br/>Sehr gut! 👍', {
        theme: {
          '--toastBackground': '#10b981',
          '--toastBarBackground': '#059669'
        }
      });
      if (course.config.gamification.avatar.active) {
        submissionResponseBody.newUnlockedAssets.forEach((asset) => {
          toast.push({
            component: {
              src: AssetNotification,
              props: {
                id: asset,
                text: 'Neues Asset freigeschaltet:'
              }
            },
            theme: {
              '--toastBackground': '#3abff8',
              '--toastBarBackground': '#196480'
            },
            duration: 3000
          });
        });
      }
      try {
        const progressRequest = await fetch(`/api/courses/${course.name}/progress`);
        const progress = await progressRequest.json();

        const tasksRequest = await fetch(`/api/courses/${course.name}/tasks`);
        const tasks = await tasksRequest.json();

        let nextTask = getNextTask(tasks, progress);
        if (nextTask) {
          toast.push({
            component: {
              src: NextTaskNotification,
              props: {
                task: nextTask
              }
            },
            theme: {
              '--toastBackground': '#10b981',
              '--toastBarBackground': '#059669'
            },
            pausable: true,
            duration: 10000
          });
        }
      } catch {}
    }
    if (submission.score <= 0.99999) {
      toast.push('Falsche Abgabe!', {
        theme: {
          '--toastBackground': '#f87272',
          '--toastBarBackground': '#db0a0a'
        }
      });
    }
    submissions = [submission, ...submissions];
    submitting = false;
  };
</script>

{#if course.config.tasks.editor}
  <PageWithEditor {submitting} {task} {submissions} on:submit={onSubmit} />
{:else}
  <PageWithoutEditor {submitting} {task} {submissions} on:submit={onSubmit} />
{/if}
