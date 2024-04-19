<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<script context="module">
    let presenceId = 0;
    function getPresenceId() {
        const id = presenceId;
        presenceId++;
        return id;
    }
    function newChildrenMap() {
        return new Map();
    }
</script>

<script lang="ts">
    import { afterUpdate, setContext, tick } from "svelte";
    import { setDomContext } from "../../../context/DOMcontext.js";
    import { PresenceContext } from "../../../context/PresenceContext.js";
    import type { PresenceChildProps } from "./index.js";

    type $$Props = PresenceChildProps;

    export let isPresent: $$Props['isPresent'],
        onExitComplete: $$Props['onExitComplete'] = undefined,
        initial: $$Props['initial'] = undefined,
        custom: $$Props['custom'] = undefined,
        presenceAffectsLayout: $$Props['presenceAffectsLayout'],
        isCustom: $$Props['isCustom'];

    const presenceChildren = newChildrenMap();
    const id = getPresenceId();

    $: refresh = presenceAffectsLayout ? undefined : isPresent;

    const memoContext = () => {
        return {
            id,
            initial,
            isPresent,
            custom,
            onExitComplete: (childId) => {
                presenceChildren.set(childId, true);
                let allComplete = true;
                presenceChildren.forEach((isComplete) => {
                    if (!isComplete) allComplete = false;
                });

                allComplete && onExitComplete?.();
            },
            register: (childId) => {
                presenceChildren.set(childId, false);
                return () => presenceChildren.delete(childId);
            },
        };
    };
    let context = PresenceContext();

    afterUpdate(() => {
        if (presenceAffectsLayout) {
            context.set(memoContext());
        }
    });

    $: context.set(memoContext(refresh));

    const keyset = () => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    };
    $: keyset(isPresent);
    $: tick().then(() => {
        !isPresent && !presenceChildren.size && onExitComplete?.();
    });
    setContext(PresenceContext, context);
    setDomContext("Presence",isCustom,context)
</script>

<slot />
