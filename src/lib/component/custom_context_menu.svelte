<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { contextMenuObject } from "./custom_context_menu_shared.svelte";

  let { children } = $props();

  let pos = $state({ x: 0, y: 0 });
  let menu = $state({ w: 0, h: 0 });
  let browser = $state({ w: 0, h: 0 });
  let showMenu = $state<boolean>(false);

  function rightClickContextMenu(e: MouseEvent) {
    showMenu = true;

    browser.w = window.innerWidth;
    browser.h = window.innerHeight;

    pos.x = e.x;
    pos.y = e.y;

    if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
    if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;

    if (e.target instanceof HTMLElement) {
      contextMenuObject.update((_) => {
        return {
          target: e.target as HTMLElement,
        };
      });
    } else {
      contextMenuObject.update((_) => {
        return {
          target: null,
        };
      });
    }
  }

  function onPageClick(e: any) {
    contextMenuObject.update((_) => {
      return {
        target: null,
      };
    });
    showMenu = false;
  }
</script>

{#if showMenu}
  <nav
    transition:fly={{ duration: 50, y: 10 }}
    bind:clientWidth={menu.w}
    bind:clientHeight={menu.h}
    style=" position: absolute; 
          top:{pos.y}px; 
          left:{pos.x}px;"
  >
    <div class="navbar" id="navbar">
      <ul>
        {@render children()}
      </ul>
    </div>
  </nav>
{/if}

<svelte:window
  on:contextmenu={(e) => {
    if (e.target instanceof HTMLElement) {
      if (
        (e.target as HTMLElement).classList.contains("show-custom-context-menu")
      ) {
        e.preventDefault();
        rightClickContextMenu(e);
      } else {
        showMenu = false;
      }
    } else {
      showMenu = false;
    }
  }}
  on:click={onPageClick}
/>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  nav {
    transition: all 100ms;
  }

  .navbar {
    display: inline-flex;
    background-color: var(--black-2);
    border-radius: 10px;
    overflow: hidden;
    flex-direction: column;
    color: #ffff;
    border: 1.5px solid var(--black-3);
  }
</style>

