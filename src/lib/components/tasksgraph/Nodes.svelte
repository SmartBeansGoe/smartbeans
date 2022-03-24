<script>
  // Not refactored and no typescript
  import { Prerequisite } from '$lib/utils/types/prerequisite';
  import TaskItem from '../tasks/TaskItem.svelte';
  import Node from './Node.svelte';

  export let tasks;
  export let progress;
  export let links;
  export let column;
  export let course;

  function hightlightLinksTo(target) {
    const linkToHighlight = links.filter((link) => link.target == target);
    linkToHighlight.forEach((link) => {
      let linkPath = document.getElementById(`s${link.source}t${link.target}`);
      linkPath.setAttribute('stroke-width', '5px');
      let color = progress.includes(link.source) ? '#10B981' : '#EF4444';
      linkPath.setAttribute('stroke', color);

      let linkSVG = document.getElementById(`s${link.source}t${link.target}-svg`);
      linkSVG.style['z-index'] = 2;
    });
  }
  function deHightlightLinksTo(target) {
    const linkToDeHighlight = links.filter((link) => link.target == target);
    linkToDeHighlight.forEach((link) => {
      let linkPath = document.getElementById(`s${link.source}t${link.target}`);
      linkPath.setAttribute('stroke-width', '2px');
      let color = progress.includes(link.source) ? '#6EE7B7' : '#FCA5A5';
      linkPath.setAttribute('stroke', color);

      let linkSVG = document.getElementById(`s${link.source}t${link.target}-svg`);
      linkSVG.style['z-index'] = 0;
    });
  }
</script>

{#each tasks as task, i (task.taskid)}
  <Node
    id="taskid:{task.taskid}"
    positionTop={i}
    positionLeft={column}
    on:mouseover={() => hightlightLinksTo(task.taskid)}
    on:mouseout={() => deHightlightLinksTo(task.taskid)}
  >
    <TaskItem
      {course}
      {task}
      done={progress.includes(task.taskid)}
      unlocked={progress.includes(task.taskid) ||
        new Prerequisite(task.prerequisites).check(progress)}
    />
  </Node>
{/each}
