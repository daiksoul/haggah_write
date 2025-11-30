<script lang="ts">
  let { form, data } = $props();

  import { type ChangeObject } from "diff";
  import { enhance } from "$app/forms";
  import { multiverseShortName } from "$lib/util.js";

  import {
    evaluation,
    evaluationToString,
    type submission,
  } from "$lib/model/submission.js";
  import { showToast, toastStore } from "$lib/component/toast_store.svelte.js";
  import ToastList from "$lib/component/toast_list.svelte";
  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";
  import { fullNames, shortNames } from "$lib/data.js";

  let address_text = $state("");

  let text = $state("");
  let diffs = $state<ChangeObject<string>[]>([]);

  let res = $derived(
    diffs.map((a) => {
      let isDontCare = a.value.match(/^[\s,.]+$/);
      let type = isDontCare
        ? "correct"
        : a.added
          ? "missing"
          : a.removed
            ? "incorrect"
            : "correct";

      return {
        text: a.value,
        color: type,
      };
    }),
  );

  interface MultiVerse {
    id: number;
    book: number;
    chapter: number;
    verses: number[];
  }
  /// list of multiverse id s
  let idList: number[] | null = $state(null);
  /// list of mulitiverses
  let dataList: MultiVerse[] | null = $state<MultiVerse[] | null>(null);
  /// selected multiverse id
  let selectedId = $state<number>(0);
  /// the id from address text
  let parsedId = $state<number>(0);

  /// async function wating on data
  data.data.then(({ data: d, error }) => {
    if (!error && d != null) {
      idList = d.map((v) => v.id);
      dataList = d.map((v) => {
        return {
          id: v.id,
          book: v.book,
          chapter: v.chapter,
          verses: v.verses,
        };
      });
      selectedId = idList[0];
    }
  });

  interface Draft {
    id: number;
    multiverseId: number | null;
    address: string | null;
    content: string;
    updatedAt: Date;
  }

  let selectedDraftId = $state(-1);
  let draftList: Draft[] | null = $state<Draft[] | null>(null);
  let selectedDraft = $derived<Draft | null>(
    draftList === null
      ? null
      : draftList.filter((d) => d.id === selectedDraftId)[0],
  );

  data.draft.then(({ data: d, error }) => {
    if (!error && d != null) {
      draftList = d.map((v) => {
        return {
          id: v.id,
          multiverseId: v.multiverseId,
          address: v.address,
          content: v.content,
          updatedAt: new Date(v.updatedAt),
        };
      });

      if (draftList.length != 0) {
        selectedDraftId = draftList[0].id;
      }
    }
  });

  /// selected mulitverse
  let selectedMultiverse = $derived<MultiVerse | null>(
    dataList === null
      ? null
      : dataList.filter((v: MultiVerse) => v.id === selectedId)[0],
  );

  let submitForm: HTMLFormElement | null = $state(null);

  let submissionList: submission[] = $state<submission[]>([]);

  function saveSubmission() {
    let subm = submissionList.find((v) => v.multiverseId == selectedId);
    if (!subm) {
      submissionList.push({
        ownerId: "wee",
        multiverseId: selectedId,
        submission: text.toString(),
        createdAt: new Date(),
        eval: evaluation.UNEVALUATED,
      });
    } else {
      subm.createdAt = new Date();
      subm.submission = text.toString();
    }
  }

  let submitted = $state(false);

  function saveDraft() {
    draftList?.push();
  }

  function updateTextField() {
    text =
      submissionList.find((v) => v.multiverseId == selectedId)?.submission ??
      "";
    diffs.clear();
    submitted = false;
  }

  /// parses {address_text}
  /// returns corrisponding multiverse id or -1 or null
  /// -1 when no corrisponding multiverse is found
  /// null when parsing error
  function parseAddress(): number | null {
    let regExp =
      /^\s*(\D+)\s*(\d+)\s*[:장]((?:\s*\d+(?:\s*[-~]\s*\d+)?절?)(?:\s*,\s*\d+(?:\s*[-~]\s*\d+)?절?)*)\s*$/g;
    // let matches = address_text.matchAll(regExp);
    let matches = regExp.exec(address_text);

    if (matches?.length != 4) {
      return null;
    }

    let arr = [...(matches?.splice(1) ?? [])];

    let book = -1;
    let bookString = arr[0].trim();
    if (fullNames.indexOf(bookString) != -1) {
      book = fullNames.indexOf(bookString);
    } else if (shortNames.indexOf(bookString) != -1) {
      book = shortNames.indexOf(bookString);
    } else {
      return null;
    }

    let chapter = parseInt(arr[1]);
    if (isNaN(chapter)) {
      return null;
    }
    let split = arr[2].split(",");
    let verses: number[] = [];
    for (const v of split) {
      if (v.includes("~") || v.includes("-")) {
        let tmp: string[];

        if (v.includes("~")) {
          tmp = v.split("~");
        } else {
          tmp = v.split("-");
        }

        let t1 = parseInt(tmp[0].trim().replaceAll("절", ""));
        let t2 = parseInt(tmp[1].trim().replaceAll("절", ""));

        if (isNaN(t1) || isNaN(t2)) {
          return null;
        }

        for (let i = t1; i <= t2; i++) {
          verses.push(i);
        }
      } else {
        let t = parseInt(v.trim().replaceAll("절", ""));
        if (isNaN(t)) {
          return null;
        }
        verses.push(t);
      }
    }

    return (
      dataList?.find((v) => {
        return (
          v.book == book && v.chapter == chapter && v.verses.equals(verses)
        );
      })?.id ?? -1
    );
  }

  function focus(e: HTMLElement) {
    e.focus();
  }

  let textArea: HTMLTextAreaElement | null = $state(null);
