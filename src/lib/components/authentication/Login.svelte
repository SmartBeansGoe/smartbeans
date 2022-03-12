<script lang="ts">
  export let courses: string[];

  let password: string;
  let username: string;
  let course: string;

  let error: string;

  const onLogin = () => {
    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
        course: course
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      if (res.ok) location.reload();
      else error = await res.text();
    });
  };

  const onInput = () => {
    error = undefined;
  };

  const onKeypress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.ctrlKey && !buttonDisabled) {
      onLogin();
    }
  };

  $: buttonDisabled =
    password === undefined ||
    username === undefined ||
    course === undefined ||
    password === '' ||
    username === '' ||
    course === '';
</script>

<section on:keypress={onKeypress}>
  <h2 class="w-full text-center text-3xl font-bold">Login</h2>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Username</span>
    </p>
    <input
      bind:value={username}
      type="text"
      placeholder="Username"
      class="input input-bordered"
      on:input={onInput}
    />
  </div>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Passwort</span>
    </p>
    <input
      bind:value={password}
      type="password"
      placeholder="Passwort"
      class="input input-bordered"
      on:change={onInput}
    />
  </div>
  <div class="form-control">
    <p class="label">
      <span class="label-text">Kurs</span>
    </p>
    <select bind:value={course} on:change={onInput} class="select select-bordered w-full max-w-xs">
      {#each courses as name}
        <option>{name}</option>
      {/each}
    </select>
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
      on:click={onLogin}
      class="btn"
      class:btn-primary={!buttonDisabled}
      class:btn-active={buttonDisabled}
      class:btn-ghost={buttonDisabled}
      class:btn-disabled={buttonDisabled}>Einloggen</button
    >
  </div>
  <div class="w-full text-center">
    <a class="link" href="/auth/register">Zum Registrieren</a>
  </div>
</section>
