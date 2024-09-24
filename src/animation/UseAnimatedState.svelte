<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script module lang="ts">
  var createObject = function () {
    return {};
  };
  var stateVisualElement = visualElement({
    build: function () {},
    measureViewportBox: axisBox,
    resetTransform: function () {},
    restoreTransform: function () {},
    removeValueFromRenderState: function () {},
    render: function () {},
    scrapeMotionValuesFromProps: createObject,
    readValueFromInstance: function (_state, key, options) {
      return options.initialState[key] || 0;
    },
    makeTargetAnimatable: function (element, _a) {
      var transition = _a.transition,
        transitionEnd = _a.transitionEnd,
        target = __rest(_a, ["transition", "transitionEnd"]);
      var origin = getOrigin(target, transition || {}, element);
      checkTargetForNewValues(element, target, origin);
      return __assign(
        { transition: transition, transitionEnd: transitionEnd },
        target
      );
    },
  });
</script>

<script lang="ts">
  import { afterUpdate, getContext, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import { __assign, __rest } from "tslib";
  import { ScaleCorrectionParentContext } from "../context/ScaleCorrectionProvider.svelte";
  import { UseVisualState } from "../motion/utils/use-visual-state.js";
  import { visualElement } from "../render/index.js";
  import { animateVisualElement } from "../render/utils/animation";
  import {
    checkTargetForNewValues,
    getOrigin,
  } from "../render/utils/setters.js";
  export let initialState;

  let animationState = initialState;
  const sve = stateVisualElement;
  $:( element = sve({ props: {}, visualState: state }));
  onMount(() => {
    element.mount({});
    return () => element.unmount();
  });
  const _afterUpdate = () => {
    element.setProps({
      onUpdate: (v) => (animationState = { ...v }),
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
  let startAnimation = (animationDefinition) => {
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
