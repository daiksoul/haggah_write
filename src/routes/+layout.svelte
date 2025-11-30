<script lang="ts">
  import UpArrow from "$lib/component/icon/up_arrow.svelte";

  let { children } = $props();

  let navOpen = $state(false);
</script>

{@render children()}

<div
  class="container"
  data-open={navOpen}
  style:bottom={navOpen ? "0px" : "-40px"}
>
  <button
    onclick={(_) => {
      navOpen = !navOpen;
    }}
  >
    <UpArrow width="30px" height="30px" />
  </button>
  <div class="nav-container">
    <a href="/">홈화면</a>
    <a href="/bible">성경</a>
    <a href="/my">개인페이지</a>
  </div>
</div>

<style>
  button {
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0;
    scale: 1;
    transition: all 200ms;
  }

  .container {
    position: fixed;
    bottom: 0;
    /* text-align: center; */
    transition: all 200ms;
    padding-left: 20px;
  }

  .container[data-open="false"] button {
    transform: rotate(0deg);
  }

  .container[data-open="true"] button {
    transform: rotate(180deg);
  }

  .nav-container {
    /* padding: 0 12.5% 10px 12.5%; */
    text-align: start;
    margin-bottom: 12px;
  }

  .nav-container a {
    margin-right: 15px;
    color: var(--white-1);
    transition: all 200ms;
    text-decoration: underline;
  }
</style>
