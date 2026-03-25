<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<script module lang="ts">
    function newChildrenMap(): Map<string | number, boolean> {
        return new Map<string | number, boolean>();
    }
</script>

<script lang="ts">
    import { tick } from "svelte";
    import {
        type PresenceContext,
        setPresenceContext,
    } from "../../../context/PresenceContext.svelte";
    import PopChild from "../PopChild/PopChild.svelte";
    import type { PresenceChildProps } from "./index.js";

    interface Props extends PresenceChildProps {}

    let {
        isPresent,
        onExitComplete = undefined,
        initial,
        custom = undefined,
        presenceAffectsLayout,
        sharedLayoutDependency = undefined,
        mode,
        children: desendants,
    }: Props = $props();

    const presenceChildren = $state(newChildrenMap());
    const id = $props.id();

    // Use $state so external mutations (e.g. measurePop from PopChild) persist.
    // $derived would create a new object every render, discarding any mutations.
    // onExitComplete closes over the live prop binding so no $effect is needed —
    // it always calls the latest onExitComplete when invoked.
    let context = $state<PresenceContext>({
        id,
        initial,
        isPresent,
        custom,
        layoutDependency: 0,
        onExitComplete: (childId: string | number) => {
            // Ignore stale callbacks from unmounted children (e.g. after mode switch remount).
            if (!presenceChildren.has(childId)) return;
            presenceChildren.set(childId, true);
            for (const [, isComplete] of presenceChildren) {
                if (!isComplete) return;
            }
            onExitComplete?.();
        },
        register: (childId: string | number) => {
            presenceChildren.set(childId, false);
            return () => {
                presenceChildren.delete(childId);
            };
        },
        measurePop: undefined,
    });

    // Keep reactive props in sync with the stable $state object.
    // Use $effect.pre so layoutDependency and custom are updated BEFORE
    // MeasureLayoutWithContext's watch.pre (also $effect.pre) reads it.
    // custom must also be $effect.pre so it's available when ExitAnimationFeature
    // resolves the exit variant (which reads presenceContext.custom) during the
    // same flush that sets isPresent=false.
    $effect.pre(() => {
        context.custom = custom;
        if (presenceAffectsLayout && sharedLayoutDependency !== undefined) {
            context.layoutDependency = sharedLayoutDependency;
        }
    });
    $effect(() => {
        context.isPresent = isPresent;
        context.initial = initial;
    });

    // Reset children completion status when transitioning to not-present
    $effect(() => {
        if (!isPresent) {
            presenceChildren.forEach((_, key) =>
                presenceChildren.set(key, false),
            );
        }
    });

    // Handle case where no children registered
    $effect(() => {
        tick().then(() => {
            if (!isPresent && !presenceChildren.size) {
                onExitComplete?.();
            }
        });
    });

    // Set context with stable reference - same object every time
    setPresenceContext(context);

    const component = $derived(
        mode === "popLayout"
            ? { pop: PopChild, props: { isPresent } }
            : undefined,
    );
</script>

{#snippet children()}
    {#if component}
        <component.pop {...component.props}>
            {@render desendants?.()}
        </component.pop>
    {:else}
        {@render desendants?.()}
    {/if}
{/snippet}

{@render children()}
