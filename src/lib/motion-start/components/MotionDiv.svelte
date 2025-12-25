<script lang="ts">
  import type { Snippet } from 'svelte';
  import Motion from "../motion/MotionSSR.svelte";

  let {
    div = {},
    children,
    ...restProps
  }: {
    div?: any;
    children?: Snippet;
  } & Record<string, any> = $props();
</script>

<Motion {...restProps} let:motion={m} let:props>
  <div {...props} {...div} use:m>
    {@render children?.()}
  </div>
</Motion>
