<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script module lang="ts">
    import { SvelteMap } from "svelte/reactivity";

    let presenceId = 0;
    function getPresenceId() {
        const id = presenceId;
        presenceId++;
        return id;
    }
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
        children,
    }: Props = $props();

    const presenceChildren = $derived(newChildrenMap());
    const id = $derived(getPresenceId());

    const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);
    let context = (): PresenceContext | null => {
        return {
            id,
            initial,
            isPresent,
            custom,
            onExitComplete: (childId: string | number) => {
                presenceChildren.set(childId, true);
                for (const isComplete of presenceChildren.values()) {
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
        refresh;
        untrack(() => {
            PresenceContext.update(context);
        });
    });

    $effect(() => {
        isPresent;
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    });

    $effect(() => {
        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
    });

    $effect(() => {
        if (presenceAffectsLayout) {
            untrack(() => {
                PresenceContext.update(context);
            });
        }
    });

    // FIX: why are animation backwards??
    // this is pretty close, exit plays with context(), but measure layout plays if null
    PresenceContext.Provider = presenceAffectsLayout ? null : context();
    // $effect(() => {
    //     untrack(() => {
    //         PresenceContext.Provider = presenceAffectsLayout ? null : context();
    //     });
    // });
    // $effect(() => {
    //     untrack(() => {
    //         PresenceContext.Provider = useContext(PresenceContext).current;
    //     });
    // });
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
