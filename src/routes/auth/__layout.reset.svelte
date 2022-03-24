<div class="hero h-screen bg-base-200">
  <div class="h-full w-full absolute p-20 opacity-50">
    <div class="h-full hero backdrop" />
  </div>
  <slot />
</div>

<style>
  .backdrop {
    background-image: url('/smartbeans-logo.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
