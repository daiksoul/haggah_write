<script lang="ts">
  let { timeLeft = $bindable<number>() } = $props();

  const overHour = timeLeft > 3600;

  let hour = $derived(Math.floor(timeLeft / 3600));
  let minute = $derived(Math.floor((timeLeft % 3600) / 60));
  let seconds = $derived(timeLeft % 60);
</script>

<div class="container">
  {#if overHour}
    {hour.toString().padStart(2, "0")} :
  {/if}
  {minute.toString().padStart(2, "0")} :
  {seconds.toString().padStart(2, "0")}
</div>

<style>
  .container {
    color: var(--timer-color, var(--white-1));
    font-size: var(--timer-font-size, 1em);
    background-color: transparent;
  }
</style>
