<script lang="ts">
  import * as data from '$lib/data.ts';
  import SvelteSelect from 'svelte-select';

  let { book = $bindable(), chapter = $bindable(), verse = $bindable(1), noVerse = false} = $props();

  const indexes:number[] = [...Array(176)].map((_,x) => x+1);

  let bookChapterIdx = $derived(data.shortNames[book]+"-"+chapter);

  let chapterArrays = $derived(indexes.slice(0, data.maxChapters[book]));
  let verseArrays = $derived(indexes.slice(0,data.maxVerses.get(bookChapterIdx)));
</script>

<div class="container">
  <div>
    
  </div>
  <SvelteSelect 
    items={data.fullNames.map((x,i)=> { return {value: i, label: x}})} 
    bind:value={
      () => { return { label: data.fullNames[book], value:book } },
      (v) => book = v.value
    }
    on:change={() => {
      if(chapter > data.maxChapters[book]) {
        chapter = data.maxChapters[book];
      }

      if(verse > (data.maxVerses.get(bookChapterIdx) ?? verse)) {
        verse = data.maxVerses.get(bookChapterIdx) ?? verse;
      }
    }}
    containerStyles={`
      width: calc(${noVerse ? 66 : 50}% - ${noVerse ? 0.5 : 1}em);
    `}
  />

  <div style="width: 0.5em;"></div>

  <SvelteSelect
    items={chapterArrays}
    bind:value={
      () => { return {label: chapter, value: chapter } },
      (v) => chapter = v.value
    }
    on:change={() => {
      if(verse > (data.maxVerses.get(bookChapterIdx) ?? verse)) {
        verse = data.maxVerses.get(bookChapterIdx) ?? verse;
      }
    }}
    containerStyles={`
      width: calc(${noVerse ? 34 : 25}% - ${noVerse ? 0.5 : 1}em);
    `}
  />

  {#if !noVerse}

  <div style="width: 0.5em;"></div>

  <SvelteSelect
    items={verseArrays}
    bind:value={
      () => { return { label: verse, value: verse } },
      (v) => verse = v.value
    }
    containerStyles="
      width: calc(25% - 1em);
    "
  />
  {/if}
</div>

<style>
  .container {
    display: flex;
    font-family: 'Pretendard-Regular';

    --placeholder-color: var(--white-1);

    --item-color: var(--white-1);
    --item-hover-color: var(--white-1);

    --selected-item-color: var(--white-1);
    --clear-select-color: var(--white-1);
    --clear-select-margin: 0px;

    --border: none;
    --border-hover: none;
    --border-focused: none;
    --background: #333f;
    --list-background: #333f;
    --item-is-active-bg: var(--black-2);
    --item-hover-bg: #444f;
  }

</style>