<script lang="ts">
  import { formatDate } from "$lib/util.js";

  let { data } = $props();
</script>

<div class="body">
  <h2>{data.user?.name}님의 개인 페이지</h2>

  <p>계정 생성일 : {formatDate(new Date(data.user?.created_at ?? 0))}</p>
  <p>연결된 메일 : {data.user?.email}</p>
  <p><a href="/logout">로그아웃</a></p>
  <p><a href="/my/collection">컬렉션</a></p>
</div>

<style>
  * {
    color: var(--white-1);
  }

  .body {
    padding: 10px;
  }

  a {
    color: var(--white-1);
  }
</style>
