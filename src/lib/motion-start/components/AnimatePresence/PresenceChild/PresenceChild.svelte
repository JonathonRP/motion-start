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

    const presenceChildren = newChildrenMap();
    const id = $props.id();

    const memoExitComplete = $derived((childId: string | number) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
            if (!isComplete) return;
        }

        onExitComplete && onExitComplete();
    });

    const presenceProps = $derived(
        (
            presence: boolean | number,
            onExitComplete: typeof memoExitComplete,
        ) => ({
            id,
            initial,
            isPresent: presence,
            custom,
            onExitComplete,
            register: (childId: string | number) => {
                presenceChildren.set(childId, false);
                return () => presenceChildren.delete(childId);
            },
        }),
    );

    // FIX: may need to go back to using .current api
    // const context = $derived.by(() => {
    //     let presence = $state({ current: useContext(PresenceContext) });
    //     return presence;
    // });
    let context = useContext(PresenceContext);

    // this is getting called too much?..
    $effect(() => {
        if (presenceAffectsLayout) {
            context = presenceProps(Math.random(), memoExitComplete);
        }
    });

    const keyset = $derived((presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false)),
    );

    $effect.pre(() => {
        // $inspect.trace();
        context = presenceProps(isPresent, memoExitComplete);
    });

    // $inspect(isPresent);
    $effect(() => {
        keyset(isPresent);
        !isPresent && !presenceChildren.size && onExitComplete?.();
    });

    PresenceContext.Provider = context;
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
