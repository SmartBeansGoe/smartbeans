<script lang="ts">
  import { goto } from '$app/navigation';

  let password: string;
  let passwordRepeat: string;
  let username: string;
  let registerKey: string;

  let error: string;

  const onRegister = () => {
    fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        Authorization: `Bearer ${registerKey}`,
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      if (res.ok) goto('/');
      else error = await res.text();
    });
  };

  const onInput = () => {
    error = undefined;
  };

  const onKeypress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.ctrlKey && !buttonDisabled) {
      onRegister();
    }
  };

  $: buttonDisabled =
    password === undefined ||
    passwordRepeat === undefined ||
    passwordRepeat !== password ||
    username === undefined ||
    registerKey === undefined ||
    password === '' ||
    passwordRepeat === '' ||
    username === '' ||
    registerKey === '';
</script>

<section on:keypress={onKeypress}>
  <h2 class="w-full text-center text-3xl font-bold">Register</h2>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Username</span>
    </p>
    <input type="text" bind:value={username} placeholder="Username" class="input input-bordered" />
  </div>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Passwort</span>
    </p>
    <input
      type="password"
      bind:value={password}
      placeholder="Passwort"
      class="input input-bordered"
    />
  </div>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Passwort wiederholen</span>
    </p>
    <input
      type="password"
      bind:value={passwordRepeat}
      placeholder="Passwort"
      class:input-error={password !== passwordRepeat}
      class="input input-bordered"
    />
  </div>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Registrierungsschlüssel</span>
    </p>
    <input type="text" bind:value={registerKey} placeholder="Key" class="input input-bordered" />
  </div>
  <div class:hidden={!error} class="alert alert-error mt-3">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current flex-shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>Fehler: {error}</span>
    </div>
  </div>
  <div class="form-control mt-6">
    <button
      on:click={onRegister}
      class="btn"
      class:btn-primary={!buttonDisabled}
      class:btn-active={buttonDisabled}
      class:btn-ghost={buttonDisabled}
      class:btn-disabled={buttonDisabled}>Registrieren</button
    >
  </div>
  <div class="w-full text-center">
    <a class="link" href="/auth/login">Zum Einloggen</a>
  </div>
</section>
