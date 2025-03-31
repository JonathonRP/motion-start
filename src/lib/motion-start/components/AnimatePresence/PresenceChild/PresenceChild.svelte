<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script module lang="ts">
    import { SvelteMap } from "svelte/reactivity";
    function newChildrenMap(): Map<string | number, boolean> {
        return new Map<string | number, boolean>();
    }
</script>

<script lang="ts">
    import { PresenceContext } from "../../../context/PresenceContext.js";
    import type { PresenceChildProps } from "./index.js";
    import PopChild from "../PopChild/PopChild.svelte";
    import { useContext } from "../../../context/use";
    import { tick, untrack } from "svelte";

    interface Props extends PresenceChildProps {}

    let {
        isPresent,
        onExitComplete,
        initial,
        custom = undefined,
        presenceAffectsLayout,
        mode,
        children,
    }: Props = $props();

    const presenceChildren = $derived(newChildrenMap());
    const id = $props.id();

    const memoExitComplete = (childId: string | number) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
            if (!isComplete) return;
        }

        onExitComplete && onExitComplete();
    };

    // const presenceProps =

    // FIX: may need to go back to using .current api
    // const context = $derived.by(() => {
    //     let presence = $state({ current: useContext(PresenceContext) });
    //     return presence;
    // });
    let context = $derived({
        id,
        initial,
        isPresent,
        custom,
        onExitComplete: memoExitComplete,
        register: (childId: string | number) => {
            presenceChildren.set(childId, false);
            return () => presenceChildren.delete(childId);
        },
    });

    // this is getting called too much?..
    $effect.pre(() => {
        if (presenceAffectsLayout) {
            Math.random();
            untrack(() => {
                PresenceContext.Provider = context;
            });
        }
    });

    const keyset = $derived((presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false)),
    );

    $effect(() => {
        // $inspect.trace();
        keyset(isPresent);
        untrack(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
            PresenceContext.Provider = context;
        });
    });

    // $inspect(isPresent, id, useContext(PresenceContext));
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
