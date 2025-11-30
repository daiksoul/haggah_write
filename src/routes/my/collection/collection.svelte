<script lang="ts">
  interface Prop {
    data: Collection
  }

  let { data = $bindable<Collection>() }: Prop = $props();
</script>

<div class="contain-all">
  <h3><a href={`/my/collection/${data.id}`}>{data.name}</a></h3>
  <div>{data.description}</div>
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

  h3 a {
    text-decoration: none;
    color: var(--white-1);
  }
</style>