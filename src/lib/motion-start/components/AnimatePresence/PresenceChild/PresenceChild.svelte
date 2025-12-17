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
        usePresenceContext,
        setPresenceContext,
    } from "../../../context/PresenceContext.svelte";
    import PopChild from "../PopChild/PopChild.svelte";
    import type { PresenceChildProps } from "./index.js";

    interface Props extends PresenceChildProps {}

    let {
        isPresent,
        onExitComplete,
        initial,
        custom = undefined,
        presenceAffectsLayout,
        mode,
        children: desendent,
    }: Props = $props();

    const presenceChildren = $state(newChildrenMap());
    const id = $props.id();

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

    // Create a reactive context that rebuilds when isPresent changes
    const memoContext = $derived({
        mode,
        id,
        initial,
        isPresent,  // Now this will be the current prop value
        custom,
        onExitComplete: (childId: string | number) => {
            presenceChildren.set(childId, true);
            for (const [, isComplete] of presenceChildren) {
                if (!isComplete) return;
            }

            onExitComplete && onExitComplete();
        },
        register: (childId: string | number) => {
            presenceChildren.set(childId, false);
            return () => {
                presenceChildren.delete(childId);
            };
        },
    });

    let context = $state(memoContext);

    $effect(() => {
        // Update context when memoContext changes (which happens when isPresent changes)
        context = memoContext;
    });

    const setExit = (_isPresent: boolean) => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    };
    $effect(() => {
        setExit(isPresent);
    });
    $effect(() => {
        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
    });

    setPresenceContext({
        get current() {
            return context;
        },
    });
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {#snippet children({ measure })}
            {@render desendent({ measure })}
        {/snippet}
    </PopChild>
{:else}
    {@render desendent({ measure: undefined })}
{/if}
