<script>
  // Not refactored and no typescript
  import graphStore from './graphStore';
  import { onMount } from 'svelte';

  export let links;
  export let progress;

  onMount(() => {
    links.forEach((link) => {
      let nodeSVG = document.getElementById(`s${link.source}t${link.target}-svg`);
      setDimensions(nodeSVG, link);
      let nodePath = document.getElementById(`s${link.source}t${link.target}`);
      drawLink(nodePath, link);
    });
  });

  function setDimensions(node, link) {
    if ($graphStore[link.source + '-' + link.target] == undefined) {
      let from = document.getElementById('taskid:' + link.source);
      let to = document.getElementById('taskid:' + link.target);

      let svgTop = from.offsetTop > to.offsetTop ? to.offsetTop : from.offsetTop;
      let svgBottom =
        from.offsetTop + from.offsetHeight > to.offsetTop + to.offsetHeight
          ? from.offsetTop + from.offsetHeight
          : to.offsetTop + to.offsetHeight;

      let svgWidth = to.offsetLeft - (from.offsetLeft + from.offsetWidth);
      let svgHeight = svgBottom - svgTop;

      let posStart = {
        x: 0,
        y: from.offsetTop + from.offsetHeight / 2 - svgTop
      };
      let posEnd = {
        x: svgWidth,
        y: to.offsetTop + to.offsetHeight / 2 - svgTop
      };

      $graphStore[link.source + '-' + link.target] = {};
      $graphStore[link.source + '-' + link.target]['svgTop'] = svgTop;
      $graphStore[link.source + '-' + link.target]['svgBottom'] = svgBottom;
      $graphStore[link.source + '-' + link.target]['svgWidth'] = svgWidth;
      $graphStore[link.source + '-' + link.target]['svgHeight'] = svgHeight;
      $graphStore[link.source + '-' + link.target]['fromOffsetTop'] = from.offsetTop;
      $graphStore[link.source + '-' + link.target]['toOffsetTop'] = to.offsetTop;
      $graphStore[link.source + '-' + link.target]['fromOffsetLeft'] = from.offsetLeft;
      $graphStore[link.source + '-' + link.target]['fromOffsetWidth'] = from.offsetWidth;
      $graphStore[link.source + '-' + link.target]['posStart'] = posStart;
      $graphStore[link.source + '-' + link.target]['posEnd'] = posEnd;
    }

    let svgWidth = $graphStore[link.source + '-' + link.target].svgWidth;
    let svgHeight = $graphStore[link.source + '-' + link.target].svgHeight;
    let fromOffsetTop = $graphStore[link.source + '-' + link.target]['fromOffsetTop'];
    let toOffsetTop = $graphStore[link.source + '-' + link.target]['toOffsetTop'];
    let fromOffsetLeft = $graphStore[link.source + '-' + link.target]['fromOffsetLeft'];
    let fromOffsetWidth = $graphStore[link.source + '-' + link.target]['fromOffsetWidth'];

    node.style.top = (fromOffsetTop > toOffsetTop ? toOffsetTop : fromOffsetTop) + 'px';
    node.style.left = fromOffsetLeft + fromOffsetWidth + 'px';
    node.style.height = svgHeight + 'px';
    node.style.width = svgWidth + 'px';
  }

  function drawLink(node, link) {
    let posStart = $graphStore[link.source + '-' + link.target]['posStart'];
    let posEnd = $graphStore[link.source + '-' + link.target]['posEnd'];

    let color = progress.includes(link.source) ? '#6EE7B7' : '#FCA5A5';
    node.setAttribute('stroke', color);

    node.setAttribute(
      'd',
      `M ${posStart.x},${posStart.y} C ${posStart.x},${posStart.y} ${posStart.x + posEnd.x / 2},${
        posStart.y
      } ${posStart.x + posEnd.x / 2},${(posStart.y + posEnd.y) / 2} ${posStart.x + posEnd.x / 2},${
        posEnd.y
      } ${posEnd.x},${posEnd.y} ${posEnd.x},${posEnd.y}`
    );
  }
</script>

{#each links as link}
  <svg id="s{link.source}t{link.target}-svg" class="absolute">
    <path id="s{link.source}t{link.target}" stroke-width="2px" fill="transparent" />
  </svg>
{/each}
