<script lang="ts">
  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";
  import DiffList from "$lib/component/diff_list.svelte";
  import { multiverseShortName } from "$lib/util.js";

  let { data } = $props();
</script>

<h1>시험 결과</h1>
{#await data.submitNdraft}
  <CircularLoadingIndicator />
{:then { data: sndData, error: sndError }}
  {#if !sndError}
    <h2>제출 목록</h2>
    <div class="snd-list-container">
      {#each sndData.filter((e: any) => e.content != null && e.content.length > 0) as snd}
        <div
          class={[
            "snd-container",
            snd.eval == 2 && "incorrect",
            snd.eval == 0 && "unevaluated",
          ]}
        >
          <div class="snd-address">
            {#if data.examData?.showAddress}
              {multiverseShortName({
                id: -1,
                book: snd.book,
                chapter: snd.chapter,
                verses: snd.verses,
              })}
            {:else}
              {snd.address}
            {/if}
          </div>
          {#if snd.submitCount > 0}
            <DiffList diffs={snd.res ?? []} />
          {:else}
            {snd.content}
          {/if}
          <!-- <div class="snd-res"> -->
          <!--     {#each snd.res.map((a: ChangeObject<string>) => { -->
          <!--       let isDontCare = a.value.match(/^[\s,.]+$/); -->
          <!--       let type = isDontCare ? "correct" : a.added ? "missing" : a.removed ? "incorrect" : "correct"; -->
          <!--       return { text: a.value, color: type }; -->
          <!--     }) as token} -->
          <!--       <span class={["snd-res-token", token.color]}> -->
          <!--         {token.text} -->
          <!--       </span> -->
          <!--     {/each} -->
          <!-- </div> -->
        </div>
      {/each}
    </div>
    <h2>미제출 구절</h2>
    <div class="snd-list-container">
      {#each sndData.filter((e: any) => e.content == null) as snd}
        <div class="snd-container">
          <div class="snd-address">
            {multiverseShortName({
              id: snd.mid,
              book: snd.book,
              chapter: snd.chapter,
              verses: snd.verses,
            })}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    {sndError.cause}
    {sndError.message}
  {/if}
{/await}

<style>
  .snd-list-container {
    width: 75%;
    margin-left: 50px;
  }

  .snd-container {
    padding: 12px 5px 12px 5px;
    border-bottom: solid 1px var(--white-1);
    color: var(--white-1);
  }

  .snd-container:last-child {
    border-bottom: none;
  }

  .snd-address {
    font-weight: bold;
  }

  .incorrect .snd-address {
    color: var(--red-1);
  }

  .unevaluated .snd-address {
    color: #888;
  }

  h1,
  h2 {
    color: white;
  }

  h2 {
    margin-left: 25px;
  }
</style>
