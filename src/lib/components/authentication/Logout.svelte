<script lang="ts">
  import { goto } from '$app/navigation';

  const onRegister = () => {
    goto('/auth/register');
  };
  const onLogin = () => {
    goto('/auth/login');
  };
</script>

<h2 class="w-full text-center text-3xl font-bold">Erfolgreich ausgeloggt!</h2>
<div class="form-control mt-6">
  <div class="btn-group">
    <button on:click={onRegister} class="btn btn-primary w-1/2 btn-outline">Registrieren</button>
    <button on:click={onLogin} class="btn btn-primary w-1/2">Einloggen</button>
  </div>
</div>
