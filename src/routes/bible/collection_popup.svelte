<script lang="ts">
  import { fly } from "svelte/transition";

  type CollectionCallbackFunction = (collection: Collection) => void;

  interface Prop {
    collections: Collection[];
    callback: CollectionCallbackFunction;
    showPopup: boolean;
  }

  let {
    collections = $bindable<Collection[]>(),
    callback = $bindable<CollectionCallbackFunction>(),
    showPopup = $bindable<boolean>(),
  }: Prop = $props();

  let popup = $state({ w: 0, h: 0 });
  let browser = $state({ w: 0, h: 0 });

  let overlay: HTMLDivElement | null = $state(null);

  function onPageClick(e: MouseEvent) {
    if (e.target != overlay) return;
    showPopup = false;

    // if(e.target instanceof HTMLElement) {
    //   // console.log(e.target.classList);
    // }

    // if(!(showPopup &&
    // e.clientX > browser.w/2 - popup.w/2&&
    // e.clientX < browser.w/2 + popup.w/2&&
    // e.clientY > browser.h/2 - popup.h/2&&
    // e.clientY < browser.h/2 + popup.h/2) &&
    // !(e.target instanceof HTMLElement
    //   && e.target.classList.contains("custom-context-menu"))) {

    // }
  }
</script>

{#if showPopup}
  <div class="overlay" bind:this={overlay}>
    <div
      class="container"
      bind:clientWidth={popup.w}
      bind:clientHeight={popup.h}
      transition:fly={{ y: 100, duration: 100 }}
      style="
      width: 25%;
      height: 25%;
      left: {browser.w / 2 - popup.w / 2}px;
      top: {browser.h / 2 - popup.h / 2}px;
      position: absolute;
    "
    >
      <div class="title">모음집 선택</div>
      <div class="sizedbox" style="height: 10px"></div>
      <div class="scroll">
        {#each collections as collect}
          <button
            class="single-collection"
            onclick={(e) => {
              callback(collect);
            }}
          >
            {collect.name}
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<svelte:window
  bind:innerHeight={browser.h}
  bind:innerWidth={browser.w}
  on:click={onPageClick}
/>

<style>
  .overlay {
    background-color: #0008;
    inset: 0;
    position: fixed;
  }

  .container {
    padding: 10px;
    background-color: var(--black-2);
    border: 1px solid var(--black-3);
    border-radius: 4px;

    color: var(--white-1);
  }

  .title {
    font-size: 1.2em;
  }

  .scroll {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .single-collection {
    border: none;
    padding: 10px 15px 10px 15px;
    margin: none;
    background-color: transparent;
    border-radius: 0;
    display: block;
    width: 100%;
    text-align: start;
    color: var(--white-1);
    font-size: 1em;
  }

  .single-collection:hover {
    background-color: #fff2;
  }
</style>

