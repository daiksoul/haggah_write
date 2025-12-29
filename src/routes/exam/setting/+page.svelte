<script lang="ts">
  import DurationInput from "$lib/component/duration_input.svelte";
  import Radio from "$lib/component/radio.svelte";
  import Switch from "$lib/component/switch.svelte";
  import {
    answerCheckMethod,
    answerCheckMethod2Kor,
  } from "$lib/model/exam_data.ts";

  import { slide } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { showToast } from "$lib/component/toast_store.svelte";

  let { data, form } = $props();

  let useTimer: boolean = $state(false);
  let showAddress: boolean = $state(false);
  let showAnswer: boolean = $state(false);
  let replaceToChimRye: boolean = $state(false);
  let maxSubmissionCount: number = $state(1);

  let timerSecond: number = $state(0);
  let showAnswerOption: answerCheckMethod = $state(answerCheckMethod.INSTANT);

  let submissionCountText: string = $state("1");

  let startForm: HTMLFormElement | null = $state(null);
</script>

<div class="container">
  <h1>시험 설정</h1>
  <div class="option-group">
    <div class="option-title">
      제한시간
      <Switch bind:state={useTimer} --button-size="20px" />
    </div>
    {#if useTimer}
      <div class="timer-container" transition:slide>
        <div>시간 설정</div>
        <div>
          <DurationInput bind:totalSeconds={timerSecond} />
        </div>
      </div>
    {/if}
  </div>

  <div class="option-group">
    <div class="option-title">
      주소표시
      <Switch bind:state={showAddress} --button-size="20px" />
    </div>
  </div>

  <div class="option-group">
    <div class="option-title">
      오답표시
      <Switch bind:state={showAnswer} --button-size="20px" />
    </div>
    {#if showAnswer}
      <div class="radio-container" transition:slide>
        <Radio
          bind:currentValue={showAnswerOption}
          list={[0, 1, 2]}
          stringMaker={answerCheckMethod2Kor}
        ></Radio>
      </div>
    {/if}
  </div>
  <div class="option-group">
    <div class="option-title">
      '세례'를 '침례'로 치환
      <Switch bind:state={replaceToChimRye} --button-size="20px" />
    </div>
  </div>
  <div class="option-group">
    <div class="option-title">
      최대 답변 제출 횟수
      <input
        type="text"
        class="text-input"
        onfocusout={() => {
          let _number = parseInt(submissionCountText);
          if (!isNaN(_number)) {
            maxSubmissionCount = _number;
          }
          submissionCountText = `${maxSubmissionCount}`;
        }}
        bind:value={submissionCountText}
      />
    </div>
  </div>
  <div class="button-container">
    <button
      class="button-input"
      onclick={() => {
        startForm?.requestSubmit();
      }}>시작</button
    >
  </div>
</div>

<form
  action="?/start"
  method="POST"
  bind:this={startForm}
  use:enhance={() => {
    return async ({ update }) => {
      await update();
      if (form?.status == "error") {
        showToast(form.message!, "error", true);
      }
    };
  }}
>
  <input type="hidden" name="collection_id" bind:value={data.collectionId} />
  <input type="hidden" name="use_timer" bind:value={useTimer} />
  <input type="hidden" name="show_address" bind:value={showAddress} />
  <input type="hidden" name="show_answer" bind:value={showAnswer} />
  <input
    type="hidden"
    name="max_submission_count"
    bind:value={maxSubmissionCount}
  />
  <input type="hidden" name="time_limit" bind:value={timerSecond} />
  <input type="hidden" name="answer_check" bind:value={showAnswerOption} />
  <input type="hidden" name="chimrye" bind:value={replaceToChimRye} />
</form>

<style>
  * {
    color: var(--white-1);
  }

  .container {
    width: 20%;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .timer-container {
    margin: 5px 0 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .timer-container div {
    align-self: center;
  }

  .radio-container {
    margin: 5px 0 0 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .option-group {
    margin: 0 0 10px 0;
  }

  .option-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .text-input {
    font-size: 16px;
    padding: 2px 10px 2px 10px;
    max-width: 10%;
    text-align: end;
    vertical-align: middle;
    border: solid 1px var(--white-1);
  }

  .button-container {
    text-align: center;
  }

  .button-input {
    font-size: 15px;
    width: fit-content;
    padding: 10px 20px 10px 20px;
  }
</style>
