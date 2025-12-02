<script lang="ts">
  import { flip } from "svelte/animate";
  import Toast from "./toast.svelte";
  import { toastList, type ToastModel } from "./toast_store.svelte.ts";
  import { receive, send } from "./transition.ts";
  let toast = $state({ w: 0, h: 0 });
  let browser = $state({ w: 0, h: 0 });

  let listState = $state<ToastModel[]>();

  toastList.subscribe((value) => {
    listState = value.list;
  });
</script>

<div
  class="toast-list"
  bind:clientWidth={toast.w}
  bind:clientHeight={toast.h}
  style="
      position: absolute;
      left: {browser.w / 2 - toast.w / 2}px;
    "
>
  {#each listState as toast (toast.id)}
    <div
      in:receive={{ key: toast.id }}
      out:send={{ key: toast.id }}
      animate:flip={{ duration: 250 }}
    >
      <Toast toastModel={toast} />
    </div>
  {/each}
</div>

<svelte:window bind:innerHeight={browser.h} bind:innerWidth={browser.w} />

<style>
  .toast-list {
    position: absolute;
    display: block;
    width: 25%;
    top: 10px;
  }
</style>

