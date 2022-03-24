<script lang="ts">
  import { session } from '$app/stores';
  import Settings from '$lib/components/profile/Settings.svelte';
</script>

<Settings user={$session.user} />
