<script lang="ts">
  export let title: string = null;
  export let description: string = null;
  export let centered: boolean = false;

  let cls: string = '';
  export let classCardBody: string = '';
  export { cls as class };
</script>

<div class="card w-full bg-base-100 shadow-xl {cls}" on:click>
  <div class:text-center={centered} class="card-body w-full p-4 {classCardBody}">
    {#if title}
      <h2 class="text-xl font-semibold">{title}</h2>
    {/if}
    {#if description}
      <p>{description}</p>
    {/if}
    <slot />
  </div>
</div>
