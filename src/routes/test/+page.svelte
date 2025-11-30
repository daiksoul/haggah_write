<script lang="ts">
  let { form } = $props(); 

  import { type ChangeObject } from "diff";

  import BibleExplorer from "$lib/component/bible_explorer.svelte";
  import { enhance } from "$app/forms";

  let text = $state("");
  let diffs = $state<ChangeObject<string>[]>([]);

  let res = $derived(
    diffs.map((a) => {
      let isDontCare = a.value.match(/^[\s,.]+$/);
      let type = a.added ? "missing" : a.removed ? "incorrect" : "correct";
      let dontCareRender = type !== "incorrect" && isDontCare;

      return {
        text: a.value, 
        color: dontCareRender ? "correct" : type, 
        render: dontCareRender || !isDontCare
      }
    })
  );

  let book = $state<number>(0);
  let chapter = $state<number>(1);
  let verse = $state<number>(1);


</script>

<div class="contain-everything">
  <div class="explorer-container align-mid" style="width: 30%;">
    <BibleExplorer 
      bind:book={book} 
      bind:chapter={chapter} 
      bind:verse={verse}></BibleExplorer>
  </div>

  <div class="sizedbox" style="height: 25px;"> </div>
  
  <textarea class="input align-mid" rows="5" bind:value={text} onchange={() => {}}> </textarea>
  <br/>
  <div class="sizedbox" style="height: 25px;"> </div>
  <form method="POST" action="?/submit" use:enhance={() => {
    return async ({update}) => {
      await update();

      book = form?.query?.book ?? 0;
      chapter = form?.query?.chapter ?? 1;
      verse = form?.query?.verse ?? 1;
      diffs = form?.result ?? [];
    }
  }}>
    <input type="hidden" name="book" bind:value={book}/>
    <input type="hidden" name="chapter" bind:value={chapter}/>
    <input type="hidden" name="verse" bind:value={verse}/>
    <input type="hidden" name="content" bind:value={text}/>
    <button class="submitter align-mid">
      정답 확인
    </button>
  </form>

  <div class="sizedbox" style="height: 25px;"> </div>

  <div class="output-container align-mid">
    {#each res as token}
      {#if token.render}
          <span class="{token.color} output"> {token.text} </span>
      {/if}
    {/each}
  </div>
</div>

<style>
  * {
    font-family: 'Pretendard-Regular';
  }

  .contain-everything {
    position: absolute;
    left: 50%;
    transform: translate(-50%,0);
    top: 30%;

    width: 100%;

    align-items: center;
  }

  .align-mid {
    position: relative;
    left: 50%;
    transform: translate(-50%,0);
  }

  .explorer-container {
    z-index: 1;
  }

  .input{
    text-align: center;
    font-size: 30px;

    word-break: keep-all;
    word-wrap: normal;
    
    /* 
    top: 50%; */
    width: 70%;
    
    color: var(--white-1);
    background-color: #1E1E1Eff;
    border-radius: 0.4em;
    padding: 0.4em;
    border: none;
    outline: none;

    resize: none;
  }

  .input:focus {
    outline: none;
  }

  .submitter {
    position: relative;

    border: none;
    border-radius: 4px;
    padding: 4px 12px 4px 12px;

    font-size: 20px;

    background-color: var(--black-3);

    color: var(--white-1);
  }

  .output-container {
    /* bottom: 20%; */
    width: 70%;
    text-align: center;

    word-break: keep-all;
    word-wrap: normal;
  }

  .output {
    font-size: 25px;
    color: var(--white-1);
    line-height: 40px;
  }

  .incorrect {
    background-color: #ff000022;
    border-radius: 4px;
    padding: 4px;
    /* text-decoration: underline;
    text-underline-offset: -.4em;
    text-decoration-thickness: .1em; */
    /* text-decoration-color: #FF0000FF; */
    /* text-decoration-line: underline; */
    color: #fff4;
  }

  .missing {
    background-color: #00ff0022;
    border-radius: 4px;
    padding: 4px;
  }

  .correct {
    color: var(--white-1);
  }
</style>