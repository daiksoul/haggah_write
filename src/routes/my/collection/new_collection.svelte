<script lang="ts">
  import { enhance } from "$app/forms";
  import Cross from "$lib/component/icon/cross.svelte";
  import { shortNames, validateAddress } from "$lib/data";
  import { numberArrayToString, stringToNumberArray } from "$lib/util";
  import readXlsxFile from "read-excel-file";
  import { fade, fly } from "svelte/transition";

  type RecallFunction = () => void;

  interface Prop {
    showPopUp: boolean;
    name: string;
    description: string;
    recallFunction: RecallFunction;
    files: FileList | null;
  }

  let {
    showPopUp = $bindable<boolean>(),
    name = $bindable<string>(),
    description = $bindable<string>(),
    recallFunction,
    files = $bindable<FileList | null>(),
  }: Prop = $props();

  let overlay: HTMLDivElement | null = $state(null);

  function onPageClick(e: MouseEvent) {
    if (e.target != overlay) return;
    showPopUp = false;
  }

  interface AddressPreview {
    book: number;
    chapter: number;
    verses: number[];
    valid: boolean;
  }

  let addresses: AddressPreview[] = $state([]);
  let fileInput: HTMLInputElement | null = $state(null);

  function onFileSubmit() {
    addresses.clear();
    if (files != null) {
      readXlsxFile(files[0]).then((rows) => {
        for (let row of rows) {
          let bookIdx = shortNames.indexOf(row.at(0)?.toString() ?? "");

          let chapter = parseInt(row.at(1)?.toString() ?? "");

          let verses = stringToNumberArray(row.at(2)?.toString() ?? "");

          addresses.push({
            book: bookIdx,
            chapter: chapter,
            verses,
            valid: validateAddress({ book: bookIdx, chapter, verses }),
          });
        }
      });
    }
  }

  function onFileClear() {
    files = null;
    addresses.clear();
  }
</script>

{#if showPopUp}
  <div class="overlay" transition:fade={{ duration: 50 }} bind:this={overlay}>
    <div
      class="container"
      in:fly={{ y: 200, duration: 100, delay: 50 }}
      out:fly={{ y: 200, duration: 100 }}
    >
      <div class="title">보관함 만들기</div>
      <div class="sizedbox" style="height: 10px"></div>

      <div class="form-label">보관함 이름</div>
      <div class="sizedbox" style="height: 5px"></div>
      <input class="text-input" name="name" bind:value={name} />

      <div class="form-label">설명</div>
      <div class="sizedbox" style="height: 5px"></div>
      <input class="text-input" name="description" bind:value={description} />

      <div class="form-label">파일에서 가져오기</div>
      <div class="file-input-container">
        <label for="file-input" class="file-input">파일 선택</label>
        <input
          id="file-input"
          class="file-input-input"
          type="file"
          name="input_file"
          bind:files
          bind:this={fileInput}
          onchange={onFileSubmit}
        />
        <div class="file-path text-input">
          {files?.item(0)?.name ?? "선택된 파일 없음"}
        </div>
        <button class="file-clear-button" onclick={onFileClear}>
          <Cross width="24px" height="24px" />
        </button>
      </div>

      <div>
        {#each addresses as addr}
          <div class={["address-preview", !addr.valid && "invalid"]}>
            {shortNames[addr.book]}
            {addr.chapter} : {numberArrayToString(addr.verses)}
          </div>
        {/each}
      </div>

      <div class="button-container">
        <button
          class="button-input"
          onclick={(_) => {
            files = null;
            addresses.clear();
            showPopUp = false;
          }}>취소</button
        >
        <button
          class="button-input"
          onclick={(_) => {
            recallFunction();
          }}>확인</button
        >
      </div>
    </div>
  </div>
{/if}

<svelte:window onclick={onPageClick} />

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

  .file-input-container {
    display: block;
    margin: 5px 0 5px 0;
  }

  .file-input-container > * {
    display: inline-block;
  }

  .file-input-input {
    display: none;
  }

  .file-input {
    padding: 12px;
  }

  .file-path.text-input {
    background-color: var(--black-3);
    display: inline-block;
    font-size: 1em;
    padding: 12px;
    margin: 0 0 0 15px;
    width: 50%;
  }

  .file-clear-button {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    position: relative;
    left: -40px;
    vertical-align: middle;
  }

  .address-preview.invalid {
    color: var(--red-1);
  }

  .button-container {
    position: fixed;
    bottom: 15px;
    left: 50%;

    align-items: center;
    text-align: center;

    display: flex;
    transform: translate(-50%, 0%);
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
    transform: translate(-50%, -50%);

    color: var(--white-1);

    padding: 15px 30px 0 30px;
  }
</style>
