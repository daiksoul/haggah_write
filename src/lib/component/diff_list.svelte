<script lang="ts">
  import type { ChangeObject } from "diff";

  interface prop {
    diffs: ChangeObject<string>[];
  }

  let { diffs }: prop = $props();
</script>

<div class="container">
  {#each diffs.map((a) => {
    let isDontCare = a.value.match(/^[\s,.]+$/);
    let type = isDontCare ? "correct" : a.added ? "missing" : a.removed ? "incorrect" : "correct";
    return { text: a.value, color: type };
  }) as dif}
    <span class={["diff-token", dif.color]}>
      {dif.text}
    </span>
  {/each}
</div>

<style>
  .container {
    word-break: keep-all;
    word-wrap: normal;
  }

  .diff-token {
    color: var(--default-color, var(--white-1));
    font-size: var(--default-font-size);
  }

  .diff-token.incorrect {
    background-color: var(--incorrect-bg-color, #ff000022);
    color: var(--incorrect-color, #fff4);
    border-radius: var(--bg-border-radius, 2px);
    padding: var(--bg-padding, 2px);
  }

  .diff-token.missing {
    background-color: var(--missing-bg-color, #00ff0022);
    color: var(--missing-color, var(--white-1));
    border-radius: var(--bg-border-radius, 2px);
    padding: var(--bg-padding, 2px);
  }
</style>
