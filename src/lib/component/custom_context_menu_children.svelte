<script lang="ts">
  type ElementCallFunction = (target: HTMLElement | null) => void;

  interface Props {
    children: any;
    action: ElementCallFunction;
  }

  let { children, action }: Props = $props();
  import { contextMenuObject } from "./custom_context_menu_shared.svelte";

  let ctxObject = $state<HTMLElement | null>(null);
  contextMenuObject.subscribe((e) => {
    ctxObject = e.target;
  });
</script>

<li>
  <button class="custom-context-menu" onclick={() => action(ctxObject)}
    >{@render children()}</button
  >
</li>

<style>
  button {
    background-color: transparent;
    /* background-color: var(--white-1); */
    margin: 0;
    border: none;
    color: var(--white-1);
    font-size: 1em;
    width: 100%;
    text-align: start;
  }
  li:hover {
    background-color: #0002;
  }

  li {
    padding: 0;
    margin: 0;
  }

  li button {
    padding: 5px 10px 5px 10px;
    vertical-align: middle;
  }

  li button :global(*) {
    vertical-align: middle;
    transform: translate(0, -1.5px);
  }
</style>

