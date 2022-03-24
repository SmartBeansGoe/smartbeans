<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let modalOpen: boolean;

  let deletePassword = false;
  let password: string = '';

  const onDeletePassword = async (password: string) => {
    const response = await fetch('/api/user/configure/password', {
      method: 'DELETE',
      body: JSON.stringify({ password: password })
    });
    if (!response.ok) {
      toast.push(`${response.status} ${await response.text()}`, {
        theme: {
          '--toastBackground': '#f87272',
          '--toastBarBackground': '#db0a0a'
        }
      });
    } else {
      toast.push(`Passwort gelöscht!`, {
        theme: {
          '--toastBackground': '#10b981',
          '--toastBarBackground': '#059669'
        }
      });

      password = '';
      deletePassword = true;
      modalOpen = false;
    }
  };
</script>

<section class:modal-open={modalOpen} class="modal cursor-pointer">
  {#if !deletePassword}
    <arcticle class="modal-box card w-1/2 bg-base text-base-content">
      <div class="card-body items-center text-center">
        <h2 class="card-title">Sie löschen gerade ihr Passwort!</h2>
        <p>
          Wollen Sie wirklich ihr Passwort löschen? Sie können dann nur noch über die
          LTI-Schnittstelle über StudIP auf ihren Account zu greifen. Oder müssen ein neues Passwort
          einrichten.
        </p>
        <div class="card-actions justify-end">
          <button class="btn btn-error" on:click={() => (deletePassword = true)}
            >Ja, löschen!</button
          >
          <button
            class="btn btn-success"
            on:click={() => {
              modalOpen = false;
              dispatch('cancel');
            }}>Nein, abbrechen!</button
          >
        </div>
      </div>
    </arcticle>
  {:else}
    <arcticle class="modal-box card w-1/2 bg-base text-base-content">
      <div class="card-body items-center text-center">
        <h2 class="card-title">Passwort löschen!</h2>
        <p>Bestätigen Sie die Löschung mit ihrem Passwort:</p>
        <div class="form-control">
          <input
            type="password"
            bind:value={password}
            placeholder="Passwort"
            class="input input-bordered"
          />
        </div>

        <div class="card-actions justify-end">
          <button
            class="btn btn-error"
            on:click={async () => {
              await onDeletePassword(password);
            }}>Jetzt, löschen!</button
          >
          <button
            class="btn btn-success"
            on:click={() => {
              password = '';
              modalOpen = false;
              dispatch('cancel');
            }}>Abbrechen</button
          >
        </div>
      </div>
    </arcticle>
  {/if}
</section>
