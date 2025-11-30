<script lang="ts">
  import * as info from "$lib/data.ts";
  import { page } from "$app/state";
  import BibleExplorer from "$lib/component/bible_explorer.svelte";
  import CustomContextMenu from "$lib/component/custom_context_menu.svelte";
  import CustomContextMenuChildren from "$lib/component/custom_context_menu_children.svelte";
  import Copy from "$lib/component/icon/copy.svelte";
  import SelectAll from "$lib/component/icon/select_all.svelte";
  import SelectNone from "$lib/component/icon/select_none.svelte";
  import Select from "$lib/component/icon/select.svelte";
  import Store from "$lib/component/icon/store.svelte";

  import { slide } from "svelte/transition";
  import "$lib/util.ts";
  import { enhance } from "$app/forms";
  import ToastList from "$lib/component/toast_list.svelte";
  import CollectionPopup from "./collection_popup.svelte";
  import { showToast } from "$lib/component/toast_store.svelte.js";
  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";

  let { data, form } = $props();

  let book = parseInt(
    (page.url.searchParams.get("book") as string | null) ?? "0",
  );
  let chapter = parseInt(
    (page.url.searchParams.get("chapter") as string | null) ?? "1",
  );

  let prevBook = book;
  let prevChapter = chapter - 1;

  if (chapter === 1) {
    prevBook = book - 1;
    prevChapter = info.maxChapters[prevBook];
  }

  var nextBook = book;
  var nextChapter = chapter + 1;

  if (chapter === info.maxChapters[book]) {
    nextBook = book + 1;
    nextChapter = 1;
  }

  let navBook = $state<number>(book);
  let navChapter = $state<number>(chapter);

  let topHeight = $state();
  let bottomHeight = $state();

  /// form data
  let selected = $state<number[]>([]);

  let checkState = $derived(selected.length > 0);

  /// collection popup
  let showPopup = $state(false);

  let saveForm: HTMLFormElement | undefined = $state<
    HTMLFormElement | undefined
  >();

  let selectedCollectionId = $state<number>(-1);
</script>

