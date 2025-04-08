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

    const context = () => ({
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

    // FIX: may need to go back to using .current api
    // const context = $derived.by(() => {
    //     let presence = $state({ current: useContext(PresenceContext) });
    //     return presence;
    // });
    // let context = useContext(PresenceContext);

    // // this is getting called too much?..
    $effect(() => {
        if (presenceAffectsLayout) {
            // untrack(() => {
            //     PresenceContext.Provider = contextMemo();
            // });
            // PresenceContext.Provider = contextMemo();
            // PresenceContext.update(() => context);
            // untrack(() => {
            //     PresenceContext.Provider = context;
            // });
            // untrack(() => {
            //     PresenceContext.update(contextMemo);
            // });
            // untrack(() => {
            PresenceContext.update(() => context());
            // });
        }
    });

    $effect(() => {
        // refresh;
        // untrack(() => {
        //     PresenceContext.Provider = contextMemo();
        // });
        // untrack(() => {
        // context = contextMemo(refresh);
        // });
        refresh;
        untrack(() => {
            PresenceContext.update(() => context());
        });
    });

    const keyset = (presence: boolean) =>
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));

    // $inspect(isPresent);
    $effect(() => {
        // firing because of presenceChildren - size changing... and shouldnt be dep here...
        $inspect.trace();
        keyset(isPresent);

        tick().then(() => {
            !isPresent && !presenceChildren.size && onExitComplete?.();
        });
        // untrack(() => PresenceContext.update(() => context));
        // untrack(() => {
        //     PresenceContext.Provider = context;
        // });
        // presenceContext = context;
    });

    // $effect(() => {
    //     // $inspect.trace();
    //     isPresent;
    //     untrack(() => {
    //         PresenceContext.Provider = context;
    //     });
    // });

    PresenceContext.Provider = context();
    // PresenceContext.update(context);
    // let test = $derived(useContext(PresenceContext).current);
    // $inspect(isPresent, id, context(), test);

    // TODO: why does this break other animations??
</script>

{#if mode === "popLayout"}
    <PopChild {isPresent}>
        {@render children?.()}
    </PopChild>
{:else}
    {@render children?.()}
{/if}
