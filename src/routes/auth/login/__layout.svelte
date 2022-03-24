<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session }) => {
    if (session.user !== null) return { status: 302, redirect: `/` };
    return {};
  };
</script>

<div class="hero-content flex-col">
  <section class="text-center">
    <h1 class="text-5xl font-bold">SmartBeans</h1>
    <p class="py-6">Die Platform für das Lernen von Programmiersprachen...</p>
  </section>
  <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100  bg-opacity-90">
    <div class="card-body">
      <slot />
    </div>
  </div>
</div>
