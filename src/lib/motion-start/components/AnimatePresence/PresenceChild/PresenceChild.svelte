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
    import { useContext } from "$lib/motion-start/context/utils/context.js";
    import { useId } from "$lib/motion-start/utils/useId.js";
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
    const id = useId();

    const memoExitComplete = $derived((childId: string | number) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
            if (!isComplete) return;
        }

        onExitComplete && onExitComplete();
    });

    const presenceProps = $derived(() => ({
        id,
        initial,
        isPresent,
        custom,
        onExitComplete: memoExitComplete,
        register: (childId: string | number) => {
            presenceChildren.set(childId, false);
            return () => presenceChildren.delete(childId);
        },
    }));

    const context = useContext(PresenceContext);

    $effect(() => {
        memoExitComplete;
        if (presenceAffectsLayout) {
            context.current = presenceProps();
        }
    });

    const keyset = $derived((presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false)),
    );

    $effect.pre(() => {
        // $inspect.trace();
        memoExitComplete;
        context.current = presenceProps();

        keyset(isPresent);
    });

    $effect.pre(() => {
        PresenceContext.Provider = context.current;
    });

    // $inspect(isPresent);
    $effect(() => {
        !isPresent && !presenceChildren.size && onExitComplete?.();
    });
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
