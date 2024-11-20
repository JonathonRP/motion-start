<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" generics="Instance, RenderState">
  import type { Component } from "svelte";
  import type { RenderComponent } from "./features/types";

  type $$Props = {
    UseRender: ReturnType<RenderComponent<Instance, RenderState>>;
    MeasureLayout: Component | undefined;
  };

  // component props
  export let UseRender: $$Props["UseRender"],
    MeasureLayout: $$Props["MeasureLayout"];
</script>

{#if MeasureLayout}
  <MeasureLayout />
{/if}
<UseRender />
