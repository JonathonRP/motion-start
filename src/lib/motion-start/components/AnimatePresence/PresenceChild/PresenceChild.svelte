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
    import { useId } from "../../../utils/useId.js";
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
    const id = useId();

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
            isPresent,
            custom,
            onExitComplete,
            register: (childId: string | number) => {
                presenceChildren.set(childId, false);
                return () => presenceChildren.delete(childId);
            },
        }),
    );

    // FIX: may need to go back to using .current api
    const context = $derived.by(() => {
        let presence = $state({ current: useContext(PresenceContext) });
        return presence;
    });

    // this is getting called too much?..
    $effect(() => {
        if (presenceAffectsLayout) {
            context.current = presenceProps(Math.random(), memoExitComplete);
        }
    });

    const keyset = $derived((presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false)),
    );

    $effect.pre(() => {
        // $inspect.trace();
        context.current = presenceProps(isPresent, memoExitComplete);
    });

    // $inspect(isPresent);
    $effect(() => {
        keyset(isPresent);
        !isPresent && !presenceChildren.size && onExitComplete?.();
    });

    PresenceContext.Provider = context.current;
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
