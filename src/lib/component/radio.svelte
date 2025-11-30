<script lang="ts">
  type StringMaker<T> = (value: T) => string;

  interface Prop<T> {
    list: T[];
    currentValue: T;
    stringMaker: StringMaker<T>;
  }

  type G = $$Generic;

  let {
    list = [],
    currentValue = $bindable<G>(),
    stringMaker = (val: G) => `${val}`,
  }: Prop<G> = $props();
</script>

<div class="container">
  {#each list as item}
    <button
      class={["item", currentValue == item && "selected"]}
      onclick={() => {
        currentValue = item;
      }}
    >
      {stringMaker(item)}
    </button>
  {/each}
</div>

<style>
  .container {
    display: inline-flex;
    flex-direction: row;
    border: solid 1px var(--white-2);
    border-radius: 15px;
    color: var(--white-1);
  }

  .container > *:first-child {
    border: none;
    border-radius: 15px 0 0 15px;
    padding-left: 10px;
  }

  .container > *:last-child {
    border-radius: 0 15px 15px 0;
    padding-right: 10px;
  }

  .item {
    border-top: none;
    border-bottom: none;
    border-right: none;
    border-left: solid 1px var(--white-2);
    padding: 0 5px 0 5px;
    background-color: transparent;
    color: var(--white-1);
    font-size: 16px;

    transition: all 500ms;
  }

  .item.selected {
    color: var(--black-1);
    background-color: var(--white-2);
  }
</style>
