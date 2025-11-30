<script lang="ts">
  import { enhance } from "$app/forms";
  import ToastList from "$lib/component/toast_list.svelte";
  import { showToast } from "$lib/component/toast_store.svelte.js";

  let email = $state<string>();
  let password = $state<string>();
  let password2 = $state<string>();
  let name = $state<string>();

  let signinFormElement = $state<HTMLFormElement>();

  let { form } = $props();
</script>

<div class="everything-container align-mid">
  <h1>로그인</h1>
  <form
    id="signin-form"
    method="POST"
    action="?/signin"
    bind:this={signinFormElement}
    use:enhance={() => {
      return async ({ update }) => {
        await update();
        if (form?.message) {
          showToast(form?.message ?? "", "error", true);
        }
      };
    }}
  >
    <input
      type="email"
      class="text-input"
      placeholder="이메일"
      required
      name="email"
      bind:value={email}
    />
    <input
      type="password"
      class="text-input"
      placeholder="비밀번호"
      required
      name="password"
      bind:value={password}
    />
    <button
      onclick={(_) => {
        signinFormElement?.requestSubmit();
      }}
      class="button-input"
    >
      로그인
    </button>
  </form>
</div>

<ToastList />

<style>
  * {
    color: var(--white-1);
  }

  form {
    display: block;
  }

  .align-mid {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .text-input {
    display: block;
    background-color: var(--black-2);
    color: var(--white-1);
    border: 1px solid var(--black-3);
    font-size: 1.2em;
    border-radius: 5px;
    padding: 12px;

    width: calc(100% - 24px);
    margin: 0 0 10px 0;
  }

  .button-input {
    font-size: 1.2em;
    background-color: var(--black-3);
    border: none;
    color: var(--white-1);
    border-radius: 5px;
    padding: 12px;
    width: 100%;
  }

  .everything-container {
    display: block;

    position: absolute !important;

    width: 25%;
  }
</style>
