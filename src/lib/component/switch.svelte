<script lang="ts">
  interface Prop {
    state: boolean;
  }

  let { state = $bindable() }: Prop = $props();
</script>

<button class="container" onclick={() => (state = !state)} aria-label="switch">
  <div class={["switch-background", state && "on"]}>
    <div class={["switch-thumb", state && "on"]}></div>
  </div>
</button>

<style>
  .container {
    display: inline-block;
    border: none;
    outline: 0;
    background-color: transparent;
    padding: 0;
    vertical-align: middle;
  }

  .switch-background {
    background-color: var(--black-2);
    border-radius: calc(var(--button-size) / 2 + 2px);
    width: calc(var(--button-size) * 2);
    height: var(--button-size);
    transition: all 500ms;
    padding: 0px;
    border: solid 1px var(--white-1);
  }
  .switch-background.on {
    background-color: var(--white-1);
  }
  .switch-thumb {
    background-color: var(--white-1);
    border-radius: 100%;
    width: calc(var(--button-size) * 5 / 6);
    height: calc(var(--button-size) * 5 / 6);
    position: relative;
    left: calc(var(--button-size) * 1 / 6);
    top: calc(var(--button-size) / 12);
    transition: all 500ms;
    margin: 0;
  }
  .switch-thumb.on {
    background-color: var(--black-2);
    position: relative;
    left: var(--button-size);
  }
</style>
