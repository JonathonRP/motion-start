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
    } from "../../../context/PresenceContext.js";
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

    const memoContext = {
        mode,
        id,
        initial,
        isPresent,
        get custom() {
            return custom;
        },
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
    };

    let context = usePresenceContext().current;

    $effect(() => {
        if (presenceAffectsLayout) {
            context = memoContext;
        }
    });

    $effect(() => {
        refresh;
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
