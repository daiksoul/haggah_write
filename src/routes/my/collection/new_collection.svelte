<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade, fly } from "svelte/transition";

  type RecallFunction = () => void;

  interface Prop {
    showPopUp: boolean,
    name: string,
    description: string,
    recallFunction: RecallFunction,
  }

  let { 
    showPopUp = $bindable<boolean>(), 
    name = $bindable<string>(), 
    description = $bindable<string>(),
    recallFunction
  } : Prop = $props();
  
  let overlay : HTMLDivElement | null = $state(null);

  function onPageClick(e: MouseEvent) {
    if(e.target != overlay) return;
    showPopUp = false;
  }
</script>


{#if showPopUp}
<div class="overlay" transition:fade={{ duration: 50 }} bind:this={overlay}>
  <div class="container" in:fly={{ y: 200, duration: 100, delay: 50 }} out:fly={{y: 200, duration: 100}}>
    <div class="title">보관함 만들기</div>
    <div class="sizedbox" style="height: 10px"></div>
    
    <div class="form-label">보관함 이름</div>
    <div class="sizedbox" style="height: 5px"></div>
    <input class="text-input" name="name" bind:value={name}>
    <div class="form-label">설명</div>
    <div class="sizedbox" style="height: 5px"></div>
    <input class="text-input" name="description" bind:value={description}>
    
    <div class="button-container">
      <button 
        class="button-input" 
        onclick={(_) => {
          showPopUp = false;
        }}>취소</button>
      <button 
        class="button-input"
        onclick={(_) => {
          recallFunction();
        }}>확인</button>
    </div>
  </div>
</div>
{/if}

<style>
  .title {
    font-size: 1.2em;
    /* font-weight: bold; */
  }

  .text-input {
    font-size: 1em;
    background-color: var(--black-3);
  }

  .button-input {
    font-size: 1em;
    /* display: inline-block; */
    width: 80px;

    margin: 0 5px 0 5px;
  }

  .button-container {
    position: fixed;
    bottom: 15px;
    width: 25%;
    left: 50%;

    align-items: center;

    display: flex;
    transform: translate(-50%);
  }

  .container {
    width: 50%;
    aspect-ratio: 4/3;
    
    border-radius: 4px;
    border: solid 1px #444;
    background-color: var(--black-2);

    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    color: var(--white-1);

    padding: 15px 30px 0 30px;
  }
</style>

<svelte:window onclick={onPageClick}/>