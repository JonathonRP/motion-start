<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script context="module" lang="ts" module>
    let presenceId = 0;
    function getPresenceId() {
        const id = presenceId;
        presenceId++;
        return id;
    }
    function newChildrenMap(): Map<number, boolean> {
        return new Map<number, boolean>();
    }
</script>

<script lang="ts">
    import { setContext, tick } from "svelte";
    import { setDomContext } from "../../../context/DOMcontext.js";
    import { PresenceContext } from "../../../context/PresenceContext.js";
    import type { PresenceChildProps } from "./index.js";

    interface Props extends PresenceChildProps {}

    let {
        isPresent,
        onExitComplete = undefined,
        initial = undefined,
        custom = undefined,
        presenceAffectsLayout,
        isCustom,
        children,
    }: Props = $props();

    const presenceChildren = newChildrenMap();
    const id = getPresenceId();

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

    const memoContext = (flag?: boolean) => {
        return {
            id,
            initial,
            isPresent,
            custom,
            onExitComplete: (childId: number) => {
                presenceChildren.set(childId, true);
                let allComplete = true;
                presenceChildren.forEach((isComplete) => {
                    if (!isComplete) allComplete = false;
                });

                allComplete && onExitComplete?.();
            },
            register: (childId: number) => {
                presenceChildren.set(childId, false);
                return () => presenceChildren.delete(childId);
            },
        };
    };
    let context = PresenceContext();

    $effect(() => {
        if (presenceAffectsLayout) {
            context.set(memoContext());
        }
    });

    $effect(() => context.set(memoContext(refresh)));

    const keyset = (flag?: boolean) => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    };
    $effect(() => {
        keyset(isPresent);
        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
    });
    setContext(PresenceContext, context);
    setDomContext("Presence", isCustom, context);
</script>

{@render children?.()}
