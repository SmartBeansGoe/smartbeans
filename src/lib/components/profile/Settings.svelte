<script lang="ts">
  import { session } from '$app/stores';

  import type { UserSession } from '$lib/utils/types/user';
  import Icon from '@iconify/svelte';
  import { toast } from '@zerodevx/svelte-toast';
  import Card from '../utils/Card.svelte';
  import ChangePasswordModal from './ChangePasswordModal.svelte';
  import CreatePasswordModal from './CreatePasswordModal.svelte';
  import DeletePasswordModal from './DeletePasswordModal.svelte';

  export let user: UserSession;

  let modalDeletePasswordOpen = false;
  let modalCreatePasswordOpen = false;
  let modalChangePasswordOpen = false;

  let passwordChecked = user.passwordSet;
  let ltiChecked = user.ltiEnabled;

  let displayName = user.displayName;
  let changeDisplayName = false;

  const onChangeDisplayName = async (name: string) => {
    const request = await fetch(`/api/user/configure/displayName/${name}`, { method: 'POST' });
    if (!request.ok) {
      toast.push(`${request.status} ${request.statusText}`, {
        theme: {
          '--toastBackground': '#f87272',
          '--toastBarBackground': '#db0a0a'
        }
      });
    } else {
      $session.user.displayName = name;
    }
  };
</script>

<Card title="Einstellungen">
  <div class="form-control">
    <div class="input-group max-w-md">
      <input
        type="text"
        disabled={!changeDisplayName}
        bind:value={displayName}
        class="input input-bordered w-full input-primary"
        on:keypress={async (event) => {
          if (
            (displayName.length < 3 || displayName.length > 16) &&
            changeDisplayName &&
            event.key === 'Enter'
          ) {
            toast.push('Dein Anzeigename muss zwischen 3 und 16 Zeichen liegen.');
          } else if (changeDisplayName && event.key === 'Enter') {
            changeDisplayName = false;
            await onChangeDisplayName(displayName);
          }
        }}
      />

      <label
        class:btn-disabled={(displayName.length < 3 || displayName.length > 16) &&
          changeDisplayName}
        class:btn-primary={!(
          (displayName.length < 3 || displayName.length > 16) &&
          changeDisplayName
        )}
        class="btn btn-square swap swap-rotate"
        role="button"
      >
        <input
          bind:checked={changeDisplayName}
          type="checkbox"
          on:change={async () => {
            if (!changeDisplayName) {
              await onChangeDisplayName(displayName);
            }
          }}
        />
        <Icon class="swap-off" icon="mdi:pencil" width="24" height="24" />
        <Icon class="swap-on" icon="mdi:check-thick" width="24" height="24" />
      </label>
    </div>
  </div>

  <div class="form-control">
    <label class="label cursor-pointer max-w-md">
      <span class="label-text">Passwort-Login</span>
      <input
        class:tooltip={!ltiChecked}
        class="toggle toggle-primary"
        disabled={!ltiChecked}
        data-tip="Passwort-Login kann nicht ausgeschaltet werden, da kein LTI-Login eingerichtet ist."
        type="checkbox"
        bind:checked={passwordChecked}
        on:change={() => {
          if (passwordChecked) modalCreatePasswordOpen = true;
          else modalDeletePasswordOpen = true;
        }}
      />
    </label>
    {#if passwordChecked}
      <button class="btn btn-primary max-w-md" on:click={() => (modalChangePasswordOpen = true)}>
        Passwort ändern
      </button>
    {/if}
  </div>
</Card>

<DeletePasswordModal
  bind:modalOpen={modalDeletePasswordOpen}
  on:cancel={() => (passwordChecked = true)}
/>

<CreatePasswordModal
  bind:modalOpen={modalCreatePasswordOpen}
  on:cancel={() => (passwordChecked = false)}
/>

<ChangePasswordModal bind:modalOpen={modalChangePasswordOpen} />
