<script lang="ts">
  let { color = "var(--white-1)", width = "20px", height = "20px" } = $props();

  // icon provided by https://www.svgrepo.com/collection/phosphor-filled-icons/
</script>

<svg
  fill={color}
  {width}
  {height}
  viewBox="0 0 255.99316 255.99316"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M215.99414,31.99316h-128a8.0004,8.0004,0,0,0-8,8v40.001h-40.001a8.0004,8.0004,0,0,0-8,8v128a8.0004,8.0004,0,0,0,8,8h128a8.00039,8.00039,0,0,0,8-8v-40.001h40.001a8.00039,8.00039,0,0,0,8-8v-128A8.0004,8.0004,0,0,0,215.99414,31.99316Zm-8,128h-32.001v-71.999a8.00039,8.00039,0,0,0-8-8h-71.999v-32.001h112Z"
  />
</svg>

