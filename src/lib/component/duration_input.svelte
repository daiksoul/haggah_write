<script lang="ts">
  let hourString: string = $state("00");
  let minuteString: string = $state("00");
  let secondString: string = $state("00");

  interface Prop {
    totalSeconds: number;
  }

  let hour: number = $state(0);
  let minute: number = $state(0);
  let second: number = $state(0);

  let { totalSeconds = $bindable<number>(0) }: Prop = $props();

  function confirmHour() {
    let _hour = parseInt(hourString);
    if (isNaN(_hour) || _hour < 0) {
      hour = 0;
    } else {
      hour = _hour;
    }
    hourString = hour.toString().padStart(2, "0");
    totalSeconds = hour * 3600 + minute * 60 + second;
  }
  function confirmMinute() {
    let _minute = parseInt(minuteString);

    if (isNaN(_minute) || _minute < 0) {
      minute = 0;
    } else if (_minute > 59) {
      minute = 59;
    } else {
      minute = _minute;
    }
    minuteString = minute.toString().padStart(2, "0");
    totalSeconds = hour * 3600 + minute * 60 + second;
  }

  function confirmSecond() {
    let _second = parseInt(secondString);
    if (isNaN(_second) || _second < 0) {
      second = 0;
    } else if (_second > 59) {
      second = 59;
    } else {
      second = _second;
    }
    secondString = second.toString().padStart(2, "0");
    totalSeconds = hour * 3600 + minute * 60 + second;
  }
</script>

<div class="container">
  <input
    type="text"
    bind:value={hourString}
    onfocusout={(_) => confirmHour()}
  />:
  <input
    type="text"
    bind:value={minuteString}
    onfocusout={(_) => confirmMinute()}
  />:
  <input
    type="text"
    bind:value={secondString}
    onfocusout={(_) => confirmSecond()}
  />
</div>

<style>
  .container {
    display: inline-flex;
    font-size: 16px;
    padding: 2px;
    border: solid 1px var(--white-3);
    border-radius: 4px;
    color: var(--white-1);
  }

  input {
    background-color: transparent;
    color: white;
    border: none;
    width: 2ch;
    outline: none;
    font-size: 16px;
  }
</style>
