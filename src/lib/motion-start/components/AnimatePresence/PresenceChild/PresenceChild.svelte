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
    import { untrack } from "svelte";

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

    const presenceChildren = $state(newChildrenMap());
    const id = $props.id();

    const memoExitComplete = $derived((childId: string | number) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
            if (!isComplete) return;
        }

        onExitComplete && onExitComplete();
    });

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

    let context = (refreshness?: number | boolean) => ({
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

    $effect(() => {
        if (presenceAffectsLayout) {
            untrack(() => (useContext(PresenceContext).current = context()));
        }
    });

    $effect(() => {
        refresh;
        PresenceContext.update(context);
    });

    const keyset = (presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));

    $effect(() => {
        keyset(isPresent);

        !isPresent && !presenceChildren.size && onExitComplete?.();
    });

    // $inspect(useContext(PresenceContext).current);
    // doublecheck this should always be null or use current PresenceContext value derived?
    PresenceContext.Provider = null;

    // TODO: why does this break other animations??
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
