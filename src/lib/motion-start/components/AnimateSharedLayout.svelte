<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.. -->

<script lang="ts" context="module" module>
  let id = 0;
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import { invariant } from "../utils/errors";
  import { LayoutGroup } from "./LayoutGroup";

  onMount(() => {
    invariant(
      false,
      "AnimateSharedLayout is deprecated: https://www.framer.com/docs/guide-upgrade/##shared-layout-animations",
    );
  });
</script>

<LayoutGroup id={`asl-${id++}`}>
  <slot />
</LayoutGroup>
