<script lang="ts" context="module">
  // Identifies the skills from the tasks and merges the points of the same tag
  export const calcSkillPointsFrom = (tasks: CourseTask[]) => {
    const skills = tasks
      .map((task) => task.tags.filter((t) => t.hasOwnProperty('points')))
      .flat()
      .reduce((previous, current) => {
        if (current.points === undefined) {
          return previous;
        }
        if (previous[current.name] === undefined) {
          previous[current.name] = current.points;
        } else {
          previous[current.name] += current.points;
        }
        return previous;
      }, {});

    return skills;
  };

  // Calculates all points for each skill/tag based on the user's progress
  export const calcProgressPointsFrom = (tasks: CourseTask[], progress: Progress) => {
    const skills = tasks
      .map((task) =>
        task.tags
          .filter((t) => t.hasOwnProperty('points'))
          .map((t) => {
            return { ...t, taskid: task.taskid };
          })
      )
      .flat()
      .reduce((previous, current) => {
        let currentFinished = {
          name: current.name,
          points: progress.includes(current.taskid) ? current.points : 0
        };
        if (previous[currentFinished.name] === undefined) {
          previous[currentFinished.name] = currentFinished.points;
        } else {
          previous[currentFinished.name] += currentFinished.points;
        }
        return previous;
      }, {});

    return skills;
  };

  const calcPointsRatio = (skills: object, points: object, labels: string[]) => {
    return labels.map((label) => {
      if (skills[label] === undefined) {
        throw new Error(`Skill object does not include the label: ${label}`);
      }
      if (points[label] === undefined) {
        throw new Error(`SkillPoints object does not include the label: ${label}`);
      }

      return (points[label] / skills[label]) * 100;
    });
  };
</script>

<script lang="ts">
  import _ from 'lodash';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
  import type { CourseTask } from '$lib/utils/types/task';
  import type { Progress } from '$lib/utils/types/progress';

  let chartCanvas: any;
  export let tasks: CourseTask[];
  export let progress: Progress;

  onMount(async () => {
    const skills = calcSkillPointsFrom(tasks);
    const points = calcProgressPointsFrom(tasks, progress);
    const labels = Object.keys(skills).sort((a, b) => a.localeCompare(b));

    let ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: '#10b98150',
            borderColor: '#10b981',
            data: calcPointsRatio(skills, points, labels)
          }
        ]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            grid: {
              lineWidth: 4
            },
            angleLines: {
              lineWidth: 4
            },
            ticks: {
              font: { size: 14 }
            },
            pointLabels: {
              font: { size: 16 }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0,
            borderWidth: 4
          },
          point: {
            radius: 4,
            borderWidth: 4,
            hoverRadius: 6,
            hoverBorderWidth: 6
          }
        }
      }
    });
  });
</script>

<canvas bind:this={chartCanvas} />
