<script lang="ts">
  import { session } from '$app/stores';
  import config from '$config';

  import Code from '$lib/components/utils/Code.svelte';
  import type { Submission } from '$lib/utils/types/submission';
  import type { CourseTask } from '$lib/utils/types/task';
  import Icon from '@iconify/svelte';

  export let task: CourseTask;
  export let submissions: Submission[];
  let active = 0;

  $: submissions.sort((a, b) => b.id - a.id);

  const onShare = () => {
    let submission = submissions[active];
    let date = new Date(submission.timestamp * 1000);
    let time = date.toLocaleString();

    let body =
      `# Aufgabe "${task.taskDescription.shortname}"" Id: ${submission.taskid}\n` +
      `Abgabe von *${$session.user.username}* aus dem Kurs *${$session.user.activeCourse}*\n` +
      `Datum: ${time}\n` +
      `## Problembeschreibung:\n *Beschreibe dein Problem und teile den Link mit einem Tutor.*\n` +
      `**WICHTIG**: *Speichere auch du dir den Link ab.*\n`;
    if (submission.resultType === 'COMPILE_ERROR') {
      body +=
        `## Compiler-Output\n` +
        `Result: ${submission.resultType}\n\n` +
        (submission.simplified.compiler.stdout != undefined
          ? `### Standardausgabe:\n\`\`\`\n${submission.simplified.compiler.stdout}\n\`\`\`\n`
          : '') +
        `### Abgabe:\n\`\`\`${task.lang}\n${submission.content}\n\`\`\``;
    } else {
      body +=
        `## Testergebnis\n` +
        `Result: ${submission.resultType}\n\n` +
        (submission.simplified.testCase.stdin != undefined
          ? `### Standardeingabe:\n\`\`\`\n${submission.simplified.testCase.stdin}\n\`\`\`\n`
          : '') +
        (submission.simplified.testCase.stdout != undefined
          ? `### Standardausgabe:\n\`\`\`\n${submission.simplified.testCase.stdout}\n\`\`\`\n`
          : '') +
        (submission.simplified.testCase.expectedStdout != undefined
          ? `### Geforderte Standardausgabe:\n\`\`\`\n${submission.simplified.testCase.expectedStdout}\`\`\`\n`
          : '') +
        `### Abgabe:\n\`\`\`${task.lang}\n${submission.content}\n\`\`\``;
    }
    fetch(`${config.padUrl}/new`, {
      headers: { 'Content-Type': 'text/markdown' },
      method: 'POST',
      body: body
    })
      .then((response) => {
        window.open(response.url + '?both');
      })
      .catch((error) => {
        console.log(error);
      });
  };
</script>

<div class="relative">
  {#if submissions.length > 0}
    <div class="sticky top-0 tabs px-6 flex-nowrap tabs-boxed rounded-none overflow-x-auto z-10">
      {#each submissions as submission, i}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class:tab-active={i === active}
          on:click={() => (active = i)}
          class="tab px-2 flex-nowrap"
        >
          {submissions.length - i}
          {#if submission.score > 0.99999}
            <Icon class="text-success" icon="mdi:clipboard-check" width={20} height={20} />
          {:else}
            <Icon class="text-error" icon="mdi:clipboard-remove" width={20} height={20} />
          {/if}
        </a>
      {/each}
    </div>
    <section class="relative">
      {#if submissions.length > 0}
        <div class="p-6 pt-4">
          {#if submissions[active].simplified.compiler}
            <div class="flex items-center gap-2">
              <h3>Compiler:</h3>
              {#if submissions[active].simplified.compiler.exitCode === 0}
                <Icon class="text-success" icon="mdi:check-thick" width={20} height={20} />
              {/if}
              {#if submissions[active].simplified.compiler.exitCode > 0}
                <Icon class="text-error" icon="icomoon-free:cross" width={14} height={14} />
              {/if}
            </div>
            {#if submissions[active].simplified.compiler.stdout}
              <Code lang={task.lang} code={submissions[active].simplified.compiler.stdout} />
            {/if}
          {/if}
          <div class="flex items-center gap-2">
            <h3>Resultat:</h3>
            {submissions[active].resultType}
          </div>
          {#if submissions[active].details && submissions[active].details.error}
            <Code lang="plaintext" code={submissions[active].details.error} />
          {/if}
          <div class="flex items-center gap-2">
            <h3>Testfall:</h3>
            {#if submissions[active].score <= 0.99999}
              <Icon class="text-error" icon="icomoon-free:cross" width={14} height={14} />
            {/if}
            {#if submissions[active].score > 0.99999}
              <Icon class="text-success" icon="mdi:check-thick" width={20} height={20} />
            {/if}
          </div>
          {#if submissions[active].simplified.testCase}
            {#if submissions[active].simplified.testCase.message}
              <Code lang={task.lang} code={submissions[active].simplified.testCase.message} />
            {/if}
            {#if submissions[active].simplified.testCase.stdin !== undefined}
              <h3>Standardeingabe:</h3>
              <Code lang={task.lang} code={submissions[active].simplified.testCase.stdin} />
            {/if}

            {#if submissions[active].simplified.testCase.stdout !== undefined}
              <h3>Standardausgabe:</h3>
              <Code lang={task.lang} code={submissions[active].simplified.testCase.stdout} />
            {/if}
            {#if submissions[active].simplified.testCase.expectedStdout !== undefined}
              <h3>Erwartete Standardausgabe:</h3>
              <Code
                lang={task.lang}
                code={submissions[active].simplified.testCase.expectedStdout}
              />
            {/if}
          {/if}

          {#if submissions[active].content}
            <h3>Abgabe</h3>
            <Code lang={task.lang} code={submissions[active].content} />
          {/if}
        </div>
        <button class="absolute btn btn-sm btn-info btn-outline right-6 top-5" on:click={onShare}
          >Teilen</button
        >
      {/if}
    </section>
  {:else}
    <div class="flex justify-center items-center h-full">Bisher keine Abgaben vorhanden.</div>
  {/if}
</div>
