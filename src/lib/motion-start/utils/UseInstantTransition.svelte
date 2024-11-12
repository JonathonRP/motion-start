<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module" module>
    export function disableInstantTransitions() {
        instantAnimationState.current = false;
    }
</script>

<script lang="ts">
    import { frame } from "../frameloop";
    import { useInstantLayoutTransition as UseInstantLayoutTransition } from "../projection/use-instant-layout-transition";
    import { UseForceUpdate } from "./use-force-update";
    import { instantAnimationState } from "./use-instant-transition-state";

    let unlockOnFrameRef: number | undefined = undefined;

    $: {
        /**
         * Unblock after two animation frames, otherwise this will unblock too soon.
         */
        frame.postRender(() =>
            frame.postRender(() => {
                /**
                 * If the callback has been called again after the effect
                 * triggered this 2 frame delay, don't unblock animations. This
                 * prevents the previous effect from unblocking the current
                 * instant transition too soon. This becomes more likely when
                 * used in conjunction with React.startTransition().
                 */
                if (forcedRenderCount !== unlockOnFrameRef) return;
                instantAnimationState.current = false;
            }),
        );
    }

    $: instantTransition = (callback: () => void) => {
        startInstantLayoutTransition(() => {
            instantAnimationState.current = true;
            forceUpdate();
            callback();
            unlockOnFrameRef = forcedRenderCount + 1;
        });
    };
</script>

<UseForceUpdate let:forceUpdate let:forcedRenderCount>
    <UseInstantLayoutTransition let:startInstantLayoutTransition>
        <slot {instantTransition} />
    </UseInstantLayoutTransition>
</UseForceUpdate>
