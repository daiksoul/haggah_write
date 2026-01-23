<script lang="ts">
  import Cross from "$lib/component/icon/cross.svelte";
  import readXlsxFile from "read-excel-file";

  let files: FileList | null = $state(null);
  let fileInput: HTMLFormElement | null = $state(null);

  async function submit() {
	if(files == null) return;

  	let rows = await readXlsxFile(files.item(0));

	for (let row of rows) {
		let book = row.at(0)?.toString() ?? '';
		let chapter = row.at(1)?.toString() ?? '';
		let verses = row.at(2)?.toString() ?? '';
	
		fetch("grader/API", {
			method: "POST",
			body: JSON.Stringify(
				{book , chapter , verses ,}
			),
			headers: {
				"Content-Type": "application/json",
			}
		});


	}
  }

  function onFileSubmit() {}

  function onFileClear() {
    files = null;
  }
</script>

<div class="body">
  <h1>파일 업로드하기</h1>

  <form bind:this={fileInput}>
    <div class="file-input-container">
      <label for="file-input" class="file-input">파일 선택</label>
      <input
        id="file-input"
        class="file-input-input"
        type="file"
        name="input_file"
        bind:files
        onchange={onFileSubmit}
      />
      <div class="file-path text-input">
        {files?.item(0)?.name ?? "선택된 파일 없음"}
      </div>
      <button class="file-clear-button" onclick={onFileClear}>
        <Cross width="24px" height="24px" />
      </button>
    </div>

    <button
      class="button-input submit"
      onclick={() => {
        //fileInput?.requestSubmit();

	submit();
      }}>제출</button
    >
  </form>
</div>

<style>
  .body {
    margin: 2px;
    text-align: center;
  }

  h1 {
    color: var(--white-1);
  }

  .file-input-container {
    display: block;
    margin: 5px 0 5px 0;
  }

  .file-input-container > * {
    display: inline-block;
  }

  .file-input-input {
    display: none;
  }

  .file-input {
    padding: 12px;
  }

  .file-path.text-input {
    background-color: var(--black-3);
    display: inline-block;
    font-size: 1em;
    padding: 12px;
    margin: 0 0 0 15px;
    width: 200px;
    text-align: start;
  }

  .file-clear-button {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    position: relative;
    left: -40px;
    vertical-align: middle;
  }

  .button-input.submit {
    width: 320px;
  }
</style>
