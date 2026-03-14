<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" generics="T extends {key:any}">
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import { getContext, setContext, tick } from "svelte";
    import {
        SharedLayoutContext,
        isSharedLayout,
    } from "../../context/SharedLayoutContext.js";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import type { Writable } from "svelte/store";
    import {
        type SharedLayoutSyncMethods,
        type SyncLayoutBatcher,
    } from "../AnimateSharedLayout/types.js";
    import {
        LayoutEpochContext,
        createLayoutEpoch,
        type LayoutEpoch,
    } from "../../context/LayoutEpochContext.js";

    type $$Props = AnimatePresenceProps<ConditionalGeneric<T>>;

    export let list: $$Props["list"] = undefined,
        custom: $$Props["custom"] = undefined,
        initial: $$Props["initial"] = true,
        onExitComplete: $$Props["onExitComplete"] = undefined,
        exitBeforeEnter: $$Props["exitBeforeEnter"] = undefined,
        presenceAffectsLayout = true,
        show: $$Props["show"] = undefined,
        isCustom = false;

    let _list = list !== undefined ? list : show ? [{ key: 1 }] : [];
    $: _list = list !== undefined ? list : show ? [{ key: 1 }] : [];

    const layoutContext =
        getContext<Writable<SyncLayoutBatcher | SharedLayoutSyncMethods>>(
            SharedLayoutContext,
        ) || SharedLayoutContext(isCustom);

    // Single epoch store.  Measure subscribes to it for synchronous snapshots
    // (store.update fires subscribers before DOM changes) and MeasureContextProvider
    // reads it reactively to trigger afterU → syncLayout.flush() after DOM settles.
    const layoutEpoch = createLayoutEpoch();
    setContext(LayoutEpochContext, layoutEpoch);

    // Snapshot sibling positions (snapshot=true) and notify shared layout before
    // a DOM change so Measure can FLIP elements to their new spots.
    // Called by forceRender (post-exit) and by the addition path in the reactive
    // block below — both cases need the same snapshot + shared-layout notification.
    function snapshotLayout() {
        if (presenceAffectsLayout) {
            layoutEpoch.update((v) => ({ n: v.n + 1, snapshot: true }));
        }
        if (isSharedLayout($layoutContext)) {
            $layoutContext.forceUpdate();
        }
    }

    $: forceRender = () => {
        snapshotLayout();
        _list = [..._list];
    };

    function getChildKey(child: { key: number }) {
        return child.key || "";
    }

    let isInitialRender = true;
    let filteredChildren = _list;
    $: filteredChildren = _list;

    let presentChildren = filteredChildren;
    let allChildren = new Map<string | number, { key: number }>();
    let exiting = new Set<"" | number>();
    const updateChildLookup = (
        children: { key: number }[],
        allChild: Map<string | number, { key: number }>,
    ) => {
        children.forEach((child) => {
            const key = getChildKey(child);
            allChild.set(key, child);
        });
    };
    $: updateChildLookup(filteredChildren, allChildren);

    let childrenToRender: {
        present: boolean;
        item: any;
        key: any;
        onExit: undefined | (() => void);
    }[] = [
        ...filteredChildren.map((v) => ({
            present: true,
            item: v,
            key: v.key,
            onExit: undefined,
        })),
    ];

    $: if (!isInitialRender) {
        const presentKeys = presentChildren.map(getChildKey);
        const targetKeys = filteredChildren.map(getChildKey);

        const hasRemovals = presentKeys.some(
            (k) => targetKeys.indexOf(k) === -1,
        );
        const hasAdditions = targetKeys.some(
            (k) => presentKeys.indexOf(k) === -1,
        );

        if (hasRemovals) {
            // Flush-only epoch (snapshot=false): drives animateF → safeToRemove for the
            // exiting layout element (id2 registration).  Deferred by one tick so that
            // PresenceChild's $effect (Svelte 5) has fired, updating PresenceContext and
            // therefore visualElement.isPresent before Measure.svelte's epoch handler
            // checks !visualElement.isPresent.  Siblings are skipped here; forceRender
            // fires snapshotLayout() after the exit completes so they FLIP.
            tick().then(() =>
                layoutEpoch.update((v) => ({ n: v.n + 1, snapshot: false })),
            );
        } else if (hasAdditions) {
            // Snapshot sibling positions before the DOM update (same logic as
            // forceRender) so they FLIP to their new positions after the incoming
            // element shifts them.  presenceAffectsLayout and shared-layout notify
            // are handled inside snapshotLayout().
            snapshotLayout();
        }
        // No epoch when hasRemovals=false && hasAdditions=false: this is a
        // forceRender-triggered re-run (no real diff).  forceRender already fired
        // snapshotLayout() before _list=[..._list], so we must not fire again.

        // If this is a subsequent render, deal with entering and exiting children
        childrenToRender = [
            ...filteredChildren.map((v) => ({
                present: true,
                item: v,
                key: v.key,
                onExit: undefined,
            })),
        ];

        // Diff the present children with our target children and mark those that are exiting
        const numPresent = presentKeys.length;
        for (let i = 0; i < numPresent; i++) {
            const key = presentKeys[i];
            if (targetKeys.indexOf(key) === -1) {
                exiting.add(key);
            } else {
                // In case this key has re-entered, remove from the exiting list
                exiting.delete(key);
            }
        }

        // If we currently have exiting children, and we're deferring rendering incoming children
        // until after all current children have exiting, empty the childrenToRender array
        if (exitBeforeEnter && exiting.size) {
            childrenToRender = [];
        }
        // Loop through all currently exiting components and clone them to overwrite animate
        // with any exit prop they might have defined.
        exiting.forEach((key) => {
            // If this component is actually entering again, early return
            if (targetKeys.indexOf(key) !== -1) return;

            const child = allChildren.get(key);
            if (!child) return;

            const insertionIndex = presentKeys.indexOf(key);

            const onExit = () => {
                allChildren.delete(key);
                exiting.delete(key);

                // Remove this child from the present children
                const removeIndex = presentChildren.findIndex(
                    (presentChild) => presentChild.key === key,
                );

                if (removeIndex < 0) {
                    return;
                }
                presentChildren.splice(removeIndex, 1);

                // Defer re-rendering until all exiting children have indeed left
                if (!exiting.size) {
                    presentChildren = [...filteredChildren];
                    forceRender();
                    onExitComplete && onExitComplete();
                }
            };

            childrenToRender.splice(insertionIndex, 0, {
                present: false,
                item: child,
                key: getChildKey(child),
                onExit,
            });
        });
        presentChildren = childrenToRender;
    } else {
        isInitialRender = false;
    }
</script>

{#each childrenToRender as child (getChildKey(child))}
    <PresenceChild
        isPresent={child.present}
        initial={!isInitialRender || initial ? undefined : false}
        custom={child.onExit ? custom : undefined}
        {presenceAffectsLayout}
        onExitComplete={child.onExit}
        {isCustom}
        presenceKey={child.key}
    >
        <slot item={child.item} />
    </PresenceChild>
{/each}
