<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    let response = await fetch('/api/auth/meta');
    if (!response.ok) {
      return { status: response.status };
    }

    let courses: { name: string }[] = await response.json();

    return { props: { courses: courses.map((c: { name: string }) => c.name) } };
  };
</script>

<script lang="ts">
  import Login from '$lib/components/authentication/Login.svelte';
  export let courses: string[];
</script>

<Login {courses} />
