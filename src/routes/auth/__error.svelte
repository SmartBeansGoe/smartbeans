<script lang="ts" context="module">
  import type { ErrorLoad } from '@sveltejs/kit';

  export const load: ErrorLoad = async ({ status, error }) => {
    return { props: { status: status, statusText: error.name, error: error.message } };
  };
</script>

<script lang="ts">
  import Card from '$lib/components/utils/Card.svelte';

  export let status: number;
  export let statusText: string;
  export let error: string;

  let message;
  switch (status) {
    case 500:
      statusText = statusText ? statusText : 'Internal Server Error';
      message = error ? error : '';
  }
</script>

<Card class="max-w-md" title="{status}: {statusText}">
  {message}
</Card>
