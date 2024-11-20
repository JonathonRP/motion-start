<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module" module>
  import { correctBorderRadius } from "../../../projection/styles/scale-border-radius";
  import { correctBoxShadow } from "../../../projection/styles/scale-box-shadow";

  const defaultScaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow,
  };
</script>

<script lang="ts">
  import { frame } from "../../../frameloop";
  import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
  import { addScaleCorrector } from "../../../projection/styles/scale-correction";
  import { globalProjectionState } from "../../../projection/node/state";
  import { microtask } from "../../../frameloop/microtask";
  import type { MeasureProps } from "./MeasureLayout";

  type $$Props = MeasureProps;

  export let visualElement: $$Props["visualElement"],
    layoutGroup: $$Props["layoutGroup"],
    switchLayoutGroup: $$Props["switchLayoutGroup"] | undefined = undefined,
    layoutId: $$Props["layoutId"] | undefined = undefined,
    layoutDependency: $$Props["layoutDependency"] | undefined = undefined,
    drag: $$Props["drag"] | undefined = undefined,
    isPresent: $$Props["isPresent"],
    safeToRemove: $$Props["safeToRemove"] | undefined = undefined;

  $: ({ projection } = visualElement);
  let prevProps;

  $: prevProps = {
    isPresent,
    layoutDependency,
  };

  const _safeToRemove = () => {
    safeToRemove && safeToRemove();
  };

  // componentDidMount
  onMount(() => {
    addScaleCorrector(defaultScaleCorrectors);

    if (projection) {
      if (layoutGroup.group) layoutGroup.group.add(projection);

      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }

      projection.root!.didUpdate();
      projection.addEventListener("animationComplete", () => {
        _safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        onExitComplete: () => _safeToRemove(),
      });
    }

    globalProjectionState.hasEverUpdated = true;
  });

  /**
   * If this is a child of a SyncContext, notify it that it needs to re-render. It will then
   * handle the snapshotting.
   *
   * If it is stand-alone component, add it to the batcher.
   */

  let updated = false;
  const updater = (nc = false) => {
    if (updated) {
      return null;
    }
    updated = true;

    if (!projection) return null;

    /**
     * TODO: We use this data in relegate to determine whether to
     * promote a previous element. There's no guarantee its presence data
     * will have updated by this point - if a bug like this arises it will
     * have to be that we markForRelegation and then find a new lead some other way,
     * perhaps in didUpdate
     */
    projection.isPresent = isPresent;

    if (
      drag ||
      prevProps.layoutDependency !== layoutDependency ||
      layoutDependency === undefined
    ) {
      projection.willUpdate();
    } else {
      _safeToRemove();
    }

    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        /**
         * If there's another stack member taking over from this one,
         * it's in charge of the exit animation and therefore should
         * be in charge of the safe to remove. Otherwise we call it here.
         */
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            _safeToRemove();
          }
        });
      }
    }

    return null;
  };

  $: update !== undefined && updater(update);

  // getSnapshotBeforeUpdate
  if (update === undefined) {
    beforeUpdate(updater);
  }

  const afterU = (nc = false) => {
    updated = false;

    if (projection) {
      projection.root!.didUpdate();

      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          _safeToRemove();
        }
      });
    }
  };

  // componentDidUupdate
  afterUpdate(afterU);

  onDestroy(() => {
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (switchLayoutGroup && switchLayoutGroup.deregister)
        switchLayoutGroup.deregister(projection);
    }
  });
</script>
