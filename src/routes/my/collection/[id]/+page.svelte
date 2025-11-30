<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";
  import Edit from "$lib/component/icon/edit.svelte";
  import Remove from "$lib/component/icon/remove.svelte";
  import Save from "$lib/component/icon/save.svelte";
  import ToastList from "$lib/component/toast_list.svelte";
  import { showToast } from "$lib/component/toast_store.svelte.js";
  import { receive, send } from "$lib/component/transition";
  import { multiverseShortName } from "$lib/util.js";
  import { flip } from "svelte/animate";

  let { data, form, params } = $props();

  let deleteForm: HTMLFormElement | null = $state(null);
  var deleteId: number = $state(-1);

  let editNameForm: HTMLFormElement | null = $state(null);
  let editMode: boolean = $state(false);
  let editNameString: string = $state("");

  function focusFunc(e: HTMLElement) {
    e.focus();
  }

  let formWidth = $state(0);
</script>

<div class="contain-all">
  <div class="middle-column">
    {#await data.collection}
      <CircularLoadingIndicator />
    {:then { data: collectionData, error }}
      {#if !error}
        {#if !editMode}
          <h1>
            {collectionData.name}
            <button
              class="edit-name-button"
              onclick={(_) => {
                editNameString = collectionData.name;
                editMode = true;
              }}
            >
              <Edit color="white" width="1.5em" height="1.5em" />
            </button>
          </h1>
          <button
            class="button-input"
            onclick={(_) => {
              goto(`/exam/setting?cid=${params.id}`);
            }}>시험보기</button
          >
        {:else}
          <input
            type="text"
            class="edit-name-input"
            bind:value={editNameString}
            style:width={formWidth + "px"}
            use:focusFunc
          />
          <button
            class="edit-name-button"
            onclick={(_) => {
              if (collectionData.name != editNameString) {
                editNameForm?.requestSubmit();
              }
              editMode = false;
            }}
          >
            <Save color="white" width="1.5em" height="1.5em" />
          </button>
        {/if}
      {:else}
        오류가 발생했습니다 <br /> {error.message}
      {/if}
    {/await}

    {#await data.mulitverse}
      <CircularLoadingIndicator />
    {:then { data: vData, error: vError }}
      {#if !vError}
        {#each vData as pVerse (pVerse.id)}
          <div
            class="multiverse-container"
            in:receive={{ key: pVerse.id }}
            out:send={{ key: pVerse.id }}
            animate:flip={{ duration: 250 }}
          >
            <div class="main-part">
              <p class="verse-name">{multiverseShortName(pVerse)}</p>
              <p>{pVerse.content}</p>
            </div>
            <div class="util-part">
              <button
                onclick={() => {
                  deleteId = pVerse.id;
                  deleteForm?.requestSubmit();
                }}
              >
                <Remove color="white" width="1em" height="1em" />
              </button>
            </div>
          </div>
        {/each}
      {:else}
        오류가 발생했습니다 <br /> {vError.message}
      {/if}
    {/await}
  </div>
</div>

<div class="displace edit-name-input" bind:clientWidth={formWidth}>
  {editNameString}
</div>

<form
  action="?/remove"
  method="POST"
  bind:this={deleteForm}
  use:enhance={(e) => {
    e.formData.set("id", deleteId.toString());

    return async ({ update }) => {
      await update({ reset: false });

      switch (form?.status) {
        case "error":
          showToast(form.message!, form.status, true);
          break;
        case "success":
          showToast("구절을 삭제하였습니다", "success", true);
          break;
        default:
          break;
      }
    };
  }}
></form>
<form
  action="?/editCollection"
  method="POST"
  bind:this={editNameForm}
  use:enhance={(e) => {
    e.formData.set("new_name", editNameString);

    return async ({ update }) => {
      await update({ reset: true });

      switch (form?.status) {
        case "error":
          showToast(form.message!, form.status, true);
          break;
        case "success":
          showToast("이름을 수정하였습니다", "success", true);
          break;
        default:
          break;
      }
    };
  }}
></form>

<ToastList />

<style>
  .contain-all {
    width: 100%;
    color: var(--white-1);
    background-color: var(--black-2);
  }

  .middle-column {
    width: 75%;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .multiverse-container {
    border: 2px solid var(--black-4);
    border-radius: 4px;
    padding: 10px 20px 10px 20px;

    color: var(--white-1);

    margin: 10px 0px 10px 0px;

    word-break: keep-all;
    word-wrap: normal;

    display: flex;
  }

  .multiverse-container p {
    margin: 0;
  }

  .multiverse-container .main-part {
    width: calc(100% - 40px);
    position: relative;
  }

  .multiverse-container .util-part {
    width: 50px;
    right: 0;
    position: relative;
    height: 100%;
  }

  :global(.multiverse-container .util-part svg) {
    vertical-align: middle;
  }

  .multiverse-container .verse-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 5px;
  }

  .util-part button {
    background-color: transparent;
    padding: 0;
    border: none;
  }

  .edit-name-button {
    background-color: transparent;
    padding: 0;
    border: none;
  }

  .displace.edit-name-input {
    position: fixed;
    bottom: -999px;
  }

  .edit-name-input {
    display: inline-block;
    font-size: 2em;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
    /*width: 100px;*/
    padding: 0;

    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: solid 1px var(--white-1);
    color: white;
    background-color: transparent;
  }

  .edit-name-input:focus {
    outline: none;
  }
</style>
