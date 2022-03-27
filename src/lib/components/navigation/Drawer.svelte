<script lang="ts">
  import { page } from '$app/stores';

  import type { Course } from '$lib/utils/types/course';
  import Icon from '@iconify/svelte';

  export let open: boolean;
  export let course: Course;
</script>

<div class:drawer-mobile={open} class="h-screen transition duration-100 drawer w-full">
  <input id="my-drawer" type="checkbox" bind:checked={open} class="drawer-toggle" />
  <div class="drawer-content">
    <slot />
  </div>
  <div class="drawer-side shadow-2xl">
    <label for="my-drawer" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-60 bg-base-100 text-base-content">
      <!-- Sidebar content here -->
      <div class="relative flex flex-wrap justify-center">
        <img class="w-20 h-20" alt="" src="/smartbeans-logo.png" />
        <p class="w-full text-center text-base font-bold -mb-2">SmartBeans</p>
      </div>

      <div class="divider" />
      <li>
        <a class:active={$page.url.pathname === '/'} class="gap-2" href="/">
          <Icon icon="mdi:view-dashboard" width={24} height={24} />
          Dashboard
        </a>
      </li>
      {#if course.config.tasks.standardView}
        <li>
          <a
            class:active={$page.url.pathname === '/tasks' ||
              $page.url.pathname.startsWith('/tasks/')}
            class="gap-2"
            href="/tasks"
          >
            <Icon icon="mdi:code-braces" width={24} height={24} />
            {course.config.tasks.standardView.title}
          </a>
        </li>
      {/if}
      {#if course.config.tasks.complexView}
        <li>
          <a
            class:active={$page.url.pathname.startsWith('/tasksgraph')}
            class="gap-2"
            href="/tasksgraph"
          >
            <Icon icon="mdi:graph" width={24} height={24} />
            {course.config.tasks.complexView.title}
          </a>
        </li>
      {/if}
      {#if course.config.gamification.leaderboard.active}
        <li>
          <a
            class:active={$page.url.pathname.startsWith('/leaderboard')}
            class="gap-2"
            href="/leaderboard"
          >
            <Icon icon="mdi:trophy" width={24} height={24} />
            Leaderboard
          </a>
        </li>
      {/if}
      {#if course.config.gamification.avatar.active}
        <li>
          <a
            class:active={$page.url.pathname.startsWith('/wardrobe')}
            class="gap-2"
            href="/wardrobe"
          >
            <Icon icon="mdi:wardrobe" width={24} height={24} />
            Kleiderschrank
          </a>
        </li>
      {/if}
      <li>
        <a class:active={$page.url.pathname.startsWith('/profile')} class="gap-2" href="/profile">
          <Icon icon="mdi:account-cog" width={24} height={24} />
          Profil
        </a>
      </li>
    </ul>
  </div>
</div>