</script>

<form
  id="draft-form"
  method="POST"
  action=""
  use:enhance={(d) => {
    d.formData.set("type", "update");
    return async ({ update }) => {};
  }}
>
  {#if data.examData?.showAddress}
    <input type="hidden" name="multiverse_id" bind:value={selectedId} />
  {:else}
    <input type="hidden" name="address" bind:value={address_text} />
  {/if}
  <input type="hidden" name="content" bind:value={text} />
  <input type="hidden" name="exam_id" value={data.examData?.id} />
</form>

<form
  id="sumbit-form"
  method="POST"
  action="?/submit"
  bind:this={submitForm}
  use:enhance={(d) => {
    if (data.examData?.showAddress) {
      d.formData.set("multiverse_id", selectedId.toString());
    } else {
      d.formData.set("multiverse_id", parsedId.toString());
    }

    d.formData.set("draft_id", "");

    return async ({ update }) => {
      await update({ reset: false });
      diffs = form?.result ?? [];

      saveSubmission();

      var submission = submissionList.find((v) => v.multiverseId == selectedId);

      if (form?.error) {
        showToast(form.error, "error", true);
      }

      if (!submission) {
      } else {
        submission.eval = form?.status ?? evaluation.UNEVALUATED;
      }
    };
  }}
>
  <!-- <input type="hidden" name="multiverse_id" value={selectedId} /> -->
  <input type="hidden" name="book" value={selectedMultiverse?.book} />
  <input type="hidden" name="chapter" value={selectedMultiverse?.chapter} />
  <input
    type="hidden"
    name="verses"
    value={selectedMultiverse?.verses?.join(",")}
  />
  <input type="hidden" name="content" bind:value={text} />
</form>

<div class="contain-everything">
  {#if data.examData?.showAddress}
    <div class="address-container align-mid" style="width: 30%;">
      {selectedMultiverse != null
        ? multiverseShortName(selectedMultiverse)
        : ""}
    </div>
  {:else}
    <input
      class="address-container align-mid"
      style="width:30%"
      type="text"
      bind:value={address_text}
    />
  {/if}
  <hr style="width: 30%;" />

  <div class="sizedbox" style="height: 25px;"></div>

  <textarea
    class="input align-mid"
    rows="5"
    bind:value={text}
    onchange={() => {}}
    use:focus
    bind:this={textArea}
  >
  </textarea>
  <br />
  <div class="sizedbox" style="height: 25px;"></div>
  <div class="underbar-container align-mid">
    <button
      class="submitter"
      onclick={() => {
        // console.log("Submission!");
        console.log(parseAddress());
      }}
    >
      정답 확인
    </button>

    <button
      onclick={() => {
        if (idList == null) return;
        const tmpIdx = idList.indexOf(selectedId);
        if (tmpIdx <= 0) {
        } else {
          saveSubmission();

          selectedId = idList[tmpIdx - 1];

          updateTextField();
          textArea?.focus();
        }
      }}
      disabled={idList == null || idList.indexOf(selectedId) <= 0}
    >
      이전
    </button>
    <button
      onclick={() => {
        if (idList == null) return;
        const tmpIdx = idList.indexOf(selectedId);
        if (tmpIdx >= idList.length - 1) {
        } else {
          saveSubmission();

          selectedId = idList[tmpIdx + 1];

          updateTextField();
          textArea?.focus();
        }
      }}
      disabled={idList == null ||
        idList.indexOf(selectedId) >= idList.length - 1}
    >
      다음
    </button>

    <button
      onclick={(_) => {
        submitted = true;
        console.log(`${res.length}`);
        let pRes = parseAddress();

        if (pRes == null) {
          showToast("주소 형식이 잘못되었습니다", "error", true);
        } else {
          parsedId = pRes;
          submitForm?.requestSubmit();
        }
      }}
    >
      제출하기
    </button>
  </div>

  <div class="sizedbox" style="height: 25px;"></div>

  {#if true}
    <!-- {#if data.examData?.showAnswer && (data.examData.answerCheck == 0 || data.examData?.answerCheck == 1)} -->
    <div class="output-container align-mid">
      {#if submitted && res.length == 0}
        <CircularLoadingIndicator />
      {:else}
        {#each res as token}
          <span class="{token.color} output"> {token.text} </span>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<div class="sidebar-hover">
  <div class="sidebar">
    {#if data.examData?.showAddress}
      {#await data.data then { data: verses, error }}
        {#each verses as mVerse}
          <button
            class={[
              "address-button",
              selectedId == mVerse.id ? "selected" : "",
            ]}
            onclick={() => {
              saveSubmission();
              selectedId = mVerse.id;
              updateTextField();
            }}
          >
            <span
              class={[
                "address-indicator",
                evaluationToString(
                  submissionList.filter((v) => v.multiverseId == mVerse.id)[0]
                    ?.eval ?? 0,
                ),
              ]}>•</span
            >
            {multiverseShortName(mVerse)}
          </button>
        {/each}
      {/await}
    {:else}
      {#await data.draft}
        {#each draftList as draft}
          <button
            class={["address-button", selectedId == draft.id && "selected"]}
            onclick={() => {
              saveSubmission();
              selectedId = draft.id;
              updateTextField();
            }}
          >
            <span class={["address-indicator"]}>•</span>
            {draft.address}
          </button>
        {/each}
      {/await}
    {/if}
  </div>
</div>

<ToastList />

<style>
  .contain-everything {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 30%;

    width: 100%;

    align-items: center;
  }

  .align-mid {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .address-container {
    z-index: 1;
    color: var(--white-1);

    text-align: center;
    font-size: 1.5em;
  }

  input.address-container {
    background-color: #1e1e1eff;
    border: none;
    outline: none;
    border-radius: 0.4em;
  }

  .input {
    text-align: center;
    font-size: 30px;

    word-break: keep-all;
    word-wrap: normal;

    /* 
    top: 50%; */
    width: 70%;

    color: var(--white-1);
    background-color: #1e1e1eff;
    border-radius: 0.4em;
    padding: 0.4em;
    border: none;
    outline: none;

    resize: none;
  }

  .input:focus {
    outline: none;
  }

  .underbar-container {
    text-align: center;
  }

  .underbar-container button {
    position: relative;

    border: none;
    border-radius: 4px;
    padding: 8px 12px 8px 12px;
    margin: 0 5px 0 5px;

    font-size: 20px;

    background-color: var(--black-3);

    color: var(--white-1);
    align-self: center;

    display: inline-block;
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

  .output.incorrect {
    background-color: #ff000022;
    border-radius: 4px;
    padding: 4px;
    color: #fff4;
  }

  .output.missing {
    background-color: #00ff0022;
    border-radius: 4px;
    padding: 4px;
  }

  .output.correct {
    color: var(--white-1);
  }

  .sidebar {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;

    color: var(--white-1);
    background-color: #222d;
    /* background-color: red; */
    /* padding: 15px; */

    transition: all 500ms;
    overflow-x: hidden;
    overflow-y: scroll;

    white-space: nowrap;
  }

  .address-button {
    display: block;
    background-color: transparent;
    /* background-color: blue; */
    color: var(--white-1);
    border: none;
    margin: 0;
    padding: 0;

    font-size: 1em;
    text-align: start;

    width: 100%;
    padding: 5px 15px 5px 0px;
  }

  .address-button:hover {
    background-color: #fff2;
  }

  .address-button.selected {
    background: #0008;
  }

  .sidebar-hover {
    background-color: transparent;
    position: absolute;
    right: 0;
    width: 30px;
    height: 100%;

    transition: all 500ms;
  }

  .sidebar-hover:hover {
    width: 25%;
  }

  .sidebar-hover:hover .sidebar {
    width: 100%;
  }

  .address-indicator {
    --ellipse-size: 7.5px;

    display: inline-block;
    color: transparent;
    /* background-color: red; */
    width: var(--ellipse-size);
    height: var(--ellipse-size);
    line-height: var(--ellipse-size);
    text-align: center;
    border-radius: 100%;
    margin: 5px calc((30px - var(--ellipse-size)) / 2) 5px
      calc((30px - var(--ellipse-size)) / 2);
  }

  .address-indicator.unevaluated {
    /* background-color: #ffffff22; */
    /* border: solid 1px #888f; */
    /* color: #888; */
    /* background-color: #888; */
    background-color: #8888;
  }

  .address-indicator.correct {
    /* background-color: #00ff0022; */
    /* border: solid 1px #080f; */
    /* color: #0f0; */
    background-color: #0f08;
  }

  .address-indicator.incorrect {
    /* background-color: #ff000022; */
    /* border: solid 1px #800f; */
    /* color: #f00; */
    /* background-color: #800f; */
    background-color: #f008;
  }
</style>
