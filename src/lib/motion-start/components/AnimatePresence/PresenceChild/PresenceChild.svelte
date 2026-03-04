<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
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
    import { setContext, tick, untrack } from "svelte";
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
                if (presenceChildren.get(childId) === true) return;
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
    // Set synchronously so children see a non-null context when they call
    // usePresence() during their own initialization. Deferring via tick() caused
    // the store to still be null at child-init time → id=undefined, no registration,
    // AlwaysPresent returned, exit animations never fired, presenceChildren empty.
    context.set(memoContext());

    $effect(() => {
        if (presenceAffectsLayout) {
            const ctx = memoContext();
            // Defer store.set() past the current effect execution — calling it
            // synchronously causes $.mutate → $.internal_set to fire while the
            // effect is still on the call stack, which Svelte 5 treats as an
            // unsafe mutation and throws.
            tick().then(() => context.set(ctx));
        }
    });

    $effect(() => { refresh; const ctx = untrack(memoContext); tick().then(() => context.set(ctx)); });

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
