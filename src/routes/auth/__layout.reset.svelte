<div class="hero h-screen bg-base-200">
  <div class="h-full w-full absolute p-20 opacity-50">
    <div class="h-full hero backdrop" />
  </div>
  <slot />
</div>

<svelte:head>
  <title>SmartBeans</title>
</svelte:head>

<style>
  .backdrop {
    background-image: url('/smartbeans-logo.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
