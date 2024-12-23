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
    const id = useId();

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

    const presenceProps = (freshness?: boolean) => ({
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
    });

    let context = fromStore(useContext(PresenceContext)).current;

    $effect(() => {
        if (presenceAffectsLayout) {
            context = presenceProps();
        }
    });

    $effect(() => (context = presenceProps(refresh)));

    const keyset = (presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));

    $effect(() => {
        keyset(isPresent);
        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
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
