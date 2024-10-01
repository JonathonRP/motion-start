<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script module lang="ts">
  var createObject = () => ({});
  var stateVisualElement = visualElement({
    build: () => {},
    // @ts-expect-error
    measureViewportBox: axisBox,
    resetTransform: () => {},
    restoreTransform: () => {},
    removeValueFromRenderState: () => {},
    render: () => {},
    scrapeMotionValuesFromProps: createObject,
    readValueFromInstance: (_state, key, options) => (options as any).initialState[key] || 0,
    makeTargetAnimatable: (element, _a) => {
      var {transition, transitionEnd, ...target} = _a;
      var origin = getOrigin(target as any, transition || {}, element);
      checkTargetForNewValues(element, target, origin);
      return Object.assign(
        { transition, transitionEnd },
        target
      );
    },
  });
</script>

<script lang="ts">
  import type { Writable } from "svelte/store";
  import { afterUpdate, getContext, onMount } from "svelte";
  import { ScaleCorrectionParentContext } from "../context/ScaleCorrectionProvider.svelte";
  import { UseVisualState } from "../motion/utils/use-visual-state.js";
  import { visualElement } from "../render/index.js";
  import { animateVisualElement, type AnimationDefinition } from "../render/utils/animation";
  import {
    checkTargetForNewValues,
    getOrigin,
  } from "../render/utils/setters.js";
    import type { VisualElementOptions } from "../render/types";

  export let initialState: VisualElementOptions<any, any>;

  let animationState = initialState;
  const sve = stateVisualElement;
  
  // @ts-expect-error
  $:( element = sve({ props: {}, visualState: state }));
  onMount(() => {
    // @ts-expect-error
    element.mount({});
    // @ts-expect-error
    return () => element.unmount();
  });
  const _afterUpdate = () => {
    // @ts-expect-error
    element.setProps({
      onUpdate: (v: VisualElementOptions<any, any>) => (animationState = { ...v }),
    });
  };

  afterUpdate(_afterUpdate);
  const scaleCorrectionParentContext = getContext<Writable<Array<unknown>>>(
    ScaleCorrectionParentContext
  );
  scaleCorrectionParentContext.update((v) =>
    v.concat([
      {
        afterU: _afterUpdate,
      },
    ])
  );
  let startAnimation = (animationDefinition: AnimationDefinition) => {
    // @ts-expect-error
    return animateVisualElement(element, animationDefinition);
  };
</script>

<UseVisualState
  config={{
    scrapeMotionValuesFromProps: createObject,
    createRenderState: createObject,
  }}
  props={{}}
  isStatic={false}
  let:state
>
  <slot animatedState={[animationState, startAnimation]} />
</UseVisualState>
