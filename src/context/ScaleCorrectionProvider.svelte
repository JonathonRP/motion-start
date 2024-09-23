<script module lang="ts">
  import type { Writable } from "svelte/store";
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { getDomContext, setDomContext } from "./DOMcontext.js";
  export const ScaleCorrectionContext = (isCustom?: any) =>
    getDomContext("ScaleCorrection", isCustom) || writable([]);
  export const ScaleCorrectionParentContext = () => writable([] as unknown[]);

  export const provideScaleCorrection = (isCustom: any) => {
    const fromParent =
      getContext(ScaleCorrectionContext) || ScaleCorrectionContext(isCustom);

    const ctx = ScaleCorrectionContext();
    setContext(ScaleCorrectionContext, ctx);
    setDomContext("ScaleCorrection", isCustom, ctx);

    setContext(ScaleCorrectionParentContext, fromParent);
  };
</script>

<script lang="ts">
  export let isCustom;
  provideScaleCorrection(isCustom);
</script>

<slot />
