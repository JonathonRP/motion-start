<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script module lang="ts">
    import { SvelteMap } from "svelte/reactivity";
    function newChildrenMap(): Map<string | number, boolean> {
        return new SvelteMap<string | number, boolean>();
    }
</script>

<script lang="ts">
    import { PresenceContext } from "../../../context/PresenceContext.js";
    import type { PresenceChildProps } from "./index.js";
    import PopChild from "../PopChild/PopChild.svelte";
    import { useContext } from "$lib/motion-start/context/utils/context.js";
    import { useId } from "$lib/motion-start/utils/useId.js";
    import { tick } from "svelte";

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
    const id = $derived(useId());

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

    const presenceProps = $derived((cacheBuster?: boolean | number) => ({
        id,
        initial,
        isPresent,
        custom,
        onExitComplete: (childId: string | number) => {
            presenceChildren.set(childId, true);
            let allComplete = true;
            presenceChildren.forEach((isComplete) => {
                if (!isComplete) allComplete = false;
            });

            allComplete && onExitComplete?.();
        },
        register: (childId: string | number) => {
            presenceChildren.set(childId, false);
            return () => presenceChildren.delete(childId);
        },
    }));

    let context = $derived({ current: useContext(PresenceContext) });

    /**
     * this context needs to allow updating of value - otherwise exit doesn't play.
     * but also in current state enter/layout animation plays but doesn't if context object is mutated.
     */
    $effect.pre(() => {
        if (presenceAffectsLayout) {
            context.current = presenceProps();
        }
        context.current = presenceProps(refresh);
    });

    const keyset = (presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));

    $effect(() => {
        keyset(isPresent);

        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
        PresenceContext.Provider = context.current;
    });
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
