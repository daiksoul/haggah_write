<script lang="ts">
  import { toastStore, type ToastModel } from "./toast_store.svelte";
  import Check from "./icon/check.svelte";
  import Warning from "./icon/warning.svelte";
  import Info from "./icon/info.svelte";
  import Cross from "./icon/cross.svelte";
  import '$lib/util/array';

  interface Prop {
    toastModel: ToastModel
  }

  let { toastModel }: Prop = $props();

  let color = $state('');
  let icon: Element | unknown = $state();

  switch(toastModel.type) {
    case "success":
      color = '#080';
      break;
    case "error":
      color = '#800';
      break;
    case "info":
    default:
      color = '#444';
      break;
  }

</script>

<div class="container"
  style="background-color: {color};"
>
  <div class="icon">
    {#if toastModel.type === 'success'}
      <Check color='white' width='1.2em' height='1.2em'/>
    {:else if toastModel.type === 'error'}
      <Warning color='white' width='1.2em' height='1.2em'/>
    {:else}
      <Info color='white' width='1.2em' height='1.2em'/>
    {/if}
  </div>
  <div class="message">
    {toastModel.message}
  </div>

  {#if toastModel.dismissible}  
    <button class="close" onclick={(e) => {
      toastStore.list.remove(toastModel);
    }}>
      <Cross color='white' width='24px' height='24px'/>
    </button>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    padding: 15px;
    margin: 5px 0 5px 0;
    border-radius: 4px;
    color: var(--white-1);
    font-size: 1.2em;
    display: table;
    /* height: 26px; */
  }

  .container * {
    vertical-align: middle;
  }

  .container .icon {
    /* width: 36px; */
    /* height: 36px; */
    float: left;
  }

  .container .message {
    /* line-height: 36px; */
    float: left;
    margin-left: 10px;
  }

  .container .close {
    width: 24px;
    height: 24px;
    float: right;
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
  }
</style>