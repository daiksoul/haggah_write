<script lang="ts">
  import { enhance } from "$app/forms";
  import Switch from "$lib/component/switch.svelte";
  import ToastList from "$lib/component/toast_list.svelte";
  import { showToast } from "$lib/component/toast_store.svelte.js";
  import { error } from "@sveltejs/kit";

  let { form } = $props();

  let email = $state<string>();
  let password = $state<string>();
  let password2 = $state<string>();
  let name = $state<string>();

  let signupFormElement = $state<HTMLFormElement>();

  let a = $state(false);
</script>

<div class="everything-container align-mid">
  <h1>회원가입</h1>

  <form
    id="signup-form"
    method="POST"
    action="?/signup"
    bind:this={signupFormElement}
    use:enhance={() => {
      return async ({ update }) => {
        await update();

        if (form?.description) {
          showToast(form.description, "error", true);
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
    <input
      type="password"
      class="text-input"
      placeholder="비밀번호 확인"
      required
      name="passwordConfirm"
      bind:value={password2}
    />

    <input
      type="text"
      class="text-input"
      placeholder="이름"
      required
      name="name"
      bind:value={name}
    />

    <button
      onclick={(_) => {
        signupFormElement?.requestSubmit();
      }}
      class="button-input"
    >
      회원가입
    </button>
  </form>
</div>

<Switch bind:state={a} --button-size="20px !important" />

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

  .error-message {
    color: red;
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
