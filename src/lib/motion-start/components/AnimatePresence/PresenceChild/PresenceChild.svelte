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
    // Use $effect.pre so layoutDependency is updated BEFORE
    // MeasureLayoutWithContext's watch.pre (also $effect.pre) reads it.
    $effect.pre(() => {
        context.isPresent = isPresent;
        if (presenceAffectsLayout && sharedLayoutDependency !== undefined) {
            context.layoutDependency = sharedLayoutDependency;
        }
    });
    $effect(() => {
        context.initial = initial;
    });
    $effect(() => {
        context.custom = custom;
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

    const pop = $derived(
        mode === "popLayout"
            ? { component: PopChild, props: { isPresent } }
            : undefined,
    );
</script>

{#snippet children()}
    {#if pop}
        <pop.component {...pop.props}>
            {@render desendants?.()}
        </pop.component>
    {:else}
        {@render desendants?.()}
    {/if}
{/snippet}

{@render children()}
