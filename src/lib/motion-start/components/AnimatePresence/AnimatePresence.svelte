<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" generics="T extends {key:any}">
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import { useContext } from "../../context/utils/context.svelte.js";
    import { LayoutGroupContext } from "../../context/LayoutGroupContext.js";
    import { fromStore } from "svelte/store";
    import { invariant } from "$lib/motion-start/utils/errors.js";

    type $$Props = AnimatePresenceProps<ConditionalGeneric<T>>;

    export let list: $$Props["list"] = undefined,
        mode = "sync" as const,
        custom: $$Props["custom"] = undefined,
        initial: $$Props["initial"] = true,
        onExitComplete: $$Props["onExitComplete"] = undefined,
        exitBeforeEnter: $$Props["exitBeforeEnter"] = undefined,
        presenceAffectsLayout = true,
        show: $$Props["show"] = undefined;

    invariant(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");

    let _list = list !== undefined ? list : show ? [{ key: 1 }] : [];
    $: _list = list !== undefined ? list : show ? [{ key: 1 }] : [];

    const layoutContext = fromStore(useContext(LayoutGroupContext));
    $: forceRender = () => {
        layoutContext.current.forceRender?.();
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
        // If this is a subsequent render, deal with entering and exiting children
        childrenToRender = [
            ...filteredChildren.map((v) => ({
                present: true,
                item: v,
                key: v.key,
                onExit: undefined,
            })),
        ];

        // Diff the keys of the currently-present and target children to update our
        // exiting list.
        const presentKeys = presentChildren.map(getChildKey);
        const targetKeys = filteredChildren.map(getChildKey);
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
        // Loop through all currently exiting components and clone them to overwrite `animate`
        // with any `exit` prop they might have defined.
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
        // Add `MotionContext` even to children that don't need it to ensure we're rendering
        // the same tree between renders

        /*
        childrenToRender = childrenToRender.map((child) => {
            const key = child.key as string | number;
            return exiting.has(key) ? (
                child
            ) : (
                <PresenceChild
                    key={getChildKey(child)}
                    isPresent
                    presenceAffectsLayout={presenceAffectsLayout}
                >
                    {child}
                </PresenceChild>
            );
        });
        */
        presentChildren = childrenToRender;
    } else {
        isInitialRender = false;
    }

    if (
        process.env.NODE_ENV !== "production" &&
        mode === "wait" &&
        renderedChildren.length > 1
    ) {
        console.warn(
            `You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`,
        );
    }
</script>

{#each childrenToRender as child (getChildKey(child))}
    <PresenceChild
        {mode}
        isPresent={child.present}
        initial={initial ? undefined : false}
        custom={child.onExit ? custom : undefined}
        {presenceAffectsLayout}
        onExitComplete={child.onExit}
    >
        <slot item={child.item} />
    </PresenceChild>
{/each}
