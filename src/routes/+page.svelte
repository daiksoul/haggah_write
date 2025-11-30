<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";
  import Switch from "$lib/component/switch.svelte";
  import { multiverseShortName } from "$lib/util";
  import { redirect } from "@sveltejs/kit";

  let { data } = $props();

  let versePromise = data.verse;
</script>

<div class="mid">
  <div class="container">
    <div class="random-verse-container">
      <div class="random-verse-title">무작위 말씀</div>
      {#await data.verse}
        <div class="load-this"><CircularLoadingIndicator /></div>
      {:then { data: verses, error }}
        {#if !error}
          {#each verses as v}
            <div class="random-verse">{v.content}</div>
            <div class="random-verse-address">
              {multiverseShortName({
                id: -1,
                book: (v.book as number) - 1,
                chapter: v.chapter as number,
                verses: [v.verse],
              })}
            </div>
          {/each}
        {:else}
          WHAAAA?
        {/if}
      {/await}
    </div>
    <div class="nav-container">
      <button
        onclick={(_) => {
          goto("/bible");
        }}>성경</button
      >
      {#if data.isAuth}
        <button
          onclick={(_) => {
            goto("/my");
          }}>개인 페이지</button
        >
      {:else}
        <button
          onclick={(_) => {
            goto("/login");
          }}>로그인</button
        ><button
          onclick={(_) => {
            goto("/signup");
          }}>회원가입</button
        >
      {/if}
    </div>
  </div>
</div>

<style>
  * {
    color: white;
  }

  .mid {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }

  /* .random-verse-container { */
  /* } */

  .random-verse-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .load-this {
    text-align: center;
  }

  .random-verse-container {
    position: relative;
    width: 800px;

    align-items: center;

    display: flex;
    flex-direction: column;
  }

  .random-verse {
    position: relative;
    font-size: 16px;
    text-align: center;

    word-break: keep-all;
    word-wrap: normal;
  }

  .random-verse-address {
    text-align: center;
  }

  .nav-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .nav-container button {
    width: 100px;
    padding: 8px 8px 8px 8px;
    background-color: var(--black-3);
    border: none;
    border-radius: 4px;
    margin: 0 5px;
    font-size: 16px;
  }
</style>
