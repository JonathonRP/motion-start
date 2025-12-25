<script lang="ts">
  import Motion from "../motion/MotionSSR.svelte";
  let { div = {}, ...restProps }: { div?: any } & Record<string, any> = $props();
</script>

<Motion {...restProps} let:motion={m} let:props>
  <div {...props} {...div} use:m><slot /></div>
</Motion>
