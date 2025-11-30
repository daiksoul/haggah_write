<script lang="ts">
  import { flip } from "svelte/animate";
  import Toast from "./toast.svelte";
  import { toastStore } from "./toast_store.svelte.ts";
  import { fly } from "svelte/transition";
  import { receive, send } from "./transition.ts";
  let toast = $state({w: 0, h: 0});
  let browser = $state({w: 0, h: 0});
</script>

  <div class="toast-list"
    bind:clientWidth={toast.w}
    bind:clientHeight={toast.h}
    style= "
      position: absolute;
      left: {browser.w/2 - toast.w/2}px;
    "
  >
    {#each toastStore.list as toast (toast.id)}
      <div 
        in:receive={{ key: toast.id }} 
        out:send={{key: toast.id}} 
        animate:flip={{duration:250}}
      >
        <Toast toastModel={toast}/>
      </div>
    {/each}
  </div>

<svelte:window bind:innerHeight={browser.h} bind:innerWidth={browser.w}/>

<style>
  .toast-list {
    position: absolute;
    display: block;
    width: 25%;
    top: 10px;
  }
</style>