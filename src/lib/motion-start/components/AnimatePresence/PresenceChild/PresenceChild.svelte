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
    import { flushSync, onDestroy, tick, untrack } from "svelte";
    import { IsMounted } from "runed";

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
    let presenceContext = useContext(PresenceContext);
    const context = (): PresenceContext | null => {
        return {
            id,
            initial,
            isPresent,
            custom,
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
    };

    $effect(() => {
        if (presenceAffectsLayout) {
            presenceContext.current = context();
        }
    });

    $effect(() => {
        refresh;
        presenceContext.current = context();
    });

    const setExit = (_isPresent: boolean) => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    };
    $effect(() => {
        setExit(isPresent);
        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
    });

    // this is pretty close, exit plays with context(), but measure layout plays if null
    // PresenceContext.Provider = contextMemo;
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
