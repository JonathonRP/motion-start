<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" generics="T extends {key:any}">
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import { useContext } from "../../context/utils/context.svelte.js";
    import { LayoutGroupContext } from "../../context/LayoutGroupContext";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import { fromStore } from "svelte/store";
    import { SvelteMap, SvelteSet } from "svelte/reactivity";
    import { untrack, type Snippet } from "svelte";
    import { type ComponentKey, getChildKey } from "./utils.js";
    import { invariant } from "../../utils/errors.js";

    type Props = AnimatePresenceProps<ConditionalGeneric<T>> & {
        isCustom?: boolean;
        children?: Snippet<[ConditionalGeneric<T> | { key: number }]>;
    };

    let {
        exitBeforeEnter,
        custom,
        initial,
        onExitComplete,
        presenceAffectsLayout = true,
        mode = "sync",
        list,
        show,
        isCustom = false,
        children,
    }: Props = $props();

    invariant(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");

    let _list = $state(list !== undefined ? list : show ? [{ key: 1 }] : []);

    const presentChildren = $derived(_list);
    const presentKeys = $derived(presentChildren.map(getChildKey));

    let isInitialRender = $state(true);

    let pendingPresentChildren = $state(presentChildren);
    let diffedChildren = $state(presentChildren);
    let renderedChildren = $state(presentChildren);

    let exitComplete = new SvelteMap<ComponentKey, boolean>();

    // $inspect(presentChildren);
    $effect(() => {
        console.log("effect");
        list;
        isInitialRender = false;
        pendingPresentChildren = presentChildren;

        /**
         * Update complete status of exiting children.
         */
        for (let i = 0; i < renderedChildren.length; i++) {
            const key = getChildKey(renderedChildren[i]);

            if (!presentKeys.includes(key)) {
                if (exitComplete.get(key) !== true) {
                    exitComplete.set(key, false);
                }
            } else {
                exitComplete.delete(key);
            }
        }
    });

    const exitingChildren = $state<(ConditionalGeneric<T> | { key: number })[]>(
        [],
    );

    if (presentChildren !== diffedChildren) {
        let nextChildren = [...presentChildren];

        /**
         * Loop through all the currently rendered components and decide which
         * are exiting.
         */
        for (let i = 0; i < renderedChildren.length; i++) {
            const child = renderedChildren[i];
            const key = getChildKey(child);

            if (!presentKeys.includes(key)) {
                nextChildren.splice(i, 0, child);
                exitingChildren.push(child);
            }
        }

        /**
         * If we're in "wait" mode, and we have exiting children, we want to
         * only render these until they've all exited.
         */
        if (mode === "wait" && exitingChildren.length) {
            nextChildren = exitingChildren;
        }

        renderedChildren = nextChildren;
        diffedChildren = presentChildren;

        /**
         * Early return to ensure once we've set state with the latest diffed
         * children, we can immediately re-render.
         */
        // return
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

    const layoutContext = fromStore(
        useContext(LayoutGroupContext, isCustom),
    ).current;
    const forceRender = $derived(() => {
        layoutContext.forceRender?.();
        _list = [..._list];
    });
</script>

{#each renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = presentChildren === renderedChildren || presentKeys.includes(key);
    return { key, isPresent, item: child, onExit() {
            console.log("exit");
            if (exitComplete.has(key)) {
                exitComplete.set(key, true);
            } else {
                return;
            }

            let isEveryExitComplete = true;
            exitComplete.forEach((isExitComplete) => {
                if (!isExitComplete) isEveryExitComplete = false;
            });

            if (isEveryExitComplete) {
                forceRender?.();
                renderedChildren = pendingPresentChildren;

                onExitComplete && onExitComplete();
            }

            // allChildren.delete(key);
            //         exiting.delete(key);

            //         // Remove this child from the present children
            //         const removeIndex = presentChildren.findIndex(
            //             (presentChild) => presentChild.key === key,
            //         );

            //         if (removeIndex < 0) {
            //             return;
            //         }
            //         untrack(() => presentChildren).splice(removeIndex, 1);

            //         // Defer re-rendering until all exiting children have indeed left
            //         if (!exiting.size) {
            //             presentChildren = [...filteredChildren];
            //             forceRender?.();
            //             onExitComplete && onExitComplete();
            //         }
            //     };

            //     untrack(() => childrenToRender).splice(insertionIndex, 0, {
            //         present: false,
            //         item: child,
            //         key: getChildKey(child),
            //         onExit,
            //     });
        } };
}) as child (getChildKey(child))}
    <PresenceChild
        isPresent={child.isPresent}
        initial={!isInitialRender || initial ? undefined : false}
        custom={child.isPresent ? custom : undefined}
        {presenceAffectsLayout}
        {mode}
        onExitComplete={child.isPresent ? undefined : child.onExit}
        {isCustom}
    >
        {@render children?.(child.item)}
    </PresenceChild>
{/each}
