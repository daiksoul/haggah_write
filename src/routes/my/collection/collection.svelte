<script lang="ts">
  import { enhance } from "$app/forms";

  type RecallFunction = () => void;

  interface Prop {
    data: Collection;
    recallFunction: RecallFunction;
  }

  let { data = $bindable<Collection>(), recallFunction }: Prop = $props();
  let deleteForm: HTMLFormElement | null = $state(null);
</script>

<div class="contain-all">
  <h3><a href={`/my/collection/${data.id}`}>{data.name}</a></h3>
  <div>{data.description}</div>
  <button
    class="button-input"
    onclick={() => {
      recallFunction();
    }}
  >
    삭제
  </button>
</div>

<style>
  .contain-all {
    border: 1px solid var(--black-4);
    border-radius: 5px;

    padding: 10px;

    color: var(--white-1);

    width: 150px;
    margin: 10px;
  }

  h3 {
    margin: 0 0 0 0;
  }

  h3 a {
    text-decoration: none;
    color: var(--white-1);
  }

  .button-input {
    font-size: 1em;
    display: block;
    padding: 5px 10px 5px 10px;
    width: fit-content;
  }
</style>

