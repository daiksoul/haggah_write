<script lang="ts">
  let { form, data } = $props();

  import { type ChangeObject } from "diff";
  import { enhance } from "$app/forms";
  import { multiverseShortName } from "$lib/util.js";
  import { evalToAttr, type SubmitNDraft } from "$lib/model/submit_n_draft.js";
  import { showToast } from "$lib/component/toast_store.svelte.js";
  import CircularLoadingIndicator from "$lib/component/circular_loading_indicator.svelte";
  import { onDestroy, onMount } from "svelte";
  import Add from "$lib/component/icon/add.svelte";
  import Remove from "$lib/component/icon/remove.svelte";
  import Timer from "$lib/component/timer.svelte";
  import { goto } from "$app/navigation";

  let examData = $derived(data.examData);

  let completed = $state(false);

  let address_text = $state("");

  let text = $state("");
  let diffs = $state<ChangeObject<string>[]>([]);

  let timeLeft = $state(100000000);

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
  /// list of mulitiverses
  let dataList: MultiVerse[] | null = $state<MultiVerse[] | null>(null);
  /// list of multiverse id s
  let idList: number[] | null = $derived(
    dataList == null ? null : dataList.map((e) => e.id),
  );
  /// selected multiverse id
  let selectedId = $state<number>(0);
  /// timer
  let dataTimerList: number[] = $state<number[]>([]);

  /// async function wating on data
  data.data.then(({ data: d, error }) => {
    if (!error && d != null) {
      dataList = d.map((v) => {
        return {
          id: v.id,
          book: v.book,
          chapter: v.chapter,
          verses: v.verses,
        };
      });
      dataTimerList = d.map((_) => -1);
      selectedId = dataList.at(0)?.id ?? -1;
      loadInputs();
    }
  });

  let submitted = $state(false);

  /// selected mulitverse
  let selectedMultiverse = $derived<MultiVerse | null>(
    dataList === null
      ? null
      : dataList.filter((v: MultiVerse) => v.id === selectedId)[0],
  );

  let sNDList = $state<SubmitNDraft[]>([]);
  let sNDIdList: number[] | null = $derived(sNDList.map((v) => v.id));
  let sNDTimerList: number[] = $state([]);
  let selectedSNDId = $state<number | null>(null);
  let selectedSND = $derived<SubmitNDraft | null>(
    sNDList === null
      ? null
      : sNDList.length == 0
        ? null
        : selectedSNDId === null
          ? null
          : sNDList.filter((v: SubmitNDraft) => v.id === selectedSNDId)[0],
  );

  data.submitNdraft.then(({ data: d, error }) => {
    if (!error) {
      sNDList?.push(...(d ?? []));
      for (const _ of sNDList!) {
        sNDTimerList.push(-1);
      }
      if (sNDIdList.length > 0) {
        selectedSNDId = sNDIdList[0];
        loadInputs();
      }
    }
  });

  let draftForm: HTMLFormElement | null = $state(null);

  function focus(e: HTMLElement) {
    e.focus();
  }

  let textArea: HTMLTextAreaElement | null = $state(null);

  function saveDraft(submit: boolean = false) {
    if (text.trim().length == 0 && address_text.trim().length == 0) return;
    //console.log(sNDList);

    if (selectedSNDId == null) {
      let now = new Date(Date.now());

      let tmpSND = {
        id: -1,
        created_at: now,
        updated_at: now,
        owner_uid: "",
        exam_id: examData?.id ?? -1,
        multiverse_id: examData?.showAddress ? selectedId : null,
        address: address_text,
        content: text,
        submit_count: 0,
        eval: 0,
        res: [],
      };
      sNDList?.push(tmpSND);
      sNDTimerList.push(-1);

      let tmpIdx = examData?.showAddress
        ? (idList?.indexOf(selectedId) ?? -1)
        : sNDTimerList.length - 1;

      if (submit) {
        debounceSubmit(tmpIdx, tmpSND);
      } else {
        debounceDraft(tmpIdx, tmpSND);
      }
    } else {
      if (selectedSND?.content == text && selectedSND?.address == address_text)
        return;

      selectedSND!.address = address_text;
      selectedSND!.content = text;
      selectedSND!.updated_at = new Date(Date.now());

      let tmpIdx = examData?.showAddress
        ? (idList?.indexOf(selectedId) ?? -1)
        : sNDIdList?.indexOf(selectedSNDId!);

      if (submit) {
        debounceSubmit(tmpIdx!, selectedSND!);
      } else {
        debounceDraft(tmpIdx!, selectedSND!);
      }
    }
  }

  function cleanInputs() {
    text = "";
    address_text = "";
    diffs.clear();
  }

  function loadInputs() {
    text = selectedSND?.content ?? "";
    address_text = selectedSND?.address ?? "";
    diffs.push(...(selectedSND?.res ?? []));
  }

  function debounceDraft(idx: number, draft: SubmitNDraft) {
    clearTimeout(
      examData?.showAddress ? dataTimerList[idx] : sNDTimerList[idx],
    );

    let sndIdx = idx;
    if (examData?.showAddress) {
      sndIdx =
        sNDList.findIndex((v) => v.multiverse_id == dataList?.at(idx)?.id) ??
        -1;
    }

    let tmpId = window.setTimeout(async () => {
      let response = await fetch("/exam/API/draft", {
        method: "POST",
        body: JSON.stringify({ idx: idx, draft: draft }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status != 201) {
        const { message } = await response.json();
        showToast(message, "error", true);
      }

      const { id } = await response.json();

      if (sNDList != null && sNDList[sndIdx].id == -1) {
        sNDList[sndIdx].id = id;
        //selectedSNDId = id;
        //loadInputs();
      }

      if (examData?.showAddress) {
        dataTimerList[idx] = -1;
      } else {
        sNDTimerList[idx] = -1;
      }
    }, 500);

    if (examData?.showAddress) {
      dataTimerList[idx] = tmpId;
    } else {
      sNDTimerList[idx] = tmpId;
    }
  }

  function debounceSubmit(idx: number, submission: SubmitNDraft) {
    clearTimeout(
      examData?.showAddress ? dataTimerList[idx] : sNDTimerList[idx],
    );

    let sndIdx = idx;
    if (examData?.showAddress) {
      sndIdx =
        sNDList.findIndex((v) => v.multiverse_id == dataList?.at(idx)?.id) ??
        -1;
    }

    let tmpId = window.setTimeout(async () => {
      let response = await fetch("/exam/API/submit", {
        method: "POST",
        body: JSON.stringify({ idx: idx, submission: submission }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const {
        message,
        data: resultData,
        complete,
        diffs: resDiff,
      } = await response.json();

      if (response.status > 399) {
        showToast(message, "error", true);
        if (examData?.showAddress) {
          dataTimerList[idx] = -1;
        } else {
          sNDTimerList[idx] = -1;
          if (selectedSNDId == -1) sNDTimerList.removeAt(idx);
        }
        if (selectedSNDId == -1) sNDList.removeAt(sndIdx);

        if (response.status == 461) {
          completed = true;
          return;
        } else if (response.status == 462) {
          goto("/exam/result");
          return;
        }

        return;
      }

      if (examData?.showAnswer) {
        diffs.clear();
        diffs.push(...resDiff);
      }

      if (sNDList != null) {
        if (sNDList[sndIdx].id == -1) {
          sNDList[sndIdx].id = resultData.id;
        }
        if (selectedSNDId == null) {
          //sNDList[sndIdx].id = resultData.id;
          selectedSNDId = resultData.id;
        }

        console.log(resultData.submit_count);

        sNDList[sndIdx].created_at = resultData.created_at;
        sNDList[sndIdx].updated_at = resultData.updated_at;
        sNDList[sndIdx].multiverse_id = resultData.multiverse_id;
        sNDList[sndIdx].submit_count = resultData.submit_count;
        sNDList[sndIdx].eval = resultData.eval;
        sNDList[sndIdx].res = resultData.res;
      }

      if (complete) {
        showToast("시험이 종료되었습니다.", "success", false);
        completed = true;
      }

      if (examData?.showAddress) {
        dataTimerList[idx] = -1;
      } else {
        sNDTimerList[idx] = -1;
      }
    }, 500);

    if (examData?.showAddress) {
      dataTimerList[idx] = tmpId;
    } else {
      sNDTimerList[idx] = tmpId;
    }
  }

  function debounceDelete(idx: number, submission: SubmitNDraft) {
    clearTimeout(
      examData?.showAddress ? dataTimerList[idx] : sNDTimerList[idx],
    );
    let sndIdx = idx;
    if (examData?.showAddress) {
      sndIdx =
        sNDList.findIndex((v) => v.multiverse_id == dataList?.at(idx)?.id) ??
        -1;
    }
    let tmpId = window.setTimeout(async () => {
      let response = await fetch("/exam/API/delete", {
        method: "POST",
        body: JSON.stringify({ idx: idx, id: submission.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status != 201) {
        let { message } = await response.json();
        showToast(message, "error", true);
        return;
      }

      if (selectedSNDId == sNDIdList?.at(idx) && sNDIdList != null) {
        if (sNDIdList?.length > 1) {
          let tmpIdx = Math.min(idx + 1, sNDIdList?.length - 2);
          selectedSNDId = sNDIdList[tmpIdx];
        } else {
          selectedSNDId = null;
        }
      }
      loadInputs();

      sNDList.removeAt(idx);
      sNDTimerList.removeAt(idx);
    }, 500);

    if (examData?.showAddress) {
      dataTimerList[idx] = tmpId;
    } else {
      sNDTimerList[idx] = tmpId;
    }
  }

  onMount(() => {
    completed = examData == null || examData?.completedAt != null;
    console.log(completed);

    if (examData?.useTimer) {
      timeLeft = examData?.timeLeft ?? examData?.timeLimit ?? 600;

      window.setInterval(() => {
        timeLeft--;

        if (timeLeft == -1) {
          completed = true;
        }
      }, 1000);
    }
  });

  let updateTimerForm: HTMLFormElement | null = $state(null);

  // onDestroy(() => {
  //   updateTimerForm?.submit();
  // });

  $effect(() => {
    if (completed == true) {
      fetch("/exam/API/complete", {
        method: "POST",
      });
      setTimeout(() => goto(`/exam/result/${examData?.id}`), 2500);
    }
  });
</script>

<form
  id="update-timer-form"
  method="POST"
  action="?/updateTimer"
  bind:this={updateTimerForm}
  use:enhance={(e) => {
    return async ({ update }) => {
      return update({ reset: false });
    };
  }}
>
  <input type="hidden" name="timeLeft" bind:value={timeLeft} />
</form>

<div class="contain-everything">
  <div class="submit-counter align-mid">
    [ {selectedSND?.submit_count ?? 0} / {examData?.maxSubmissionCount} ]
  </div>
  {#if examData?.showAddress}
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
      tabindex="0"
      disabled={completed || (selectedSND != null && selectedSND.eval == 1)}
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
    tabindex="0"
    disabled={completed || (selectedSND != null && selectedSND.eval == 1)}
  >
  </textarea>
  <br />
  <div class="sizedbox" style="height: 25px;"></div>
  <div class="underbar-container align-mid">
    <button
      onclick={() => {
        if (examData?.showAddress) {
          if (idList == null) return;

          const tmpIdx = idList.indexOf(selectedId);
          if (tmpIdx <= 0) return;

          saveDraft();
          cleanInputs();

          selectedId = idList[tmpIdx - 1];
          selectedSNDId =
            sNDList.find((e) => e.multiverse_id == selectedId)?.id ?? null;

          loadInputs();
        } else {
          if (sNDIdList == null) return;
          if (sNDIdList.length < 0) return;

          saveDraft();

          if (selectedSNDId == null) {
            selectedSNDId = sNDIdList[sNDIdList.length - 1];
            return;
          }

          const tmpIdx = sNDIdList?.indexOf(selectedSNDId);

          if (tmpIdx > 0) {
            selectedSNDId = sNDIdList[tmpIdx - 1];
          }
          loadInputs();
        }
      }}
      disabled={(examData?.showAddress &&
        (idList == null || idList.indexOf(selectedId) <= 0)) ||
        (!examData?.showAddress &&
          (sNDIdList == null ||
            (selectedSNDId != null && sNDIdList.indexOf(selectedSNDId) <= 0)))}
      tabindex="0"
    >
      이전
    </button>
    <button
      onclick={(_) => {
        //console.log(`${res.length}`);
        saveDraft(true);
      }}
      tabindex="0"
      disabled={completed}
    >
      제출하기
    </button>
    <button
      onclick={() => {
        if (examData?.showAddress) {
          if (idList == null) return;
          const tmpIdx = idList.indexOf(selectedId);
          if (tmpIdx >= idList.length - 1) return;

          saveDraft();
          cleanInputs();

          selectedId = idList[tmpIdx + 1];
          selectedSNDId =
            sNDList.find((e) => e.multiverse_id == selectedId)?.id ?? null;

          loadInputs();
        } else {
          if (sNDIdList == null) return;
          if (sNDIdList.length < 0) return;

          saveDraft();

          if (selectedSNDId == null) {
            selectedSNDId = sNDIdList[0];
            return;
          }

          const tmpIdx = sNDIdList?.indexOf(selectedSNDId);

          if (tmpIdx < sNDIdList.length - 1) {
            selectedSNDId = sNDIdList[tmpIdx + 1];
          }
          loadInputs();
        }
      }}
      disabled={(examData?.showAddress &&
        (idList == null || idList.indexOf(selectedId) >= idList.length - 1)) ||
        (!examData?.showAddress &&
          (sNDIdList == null ||
            (selectedSNDId != null &&
              sNDIdList.indexOf(selectedSNDId) >= sNDIdList.length - 1)))}
      tabindex="0"
    >
      다음
    </button>
  </div>

  <div class="sizedbox" style="height: 25px;"></div>

  <!-- {#if true} -->
  {#if examData?.showAnswer && (examData.answerCheck == 0 || examData?.answerCheck == 1)}
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
    {#if examData?.showAddress}
      {#await data.data then { data: verses, error }}
        {#each verses as mVerse, i}
          <button
            class={["address-button", selectedId == mVerse.id && "selected"]}
            onclick={() => {
              saveDraft();
              cleanInputs();
              selectedId = mVerse.id;
              selectedSNDId =
                sNDList.find((e) => e.multiverse_id == mVerse.id)?.id ?? null;
              loadInputs();
            }}
          >
            {#if dataTimerList[i] == -1}
              <span
                class={[
                  "address-indicator",
                  evalToAttr(
                    sNDList.find((e) => e.multiverse_id == mVerse.id) ?? null,
                  ),
                ]}>•</span
              >
            {:else}
              <span class="address-loading-indicator">
                <CircularLoadingIndicator
                  width="7px"
                  height="7px"
                  --loading-indicator-border-width="2px"
                />
              </span>
            {/if}
            {multiverseShortName(mVerse)}
          </button>
        {/each}
      {/await}
    {:else}
      {#each sNDList as draft, i}
        <div class="address-row">
          <button
            class={["address-button", selectedSNDId == draft.id && "selected"]}
            onclick={() => {
              saveDraft();
              cleanInputs();
              selectedSNDId = draft.id;
              loadInputs();
            }}
          >
            {#if sNDTimerList[i] == -1}<span
                class={["address-indicator", evalToAttr(draft)]}
              >
                •</span
              >
            {:else}
              <span class="address-loading-indicator">
                <CircularLoadingIndicator
                  width="7px"
                  height="7px"
                  --loading-indicator-border-width="2px"
                />
              </span>
            {/if}
            {draft.address}
          </button>
          <div class="draft-util">
            {#if draft.eval == 0}
              <button
                class="remove-draft-button"
                onclick={(_) => {
                  debounceDelete(i, draft);
                }}
              >
                <Remove width="12px" height="12px" color="var(--white-1)" />
              </button>
            {/if}
          </div>
        </div>
      {/each}
      <button
        class={["address-button", selectedSNDId == null && "selected"]}
        onclick={(_) => {
          saveDraft();
          cleanInputs();
          selectedSNDId = null;
        }}
      >
        <div style="padding: 0 7.5px 0 7.5px; display: inline-block;">
          <Add color="var(--white-1)" width="16px" height="16px" />
        </div>
        새로 작성하기
      </button>
    {/if}
  </div>
</div>

{#if examData?.useTimer}
  <div class="timer-container">
    <Timer bind:timeLeft />
  </div>
{/if}

{#if completed}
  <div class="overlay">완료된 시험입니다</div>
{/if}

<svelte:window
  on:beforeunload={(e: BeforeUnloadEvent) => {
    if (completed) {
    } else {
      if (examData?.useTimer) {
        updateTimerForm?.requestSubmit();
      }
      e.preventDefault();
      e.returnValue = "시험이 진행중입니다. 정말로 종료하시겠습니까?";
    }
  }}
/>

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

  .submit-counter {
    color: var(--white-1);
    text-align: center;
    font-size: 1.2em;
    margin-bottom: 20px;
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

  .input:disabled {
    color: var(--white-2);
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

  .address-row {
    position: relative;
  }

  .address-button {
    display: flex;
    flex-direction: row;
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

  .address-button * {
    display: inline-block;
  }

  .draft-util {
    position: absolute;
    top: 5px;
    right: -100px;
    transition: all 500ms;
  }

  .remove-draft-button {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-hover:hover .draft-util {
    right: 15px;
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

  .address-loading-indicator {
    --ellipse-size: 10px;
    margin: 5px calc((30px - var(--ellipse-size)) / 2) 5px
      calc((30px - var(--ellipse-size)) / 2);
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

  .timer-container {
    border: solid 2px var(--white-4);
    border-top: none;
    border-radius: 0 0px 10px 10px;
    padding: 5px 15px 5px 15px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .overlay {
    color: white;
    display: flex;
    font-size: 60px;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
  }
</style>
