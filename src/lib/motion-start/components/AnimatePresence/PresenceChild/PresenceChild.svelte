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
    import { useContext } from "$lib/motion-start/context/utils/context.svelte.js";
    import { useId } from "$lib/motion-start/utils/useId.js";
    import { fromStore } from "svelte/store";

    interface Props extends PresenceChildProps {
        isCustom?: boolean;
    }

    let {
        isPresent,
        onExitComplete,
        initial,
        custom,
        presenceAffectsLayout,
        mode,
        isCustom,
        children,
    }: Props = $props();

    const presenceChildren = newChildrenMap();
    const id = $state(useId());

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

    const memoContext = (flag?: boolean) => {
        return {
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
        };
    };
    let context = fromStore(useContext(PresenceContext, isCustom)).current;

    $effect.pre(() => {
        if (presenceAffectsLayout) {
            context = memoContext();
        }

        context = memoContext(refresh);
    });

    const keyset = (flag?: boolean) => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    };

    $effect.pre(() => {
        keyset(isPresent);
        !isPresent && !presenceChildren.size && onExitComplete?.();

        PresenceContext["_c"] = isCustom;
        PresenceContext.Provider = context;
    });
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
