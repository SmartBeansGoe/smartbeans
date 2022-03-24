<script lang="ts">
  import { session } from '$app/stores';

  import type { Asset } from '$lib/utils/types/assets';
  import type { Avatar } from '$lib/utils/types/avatar';

  import Mannequin from './Mannequin.svelte';
  export let assets: Asset[];
  export let avatar: Avatar;

  let groups = [
    { name: 'Oberteile', type: 'shirt', assets: assets.filter((asset) => asset.type === 'shirt') },
    {
      name: 'Hosen/Röcke',
      type: 'pants',
      assets: assets.filter((asset) => asset.type === 'pants')
    },
    { name: 'Kopfbedeckung', type: 'hat', assets: assets.filter((asset) => asset.type === 'hat') }
  ];

  const changeAvatarAsset = async (asset: Asset, type = null) => {
    let body = {
      ...avatar
    };
    body[asset ? asset.type : type] = asset ? asset.id : null;
    const avatarResponse = await fetch('/api/user/avatar', {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
    avatar = await avatarResponse.json();
    $session.user.avatar = avatar;
  };

  let active = 'shirt';
  $: selected = avatar[active];
</script>

<div class="tabs tabs-boxed w-full -mb-2">
  {#each groups as { name, type }}
    <a class:tab-active={active === type} class="tab grow" on:click={() => (active = type)}
      >{name}</a
    >
  {/each}
</div>

{#each groups as { type, assets }}
  <section class="border-base-300 overflow-y-auto" class:hidden={active !== type}>
    {#each assets as asset}
      <Mannequin
        {asset}
        selected={selected === asset.id}
        on:click={async () => {
          if (selected === asset.id) {
            await changeAvatarAsset(null, asset.type);
          } else {
            await changeAvatarAsset(asset);
          }
        }}
      />
    {/each}
  </section>
{/each}
