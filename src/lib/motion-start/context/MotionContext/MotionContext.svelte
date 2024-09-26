<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
  import { getContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type { VisualElement } from "../../render/types";
  import type { MotionContextProps } from "./index.js";
  import { getDomContext } from "../DOMcontext";

  export const MotionContext = (c?: any) =>
    getDomContext("Motion", c) || writable<MotionContextProps>({});

  export const useVisualElementContext = (c?: any) => {
    return (getContext(MotionContext) || MotionContext(c)) as
      | VisualElement<any, any>
      | undefined;
  };
</script>

<script lang="ts">
  export let isCustom;
  const motionContext =
    getContext<Writable<MotionContextProps>>(MotionContext) ||
    MotionContext(isCustom);
</script>

<slot parent={$motionContext.visualElement} />
