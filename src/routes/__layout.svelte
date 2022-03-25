<script lang="ts" context="module">
  export const load: Load = async ({ session, url }) => {
    if (url.pathname.startsWith('/api')) {
      return {};
    }

    if (!url.pathname.startsWith('/auth') && session.user === null) {
      return { status: 302, redirect: '/auth/login' };
    }
    if (session.user !== null && session.course === null) {
      return {
        status: 400,
        error: `Course '${session.user.activeCourse}' is not defined!`
      };
    }
    return { props: { course: session.course, user: session.user } };
  };
</script>

<script lang="ts">
  import '../app.css';
  import NavBar from '$lib/components/navigation/NavBar.svelte';
  import type { Course } from '$lib/utils/types/course';
  import type { UserSession } from '$lib/utils/types/user';
  import type { Load } from '@sveltejs/kit';
  import Drawer from '$lib/components/navigation/Drawer.svelte';
  import Avatar from '$lib/components/gamification/avatar/Avatar.svelte';
  import Card from '$lib/components/utils/Card.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { page, session } from '$app/stores';
  import _ from 'lodash';
  import UnlockableAssetsShowcase from '$lib/components/gamification/avatar/UnlockableAssetsShowcase.svelte';
  import { writable, type Writable } from 'svelte/store';
  import { browser } from '$app/env';

  export let course: Course;
  export let user: UserSession;

  let drawer: Writable<boolean>;
  if (browser) {
    drawer = writable<boolean>(localStorage.getItem('drawer-open') === 'true' || false);
    drawer.subscribe((value) => localStorage.setItem('drawer-open', JSON.stringify(value)));
  }
</script>

<svelte:head>
  <title>SmartBeans</title>
</svelte:head>

{#if course && user}
  <Drawer bind:open={$drawer} {course}>
    <NavBar {course} {user} bind:burger={$drawer} />
    <div class="grid grid-cols-6 m-4 gap-4">
      <main
        class="col-span-6 {course.config.gamification.avatar.active
          ? 'xl:col-span-5'
          : ''} viewport-height"
      >
        <slot test="" />
      </main>
      {#if course.config.gamification.avatar.active}
        <div class="flex flex-col visible-avatar xl:visible xl:col-span-1 gap-4">
          <Card title={user.displayName} centered={true}>
            <Avatar avatar={user.avatar} />
          </Card>

          {#if $page.url.pathname.startsWith('/tasks/')}
            <UnlockableAssetsShowcase course={course.name} taskid={$page.params.taskid} />
          {/if}
        </div>
      {/if}
    </div>
  </Drawer>

  <div class="toast-position">
    <SvelteToast options={{ duration: 2000 }} />
  </div>
{/if}

<style>
  .toast-position {
    --toastContainerTop: auto;
    --toastContainerRight: 2rem;
    --toastContainerBottom: 1rem;
    --toastContainerLeft: auto;
  }

  .viewport-height {
    height: calc(calc(100vh - 64px) - 2rem);
  }
  @media only screen and (max-width: 1280px) {
    .visible-avatar {
      display: none;
    }
  }
</style>
