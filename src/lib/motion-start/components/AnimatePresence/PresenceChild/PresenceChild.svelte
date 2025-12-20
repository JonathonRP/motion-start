<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<script module lang="ts">
    function newChildrenMap(): Map<string | number, boolean> {
        return new Map<string | number, boolean>();
    }
</script>

<script lang="ts">
    import { tick, untrack } from "svelte";
    import {
        usePresenceContext,
        setPresenceContext,
        type PresenceContext,
    } from "../../../context/PresenceContext.svelte";
    import PopChild from "../PopChild/PopChild.svelte";
    import type { PresenceChildProps } from "./index.js";
    import type { Attachment } from "svelte/attachments";

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

    let isReusedContext = true;

    const refresh = $derived(
        presenceAffectsLayout ? presenceAffectsLayout : isPresent,
    );

    // Initialize context with correct values immediately (not in $effect)
    // This is critical because child motion components need access to register() during mount
    let contextMemo: PresenceContext = $derived.by(() => ({
        mode,
        id,
        initial,
        isPresent,
        get custom() {
            return custom;
        },
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
    }));

    let context = $state(usePresenceContext().current);

    // afterUpdate
    $effect(() => {
        if (presenceAffectsLayout) {
            tick().then(() => {
                context = contextMemo;
            });
        }
    });
    $effect(() => {
        refresh;
        context = contextMemo;
    });

    const setExit = (_isPresent: boolean) => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    };
    $effect(() => {
        setExit(isPresent);
    });
    $effect(() => {
        tick().then(() => {
            !isPresent &&
                !presenceChildren.size &&
                untrack(() => onExitComplete?.());
        });
    });

    setPresenceContext({
        get current() {
            return context;
        },
    });
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children()}
    </PopChild>
{:else}
    {@render children()}
{/if}
