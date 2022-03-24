<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let modalOpen: boolean;

  let oldPassword: string = '';
  let password: string = '';
  let passwordRepeat: string = '';

  const onSubmitPassword = async (oldPassword: string, newPassword: string) => {
    const response = await fetch('/api/user/configure/password', {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword, oldPassword: oldPassword })
    });
    if (!response.ok) {
      toast.push(`${response.status} ${await response.text()}`, {
        theme: {
          '--toastBackground': '#f87272',
          '--toastBarBackground': '#db0a0a'
        }
      });
    } else {
      toast.push(`Passwort geändert!`, {
        theme: {
          '--toastBackground': '#10b981',
          '--toastBarBackground': '#059669'
        }
      });
      oldPassword = '';
      password = '';
      passwordRepeat = '';
      modalOpen = false;
    }
  };
</script>

<section class:modal-open={modalOpen} class="modal cursor-pointer">
  <arcticle class="modal-box card w-1/2 bg-base text-base-content">
    <div class="card-body items-center text-center">
      <h2 class="card-title">Passwort ändern!</h2>
      <div class="form-control">
        <p class="label">
          <span class="label-text">Altes Passwort</span>
        </p>
        <input
          type="password"
          bind:value={oldPassword}
          placeholder="Passwort"
          class="input input-bordered"
        />
      </div>

      <div class="form-control">
        <p class="label">
          <span class="label-text">Neues Passwort</span>
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
          <span class="label-text">Neues Passwort wiederholen</span>
        </p>
        <input
          type="password"
          bind:value={passwordRepeat}
          placeholder="Passwort"
          class:input-error={password !== passwordRepeat}
          class="input input-bordered"
        />
      </div>

      <div class="card-actions justify-end">
        <button
          disabled={(oldPassword === '' || oldPassword === undefined) &&
            (password === '' || password === undefined || password !== passwordRepeat)}
          class="btn btn-success"
          on:click={async () => {
            await onSubmitPassword(oldPassword, password);
          }}>Ändern</button
        >
        <button
          class="btn"
          on:click={() => {
            oldPassword = '';
            password = '';
            passwordRepeat = '';
            modalOpen = false;
            dispatch('cancel');
          }}>Abbrechen</button
        >
      </div>
    </div>
  </arcticle>
</section>