<div class="body">
  <div bind:clientHeight={topHeight}>
    <div class="top-nav-container">
      <div class="bible-explorer-container">
        <BibleExplorer
          bind:book={navBook}
          bind:chapter={navChapter}
          noVerse={true}
        ></BibleExplorer>
      </div>
      <a
        class="top-nav-button nav"
        data-sveltekit-reload
        href={`?book=${navBook}&chapter=${navChapter}`}
      >
        바로가기
      </a>
    </div>

    <h1>
      {#if book !== undefined}
        {info.fullNames[book!]}
      {/if}

      {#if chapter !== undefined}
        {chapter}장
      {/if}
    </h1>

    <!-- <div class="sizedbox" style="width: 15px"></div> -->
  </div>

  <div
    class="verse-container"
    style={`height: calc(100% - ${topHeight}px - ${bottomHeight}px - 2em)`}
  >
    {#await data.verses}
      <CircularLoadingIndicator />
    {:then { data: verses, error }}
      {#each verses! as verse}
        <div class="verse">
          {#if checkState}
            <div
              transition:slide={{ duration: 200, axis: "x" }}
              class="checkbox-container"
            >
              <input
                type="checkbox"
                id={`check-${verse.verse}`}
                onchange={() => {
                  if (selected.includes(verse.verse)) {
                    selected.remove(verse.verse);
                  } else {
                    selected.push(verse.verse);
                  }
                }}
                checked={selected.includes(verse.verse)}
              />
              <label class="checkbox-style" for={`check-${verse.verse}`}
              ></label>
            </div>
          {/if}

          <div class="sizedbox" style="width: 5px;"></div>

          <div class="verse-number show-custom-context-menu">
            {verse.verse < 0
              ? `${Math.floor(-verse.verse / 1000)}-${-verse.verse % 1000}`
              : verse.verse}
          </div>
          <div
            id="verse_{verse.verse}"
            class="verse-content show-custom-context-menu"
          >
            {verse.content}
          </div>
        </div>
      {/each}
    {/await}
  </div>
</div>

<div class="bottom-container" bind:clientHeight={bottomHeight}>
  <div class="sizedbox" style="height: 1em;"></div>

  <div class="nav-container">
    {#if prevBook !== -1}
      <a
        class="nav"
        data-sveltekit-reload
        href={`?book=${prevBook}&chapter=${prevChapter}`}
      >
        이전
      </a>
    {/if}

    <div class="sizedbox" style="display: inline-flex; width 1em;"></div>

    {#if nextBook !== 66}
      <a
        class="nav"
        data-sveltekit-reload
        href={`/bible?book=${nextBook}&chapter=${nextChapter}`}
      >
        다음
      </a>
    {/if}
  </div>
  <div class="sizedbox" style="height: 1em;"></div>
</div>

<CustomContextMenu>
  <CustomContextMenuChildren
    action={(element: HTMLElement) => {
      navigator.clipboard.writeText(element.textContent);
    }}
  >
    <Copy color="white" width="1.2em" height="1.2em" /> 절 내용 복사하기
  </CustomContextMenuChildren>
  <CustomContextMenuChildren
    action={(element: HTMLElement) => {
      if (element.id.startsWith("verse")) {
        let t = parseInt(element.id.split("_")[1]);
        selected.push(t);
      }
    }}
  >
    <Select color="white" width="1.2em" height="1.2em" /> 절 선택
  </CustomContextMenuChildren>
  {#await data.verses}
    <CircularLoadingIndicator />
  {:then { data: verses, error }}
    {#if !error && verses != null}
      {#if selected.length < verses.length / 2}
        <CustomContextMenuChildren
          action={(_: HTMLElement) => {
            selected.clear();
            verses.forEach((verse: { verse: number }) => {
              selected.push(verse.verse);
            });
          }}
        >
          <SelectAll color="white" width="1.2em" height="1.2em" /> 모든 절 선택
        </CustomContextMenuChildren>
      {:else}
        <CustomContextMenuChildren
          action={(_: HTMLElement) => {
            selected.clear();
          }}
        >
          <SelectNone color="white" width="1.2em" height="1.2em" /> 모든 절 선택
          해제
        </CustomContextMenuChildren>
      {/if}
    {/if}
  {/await}
  {#if checkState && data.uid != null}
    <CustomContextMenuChildren
      action={(_: HTMLElement) => {
        showPopup = true;
      }}
    >
      <Store color="white" width="1.2em" height="1.2em" /> 절 담기
    </CustomContextMenuChildren>
  {/if}
</CustomContextMenu>

<form
  id="save-form"
  method="POST"
  action="?/save"
  use:enhance={({ formData }) => {
    formData.set("collection_id", selectedCollectionId.toString());
    showPopup = false;

    return async ({ update }) => {
      await update();
      switch (form?.status) {
        case "success":
          showToast("구절이 추가되었습니다", "success", true);
          break;
        case "error":
          showToast(form?.message ?? "", "error", true);
          break;
        default:
          break;
      }
    };
  }}
  bind:this={saveForm}
>
  <input type="hidden" name="book" bind:value={book} />
  <input type="hidden" name="chapter" bind:value={chapter} />
  <input type="hidden" name="verses" value={selected.join(",")} />
  <!-- <input type="hidden" name="collection_id" bind:value={selectedCollectionId} /> -->
</form>

{#await data.collection}
  <!-- <CircularLoadingIndicator /> -->
{:then { data: collection, error }}
  {#if error}
    <CollectionPopup
      callback={(_) => {}}
      collections={[
        {
          id: 0,
          name: error.message,
          description: "",
          created_at: new Date(),
          owner_id: "",
        },
      ]}
      bind:showPopup
    />
  {:else}
    <CollectionPopup
      callback={(e) => {
        selectedCollectionId = e.id;
        saveForm?.requestSubmit();
      }}
      collections={collection!}
      bind:showPopup
    />
  {/if}
{/await}

<ToastList />

<style>
  * {
    color: var(--white-1);
  }

  .body {
    margin: 8px;
  }

  .top-nav-container {
    width: 90%;
    display: flex;
  }

  .bible-explorer-container {
    width: 330px;
  }

  .verse-container {
    display: block;
    position: absolute;
    overflow: hidden scroll;
    width: calc(100% - 16px);
  }

  .verse-number {
    display: inline-block;
    width: 50px;
    margin: 0 0.4em 0 0em;
    text-align: start;
  }

  .verse-content {
    max-width: calc(100% - 100px);
  }

  .verse {
    font-size: 1.2em;
    line-height: 125%;

    display: flex;

    word-break: keep-all;

    padding: 0 0 4px 0;
  }

  .bottom-container {
    position: absolute;
    bottom: 0px;
    width: calc(100% - 16px);
  }

  .nav-container {
    width: 100%;
    align-items: center;
    text-align: center;
    margin: 0;
  }

  a.nav {
    text-decoration: none;
    background-color: var(--black-3);
    border-radius: 0.4em;
    padding: 0.3em 0.8em 0.3em 0.8em;
    line-height: 200%;
  }

  a.nav:hover {
    background-color: var(--black-4);
  }

  a.nav:active {
    background-color: var(--black-2);
    /* box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box; */

    -webkit-box-shadow: inset 0px 0px 0px 1px var(--black-4);
    -moz-box-shadow: inset 0px 0px 0px 1px var(--black-4);
    box-shadow: inset 0px 0px 0px 1px var(--black-4);
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"] + .checkbox-style {
    display: block;
    width: 15px;
    height: 15px;
    border: 2px solid white;
    border-radius: 4px;
    margin-top: 4px;
  }

  input[type="checkbox"] + .checkbox-style:hover {
    border-color: #cccf;
  }

  input[type="checkbox"]:checked + .checkbox-style {
    background-color: var(--white-1);
  }

  input[type="checkbox"]:checked + .checkbox-style:hover {
    background-color: #cccf;
  }

  input[type="checkbox"]:checked + .checkbox-style::before {
    content: "✔";
    text-align: center;
    width: 15px;
    height: 15px;
    position: relative;
    top: -5px;
    left: -1px;
    color: var(--black-2);
    font-weight: bold;
  }

  #save-form {
    display: none;
  }
</style>
