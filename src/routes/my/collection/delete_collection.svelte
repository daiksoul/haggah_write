<script lang="ts">
  import { fade, fly } from "svelte/transition";

  type RecallFunction = () => void;

  interface Prop {
    showPopUp: boolean;
    recallFunction: RecallFunction;
  }

  let { showPopUp = $bindable<boolean>(), recallFunction }: Prop = $props();

  let overlay: HTMLDivElement | null = $state(null);

  function onPageClick(e: MouseEvent) {
    if (e.target != overlay) return;
    showPopUp = false;
  }
</script>

{#if showPopUp}
  <div class="overlay" transition:fade={{ duration: 50 }} bind:this={overlay}>
    <div
      class="container"
      in:fly={{ y: 200, duration: 100, delay: 50 }}
      out:fly={{ y: 500, duration: 100 }}
    >
      <div class="title">확인</div>
      <div class="description">정말로 이 보관함을 삭제하시겠습니까?</div>
      <div class="button-container">
        <button
          class="button-input mini"
          onclick={() => {
            recallFunction();
          }}>확인</button
        >
        <button
          class="button-input mini"
          onclick={() => {
            showPopUp = false;
          }}>취소</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .title {
    font-size: 1.3em;
  }

  .button-input.mini {
    display: inline-block;
  }

  .container {
    border-radius: 4px;
    border: solid 1px #444;
    background-color: var(--black-2);

    padding: 15px 30px 15px 30px;
    width: fit-content;

    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    color: var(--white-1);
  }
</style>
