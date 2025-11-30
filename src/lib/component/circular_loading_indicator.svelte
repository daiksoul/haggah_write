<script lang="ts">
  let { width = "25px", height = "25px" } = $props();
</script>

<div class="indicator" style:width style:height></div>

<style>
  .indicator {
    display: inline-block;

    border: var(--loading-indicator-border-width, 4px) solid var(--white-4);
    border-top-color: var(--white-1);
    border-radius: 100%;

    animation: spin 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>

