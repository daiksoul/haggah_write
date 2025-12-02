<script lang="ts">
  import { enhance } from "$app/forms";

  let { data, form } = $props();

  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";
  import Add from "$lib/component/icon/add.svelte";
  import { showToast } from "$lib/component/toast_store.svelte.js";
  import Collection from "./collection.svelte";
  import NewCollection from "./new_collection.svelte";

  // let lst = [
  //   {
  //     id: 0,
  //     created_at: new Date(),
  //     name: "B2BJ",
  //     description: "비투비제이이이",
  //     owner_id: 22,
  //   },
  //   {
  //     id: 2,
  //     created_at: new Date(),
  //     name: "B2BJ",
  //     description: "비투비제이이이",
  //     owner_id: 22,
  //   },
  // ];

  let showPopUp = $state(false);

  let newName = $state<string>("");
  let newDescription = $state<string>("");

  let createForm: HTMLFormElement | null = $state(null);
</script>

<div class="body">
  <h1>말씀 모음집</h1>

  {#await data.collections}
    <CircularLoadingIndicator />
  {:then { data: collections, error: e }}
    <div class="collection-container">
      {#if !e}
        {#each collections as collection}
          <Collection data={collection}></Collection>
        {/each}
      {:else}
        오류가 발생했습니다 <br /> {e.message}
      {/if}
    </div>
  {/await}
</div>

<div class="floating-button">
  <button
    onclick={(_) => {
      showPopUp = !showPopUp;
    }}
  >
    <Add color="white" width="40px" height="40px" />
  </button>
</div>

<NewCollection
  bind:showPopUp
  bind:name={newName}
  bind:description={newDescription}
  recallFunction={() => {
    console.log("is This working?");
    createForm?.requestSubmit();
  }}
/>

<form
  action="?/create"
  method="POST"
  bind:this={createForm}
  use:enhance={(e) => {
    e.formData.set("name", newName);
    e.formData.set("description", newDescription);

    return async ({ update }) => {
      await update({ reset: false });

      switch (form?.status) {
        case "error":
          showToast(form.message!, form.status, true);
          break;
        case "success":
          showToast(form.message!, form.status, true);
          showPopUp = false;
          break;
        default:
          break;
      }
    };
  }}
>
  <!-- <input type="hidden" name="name" bind:value={newName}> -->
  <!-- <input type="hidden" name="description" bind:value={newDescription}> -->
</form>

<style>
  .body {
    color: var(--white-1);
    padding: 8px;
  }

  .collection-container {
    display: flex;
    flex-wrap: wrap;
  }

  .floating-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
    border-radius: 100%;
    border: 1px solid var(--black-3);
    padding: 2px;
  }

  .floating-button button {
    background-color: transparent;
    color: var(--white-1);
    border: none;
  }

  .floating-button button:hover {
    background-color: #333c;
    border-radius: 100%;
  }
</style>

